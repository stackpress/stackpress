//modules
import type Create from '@stackpress/inquire/Create';
import type Engine from '@stackpress/inquire/Engine';
import Nest from '@stackpress/lib/Nest';
//stackpress/sql
import type { StoreSelectFilters, StoreSelectQuery } from '../types';
import StoreInterface from './StoreInterface.js';

export default abstract class AbstractActions<
  //the basic type of the records in the store
  T extends Record<string, unknown>,
  //the extended type of the records in the store, with relations included
  E extends Record<string, unknown>
> {
  //relative store methods reference
  public abstract store: StoreInterface<T, E>;
  //database engine
  public readonly engine: Engine;
  //encoding seed for en/decryption methods
  protected _seed: string;

  /**
   * Sets the database engine and seed for en/decryption methods.
   */
  constructor(engine: Engine, seed = '') {
    this.engine = engine;
    this._seed = seed;
  }

  /**
   * Returns the count of records that match the provided filters.
   */
  public async count(query: StoreSelectFilters & { columns?: string[] }) {
    const count = this.store.select(query, this.engine.dialect.q);
    count.engine = this.engine;
    const results = await count.select('COUNT(*) AS total');
    return results?.[0]?.total || 0;
  }

  /**
   * Deletes records that match the provided filters and returns 
   * the deleted record.
   */
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

  /**
   * Finds a single record that matches the provided filters 
   * and returns it.
   */
  public async find(query: StoreSelectQuery): Promise<E | null> {
    const results = await this.findAll(query);
    return results?.[0] || null;
  }

  /**
   * Finds all records that match the provided filters 
   * and returns them as an array.
   */
  public async findAll(query: StoreSelectQuery) {
    //extract params
    //valid columns:
    // - createdAt
    // - auth.profileId
    // - auth.userProfile.emailAddress
    // - auth.userProfile.addressLocation.streetName
    // - auth.userProfile.addressLocation.*
    // - auth.userProfile.*
    // - *
    const { columns = [ '*' ] } = query;
    //get all selectors based on the provided columns
    //example selector:
    // - column: [ references', googleId ]
    // - json: [ references', googleId ],
    // - alias [ auth, user_profile, address_location, references, google_id ]
    const selectors = this.store.selectors(columns);
    //now get the select query builder
    //NOTE: the store select method will formulate all the joins, where 
    // and other select parts based on the provided query and the 
    // store's schema and relations, so we just need to pass the query 
    // (and columns) and let it handle the rest.
    const select = this.store.select({ 
      ...query, 
      //so what we are doing here is converting the above column examples
      //to the actual SQL columns (with proper quotes and aliases) that 
      //will be used in the select builder.
      columns: selectors.map(selector => {
        const q = this.engine.dialect.q;
        //selector.column will look like: 
        // [ auth, user_profile, address_location ]
        //selector.alias will look like: 
        // [ auth, user_profile, address_location, references, google_id ]
        //selector.json will look like:
        // [ references', googleId ]
        //NOTE: selector.json is not supported for selectors at the 
        // moment because we need to know the sql engine format in order
        // to formulate the correct json format...
        return [
          //"auth"."user_profile"."address_location"
          `${q}${selector.column.join(`${q}.${q}`)}${q}`,
          //"auth__user_profile__address_location"
          `${q}${selector.alias.join('__')}${q}`
        ].join(' AS ')
      }) 
    }, this.engine.dialect.q);
    select.engine = this.engine;
    //remote call and get the raw results
    const results = await select;
    //return the formatted and expanded results
    return results.map(row => {
      //the nest object will help us make a nested object result set 
      // to return instead of a flat one...
      const nest = new Nest();
      //get the last paths for each selector
      const paths = selectors.map(selector => {
        const path = this.store.path(selector.expression);
        return path.length > 0 ? path[path.length - 1] : undefined;
      });
      //ex. created_at: "2021-01-01T00:00:00.000Z"
      //ex. user__email_address: "john@doe.com"
      //ex. user__address__street_name: "123 Main St"
      Object.entries(row).forEach(([ alias, value ]) => {
        //selector.alias will look like: 
        // [ auth, user_profile, address_location, references, google_id ]
        //so we just gotta merge with __ in order to compare
        const path = paths.find(
          path => path && path.selector.alias.join('__') === alias
        );
        //if no selector was found
        if (!path) {
          //we can use heuristics to form the object key path to make 
          // and assign into a nested object, but we wont be able to 
          // unserialize the value without the selector's column 
          // instance, so we'll just return the raw value...
          return nest.withPath.set(
            alias.trim()
              //user__address__street_name -> user.address.street_name
              .replaceAll('__', '.')
              //user.address.street_name -> user.address.streetName
              .replace(
                /([a-z])_([a-z0-9])/ig, 
                (_, a, b) => a + b.toUpperCase()
              ),
            value
          );
        }
        //if we are here, then a selector was found...
        const column = path.column;
        nest.withPath.set(
          path.selector.expression,
          //unknown to any because of the dynamic nature of 
          //the selectors and columns, but it should be correct
          column.unserialize(value as any, true)
        );
      });
      return nest.get<E>();
    });
  }

  /**
   * Creates the table in the database based on the schema. 
   * Use with caution. 
   */
  public async install() {
    const create = this.store.create();
    create.engine = this.engine;
    await create;
  }

  /**
   * Deletes all records within the table. 
   * Use with caution.
   */
  public async purge(cascade = false) {
    const query = this.engine.dialect.truncate(this.store.table, cascade);
    await this.engine.query(query);
  }

  /**
   * Drops the entire table from the database. 
   * Use with caution. 
   */
  public async uninstall() {
    const query = this.engine.dialect.drop(this.store.table);
    await this.engine.query(query);
  }

  /**
   * Upgrades the table in the database to match the new schema.
   * Use with caution. 
   */
  public async upgrade(to: Create) {
    const alter = this.store.alter(to);
    alter.engine = this.engine;
    await alter;
  }
}