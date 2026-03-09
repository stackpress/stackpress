//modules
import DataMap from '@stackpress/lib/Map';
//stackpress/schema
import type { ColumnAssertionToken } from '../types.js';
import type Fieldset from '../Fieldset.js';

export default class FieldsetAssertion {
  //fieldset reference
  protected _fieldset: Fieldset;

  /**
   * Returns all the columns with assertion attributes
   */
  public get columns() {
    return this._fieldset.columns.filter(
      column => column.assertion.attributes.size > 0
    );
  }

  /**
   * Returns all assertions
   */
  public get assertions() {
    const assertions = new DataMap<string, ColumnAssertionToken[]>();
    for (const column of this.columns.values()) {
      assertions.set(
        column.name.toString(), 
        column.assertion.assertions
      );
    }
    return assertions;
  }

  /**
   * Sets the fieldset reference
   */
  constructor(fieldset: Fieldset) {
    this._fieldset = fieldset;
  }
};