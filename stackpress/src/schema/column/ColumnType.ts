//modules
import DataSet from '@stackpress/lib/Set';
//stackpress
import Exception from '../../Exception.js';
//stackpress/schema
import type { 
  AttributeDataAssertion,
  ColumnAssertionToken
} from '../types.js';
import type Schema from '../Schema.js';
import dictionary from '../dictionary.js';
import { capitalize, camelize } from '../helpers.js';

/**
 * Globally map types to other things, then set on columns
 */
export default class ColumnType {
  //name of the type
  public readonly name: string;
  //whether if the column is required
  public readonly required: boolean;
  //whether if the column is multiple values
  public readonly multiple: boolean;
  //global schema
  protected _schema?: Schema;

  /**
   * Returns the implied assertions based on the type
   */
  public get assertions() {
    //implicit validators
    const assertions = new DataSet<ColumnAssertionToken>();
    //validators based on type mapping
    // For example:
    // String, Text,    Number, Integer, 
    // Float,  Boolean, Date,   Datetime, 
    // Time,   Json,    Object, Hash
    if (this.has('assertion')) {
      const assertion = this.get<AttributeDataAssertion>('assertion')!;
      assertions.add(this.multiple ? {
        name: 'array',
        args: [ assertion.name ],
        message: 'Invalid value'
      } : { ...assertion, args: [] });
    }
    //if type is an enum
    if (this.hasSchema && this.enum) {
      const enumOptions = this.enum;
      const optionToken = dictionary.assertions.definition('is.option');
      if (enumOptions && optionToken) {
        const args = Object.values(enumOptions);
        assertions.add({...optionToken, args});
      }
    }
    //if type is required
    const requiredToken = dictionary.assertions.definition('is.required');
    if (!this.multiple && this.required && requiredToken) {
      assertions.add({ ...requiredToken, args: [] });
    }
    return assertions;
  }

  /**
   * If type is a fieldset, this returns the enum options
   */
  public get enum() {
    return this.schema.enums.get(this.name) || null;
  }

  /**
   * If type is a fieldset, this returns the model instance
   */
  public get fieldset() {
    return this.schema.fieldsets.get(this.name) || null
  }

  /**
   * Checks if the schema is assigned
   * (to prevent error to be thrown)
   */
  public get hasSchema() {
    return typeof this._schema !== 'undefined';
  }

  /**
   * If type is a model, this returns the model instance
   */
  public get model() {
    return this.schema.models.get(this.name) || null;
  }

  /**
   * Returns true if the type is nullable
   */
  public get nullable() {
    if (!this.multiple) {
      //name String - not nullable
      //name String? - nullable
      return !this.required;
    }
    //it's multiple
    //name String[] - if no default value, then nullable
    //NOTE: we cant test for this because 
    // will cause a circular dependency issue
    return false;
  }
  
  /**
   * Returns the schema associated with the typemap
   */
  public get schema() {
    if (!this._schema) {
      throw Exception.for(
        'Typemap "%s" does not have a schema assigned.', 
        this.name
      );
    }
    return this._schema;
  }

  /**
   * Sets the schema associated with the typemap
   */
  public set schema(schema: Schema) {
    this._schema = schema;
  }
  
  /**
   * Sets the name of the type map
   */
  public constructor(
    name: string, 
    required: boolean, 
    multiple: boolean, 
    schema?: Schema
  ) {
    this.name = capitalize(camelize(name));
    this.multiple = multiple;
    this.required = required;
    this._schema = schema;
  }

  /**
   * Gets a mapped value for this type
   */
  public get<T = unknown>(key: string) {
    return dictionary.types.definition<T>(this.name, key);
  }

  /**
   * Returns true if a mapped value exists for this type
   */
  public has(key: string) {
    return dictionary.types.defined(this.name, key);
  }
};