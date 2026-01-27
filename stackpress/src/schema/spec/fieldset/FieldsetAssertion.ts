//stackpress/schema
import type { ColumnAssertion as Assertion } from '../../types.js';
//stackpress/schema/spec/fieldset
import type Fieldset from './Fieldset.js';

export default class FieldsetAssertion {
  //fieldset reference
  protected _fieldset: Fieldset;

  /**
   * Returns all the columns with assertion attributes
   */
  public get attributes() {
    return this._fieldset.columns.filter(
      column => column.assertion.attributes.size > 0
    );
  }

  /**
   * Returns all assertions
   */
  public get assertions() {
    const assertions = new Map<string, Assertion[]>();
    for (const column of this.attributes.values()) {
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