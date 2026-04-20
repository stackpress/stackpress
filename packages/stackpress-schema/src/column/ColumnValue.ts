//stackpress-schema
import type Column from '../Column.js';
import { generators } from '../helpers.js';

export default class ColumnValue {
  //column reference
  protected _column: Column;

  /**
   * Returns the column @default value
   * example: @default("some value")
   */
  public get default() {
    return this._column.attributes.value('default');
  }

  /**
   * Returns true if column should be @encrypted
   */
  public get encrypted() {
    return this._column.attributes.enabled('encrypted');
  }

  /**
   * Returns true if column should be @generated
   */
  public get generated() {
    return this._column.attributes.enabled('generated');
  }

  /**
   * Returns the generator type if column 
   * has a valid @default generator
   * 
   * ie: @default("cuid()") @default("nanoid()") @default("now()")
   */
  public get generator() {
    const value = this.default;
    if (typeof value === 'string' && generators.includes(value)) {
      return value;
    }
    return null;
  }

  /**
   * Returns true if column should be @hashed
   */
  public get hashed() {
    return this._column.attributes.enabled('hashed');
  }

  /**
   * Sets the column reference
   */
  constructor(column: Column) {
    this._column = column;
  }
};