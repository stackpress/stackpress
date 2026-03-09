//modules
import type { FlatValue } from '@stackpress/inquire/types';
import type Alter from '@stackpress/inquire/Alter';
import type Create from '@stackpress/inquire/Create';
import type Delete from '@stackpress/inquire/Delete';
import type Insert from '@stackpress/inquire/Insert';
import type Select from '@stackpress/inquire/Select';
import type Update from '@stackpress/inquire/Update';
//stackpress/schema
import type { DefinitionInterfaceMap } from '../../schema/types.js';
import SchemaInterface from '../../schema/interface/SchemaInterface.js';
//stackpress/sql
import type { 
  StoreRelation,
  StoreSelectColumnPath,
  StoreSelectFilters, 
  StoreSelectJoinMap,
  StoreSelectQuery,
  ValueScalar
} from '../types.js';

export default interface StoreInterface<
  //the basic type of the records in the store
  T extends Record<string, unknown>,
  //the extended type of the records in the store, with relations included
  E extends Record<string, unknown>,
  //the acceptable inputs
  I extends Record<string, unknown>,
  //the column map
  C extends DefinitionInterfaceMap = DefinitionInterfaceMap,
  //the relation map
  R extends Record<string, StoreRelation> = Record<string, StoreRelation<{}, {}, {}>>
> extends SchemaInterface<T, C> {
  //the relationships for the model, used for joins and populating related records
  relations: R;
  //the name of the table in the database (can differ from the model name)
  table: string;

  /**
   * Query builder for altering the table structure
   */
  alter(to?: Create): Alter;

  /**
   * Query builder for counting the number of records matching the query
   */
  count(
    query?: StoreSelectFilters & { columns?: string[]; }, 
    q?: string
  ): Select<{ total: number }>;

  /**
   * Query builder for creating a new table structure
   */
  create(): Create;

  /**
   * Query builder for deleting records
   */
  delete(query?: StoreSelectFilters, q?: string): Delete<T>;

  /**
   * Query builder for inserting records
   */
  insert(input: I): Insert<T>;

  /**
   * Query builder for selecting records
   */
  select(query?: StoreSelectQuery, q?: string): Select<E>;

  /**
   * Helper method for generating the where clause and values for 
   * a query based on the provided filters and the store's schema.
   */
  where(query?: StoreSelectFilters, q?: string): { 
    clause: string, 
    values: FlatValue[] 
  };

  /**
   * Query builder for updating records
   */
  update(
    query: StoreSelectFilters, 
    input: Partial<I>, 
    q?: string
  ): Update<T>;

  /**
   * Helper method for generating the column info for a given selector
   * 
   * ex. user.address.streetName -> {
   *   name: 'user.address.streetName',
   *   table: 'user__address',
   *   column: 'street_name',
   *   alias: 'user__address__street_name',
   *   path: [...],
   *   last: ...,
   *   joins: ...
   * }
   */
  getColumnInfo(selector: string): {
    name: string,
    table: string,
    column: string,
    alias: string,
    path: Array<StoreSelectColumnPath>,
    last: StoreSelectColumnPath,
    joins: StoreSelectJoinMap
  };

  /**
   * Helper method for generating the column selectors for 
   * a given column path.
   * 
   * ex. user.address.streetName -> user__address__street_name
   */
  getColumnSelectors(column: string, prefixes?: string[]): string[];

  /**
   * Serializes value, then scalarizes it, then assigns 
   * it to the SQL column name (ex. snake case)
   */
  scalarize(values: Record<string, unknown>): Record<string, ValueScalar>;

  /**
   * Unserializes value, then assigns it to 
   * the model column name (ex. camel case)
   */
  unscalarize(values: Record<string, unknown>): Partial<T>;
}