//modules
import type { StatusResponse } from '@stackpress/lib/types';
import type Create from '@stackpress/inquire/Create';
import type Engine from '@stackpress/inquire/Engine';
import Nest from '@stackpress/lib/Nest';
//stackpress-schema
import { removeUndefined, removeEmptyStrings } from 'stackpress-schema/helpers';
//stackpress-sql
import type {
  StoreSelectFilters,
  StoreSelectQuery
} from 'stackpress-sql/types';
//stackpress-session
import Exception from '../Exception.js';
//stackpress-session/profile
import type {
  Profile,
  ProfileExtended,
  ProfileActionsInterface,
  ProfileAssertInterfaceMap
} from './types.js';
import ProfileStore from './ProfileStore.js';

export default class ProfileActions implements ProfileActionsInterface {
  public readonly store;
  public readonly engine: Engine;
  protected _seed: string;

  public constructor(engine: Engine, seed = '') {
    this.engine = engine;
    this._seed = seed;
    this.store = new ProfileStore(seed);
  }

  public async batch(
    inputs: Array<Partial<Profile>>,
    mode: 'create' | 'update' | 'upsert' = 'upsert'
  ) {
    const results: StatusResponse<Profile | null>[] = [];
    try {
      await this.engine.transaction(async () => {
        let rollback = false;
        for (const input of inputs) {
          try {
            if (mode === 'upsert') {
              results.push({
                code: 200,
                status: 'OK',
                results: await this.upsert(input),
                total: 1
              });
            } else if (mode === 'create') {
              results.push({
                code: 200,
                status: 'OK',
                results: await this.create(input),
                total: 1
              });
            } else if (mode === 'update') {
              if (typeof input.id !== 'undefined') {
                const eq = {
                  id: input.id
                };
                const exists = await this.find({ eq });
                if (exists) {
                  const rows = await this.update({ eq }, input);
                  results.push({
                    code: 200,
                    status: 'OK',
                    results: rows[0] || null,
                    total: 1
                  });
                  continue;
                }
              }

              results.push({
                error: 'ID or unique field is required for update mode'
              });
            }
          } catch (e) {
            const error = e as any;
            const exception =
              typeof error.toResponse !== 'function' ?
                Exception.upgrade(error)
              : (error as Exception);
            const response = exception.toResponse();
            results.push({
              code: response.code,
              status: response.status,
              error: response.error,
              errors: response.errors
            });
            rollback = true;
          }
        }
        if (rollback) {
          throw Exception.for('Batch operation failed');
        }
      });
    } catch (e) {}
    return results;
  }

  public async count(query: StoreSelectFilters & { columns?: string[] }) {
    const { q, columns, eq, ne, ge, le, has, like, hasnt } = query;
    const count = this.store.select<{ total: number }>({
      q,
      columns,
      eq,
      ne,
      ge,
      le,
      has,
      like,
      hasnt,
      take: 0
    });
    count.engine = this.engine;
    const results = await count.select('COUNT(*) AS total');
    return results?.[0]?.total || 0;
  }

  public async create(input: Partial<Profile>) {
    //sanitize input and map to the schema
    const filtered = this.store.filter(input);
    const populated = this.store.populate(filtered);
    const serialized = this.store.serialize(populated);
    const unserialized = this.store.unserialize(serialized);
    const defined = removeEmptyStrings(unserialized);
    const sanitized = removeUndefined(defined);

    //collect errors, if any
    const errors =
      this.store.assert(sanitized, true) || ({} as ProfileAssertInterfaceMap);

    //if there were errors
    if (Object.keys(errors).length > 0) {
      //throw errors
      throw Exception.for('Invalid parameters')
        .withCode(400)
        .withErrors(errors);
    }

    const insert = this.store.insert(sanitized);
    insert.engine = this.engine;
    //dont rely on native insert...
    // pgsql returns different things than sqlite and mysql....
    const rows = await insert;
    //if there are rows, then it's pgsql...
    if (rows.length > 0) {
      return this.store.unserialize(rows[0]);
    }
    //must be mysql or sqlite...
    if (this.engine.connection.lastId) {
      const eq = { id: this.engine.connection.lastId };
      return (await this.find({ eq })) || (input as unknown as Profile);
    }
    return input as unknown as Profile;
  }

  public async delete(query: StoreSelectFilters) {
    const rows = await this.findAll(query);
    //if there are no rows, it doesn't make sense to delete...
    if (rows.length > 0) {
      const remove = this.store.delete(query, this.engine.dialect.q);
      remove.engine = this.engine;
      //dont rely on native delete...
      // pgsql returns different things than sqlite and mysql....
      await remove;
    }
    return rows;
  }

  public async find(query: StoreSelectQuery) {
    const results = await this.findAll(query);
    return results?.[0] || null;
  }

  public async findAll(query: StoreSelectQuery) {
    //extract params
    //valid columns:
    // - createdAt
    // - userProfile.createdAt
    // - auth.userProfile.addressLocation:references.googleId
    // - userProfile.*
    // - *
    const { columns = ['*'] } = query;
    //get all selectors based on the provided columns
    //example selector:
    // - alias: auth__user_profile__address_location__references__google_id
    // - selector: [ auth, user_profile, address_location ]
    // - parents: [ auth, user_profile ]
    // - navigation: [ auth ]
    // - table: user_profile
    // - column: address_location
    // - json: [ references, googleId ]
    // - path: StorePath
    const selectors = this.store.selectors(columns);
    //now get the select query builder
    const select = this.store.select(query, this.engine.dialect.q);
    select.engine = this.engine;
    //remote call and get the raw results
    const results = await select;
    //return the formatted and expanded results
    return results.map((row) => {
      //the nest object will help us make a nested object result set
      // to return instead of a flat one...
      const nest = new Nest();
      //ex. created_at: "2021-01-01T00:00:00.000Z"
      //ex. user__email_address: "john@doe.com"
      //ex. user__address__street_name: "123 Main St"
      Object.entries(row).forEach(([alias, value]) => {
        const selector = selectors.find((selector) => selector.alias === alias);
        //if no selector was found
        if (!selector) {
          //we can use heuristics to form the object key path to make
          // and assign into a nested object, but we wont be able to
          // unserialize the value without the selector's column
          // instance, so we'll just return the raw value...
          return nest.withPath.set(
            alias
              .trim()
              //user__address__street_name -> user.address.street_name
              .replaceAll('__', '.')
              //user.address.street_name -> user.address.streetName
              .replace(
                /([a-z])_([a-z0-9])/gi,
                (_, a, b) => a + b.toUpperCase()
              ),
            value
          );
        }
        //extract column and store from the selector path
        const {
          column,
          store: { columns, relations }
        } = selector.path;
        //from: auth.userProfile.addressLocation:references.googleId
        //  to: auth.userProfile.addressLocation.references.googleId
        const keys = selector.path.expression.replaceAll(':', '.');
        //if we are here, then a path was found...
        //if column is a store column (as opposed to a relation column)
        if (column in columns) {
          //then we can unserialize the value
          const unserialized = columns[column].unserialize(
            //unknown to any because of the dynamic nature of
            //the selectors and columns, but it should be correct
            value as any,
            true
          );
          //add to the nest
          nest.withPath.set(keys, unserialized);
        } else if (column in relations) {
          //then we can unserialize the value
          const unserialized = relations[column].store.unserialize(
            //unknown to any because of the dynamic nature of
            //the selectors and columns, but it should be correct
            value as Record<string, any>,
            true
          );
          //add to the nest
          nest.withPath.set(keys, unserialized);
        }
      });
      return nest.get<ProfileExtended>();
    });
  }

  public async install() {
    const create = this.store.create();
    create.engine = this.engine;
    await create;
  }

  public async purge(cascade: boolean = false) {
    const query = this.engine.dialect.truncate(this.store.table, cascade);
    await this.engine.query(query);
  }

  public async remove(query: StoreSelectFilters) {
    return await this.update(query, { active: false });
  }

  public async restore(query: StoreSelectFilters) {
    return await this.update(query, { active: true });
  }

  public async uninstall() {
    const query = this.engine.dialect.drop(this.store.table);
    await this.engine.query(query);
  }

  public async update(query: StoreSelectFilters, input: Partial<Profile>) {
    //sanitize input and map to the schema
    const filtered = this.store.filter(input);
    const serialized = this.store.serialize(filtered);
    const unserialized = this.store.unserialize(serialized);
    const defined = removeEmptyStrings(unserialized);
    const sanitized = removeUndefined(defined);

    //collect errors, if any
    const errors =
      this.store.assert(sanitized) || ({} as ProfileAssertInterfaceMap);
    //if there were errors
    if (Object.keys(errors).length > 0) {
      //throw errors
      throw Exception.for('Invalid parameters')
        .withCode(400)
        .withErrors(errors);
    }

    const rows = await this.findAll(query);
    //even if there were results, we can't requery because the results
    // might be different after the update, so we have to manually merge
    // the input with the existing records
    const results = rows.map((row) => ({ ...row, ...sanitized })) as Profile[];
    //if there are no rows, it doesn't make sense to update...
    if (rows.length === 0) return results;

    //okay to update now
    const update = this.store.update(query, input, this.engine.dialect.q);
    update.engine = this.engine;
    //dont rely on native update...
    // pgsql returns different things than sqlite and mysql....
    await update;
    return results;
  }

  public async upgrade(to: Create) {
    const alter = this.store.alter(to);
    alter.engine = this.engine;
    await alter;
  }

  public async upsert(input: Partial<Profile>) {
    if (typeof input.id !== 'undefined') {
      const eq = {
        id: input.id
      };
      const rows = await this.update({ eq }, input);
      return rows[0] || null;
    }

    return await this.create(input);
  }
}
