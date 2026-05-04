//stackpress-schema
import type Fieldset from '../Fieldset.js';

export default class FieldsetDocument {
  //column reference
  protected _fieldset: Fieldset;
  
  /**
   * Returns the column @description
   * example: @description("This is a description of the fieldset")
   */
  public get description() {
    return this._fieldset.attributes.value<string>('description') || null;
  }

  /**
   * Returns all columns with descriptions
   */
  public get descriptions() {
    return this._fieldset.columns.filter(
      column => typeof column.document.description === 'string'
    );
  }

  /**
   * Returns all columns with examples
   */
  public get examples() {
    return this._fieldset.columns.filter(
      column => Array.isArray(column.document.examples)
        && column.document.examples.length > 0
    );
  }

  /**
   * Sets the column reference
   */
  constructor(fieldset: Fieldset) {
    this._fieldset = fieldset;
  }
};