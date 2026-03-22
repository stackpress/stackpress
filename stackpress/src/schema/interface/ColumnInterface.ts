//modules
import type { ZodType } from 'zod';
//stackpress/schema
import type { ErrorReport } from '../types.js';
//stackpress/schema/interface
import DefinitionInterface from './DefinitionInterface.js';

export default interface ColumnInterface<
  //default type of this column (string, number, date, undefined, etc)
  D = unknown,
  //serialized return type
  //(if nullable, you should include that as well...)
  S = unknown,
  //unserialized return type
  //(if nullable, you should include that as well...)
  U = unknown,
  //shape (zod) type
  Z extends ZodType = ZodType
> extends DefinitionInterface<D, ErrorReport, S, U, Z> {
  /**
   * Assert that a value is valid for this column, 
   * returning an error message if not
   */
  assert<T>(value: T): ErrorReport | null;

  /**
   * Serialize a value for this column (for like a database...)
   */
  serialize<T>(value: T, encrypt?: boolean): S | undefined;

  /**
   * Unserialize a value (from like a database) 
   * into the appropriate type for this column
   */
  unserialize<T>(value: T, decrypt?: boolean): U | undefined;
};