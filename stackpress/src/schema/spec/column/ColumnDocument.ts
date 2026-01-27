import type Column from './Column.js';

export default class ColumnDocument {
  //column reference
  protected _column: Column;
  
  /**
   * Returns the column @description
   * example: @description("Some Description")
   */
  public get description() {
    return this._column.attributes.value<string>('description');
  }

  /**
   * Returns the column @examples
   * example: @examples("example1" "example2")
   */
  public get examples() {
    return this._column.attributes.get('examples')?.args || [];
  }

  /**
   * Sets the column reference
   */
  constructor(column: Column) {
    this._column = column;
  }
};