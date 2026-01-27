//stackpress/schema/spec/column
import type Column from './Column.js';

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