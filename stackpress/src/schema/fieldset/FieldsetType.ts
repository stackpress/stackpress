//stackpress/schema
import type Fieldset from '../Fieldset.js';

export default class FieldsetType {
  //column reference
  protected _fieldset: Fieldset;

  /**
   * Returns all the columns that are enum types
   */
  public get enums() {
    return this._fieldset.columns.filter(
      column => Boolean(column.type.enum)
    );
  }

  /**
   * Returns all the columns that are fieldset types
   */
  public get fieldsets() {
    return this._fieldset.columns.filter(
      column => Boolean(column.type.fieldset)
    );
  }

  /**
   * Sets the column reference
   */
  constructor(fieldset: Fieldset) {
    this._fieldset = fieldset;
  }
};