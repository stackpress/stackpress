//modules
import { createId as cuid, init } from '@paralleldrive/cuid2';
import { nanoid } from 'nanoid';
//stackpress/schema
import type { ErrorList } from '../../types.js';
import assert from '../../assert.js';
//stackpress/schema/spec/column
import type Column from './Column.js';

export default class ColumnRuntime {
  //column reference
  protected _column: Column;

  /**
   * Sets the column reference
   */
  constructor(column: Column) {
    this._column = column;
  }

  /**
   * Returns error message if the value is invalid
   */
  public assert<V>(value: V, strict = true) {
    for (const assertion of this._column.assertion.assertions) {
      //Example assertion object:
      // {
      //   name: 'is.ge',
      //   import: { from, default },
      //   message: 'Not greater than..'
      //   args: [ 10 ]
      // }
      const { name, args, message } = assertion;
      const hasDefault = typeof this._column.value.default !== 'undefined';
      const hasNoValue = value === null 
        || typeof value === 'undefined'
        || value === '';
      //is.required but not strict
      const isRequiredButOptional = name === 'is.required' && !strict;
      //no value and not strict
      const noValueAndOptional = hasNoValue && !strict;
      //no value and strict, but optional type or has default value
      const noValueAndRequiredButNotRequiredOrHasDefault = hasNoValue
        && strict
        && (!this._column.type.required || hasDefault);
      const asserter = assert[name];
      //if assertion method is not 
      //a function ie. unique, etc.
      if (typeof asserter !== 'function'
        //if not strict and required
        || isRequiredButOptional
        //if not strict and has no value
        || noValueAndOptional
        //if strict and no value, but there is a default
        || noValueAndRequiredButNotRequiredOrHasDefault
      ) {
        //we should skip this check for others
        continue;
      }
      //now we can assert
      if (!asserter(value, ...args)) {
        //return message, but if message is null, then return empty string
        return message
          .replaceAll('{{name}}', this._column.name.toString())
          .replaceAll(
            '{{label}}', 
            this._column.name.label || this._column.name.toString()
          )
          .replaceAll('{{arg}}', String(args[0]))
          .replaceAll('{{arg2}}', String(args[1]))
          .replaceAll('{{arg3}}', String(args[2]))
          .replaceAll('{{value}}', String(value));
      }
    }
    //if there was an error it would have been returned
    //let's check if the column is a fieldset and there is a value
    if (this._column.type.fieldset && value) {
      //get the fieldset spec
      const fieldset = this._column.type.fieldset;
      //is it a fieldset multiple?
      if (this._column.type.multiple) {
        if (!Array.isArray(value)) {
          return 'Invalid format';
        }
        const errors: ErrorList = [];
        value.forEach(
          value => errors.push(fieldset.runtime.assert(value, strict))
        );
        if (errors.some(error => error)) {
          return errors;
        }
      //not a multiple
      } else {
        const message = fieldset.runtime.assert(value, strict);
        if (message) return message;
      }
    }
    return null;
  }
  
  /**
   * Serializes a value to be inserted into the database
   */
  public serialize<V>(value: V, scalar?: boolean): unknown;
  public serialize<V>(value: V, seed?: string, scalar?: boolean): unknown;
  public serialize<V>(value: V, seed?: string|boolean, scalar = false) {
    if (typeof seed === 'boolean') {
      scalar = seed;
      seed = undefined;
    }
    const serializer = this._column.type.serializer({
      require: this._column.type.required,
      multiple: this._column.type.multiple,
      hash: this._column.value.hashed,
      encrypt: this._column.value.encrypted
    });
    return serializer.serialize(value, seed, scalar);
  }

  /**
   * Unserializes a value coming from the database
   */
  public unserialize<V>(value: V, scalar?: boolean): unknown;
  public unserialize<V>(value: V, seed?: string, scalar?: boolean): unknown;
  public unserialize<V>(value: V, seed?: string|boolean, scalar = false) {
    if (typeof seed === 'boolean') {
      scalar = seed;
      seed = undefined;
    }
    const serializer = this._column.type.serializer({
      require: this._column.type.required,
      multiple: this._column.type.multiple,
      hash: this._column.value.hashed,
      encrypt: this._column.value.encrypted
    });
    return serializer.unserialize(value, seed, scalar);
  }


  /**
   * Determines the default value of the column
   */
  public defaultValue() {
    //@default("some value")
    const defaults = this._column.value.default;
    if (typeof defaults === 'string') {
      if (defaults.toLowerCase() === 'cuid()') {
        return cuid();
      } else if (defaults.toLowerCase() === 'nanoid()') {
        return nanoid();
      } else if (defaults.toLowerCase() === 'now()') {
        return new Date();
      } else if (/^cuid\(([0-9]+)\)$/.test(defaults)) {
        return cuid();
      }
      const forCuid = defaults.match(/^cuid\(([0-9]+)\)$/);
      if (forCuid) {
        const uuid = init({ length: parseInt(forCuid[1]) || 10 });
        return uuid();
      }
      const forNano = defaults.match(/^nanoid\(([0-9]+)\)$/);
      if (forNano) {
        return nanoid(parseInt(forNano[1]) || 10);
      }
    }
    return defaults;
  }
};