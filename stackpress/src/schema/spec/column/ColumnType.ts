//modules
import DataSet from '@stackpress/lib/Set';
//stackpress
import Exception from '../../../Exception.js';
//stackpress/schema
import type { 
  ColumnAssertion, 
  SerializerSettings,
  TypeMapDataAssertion,
  TypeMapDataSerializer
} from '../../types.js';
import type { Serializer } from '../serializer/index.js';
import {
  BooleanSerializer,
  UnknownSerializer,
  DateSerializer,
  NumberSerializer,
  ObjectSerializer,
  StringSerializer
} from '../serializer/index.js';
import { capitalize, camelize } from '../../helpers.js';
//stackpress/schema/spec
import type Schema from '../Schema.js';
import * as dictionary from '../Dictionary.js';

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
    const assertions = new DataSet<ColumnAssertion>();
    //validators based on type mapping
    // For example:
    // String, Text,    Number, Integer, 
    // Float,  Boolean, Date,   Datetime, 
    // Time,   Json,    Object, Hash
    if (this.has('assertion')) {
      const assertion = this.get<TypeMapDataAssertion>('assertion')!;
      assertions.add(this.multiple ? {
        name: 'array',
        'import': {
          from: 'stackpress/schema/assert',
          'default': false
        },
        args: [ assertion.name ],
        message: 'Invalid value'
      } : { ...assertion, args: [] });
    }
    //if type is an enum
    const enumOptions = this.enum;
    const optionToken = dictionary.assertions.definition('is.option');
    if (enumOptions && optionToken) {
      const args = Object.values(enumOptions);
      assertions.add({...optionToken, args});
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
    return this.schema.fieldsets.get(this.name) || null;
  }

  /**
   * If type is a model, this returns the model instance
   */
  public get model() {
    return this.schema.models.get(this.name) || null;
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
    multiple: boolean
  ) {
    this.name = capitalize(camelize(name));
    this.multiple = multiple;
    this.required = required;
  }

  /**
   * Gets a mapped value for this type
   */
  public get<T = unknown>(key: string) {
    return dictionary.typemaps.definition<T>(this.name, key);
  }

  /**
   * Returns true if a mapped value exists for this type
   */
  public has(key: string) {
    return dictionary.typemaps.defined(this.name, key);
  }

  /**
   * Returns the serializer for this type
   */
  public serializer(settings: SerializerSettings): Serializer {
    const serializer = this.get<TypeMapDataSerializer>('serializer');
    switch (serializer?.name) {
      case 'BooleanSerializer':
        return new BooleanSerializer(settings);
      case 'DateSerializer':
        return new DateSerializer(settings);
      case 'NumberSerializer':
        return new NumberSerializer(settings);
      case 'ObjectSerializer':
        return new ObjectSerializer(settings);
      case 'StringSerializer':
        return new StringSerializer(settings);
      case 'UnknownSerializer':
      default:
        return new UnknownSerializer(settings);
    }
  }
};