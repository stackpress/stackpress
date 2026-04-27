//stackpress-schema
import type Fieldset from '../Fieldset.js';

export default class FieldsetComponent {
  //fieldset reference
  protected _fieldset: Fieldset;
  
  /**
   * Returns all the columns that are filter fields
   */
  public get filterFields() {
    return this._fieldset.columns.filter(
      column => Boolean(column.component.filterField)
    );
  }
  
  /**
   * Returns all the columns that are form fields
   */
  public get formFields() {
    return this._fieldset.columns.filter(
      column => Boolean(column.component.formField)
    );
  }

  /**
   * Returns all the columns that are list formats
   */
  public get listFormats() {
    return this._fieldset.columns.filter(
      column => Boolean(column.component.listFormat)
    );
  }

  /**
   * Returns all the columns that are span fields
   */
  public get spanFields() {
    return this._fieldset.columns.filter(
      column => Boolean(column.component.spanField)
    );
  }

  /**
   * Returns all the columns that are view formats
   */
  public get viewFormats() {
    return this._fieldset.columns.filter(
      column => Boolean(column.component.viewFormat)
    );
  }

  /**
   * Sets the fieldset reference
   */
  constructor(fieldset: Fieldset) {
    this._fieldset = fieldset;
  }
};