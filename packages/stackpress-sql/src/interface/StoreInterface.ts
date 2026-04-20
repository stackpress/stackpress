//modules
import type { WhereBuilder } from '@stackpress/inquire/types';
import type Alter from '@stackpress/inquire/Alter';
import type Create from '@stackpress/inquire/Create';
import type Delete from '@stackpress/inquire/Delete';
import type Insert from '@stackpress/inquire/Insert';
import type Select from '@stackpress/inquire/Select';
import type Update from '@stackpress/inquire/Update';
//stackpress-schema
import type { DefinitionInterfaceMap } from 'stackpress-schema/types';
import type SchemaInterface from 'stackpress-schema/SchemaInterface';
//stackpress-sql
import type { 
  StoreJoin,
  StorePath,
  StoreRelation,
  StoreSelectFilters,
  StoreSelector,
  StoreSelectQuery,
  ValueScalar
} from '../types.js';

export default interface StoreInterface<
  //the basic type of the records in the store
  T extends Record<string, unknown>,
  //the extended type of the records in the store, with relations included
  E extends Record<string, unknown>,
  //the column map
  C extends DefinitionInterfaceMap = DefinitionInterfaceMap,
  //the relation map
  R extends Record<string, StoreRelation> = Record<string, StoreRelation<{}, {}>>
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
   * Query builder for creating a new table structure
   */
  create(): Create;

  /**
   * Query builder for deleting records
   */
  delete(query?: StoreSelectFilters): Delete<T>;

  /**
   * Query builder for inserting records
   */
  insert(input: Partial<T>): Insert<T>;

  /**
   * Query builder for selecting records
   */
  select<T = E>(query?: StoreSelectQuery): Select<T>;

  /**
   * Given the expression, will return SQL column selectors, 
   * json paths and aliases
   */
  selectors(expression: string|string[]): StoreSelector[];

  /**
   * Given the expression, will return the necessary join parts
   */
  joins(query: StoreSelectQuery): StoreJoin[];

  /**
   * Given the expression will traverse 
   * through stores and collect store and column instances
   */
  paths(expression: string, paths?: StorePath[]): StorePath[];

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

  /**
   * Query builder for updating records
   */
  update(query: StoreSelectFilters, input: Partial<T>): Update<T>;

  /**
   * Helper method for generating the where clause and values for 
   * a query based on the provided filters and the store's schema.
   */
  where(builder: WhereBuilder, query?: StoreSelectFilters): WhereBuilder;
}