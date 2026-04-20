//stackpress-schema
import type Column from '../Column.js';

export default class ColumnComponent {
  //column reference
  protected _column: Column;

  /**
   * Returns the component attributes of the column
   */
  public get attributes() {
    return this._column.attributes.filter(
      attribute => attribute.component.defined
    );
  }

  /**
   * Returns the filter field attribute of the column
   */
  public get filterField() {
    return this._column.attributes.findValue(
      attribute => attribute.component.isFilterField
    );
  }

  /**
   * Returns the form field attribute of the column
   */
  public get formField() {
    return this._column.attributes.findValue(
      attribute => attribute.component.isFormField
    );
  }

  /**
   * Returns the list format attribute of the column
   */
  public get listFormat() {
    return this._column.attributes.findValue(
      attribute => attribute.component.isListFormat
    );
  }

  /**
   * Returns the span field attribute of the column
   */
  public get spanField() {
    return this._column.attributes.findValue(
      attribute => attribute.component.isSpanField
    );
  }

  /**
   * Returns the view format attribute of the column
   */
  public get viewFormat() {
    return this._column.attributes.findValue(
      attribute => attribute.component.isViewFormat
    );
  }

  /**
   * Sets the column reference
   */
  constructor(column: Column) {
    this._column = column;
  }
};