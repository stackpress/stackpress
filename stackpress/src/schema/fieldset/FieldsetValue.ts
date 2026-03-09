//stackpress/schema
import type Fieldset from '../Fieldset.js';

export default class FieldsetValue {
  //column reference
  protected _fieldset: Fieldset;

  /**
   * Returns all columns that are hashed
   */
  public get hashed() {
    return this._fieldset.columns.filter(
      column => column.value.hashed === true
    );
  }

  /**
   * Returns all columns that are encrypted
   */
  public get encrypted() {
    return this._fieldset.columns.filter(
      column => column.value.encrypted === true
    );
  }

  /**
   * Returns all columns that have default values
   */
  public get defaults() {
    return this._fieldset.columns.filter(
      column => typeof column.value.default !== 'undefined'
    );
  }

  /**
   * Returns all columns that have static default values
   */
  public get staticDefaults() {
    return this.defaults.filter(
      column => column.value.generator === null
    );
  }

  /**
   * Sets the column reference
   */
  constructor(fieldset: Fieldset) {
    this._fieldset = fieldset;
  }
};