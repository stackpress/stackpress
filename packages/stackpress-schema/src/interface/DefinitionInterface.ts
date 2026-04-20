//modules
import type { ZodType } from 'zod';

export default interface DefinitionInterface<
  //default type of this column (string, number, date, undefined, etc)
  D = unknown,
  //assert return type
  A = unknown,
  //serialized return type
  //(if nullable, you should include that as well...)
  S = unknown,
  //unserialized return type
  //(if nullable, you should include that as well...)
  U = unknown,
  //shape (zod) type
  Z extends ZodType = ZodType
> {
  //the name of the column
  name: string;
  //the zod schema for this column
  shape: Z;
  //the default value for this column
  defaults: D;

  /**
   * Assert that a value is valid for this column, 
   * returning an error message if not
   */
  assert(value: any): A | null;

  /**
   * Serialize a value for this column (for like a database...)
   */
  serialize(value: any, encrypt?: boolean): S | undefined;

  /**
   * Unserialize a value (from like a database) 
   * into the appropriate type for this column
   */
  unserialize(value: any, encrypt?: boolean): U | undefined;
};