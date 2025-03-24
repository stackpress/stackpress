//modules
import Mustache from 'mustache';
//stackpress
import type { NestedObject } from '@stackpress/lib';
//root
import type { SchemaColumnInfo, SchemaSerialOptions } from '../../types';
//local
import type Registry from '../Registry';
import Attributes from './Attributes';
import Column from './Column';
import { 
  camelize, 
  capitalize, 
  dasherize, 
  generators,
  snakerize
} from '../helpers';

export default class Fieldset {
  //stores the registry
  public readonly registry: Registry;
  //name of the fieldset
  public readonly name: string;
  //attributes of the fieldset
  public readonly attributes: Attributes;
  //columns of the fieldset
  public readonly columns: Map<string, Column>;

  /**
   * Returns all the columns with assertions
   */
  public get assertions() {
    return Array.from(this.columns.values()).filter(
      column => column.assertions.length > 0
    );
  }

  /**
   * Returns the camel cased fieldset name
   */
  public get camel() {
    return camelize(this.name);
  }

  /**
   * Returns the dashed fieldset name
   */
  public get dash() {
    return dasherize(this.name);
  }

  /**
   * Returns all the encrypted columns
   */
  public get encrypted() {
    return Array.from(this.columns.values()).filter(
      column => column.encrypted
    );
  }

  /**
   * Returns the default values
   */
  public get defaults() {
    const defaults: Record<string, any> = {};
    for (const column of this.columns.values()) {
      if (column.default === undefined 
        || generators.includes(column.default)
      ) {
        continue;
      }
      defaults[column.name] = column.default;
    }
    return defaults;
  }

  /**
   * Returns all the enum columns
   */
  public get enums() {
    return Array.from(this.columns.values()).filter(
      column => column.enum !== null
    );
  }

  /**
   * Returns all the field columns
   */
  public get fields() {
    return Array.from(this.columns.values()).filter(
      column => column.field.method !== 'none'
    );
  }

  /**
   * Returns all the types that are fieldsets
   */
  public get fieldsets(): Column[] {
    //address Address[]
    return Array.from(this.columns.values()).filter(
      column => !!column.fieldset
    );
  }

  /**
   * Returns the icon
   */
  public get icon() {
    return this.attributes.icon;
  }

  /**
   * Returns all the indexable columns
   */
  public get label() {
    return this.attributes.labels;
  }

  /**
   * Returns all the listable columns
   */
  public get lists() {
    return Array.from(this.columns.values()).filter(
      column => column.list.method !== 'hide'
    );
  }

  /**
   * Returns the lower cased fieldset name
   */
  public get lower() {
    return this.name.toLocaleLowerCase();
  }

  /**
   * Returns the schema plural label
   */
  public get plural() {
    return this.attributes.labels[1] || this.name;
  }

  /**
   * Returns the schema singular label
   */
  public get singular() {
    return this.attributes.labels[0] || this.name;
  }

  /**
   * returns snake case name
   */
  public get snake() {
    return snakerize(this.name);
  }

  /**
   * Returns the fieldset @template
   */
  public get template() {
    return this.attributes.template;
  }

  /**
   * Returns the capitalized column name
   */
  public get title() {
    return capitalize(this.name);
  }

  /**
   * Returns all the viewable columns
   */
  public get views() {
    return Array.from(this.columns.values()).filter(
      column => column.view.method !== 'hide'
    );
  }

  /**
   * Sets the fieldset and column information 
   */
  public constructor(
    registry: Registry,
    name: string, 
    attributes: Record<string, unknown>, 
    columns: SchemaColumnInfo[]
  ) {
    this.registry = registry;
    this.name = name;
    this.attributes = new Attributes(Object.entries(attributes));
    this.columns = new Map(columns.map(
      info =>[ info.name, new Column(this, info) ]
    ));
  }

  /**
   * Asserts the values
   */
  public assert(values: Record<string, any>, strict = true) {
    const errors: NestedObject<string|string[]> = {};
    for (const column of this.columns.values()) {
      if (column.model) {
        continue;
      }
      if (column.fieldset) {
        const assertions = column.fieldset.assert(
          values[column.name], 
          strict
        );
        if (assertions) {
          errors[column.name] = assertions;
        }
        continue;
      }
      const value = column.unserialize(values[column.name]);
      const message = column.assert(value, strict);
      if (typeof message === 'string') {
        errors[column.name] = message;
      }
    }
    return Object.keys(errors).length > 0 ? errors : null;
  }

  /**
   * Returns a column by name
   */
  public column(name: string) {
    return this.columns.get(name);
  }

  /**
   * Removes values that are not columns
   */
  public filter(values: Record<string, any>) {
    const filtered: Record<string, any> = {};
    for (const [ name, value ] of Object.entries(values)) {
      if (this.columns.has(name)) {
        filtered[name] = value;
      }
    }
    return filtered;
  }

  /**
   * Finds a column by snake case name
   */
  public fromSnake(name: string) {
    const columns = Array.from(this.columns.values());
    for (const column of columns) {
      if (column.snake === name) {
        return column;
      }
    }
    return null;
  }

  /**
   * Removes values that are not columns
   */
  public input(values: Record<string, any>) {
    const inputs: Record<string, any> = {};
    
    for (const [ name, value ] of Object.entries(values)) {
      if (this.fields.find(column => column.name === name)) {
        inputs[name] = value;
      }
    }
    return inputs;
  }

  /**
   * Renders a template given the data
   */
  public render(data: Record<string, any>) {
    if (!this.template) {
      return '';
    }
    return Mustache.render(this.template, data);
  }

  /**
   * Serializes values to be inserted into the database
   */
  public serialize(
    values: Record<string, any>, 
    options: SchemaSerialOptions = {}
  ) {
    const serialized: Record<string, string|number|boolean|Date|null|undefined> = {};
    for (const [ name, value ] of Object.entries(values)) {
      const column = this.columns.get(name);
      if (!column) {
        continue;
      }
      serialized[column.snake] = column.serialize(value, options);
    }
    return serialized;
  }

  /**
   * Unserializes a value coming from the database
   */
  public unserialize(
    values: Record<string, any>, 
    options: SchemaSerialOptions = {}
  ) {
    const unserialized: Record<string, any> = {};
    for (const [ name, value ] of Object.entries(values)) {
      const column = this.fromSnake(name);
      if (!column) {
        unserialized[name] = value;
        continue;
      }
      unserialized[column.name] = column.unserialize(value, options);
    }
    return unserialized;
  }
}