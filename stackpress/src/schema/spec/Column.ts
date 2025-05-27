//modules
import { createId as cuid, init } from '@paralleldrive/cuid2';
import { nanoid } from 'nanoid';
//stackpress
import type { EnumConfig } from '@stackpress/idea-parser/types';
//root
import type { 
  ErrorList,
  SchemaColumnInfo, 
  SchemaSerialOptions 
} from '../types.js';
//config
import * as typemap from '../config/typemaps.js';
//schema
import assert from '../assert.js';
import { 
  capitalize, 
  camelize, 
  dasherize,
  decrypt, 
  encrypt, 
  hash, 
  snakerize 
} from '../helpers.js';
//local
import type Fieldset from './Fieldset.js';
import Attributes from './Attributes.js';

export default class Column {
  //ex. String, Number, Date, etc.
  public readonly type: string;
  //name of the column
  public readonly name: string;
  //whether if the column is required
  public readonly required: boolean;
  //whether if the column is multiple values
  public readonly multiple: boolean;
  //column attributes
  public readonly attributes: Attributes;
  //the fieldset this column belongs to
  protected _fieldset: Fieldset;

  /**
   * Returns true if this column is an @active column
   */
  public get active() {
    return this.attributes.active;
  }

  /**
   * Returns the column attributes
   * example: @foo @bar() ...
   */
  public get assertions() {
    //if column is system generated
    //if column is a relation to another model
    //if column is related to another model
    if (this.attributes.generated || this.relation || this.related) {
      //then there is no need to validate
      //relation columns are not assertable
      //related columns are not assertable
      return [];
    }
    //explicit validators
    const assertions = this.attributes.assertions;
    //implied validators
    // String, Text,    Number, Integer, 
    // Float,  Boolean, Date,   Datetime, 
    // Time,   Json,    Object, Hash
    for (const type in typemap) {
      if (this.type === type) {
        if (this.multiple) {
          if (!assertions.find(v => v.method === 'array')) {
            assertions.unshift({ 
              method: 'array', 
              args: [ typemap.method[type] ], 
              message: 'Invalid format'
            });
          }
        } else if (!assertions.find(v => v.method === typemap.method[type])) {
          assertions.unshift({ 
            method: typemap.method[type], 
            args: [], 
            message: 'Invalid format'
          });
        }
      }
    }
    // - enum
    if (this.enum && !assertions.find(v => v.method === 'option')) {
      assertions.unshift({ 
        method: 'option', 
        args: Object.values(this.enum), 
        message: 'Invalid option'
      });
    }
    // - unique
    if (this.attributes.unique) {
      if (!assertions.find(v => v.method === 'unique')) {
        assertions.unshift({ 
          method: 'unique', 
          args: [], 
          message: 'Already exists'
        });
      }
    }
    // - required
    if (!this.multiple 
      && this.required 
      && typeof this.attributes.default === 'undefined'
    ) {
      if (!assertions.find(v => v.method === 'required')) {
        assertions.unshift({ 
          method: 'required', 
          args: [], 
          message: `${this.name} is required`
        });
      }
    }
    return assertions;
  }

  /**
   * Returns a char length if ever
   */
  public get clen() {
    return this.attributes.clen;
  }

  /**
   * Returns the dashed fieldset name
   */
  public get dash() {
    return dasherize(this.name);
  }

  /**
   * Returns the column @default value
   * example: @default("some value")
   */
  public get default() {
    //@default("some value")
    const defaults = this.attributes.default;
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
   * Returns the column @description
   * example: @description("Some description")
   */
  public get description() {
    return this.attributes.description;
  }

  /**
   * If type is an enum, this returns the enum configuration
   */
  public get enum(): EnumConfig | null {
    return this._fieldset.registry.enum.get(this.type) || null;
  }

  /**
   * Returns true if column is @encrypted
   */
  public get encrypted() {
    return this.attributes.encrypted;
  }

  /**
   * Returns the column @example
   * example: @example("Some example") @example(true)
   */
  public get example() {
    return this.attributes.example;
  }

  /**
   * Returns the column field (defaults to none)
   * example: @field.text({type "text"})
   */
  public get field() {
    return this.attributes.field;
  }

  /**
   * If type is a fieldset, this returns the fieldset instance
   */
  public get fieldset(): Fieldset | null {
    return this._fieldset.registry.fieldset.get(this.type) || null;
  }

  /**
   * Returns the column filter field (defaults to none)
   * example: @filter.text({type "text"})
   */
  public get filter() {
    return this.attributes.filter;
  }

  /**
   * Returns true if column is @generated
   */
  public get generated() {
    return this.attributes.generated;
  }

  /**
   * Returns true if column is a @hash
   */
  public get hash() {
    return this.attributes.hash;
  }

  /**
   * Returns true if column is an @id
   */
  public get id() {
    return this.attributes.id;
  }

  /**
   * Returns true if column is @filterable, @searchable, or @sortable
   */
  public get indexable() {
    return this.attributes.indexable;
  }

  /**
   * Returns the column @label
   * example: @label("Some Label")
   */
  public get label() {
    return this.attributes.label || this.name;
  }

  /**
   * Returns the column list format (defaults to none)
   * example: @list.char({length 1})
   */
  public get list() {
    if (this.model) {
      return { 
        component: false, 
        method: 'hide', 
        args: [], 
        attributes: {} 
      };
    }
    return this.attributes.list;
  }

  /**
   * Returns the highest number value
   */
  public get max() {
    return this.attributes.max;
  }

  /**
   * Returns the lowest number value
   */
  public get min() {
    return this.attributes.min;
  }

  /**
   * If type is a model, this returns the model instance
   */
  public get model() {
    return this._fieldset.registry.model.get(this.type) || null;
  }

  /**
   * Returns the related column, if any
   * - where parent is this (local) column (id)
   * - where child is the foreign column (profileId)
   */
  public get related() {
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
      .filter(column => !!column.relation)
      //example: user User @relation(...) === user User[]
      .find(column => column.type ===  this._fieldset.name);
    if (!column?.relation) {
      return null;
    }
    return column.relation;
  }

  /**
   * Returns the column relations
   * - where parent is the foreign column (id)
   * - where child is this (local) column (profileId)
   */
  public get relation() {
    //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
    const relation = this.attributes.relation;
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
   * Returns true if column is @searchable
   */
  public get searchable() {
    return this.attributes.searchable;
  }

  /**
   * Returns information on how this column 
   * should look like in a database schema
   */
  public get schema() {
    const type = (() => {
      if (Boolean(this.fieldset 
        || this.multiple || this.type === 'Json' 
        || this.type === 'Object' || this.type === 'Hash'
      )) {
        return 'json';
      } else if ([ 
        'Char', 'Text', 'Integer', 'Float', 'Boolean', 
        'Date', 'Time', 'Datetime', 'Binary', 'Timestamp'
      ].includes(this.type)) {
        return this.type.toLowerCase();
      } else if (this.type === 'Number') {
        return String(this.step).split('.')[1].length > 0 
          ? 'float' 
          : 'integer';
      } else if (this.enum) {
        return 'enum';
      }
      return 'varchar';
    })();
    const length = (() => {
      if (type === 'enum' && this.enum) {
        return [ Math.max(...Object.values(this.enum).map(
          value => String(value).length
        )), 0 ];
      } else if (type === 'char' || type === 'varchar') {
        return [ Math.min(this.clen || 255, 255), 0];
      } else if (type === 'integer') {
        return [ String(this.max).split('.')[0].length, 0 ];
      } else if (type === 'float') {
        return [ 
          String(this.max).split('.')[0].length, 
          String(this.step).split('.')[1].length 
        ];
      }
      return [ 0, 0 ];
    })();
    const defaults = this.default ? this.default
      : this.required ? null 
      : undefined;
    const unsigned = this.min >= 0;
    const increment = Boolean(this.attributes.get('increment'));
    const index = this.id ? 'primary'
      : this.unique ? 'unique' 
      : this.indexable ? 'index'
      : undefined;
    return { type, length, defaults, unsigned, increment, index };
  }

  /**
   * Returns true if column is @sortable
   */
  public get sortable() {
    return this.attributes.sortable;
  }

  /**
   * returns snake case name
   */
  public get snake() {
    return snakerize(this.name);
  }

  /**
   * Returns the column span field (defaults to none)
   * example: @span.text({type "text"})
   */
  public get span() {
    return this.attributes.span;
  }

  /**
   * Returns number step value
   */
  public get step() {
    const step = this.attributes.step;
    if (step === 1 && this.type === 'Float') {
      return 0.01;
    }
    return step || 1;
  }

  /**
   * Returns the capitalized column name
   */
  public get title() {
    return capitalize(camelize(this.name));
  }

  public get typemap() {
    return {
      type: typemap.type[this.type],
      model: typemap.model[this.type],
      format: typemap.format[this.type],
      method: typemap.method[this.type],
      literal: typemap.literal[this.type],
      mysql: typemap.mysql[this.type],
      pgsql: typemap.pgsql[this.type],
      sqlite: typemap.sqlite[this.type],
      helper: typemap.helper[this.type]
    };
  }

  /**
   * Returns true if column is @unique
   */
  public get unique() {
    return this.attributes.unique;
  }

  /**
   * Returns the column @view format (defaults to none)
   * example: @view.char({length 1})
   */
  public get view() {
    if (this.model) {
      return { 
        component: false, 
        method: 'hide', 
        args: [], 
        attributes: {} 
      };
    }
    return this.attributes.view;
  }

  /**
   * Returns the column @zindex format
   * example: @zindex(100)
   */
  public get zindex() {
    return this.attributes.zindex;
  }

  /**
   * Sets the fieldset and column information
   */
  public constructor(fieldset: Fieldset, info: SchemaColumnInfo) {
    this._fieldset = fieldset;
    this.type = info.type;
    this.name = info.name;
    this.multiple = info.multiple;
    this.required = info.required;
    this.attributes = new Attributes(
      Object.entries(info.attributes)
    );
  }

  /**
   * Returns error message if the value is invalid
   */
  public assert(value: any, strict = true) {
    for (const assertion of this.assertions) {
      const { method, args, message } = assertion;
      const hasDefault = typeof this.default !== 'undefined';
      const hasNoValue = value === null 
        || typeof value === 'undefined'
        || value === '';
      //if assertion method is not 
      //a function ie. unique, etc.
      if (typeof assert[method] !== 'function'
        //if not strict and required
        || (!strict && method === 'required')
        //if strict and no value, but there is a default
        || (strict && hasNoValue && (!this.required || hasDefault))
      ) {
        //we should skip this check for others
        continue;
      }
      //now we can assert
      if (!assert[method](value, ...args)) {
        //return message, but if message is null, then return empty string
        return message || '';
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
   * Returns a column attribute
   */
  public attribute(name: string) {
    return this.attributes.get(name);
  }

  /**
   * Serializes a value to be inserted into the database
   */
  public serialize(
    value: any, 
    options: SchemaSerialOptions = {},
    seed?: string
  ): string|number|boolean|Date|null|undefined {
    const { bool = true, date = true, object = false } = options;
    //if value is null or undefined and not required
    if (!this.required && (
      value === null || typeof value === 'undefined'
    )) {
      return value;
    //if value is null or undefined and required
    } else if (typeof value === 'undefined') {
      return value;
    }
    //serialize and hash
    if (typeof value === 'string' && this.hash) {
      return hash(value);
    } else if (typeof value === 'string' && this.encrypted && seed) {
      return encrypt(value, seed);
    }
    //if fieldset or multiple
    if (this.fieldset || this.multiple) {
      //there's no need to recursive serialize
      return object ? value: JSON.stringify(value);
    }
    //if type is in the typemap
    if (this.typemap.method) {
      //string, number, integer, float, boolean, date, object
      const type = this.typemap.method;
      //if type is a number
      if ([ 'number', 'integer', 'float' ].includes(type)) {
        const serialized = Number(value);
        return !isNaN(serialized) ? serialized : 0;
      //if type is a boolean
      } else if (type === 'boolean') {
        if (value === 'false') {
          return bool ? false: 0;
        } else if (value === 'true') {
          return bool ? true: 1;
        }
        return bool ? Boolean(value): Number(Boolean(value));
      //if type is a date
      } else if (type === 'date') {
        if (value instanceof Date) {
          return date ? value: [
            value.toISOString().split('T')[0],
            value.toTimeString().split(' ')[0]
          ].join(' ');
        } else if (typeof value === 'number') {
          const stamp = new Date(value);
          return date? stamp: [
            stamp.toISOString().split('T')[0],
            stamp.toTimeString().split(' ')[0]
          ].join(' ');
        }
        let stamp = new Date(value as unknown as string);
        if (isNaN(stamp.getTime())) {
          stamp = new Date(0);
        }
        return date ? stamp : [
          stamp.toISOString().split('T')[0],
          stamp.toTimeString().split(' ')[0]
        ].join(' ');
      //if type is an object
      } else if (type === 'object') {
        //if value is a string
        if (typeof value === 'string') {
          try { //to see if it's a valid JSON string
            if (object) {
              return JSON.parse(value);
            }
            //if value can be parsed as JSON
            JSON.parse(value);
            //then it's already JSON serialized
            return value;
          //let JSON serialize the value
          } catch (e) {}
        }
        //let JSON serialize the value
        return object ? value: JSON.stringify(value);
      }
      //if string...
      return value?.toString() || value;
    }
    //allow: string|number|null|undefined
    if (value === null 
      || typeof value === 'string'
      || typeof value === 'number'
      || typeof value === 'undefined'
    ) {
      return value as string|number|null|undefined;
    //if value is a boolean
    } else if (typeof value === 'boolean') {
      return bool ? value: Number(value);
    //if value is a date
    } else if (value instanceof Date) {
      return date ? value: [
        value.toISOString().split('T')[0],
        value.toTimeString().split(' ')[0]
      ].join(' ');
    }
    //try to get the string value
    return object ? value : (value?.toString() || value);
  }

  /**
   * Unserializes a value coming from the database
   */
  public unserialize(
    value: any, 
    options: SchemaSerialOptions = {},
    seed?: string
  ) {
    const { bool = true, date = true } = options;
    //if value is null or undefined
    if (value === null || typeof value === 'undefined') {
      return value;
    //if fieldset or multiple
    } else if (this.fieldset || this.multiple) {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          return this.multiple ? []: {};
        }
      }
    }
    //fieldset
    if (this.fieldset) {
      const fieldset = this.fieldset;
      return !this.multiple 
        ? this.fieldset.unserialize(value, options, seed)
        : Array.isArray(value)
        ? value.map(value => fieldset.unserialize(value, options, seed))
        : [];
    }
    //unserialize
    if (typeof value === 'string' && this.encrypted && seed) {
      return decrypt(value, seed);
    }
    //if type is in the typemap
    if (this.typemap.method) {
      //string, number, integer, float, boolean, date, object
      const type = this.typemap.method;
      if ([ 'number', 'integer', 'float' ].includes(type)) {
        const serialized = Number(value);
        return !isNaN(serialized) ? serialized : 0;
      } else if (type === 'boolean') {
        return bool ? Boolean(value): Number(Boolean(value));
      } else if (type === 'date') {
        if (value instanceof Date) {
          return date ? value: [
            value.toISOString().split('T')[0],
            value.toTimeString().split(' ')[0]
          ].join(' ');
        } else if (typeof value === 'number') {
          const stamp = new Date(value);
          return date? stamp: [
            stamp.toISOString().split('T')[0],
            stamp.toTimeString().split(' ')[0]
          ].join(' ');
        }
        let stamp = new Date(value as unknown as string);
        if (isNaN(stamp.getTime())) {
          stamp = new Date(0);
        }
        return date ? stamp : [
          stamp.toISOString().split('T')[0],
          stamp.toTimeString().split(' ')[0]
        ].join(' ');
      //if type is an object
      } else if (type === 'object') {
        //if value is a string
        if (typeof value === 'string') {
          try { //to parse the value
            return JSON.parse(value);
          } catch (e) {}
        }
        return value;
      }
    }
    return value;
  }
}