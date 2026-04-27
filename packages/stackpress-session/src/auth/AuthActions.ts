//modules
import type { StatusResponse } from '@stackpress/lib/types';
import type Server from '@stackpress/ingest/Server';
import type Create from '@stackpress/inquire/Create';
import type Engine from '@stackpress/inquire/Engine';
import Nest from '@stackpress/lib/Nest';
//stackpress-schema
import { 
  removeUndefined, 
  removeEmptyStrings 
} from 'stackpress-schema/helpers';
//stackpress-sql
import type {
  ClientPlugin, 
  DatabasePlugin,
  StoreSelectFilters,
  StoreSelectQuery
} from 'stackpress-sql/types';
import Exception from 'stackpress-sql/Exception';
//stackpress-session
import type { ProfileAuth } from '../profile/types.js';
import type {
  Auth,
  AuthExtended,
  AuthActionsInterface,
  AuthAssertInterfaceMap,
  AuthPasswordConfig,
  SigninInput,
  SignupInput,
  SigninType
} from './types.js';
import AuthStore from './AuthStore.js';
import ProfileActions from '../profile/ProfileActions.js';

export type ActionOptions = {
  seed?: string,
  password?: AuthPasswordConfig
};

export const isSpecialChars = /[!@#$%^&*(),.?":{}|<>\s]/;
export const isEmail = /^(?:(?:(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|\x5c(?=[@,"\[\]\x5c\x00-\x20\x7f-\xff]))(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|(?<=\x5c)[@,"\[\]\x5c\x00-\x20\x7f-\xff]|\x5c(?=[@,"\[\]\x5c\x00-\x20\x7f-\xff])|\.(?=[^\.])){1,62}(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|(?<=\x5c)[@,"\[\]\x5c\x00-\x20\x7f-\xff])|[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]{1,2})|"(?:[^"]|(?<=\x5c)"){1,62}")@(?:(?!.{64})(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.?|[a-zA-Z0-9]\.?)+\.(?:xn--[a-zA-Z0-9]+|[a-zA-Z]{2,6})|\[(?:[0-1]?\d?\d|2[0-4]\d|25[0-5])(?:\.(?:[0-1]?\d?\d|2[0-4]\d|25[0-5])){3}\])$/;

export default class AuthActions implements AuthActionsInterface {
  public static make(ctx: Server) {
    //get the database engine 
    const engine = ctx.plugin<DatabasePlugin>('database');
    //get the session seed
    //Q: Do I want to error if no seed?
    const seed = ctx.config.path('database.seed', 'abc123');
    //get password config
    const password = ctx.config.path<AuthPasswordConfig>('auth.password', {});
    return new AuthActions(engine, { seed, password });
  }

  public readonly store;
  public readonly engine: Engine;
  public readonly profile: ProfileActions;
  protected _seed: string;
  protected _password: AuthPasswordConfig;

  public constructor(engine: Engine, options: ActionOptions = {}) {
    this.engine = engine;
    this._seed = options.seed || '';
    this._password = options.password || {};
    this.store = new AuthStore(this._seed);
    this.profile = new ProfileActions(engine, this._seed);
  }

  public assert(input: Partial<SignupInput>) {
    const errors: Record<string, string> = {};
    if (!input.name) {
      errors.name = 'Name is required';
    }
    if (!input.username && !input.email && !input.phone) {
      errors.username = 'Username, email, or phone is required';
    } else if (input.email && !isEmail.test(input.email)) {
      errors.email = 'Invalid email';
    }

    const { min, max, upper, lower, number, special } = this._password;

    if (!input.secret) {
      errors.secret = 'Password is required';
    } else if (min && input.secret.length < min) {
      errors.secret = `Password must be at least ${min} characters`;
    } else if (max && input.secret.length > max) {
      errors.secret = `Password must be less than ${max} characters`;
    } else if (upper && !/[A-Z]/.test(input.secret)) {
      errors.secret = 'Password must contain at least one uppercase letter';
    } else if (lower && !/[a-z]/.test(input.secret)) {
      errors.secret = 'Password must contain at least one lowercase letter';
    } else if (number && !/[0-9]/.test(input.secret)) {
      errors.secret = 'Password must contain at least one number';
    } else if (special && !isSpecialChars.test(input.secret)) {
      errors.secret = 'Password must contain at least one special character';
    }
    return Object.keys(errors).length ? errors : null;
  }

  public async batch(
    inputs: Array<Partial<Auth>>,
    mode: 'create' | 'update' | 'upsert' = 'upsert'
  ) {
    const results: StatusResponse<Auth | null>[] = [];
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
              if (
                typeof input.token !== 'undefined' &&
                input.token !== null &&
                input.token !== ''
              ) {
                const eq = { token: input.token };
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

  public async create(input: Partial<Auth>) {
    //sanitize input and map to the schema
    const filtered = this.store.filter(input);
    const populated = this.store.populate(filtered);
    const serialized = this.store.serialize(populated);
    const unserialized = this.store.unserialize(serialized);
    const defined = removeEmptyStrings(unserialized);
    const sanitized = removeUndefined(defined);

    //collect errors, if any
    const errors =
      this.store.assert(sanitized, true) || ({} as AuthAssertInterfaceMap);

    //if there's a token value
    if (
      typeof sanitized.token !== 'undefined' &&
      sanitized.token !== null &&
      sanitized.token !== ''
    ) {
      //check to see if exists already
      const exists = await this.find({
        eq: { token: sanitized.token }
      });
      //if it does exist
      if (exists) {
        //add a unique error
        errors.token = 'Already exists';
      }
    }

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
      return (await this.find({ eq })) || (input as unknown as Auth);
    }
    return input as unknown as Auth;
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
      return nest.get<AuthExtended>();
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

  public async signin(
    type: SigninType, 
    input: Partial<SigninInput>,
    password = true
  ) {
    //get form body
    const results = await this.find({
      columns: [ '*', 'profile.*' ],
      eq: { type, token: String(input[type]) }
    }) as AuthExtended | null;
    //if null (no user found)
    if (results === null) {
      throw Exception
        .for('Invalid Parameters')
        .withErrors({ [type]: 'User Not Found' })
        .withCode(404);
    //if use password
    //NOTE: passwordless can occur if OTP or magic link is used
    } else if (password) {
      const secret = this.store.columns.secret.serialize(
        String(input.secret),
        true
      );
      if (secret !== String(results.secret)) {
        throw Exception
          .for('Invalid Parameters')
          .withErrors({ secret: 'Invalid Password' })
          .withCode(401);
      }
    }
    //update consumed
    await this.update(
      { eq: { id: results.id } }, 
      { consumed: new Date() }
    );
    return results;
  }

  public async signup(input: Partial<SignupInput>) {
    //validate input
    const errors = this.assert(input);
    //if there are errors
    if (errors) {
      throw Exception.for('Invalid Parameters')
        .withErrors(errors)
        .withCode(400);
    }
    //create profile
    const results = await this.profile.create({
      name: input.name as string,
      type: input.type || 'person',
      roles: input.roles || []
    }) as ProfileAuth;

    results.auth = {};
    //if email
    if (input.email) {
      //create email auth
      results.auth.email = await this.create({
        profileId: results.id,
        type: 'email',
        token: String(input.email),
        secret: String(input.secret)
      }).catch(e => {
        //if e is an exception with errors
        //NOTE: we cant rely on instanceof...
        if ((e as Exception).errors && e.errors.token) {
          e.withErrors({ 
            email: e.errors.token,
            token: e.errors.token
          });
        }
        throw e;
      });
    } 
    //if phone
    if (input.phone) {
      //create phone auth
      results.auth.phone = await this.create({
        profileId: results.id,
        type: 'phone',
        token: String(input.phone),
        secret: String(input.secret)
      }).catch(e => {
        //if e is an exception with errors
        //NOTE: we cant rely on instanceof...
        if ((e as Exception).errors && e.errors.token) {
          e.withErrors({ 
            phone: e.errors.token,
            token: e.errors.token
          });
        }
        throw e;
      });
    }
    //if username
    if (input.username) {
      //create username auth
      results.auth.username = await this.create({
        profileId: results.id,
        type: 'username',
        token: String(input.username),
        secret: String(input.secret)
      }).catch(e => {
        //if e is an exception with errors
        //NOTE: we cant rely on instanceof...
        if ((e as Exception).errors && e.errors.token) {
          e.withErrors({ 
            username: e.errors.token,
            token: e.errors.token
          });
        }
        throw e;
      });
    }

    return results;
  }

  public async uninstall() {
    const query = this.engine.dialect.drop(this.store.table);
    await this.engine.query(query);
  }

  public async update(query: StoreSelectFilters, input: Partial<Auth>) {
    //sanitize input and map to the schema
    const filtered = this.store.filter(input);
    const serialized = this.store.serialize(filtered);
    const unserialized = this.store.unserialize(serialized);
    const defined = removeEmptyStrings(unserialized);
    const sanitized = removeUndefined(defined);

    //collect errors, if any
    const errors =
      this.store.assert(sanitized) || ({} as AuthAssertInterfaceMap);
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
    const results = rows.map((row) => ({ ...row, ...sanitized })) as Auth[];
    //if there are no rows, it doesn't make sense to update...
    if (rows.length === 0) return results;
    //if there's a token value
    if (
      typeof sanitized.token !== 'undefined' &&
      sanitized.token !== null &&
      sanitized.token !== ''
    ) {
      //check to see if exists already
      const exists = await this.findAll({
        eq: { token: sanitized.token }
      });
      //if it does exist
      if (exists.length > 0) {
        const same = rows.some((row) => row.token === sanitized.token);
        if (!same) {
          //add a unique error
          errors.token = 'Already exists';
        }
      }
    }
    //if there were unique errors
    if (Object.keys(errors).length > 0) {
      //throw errors
      throw Exception.for('Invalid parameters')
        .withCode(400)
        .withErrors(errors);
    }

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

  public async upsert(input: Partial<Auth>) {
    if (typeof input.id !== 'undefined') {
      const eq = {
        id: input.id
      };
      const rows = await this.update({ eq }, input);
      return rows[0] || null;
    }
    if (
      typeof input.token !== 'undefined' &&
      input.token !== null &&
      input.token !== ''
    ) {
      const eq = { token: input.token };
      const exists = await this.find({ eq });
      if (exists) {
        const rows = await this.update({ eq }, input);
        return rows[0] || null;
      }
    }
    return await this.create(input);
  }
}
