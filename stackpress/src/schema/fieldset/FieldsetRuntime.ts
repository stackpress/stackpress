//modules
import type { Data } from '@stackpress/idea-parser';
//stackpress
import { render as template } from '../../helpers.js';
//stackpress/schema
import type { ErrorMap, SerializeOptions } from '../types.js';
//stackpress/schema/fieldset
import type Fieldset from './Fieldset.js';

export default class FieldsetRuntime {
  //fieldset reference
  protected _fieldset: Fieldset;

  /**
   * Sets the column reference
   */
  constructor(fieldset: Fieldset) {
    this._fieldset = fieldset;
  }

  /**
   * Asserts the values (runtime)
   */
  public assert(
    values: Record<string, unknown> = {}, 
    required = true, 
    strict = true
  ) {
    const errors: ErrorMap = {};
    for (const column of this._fieldset.columns.values()) {
      if (column.type.model) continue;
      const name = column.name.toString();
      const message = column.runtime.assert(values[name], required, strict);
      if (typeof message !== 'undefined' && message !== null) {
        errors[name] = message;
      }
    }
    return Object.keys(errors).length > 0 ? errors : null;
  }

  /**
   * Removes values that are not columns
   */
  public columnValues(values: Record<string, unknown>) {
    const columns: Record<string, any> = {};
    for (const [ name, value ] of Object.entries(values)) {
      if (this._fieldset.columns.has(name)) {
        columns[name] = value;
      }
    }
    return columns;
  }

  /**
   * Returns all computed default values for the fieldset
   */
  public defaultValues() {
    return this._fieldset.columns
      .filter(column => typeof column.value.default !== 'undefined')
      .map(column => column.runtime.defaultValue() as Data | Date)
      .toObject();
  }

  /**
   * Removes values that are not columns or (strict) input fields
   */
  public inputValues(values: Record<string, unknown>, strict = true) {
    const inputs: Record<string, any> = {};
    
    for (const [ name, value ] of Object.entries(values)) {
      const field = this._fieldset.columns.findValue(
        column => column.name.toString() === name
          && Boolean(column.component.formField)
      );
      if (field) {
        inputs[name] = value;
        continue;
      } else if (!strict) {
        const column = this._fieldset.column(name);
        //if it's not a column or a model, skip it
        if (!column || column.type.model) continue;
        inputs[name] = value;
      }
    }
    return inputs;
  }

  /**
   * Renders a template given the data
   */
  public render(data: Record<string, unknown>) {
    if (!this._fieldset.name.display) {
      return '';
    }
    return template(this._fieldset.name.display, data);
  }

  /**
   * Serializes values to be inserted into the database
   */
  public serialize(
    values: Record<string, unknown>,
    seed?: string, 
    options: SerializeOptions = {}
  ) {
    const {
      booleanToNumber = false,
      dateToString = false,
      objectToString = false
    } = options;
    const serialized: Record<string, unknown> = {};
    for (const [ name, value ] of Object.entries(values)) {
      const column = this._fieldset.columns.get(name);
      if (!column) {
        serialized[name] = value;
        continue;
      }
      let scalar = false;
      switch (column.type.name) {
        case 'Boolean':
          scalar = booleanToNumber;
          break;
        case 'Date':
        case 'Datetime':
        case 'Time':
          scalar = dateToString;
          break;
        case 'Object':
        case 'Hash':
        case 'Json':
          scalar = objectToString;
          break;
      }
      const key = column.name.toString();
      serialized[key] = column.type.multiple && Array.isArray(value)
        ? value.map(value => column.runtime.serialize(value, seed, scalar))
        : column.runtime.serialize(value, seed, scalar);
    }
    return serialized;
  }

  /**
   * Unserializes a value coming from the database
   */
  public unserialize(
    values: Record<string, unknown>,
    seed?: string, 
    options: SerializeOptions = {}
  ) {
    const {
      booleanToNumber = false,
      dateToString = false,
      objectToString = false
    } = options;
    const unserialized: Record<string, unknown> = {};
    for (const [ name, value ] of Object.entries(values)) {
      const column = this._fieldset.columns.get(name);
      if (!column) {
        unserialized[name] = value;
        continue;
      }
      let scalar = false;
      switch (column.type.name) {
        case 'Boolean':
          scalar = booleanToNumber;
          break;
        case 'Date':
        case 'Datetime':
        case 'Time':
          scalar = dateToString;
          break;
        case 'Object':
        case 'Hash':
        case 'Json':
          scalar = objectToString;
          break;
      }
      const key = column.name.toString();
      unserialized[key] = column.type.multiple && Array.isArray(value)
        ? value.map(value => column.runtime.unserialize(value, seed, scalar))
        : column.runtime.unserialize(value, seed, scalar);
    }
    return unserialized;
  }
};