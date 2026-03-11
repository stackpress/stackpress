//modules
import type { StatusResponse } from '@stackpress/lib/types';
import type Create from '@stackpress/inquire/Create';
//stackpress/schema
import type { DefinitionInterfaceMap } from '../../schema/types.js';
//stackpress/sql
import type { 
  StoreRelation, 
  StoreSelectFilters, 
  StoreSelectQuery 
} from '../types.js';
//stackpress/sql
import StoreInterface from './StoreInterface.js';

export default interface ActionsInterface<
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
> {
  //relative store methods reference
  store: StoreInterface<T, E, I, C, R>;

  /**
   * Performs batch operations (create, update, upsert) on multiple 
   * records based on the provided inputs and mode.
   */
  batch(
    inputs: Array<I>,
    mode?: 'create' | 'update' | 'upsert',
  ): Promise<StatusResponse<T | null>[]>;

  /**
   * Returns the count of records that match the provided filters.
   */
  count(query: StoreSelectFilters & { columns?: string[] }): Promise<number>;

  /**
   * Creates a new record in the database based on the provided input.
   */
  create(input: I): Promise<T>;

  /**
   * Deletes records that match the provided 
   * filters and returns the deleted record.
   */
  delete(query: StoreSelectFilters): Promise<T[]>;

  /**
   * Hard deletes a record by its ID and returns the deleted record.
   */
  deleteById(id: string): Promise<T>;

  /**
   * Finds a single record that matches the provided 
   * query and returns it with relations.
   */
  find(query: StoreSelectQuery): Promise<E | null>;

  /**
   * Finds multiple records that match the provided 
   * query and returns them with relations.
   */
  findAll(query: StoreSelectQuery): Promise<E[]>;

  /**
   * Finds a record by its ID and returns it with relations.
   */
  findById(id: string, columns?: string[]): Promise<E | null>;

  /**
   * Creates the table in the database based on the schema. 
   * Use with caution. 
   */
  install(): Promise<void>;

  /**
   * Deletes all records within the table. 
   * Use with caution.
   */
  purge(cascade?: boolean): Promise<void>;

  /**
   * Removes records that match the provided filters 
   * and returns the removed record. This is a soft delete 
   * operation that marks the record as deleted without permanently 
   * removing it from the database.
   */
  remove(query: StoreSelectFilters): Promise<T[]>;

  /**
   * Soft deletes a record by its ID and returns the removed record.
   */
  removeById(id: string): Promise<T>;

  /**
   * Restores records that match the provided filters 
   * and returns the restored record.
   */
  restore(query: StoreSelectFilters): Promise<T[]>;

  /**
   * Restores a record by its ID and returns the restored record.
   */
  restoreById(id: string): Promise<T>;

  /**
   * Drops the entire table from the database. 
   * Use with caution. 
   */
  uninstall(): Promise<void>;

  /**
   * Upgrades the table in the database to match the new schema.
   * Use with caution. 
   */
  upgrade(to: Create): Promise<void>;

  /**
   * Updates records that match the provided filters with 
   * the given input and returns the updated record.
   */
  update(query: StoreSelectFilters, input: Partial<I>): Promise<T[]>;

  /**
   * Updates a record by its ID with the given 
   * input and returns the updated record.
   */
  updateById(id: string, input: Partial<I>): Promise<T>;

  /**
   * Inserts a new record or updates an existing 
   * record based on the provided input.
   */
  upsert(input: I): Promise<T>;
};