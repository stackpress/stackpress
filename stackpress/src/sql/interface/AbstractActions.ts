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
    const count = this.store.select<{ total: number }>(query);
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
      const remove = this.store.delete(query);
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
    // - userProfile.createdAt
    // - auth.userProfile.addressLocation:references.googleId
    // - userProfile.*
    // - *
    const { columns = [ '*' ] } = query;
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
    const select = this.store.select(query);
    select.engine = this.engine;
    //remote call and get the raw results
    const results = await select;
    //return the formatted and expanded results
    return results.map(row => {
      //the nest object will help us make a nested object result set 
      // to return instead of a flat one...
      const nest = new Nest();
      //ex. created_at: "2021-01-01T00:00:00.000Z"
      //ex. user__email_address: "john@doe.com"
      //ex. user__address__street_name: "123 Main St"
      Object.entries(row).forEach(([ alias, value ]) => {
        const selector = selectors.find(selector => selector.alias === alias);
        //if no selector was found
        if (!selector) {
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
        //extract column and store from the selector path
        const { column, store: { columns, relations } } = selector.path;
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