//modules
import type { 
  AttributeValue, 
  ColumnConfig,
  Data, 
  EnumConfig
} from '@stackpress/idea-parser';
import { createId as cuid, init } from '@paralleldrive/cuid2';
import { nanoid } from 'nanoid';
//schema
import type { 
  ErrorList,
  SchemaAssertion,
  SchemaRelation
} from '../types';
import type Fieldset from './Fieldset.js';
import Attributes from './Attributes.js';
import typemap from './TypeMap.js';
import { 
  capitalize, 
  camelize, 
  dasherize,
  snakerize 
} from '../helpers.js';
import assert from '../assert.js';
import { map, toAssertToken } from '../config.js';

export class ColumnAttributes extends Attributes {
  /**
   * Returns true if this column is an @active column
   */
  public get active() {
    return this.enabled('active');
  }

  /**
   * Returns a new set of attributes that are admin specific
   */
  public get admin() {
    return this._filter('admin');
  }

  /**
   * Returns the column assertions
   */
  public get assertions() {
    const assertions: SchemaAssertion[] = [];
    const attributes = this._filter('is');

    //explicit validators
    for (const name of attributes.keys()) {
      //get the attribute (instance)
      const attribute = attributes.attribute(name)!;
      //get the method name (remove "is." prefix)
      const method = name.replace('is.', '');
      //get the arguments
      const args = attribute.args;
      //the last argument is the message
      const message = typeof args[args.length - 1] === 'string' 
        ? args.pop() as string
        : null;
      //get the attribute configuration
      const config = attribute.config;
      assertions.push({ method, args, message, config });
    }

    return assertions;
  }

  /**
   * Returns a char length if ever
   */
  public get chars() {
    //if is.ceq, is.clt, is.cle
    for (const assertion of this.assertions) {
      if (assertion.method === 'ceq') {
        return assertion.args[0] as number;
      } else if (assertion.method === 'clt') {
        return assertion.args[0] as number;
      } else if (assertion.method === 'cle') {
        return assertion.args[0] as number;
      }
    }
    return 255;
  }

  /**
   * Returns the column @default value
   * example: @default("some value")
   */
  public get default() {
    return this.value<Data | Date>('default');
  }

  /**
   * Returns the column @description
   * example: @description("Some description")
   */
  public get description() {
    return this.value<string>('description');
  }

  /**
   * Returns true if column should be @encrypted
   */
  public get encrypted() {
    return this.enabled('encrypted');
  }

  /**
   * Returns the column @example
   * example: @example("Some example") @example(true)
   */
  public get examples() {
    return this.args<string>('examples');
  }

  /**
   * Returns the column field (defaults to none)
   * example: @field.text({type "text"})
   */
  public get field() {
    const attributes = this._filter('field');
    const first = attributes.index(0);
    return first ? first.component : null;
  }

  /**
   * Returns the column filter field (defaults to none)
   * example: @filter.text({type "text"})
   */
  public get filter() {
    const attributes = this._filter('filter');
    const first = attributes.index(0);
    return first ? first.component : null;
  }

  /**
   * Returns true if column should be @generated
   */
  public get generated() {
    return this.enabled('generated');
  }

  /**
   * Returns true if column should be @hashed
   */
  public get hashed() {
    return this.enabled('hashed');
  }

  /**
   * Returns true if column is an @id
   */
  public get id() {
    return this.enabled('id');
  }

  /**
   * Returns true if column is @filterable, @searchable, or @sortable
   */
  public get indexable() {
    return this.searchable 
      || this.filter
      || this.span
      || this.sortable;
  }

  /**
   * Returns the column @label
   * example: @label("Some Label")
   */
  public get label() {
    return this.value<string>('label');
  }

  /**
   * Returns the column list format (defaults to none)
   * example: @list.char({length 1})
   */
  public get list() {
    const attributes = this._filter('list');
    const first = attributes.index(0);
    return first ? first.component : null;
  }

  /**
   * Returns the column @max
   * example: @max(100)
   * example: @is.eq(100)
   * example: @is.lt(100)
   * example: @is.le(100)
   */
  public get max() {
    const maxes: number[] = [];
    const max = this.value<number>('max');
    if (typeof max === 'number') {
      maxes.push(max);
    }
    this.assertions.forEach(assertion => {
      if (assertion.method === 'eq'
        || assertion.method === 'lt'
        || assertion.method === 'le'
      ) {
        maxes.push(assertion.args[0] as number);
      }
    });
    if (maxes.length > 0) {
      return Math.max(...maxes.filter(number => Number(number)));
    }
    return 0;
  }

  /**
   * Returns the column @min
   * example: @min(100)
   * example: @is.eq(100)
   * example: @is.gt(100)
   * example: @is.ge(100)
   */
  public get min() {
    const mins: number[] = [];
    const min = this.value<number>('min');
    if (typeof min === 'number') {
      mins.push(min);
    }
    this.assertions.forEach(assertion => {
      if (assertion.method === 'eq'
        || assertion.method === 'gt'
        || assertion.method === 'ge'
      ) {
        mins.push(assertion.args[0] as number);
      }
    });
    if (mins.length > 0) {
      return Math.min(...mins.filter(number => Number(number)));
    }
    return 0;
  }

  /**
   * Returns relation information
   */
  public get relation() {
    //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
    return this.value<SchemaRelation>('relation');
  }

  /**
   * Returns true if column is @searchable
   */
  public get searchable() {
    return this.enabled('searchable');
  }

  /**
   * Returns true if column is @sortable
   */
  public get sortable() {
    return this.enabled('sortable');
  }

  /**
   * Returns the column span field (defaults to none)
   * example: @span.text({type "text"})
   */
  public get span() {
    const attributes = this._filter('span');
    const first = attributes.index(0);
    return first ? first.component : null;
  }

  /**
   * Returns the column @step
   * example: @step(0.01)
   */
  public get step() {
    const step = this.value<number>('step');
    if (typeof step === 'number') {
      return step;
    }
    
    const max = this.max;
    const min = this.min;
    //if max has decimals, get the length
    const maxDecimals = max.toString().split('.')[1]?.length || 0;
    //if min has decimals, get the length
    const minDecimals = min.toString().split('.')[1]?.length || 0;
    //which ever is longer that's the step
    const decimalLength = Math.max(maxDecimals, minDecimals);
    //if no decimals
    if (decimalLength === 0) {
      //step is 1 by default
      return 1;
    }
    //convert to 0.001 for example
    return Math.pow(10, -decimalLength);
  }

  /**
   * Returns true if column is @unique
   */
  public get unique() {
    return this.enabled('unique');
  }

  /**
   * Returns true if there is an @updated column
   */
  public get updated() {
    return this.enabled('updated');
  }

  /**
   * Returns the column @view format (defaults to none)
   * example: @view.char({length 1})
   */
  public get view() {
    const attributes = this._filter('view');
    const first = attributes.index(0);
    return first ? first.component : null;
  }
  
  /**
   * Filters attributes by prefix
   */
  protected _filter(prefix: string) {
    const query = prefix + '.';
    //store filtered attributes here
    const attributes: Array<[string, AttributeValue]> = [];
    //loop through attributes
    for (const name of this.keys()) {
      //if it doesn't start with the prefix, skip it
      if (!name.startsWith(query)) {
        continue;
      }
      //we found it.
      const attribute = this.attribute(name);
      if (attribute) {
        //get the arguments
        attributes.push([ name, attribute.raw ]);
      }
    }
    return new ColumnAttributes(attributes);
  }
};

export default class Column extends ColumnAttributes {
  //name of the column
  public readonly name: string;
  //ex. String, Number, Date, etc.
  public readonly type: string;
  //whether if the column is required
  public readonly required: boolean;
  //whether if the column is multiple values
  public readonly multiple: boolean;
  //the fieldset this column belongs to
  protected _fieldset: Fieldset;

  /**
   * Returns the column attributes
   * example: @foo @bar() ...
   */
  public get assertions() {
    //if column is system generated
    //if column is a relation to another model
    //if column is related to another model
    if (this.generated || this.parentRelation || this.childRelation) {
      //then there is no need to validate
      //relation columns are not assertable
      //related columns are not assertable
      return [];
    }
    //implicit default validators
    const defaults: SchemaAssertion[] = [];
    //implied validators
    //if the type maps to an assert method
    // For example:
    // String, Text,    Number, Integer, 
    // Float,  Boolean, Date,   Datetime, 
    // Time,   Json,    Object, Hash
    if (this.typemap.has('assert')) {
    //if (this.type in typemap.method) {
      //get the assert method
      const method = this.typemap.call('assert') as string;
      const { array } = map.assert;
      defaults.push(this.multiple 
        ? toAssertToken(array, [ method ], 'Invalid value')
        : toAssertToken(map.assert[method], [], 'Invalid value')
      );
    }
    // - enum
    if (this.enum) {
      const { option } = map.assert;
      const args = Object.values(this.enum);
      defaults.push(
        toAssertToken(option, args, 'Invalid option')
      );
    }
    // - unique
    if (this.unique) {
      const { unique } = map.assert;
      defaults.push(
        toAssertToken(unique, [], 'Already exists')
      );
    }
    // - required
    if (!this.multiple 
      && this.required 
      && typeof this.default === 'undefined'
    ) {
      const { required } = map.assert;
      defaults.push(
        toAssertToken(required, [], `${this.name} is required`)
      );
    }
    //explicit validators
    return defaults
      //remove the default assertions that are already defined
      .filter(defaultAssert => !super.assertions.find(
        assert => assert.method === defaultAssert.method
      ))
      //then add explicit assertions
      .concat(super.assertions);
  }

  /**
   * Returns the capitalized column name
   */
  public get capitalCase() {
    return capitalize(camelize(this.name));
  }

  /**
   * Returns the relations column, if any
   * - where parent is this (local) column (id)
   * - where child is the foreign column (profileId)
   */
  public get childRelation() {
    //get foreign model
    //example: user User[]
    const model = this._fieldset.registry.model.get(this.type);
    //if no model is found
    if (!model) {
      return null;
    }
    //get the foreign model's relational column
    const column = Array.from(model.columns.values())
      //example: user User @relation(local "userId" foreign: "id")
      .filter(column => !!column.parentRelation)
      //example: user User @relation(...) === user User[]
      .find(column => column.type ===  this._fieldset.name);
    if (!column?.parentRelation) {
      return null;
    }
    return column.parentRelation;
  }

  /**
   * Returns the dashed fieldset name
   */
  public get dashCase() {
    return dasherize(this.name);
  }

  /**
   * Returns the column @default value
   * example: @default("some value")
   */
  public get default() {
    //@default("some value")
    const defaults = super.default;
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

  /**
   * If type is an enum, this returns the enum configuration
   */
  public get enum(): EnumConfig | null {
    return this._fieldset.registry.enum.get(this.type) || null;
  }

  /**
   * If type is a fieldset, this returns the fieldset instance
   */
  public get fieldset(): Fieldset | null {
    return this._fieldset.registry.fieldset.get(this.type) || null;
  }

  /**
   * Returns true if column is filterable
   */
  public get filterable() {
    return Boolean(this.filter);
  }

  /**
   * If type is a model, this returns the model instance
   */
  public get model() {
    return this._fieldset.registry.model.get(this.type) || null;
  }

  /**
   * Returns the column relations
   * - where parent is the foreign column (id)
   * - where child is this (local) column (profileId)
   */
  public get parentRelation() {
    //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
    const relation = super.relation;
    //if no relation data or this column type is not a model
    if (!relation || !this.model) {
      return null;
    }
    //get the foreign (parent) and local (child) model
    const models = { parent: this.model, child: this._fieldset };
    //get all the columns of foreign model where the type is this model
    let foreignColumns = Array.from(models.parent.columns.values()).filter(
      //ie. users User[]
      column => column.type === this._fieldset.name
    ).filter(
      //filter again if the local column has a relation name
      //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
      //to. connections User[]
      column => !relation.name || relation.name === column.name
    );
    //if no columns are found
    if (foreignColumns.length === 0) {
      //then it's not a valid relation
      return null;
    }
    //get the foreign (parent) and local (child) columns
    const columns = { 
      //ie. users User[]
      //or. connections User[]
      parent: foreignColumns[0], 
      //user User @relation(local "userId" foreign: "id")
      //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
      child: this as Column
    };
    //get the foreign (parent) and local (child) keys
    //ie. @relation(local "userId" foreign: "id")
    const keys = { 
      parent: models.parent.column(relation.foreign) as Column, 
      child: models.child.column(relation.local) as Column
    };
    if (!keys.parent || !keys.child) {
      return null;
    }
    //get the parent and child relation types
    const types = {
      //ie. user User
      //ie. user User?
      //ie. users User[]
      parent: columns.parent.multiple ? 2 : columns.parent.required ? 1 : 0,
      //ie. user User @relation(local "userId" foreign: "id")
      child: columns.child.multiple ? 2 : columns.child.required ? 1 : 0
    };

    return { 
      //ie. users User[]
      parent: { 
        //User
        model: models.parent, 
        //user User[]
        column: columns.parent, 
        //id
        key: keys.parent, 
        //2
        type: types.parent 
      }, 
      //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
      child: { 
        //File
        model: models.child, 
        //owner User @relation(...)
        column: columns.child, 
        //profileId
        key: keys.child, 
        //1
        type: types.child 
      } 
    };
  }

  /**
   * Returns true if column is spannable
   */
  public get spannable() {
    return Boolean(this.span);
  }

  /**
   * Returns number step value
   */
  public get step() {
    const step = super.step;
    if (step === 1 && this.type === 'Float') {
      return 0.01;
    }
    return step || 1;
  }

  /**
   * returns snake case name
   */
  public get snakeCase() {
    return snakerize(this.name);
  }
  
  /**
   * Returns the capitalized column name
   */
  public get titleCase() {
    return capitalize(camelize(this.name));
  }

  /**
   * Returns the type mappings for this column
   */
  public get typemap() {
    const settings = {
      encrypt: this.encrypted,
      hash: this.hashed,
      require: this.required,
      multiple: this.multiple
    };
    switch(this.type) {
      case 'String': return typemap.String.make(settings);
      case 'Text': return typemap.String.make(settings);
      case 'Boolean': return typemap.Boolean.make(settings);
      case 'Number': return typemap.Number.make(settings);
      case 'Integer': return typemap.Integer.make(settings);
      case 'Float': return typemap.Float.make(settings);
      case 'Date': return typemap.Date.make(settings);
      case 'Datetime': return typemap.Datetime.make(settings);
      case 'Time': return typemap.Time.make(settings);
      case 'Object': return typemap.Object.make(settings);
      case 'Hash': return typemap.Object.make(settings);
      case 'Json': return typemap.Object.make(settings);
      default: return typemap.Unknown.make(settings);
    }
  }
  
  /**
   * Sets the fieldset and column config
   */
  public constructor(fieldset: Fieldset, config: ColumnConfig) {
    super(config.attributes);
    this._fieldset = fieldset;
    this.type = config.type;
    this.name = config.name;
    this.multiple = config.multiple;
    this.required = config.required;
  }

  /**
   * Returns error message if the value is invalid
   */
  public assert<V>(value: V, strict = true) {
    for (const assertion of this.assertions) {
      const { method, args } = assertion;
      const message = assertion.message 
        || assertion.config.data?.message as string
        || 'Invalid value';
      const hasDefault = typeof this.default !== 'undefined';
      const hasNoValue = value === null 
        || typeof value === 'undefined'
        || value === '';
      //if assertion method is not 
      //a function ie. unique, etc.
      if (typeof assert[method] !== 'function'
        //if not strict and required
        || (!strict && method === 'required')
        //if not strict and has no value
        || (!strict && hasNoValue)
        //if strict and no value, but there is a default
        || (strict && hasNoValue && (!this.required || hasDefault))
      ) {
        //we should skip this check for others
        continue;
      }
      //now we can assert
      if (!assert[method](value, ...args)) {
        //return message, but if message is null, then return empty string
        return message
          .replaceAll('{{name}}', this.name)
          .replaceAll('{{label}}', this.label || this.name)
          .replaceAll('{{arg}}', String(args[0]))
          .replaceAll('{{arg2}}', String(args[1]))
          .replaceAll('{{arg3}}', String(args[2]))
          .replaceAll('{{value}}', String(value));
      }
    }
    //if there was an error it would have been returned
    //let's check if the column is a fieldset
    if (this.fieldset && value) {
      const fieldset = this.fieldset;
      //is it a fieldset multiple?
      if (this.multiple) {
        if (!Array.isArray(value)) {
          return 'Invalid format';
        }
        const errors: ErrorList = [];
        value.forEach(
          value => errors.push(fieldset.assert(value, strict))
        );
        if (errors.some(error => error)) {
          return errors;
        }
      //not a multiple
      } else {
        const message = fieldset.assert(value, strict);
        if (message) return message;
      }
    }
    return null;
  }

  /**
   * Serializes a value to be inserted into the database
   */
  public serialize<V>(value: V, seed?: string|boolean, scalar = false) {
    if (typeof seed === 'boolean') {
      scalar = seed;
      seed = undefined;
    }
    return this.typemap.serialize(value, seed, scalar);
  }

  /**
   * Unserializes a value coming from the database
   */
  public unserialize<V>(value: V, seed?: string|boolean, scalar = false) {
    if (typeof seed === 'boolean') {
      scalar = seed;
      seed = undefined;
    }
    return this.typemap.unserialize(value, seed, scalar);
  }

  /**
   * Filters attributes by prefix
   */
  protected _filter(prefix: string) {
    const query = prefix + '.';
    //store filtered attributes here
    const attributes: Array<[string, AttributeValue]> = [];
    //loop through attributes
    for (const name of this.keys()) {
      //if it doesn't start with the prefix, skip it
      if (!name.startsWith(query)) {
        continue;
      }
      //we found it.
      const attribute = this.attribute(name);
      if (attribute) {
        //get the arguments
        attributes.push([ name, attribute.raw ]);
      }
    }
    return new Column(this._fieldset, {
      name: this.name,
      type: this.type,
      multiple: this.multiple,
      required: this.required,
      attributes: Object.fromEntries(attributes)
    });
  }
}