//modules
import type { ZodObject } from 'zod';
//stackpress/schema
import type {
  DefinitionInterfaceMap,
  AssertInterfaceMap,
  SerializeInterfaceMap,
  UnserializeInterfaceMap
} from '../types.js';
//stackpress/schema/interface
import DefinitionInterface from './DefinitionInterface.js';

export default interface SchemaInterface<
  //the basic type of the records in the store
  T extends Record<string, unknown>,
  //map of columns and schemas
  C extends DefinitionInterfaceMap = DefinitionInterfaceMap
> extends DefinitionInterface<
  //default to each column's default type
  { [key in keyof C]: C[key]['defaults'] },
  //assert return type
  AssertInterfaceMap<C>,
  //map of each column's serialized type
  SerializeInterfaceMap<C>,
  //map of each column's unserialized type
  UnserializeInterfaceMap<C>,
  //zod object of each column's shape
  ZodObject<{ [key in keyof C]: C[key]['shape'] }>
> {
  //map of the columns associated with this schema
  columns: C;

  /**
   * Assert that a value is valid for this schema, 
   * returning an object mapping column names to error messages if not
   * (only include keys for columns that had errors)
   */
  assert(
    value: Record<string, any>, 
    required?: boolean
  ): AssertInterfaceMap<C> | null;
  
  /**
   * Removes any keys from the input that aren't in 
   * the schema, and optionally populates defaults
   */
  filter<V extends Record<string, any>>(
    value: V, 
    populate?: boolean
  ): Partial<{ [K in keyof T]: T[K] }>;

  /**
   * Populates any missing keys in the input 
   * with defaults from the schema
   */
  populate<V extends Record<string, any>>(
    value: V
  ): { [key in keyof C]: C[key]['defaults'] } & V;

  /**
   * Serialize a value for this column (for like a database...)
   */
  serialize(
    value: Record<string, any>, 
    encrypt?: boolean
  ): SerializeInterfaceMap<C>;

  /**
   * Unserialize a value (from like a database) 
   * into the appropriate type for this column
   */
  unserialize(
    value: Record<string, any>, 
    decrypt?: boolean
  ): UnserializeInterfaceMap<C>;
};