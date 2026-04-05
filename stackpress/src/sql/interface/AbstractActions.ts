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
    //extract params
    const { q, filter, span } = query;
    //valid columns:
    // - createdAt
    // - user.emailAddress
    // - user.address.streetName
    // - user.address.*
    // - user.*
    // - *
    //reference: user User @relation({ local "userId" foreign "id" })
    const columns = (query.columns || [ '*' ]).map(
      column => this.store.getColumnSelectors(column)
    ).flat();
    //now build the select query
    const where = query.where || this.where({ q, filter, span });
    const params = { columns, where, take: 0 };
    const count = this.store.select(params, this.engine.dialect.q);
    count.select('COUNT(*) as total');
    count.engine = this.engine;
    const results = (await count) as unknown as Array<{ total: number }>;
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
    const { q, filter, span, sort, skip, take } = query;
    //valid columns:
    // - createdAt
    // - user.emailAddress
    // - user.address.streetName
    // - user.address.*
    // - user.*
    // - *
    //reference: user User @relation({ local "userId" foreign "id" })
    const columns = (query.columns || [ '*' ]).map(
      column => this.store.getColumnSelectors(column)
    ).flat();
    //now build the select query
    const where = query.where || this.where({ q, filter, span });
    const params = { columns, where, sort, skip, take };
    const select = this.store.select(params, this.engine.dialect.q);
    select.engine = this.engine;
    //remote call and get the raw results
    const results = await select;
    //collect info for each column
    //ex. group.owner.address.streetName
    // - name: group.owner.address.streetName
    // - table: group__owner__address
    // - column: street_name
    // - alias: group__owner__address__street_name
    // - joins:
    //   - group as group ON (product.group_id = group.id)
    //   - user as group__owner ON (group.owner_id = group__owner.id)
    //   - address as group__owner__address ON (group__owner.address_id = group__owner__address.id)
    const info = columns
      .map((column) => this.store.getColumnInfo(column))
      .filter((column) => column.path.length > 0);
    //now we can return the formatted and expanded results
    return results.map(row => {
      const nest = new Nest();
      //ex. created_at: "2021-01-01T00:00:00.000Z"
      //ex. user__email_address: "john@doe.com"
      //ex. user__address__street_name: "123 Main St"
      Object.entries(row).forEach(([ alias, value ]) => {
        const selector = info.find(selector => selector.alias === alias);
        if (!selector || !(selector.last.column in selector.last.store.columns)) {
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
        const column = selector.last.store.columns[selector.last.column];
        nest.withPath.set(
          selector.name,
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