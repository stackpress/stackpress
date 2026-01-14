//modules
import type { 
  AttributeValue,
  ColumnConfig
} from '@stackpress/idea-parser';
import Mustache from 'mustache';
//schema
import type { ErrorMap, SerializeOptions } from '../types.js';
import type Registry from '../Registry.js';
import { 
  camelize, 
  capitalize, 
  dasherize, 
  generators,
  snakerize
} from '../helpers.js';
//local
import Attributes from './Attributes.js';
import Column from './Column.js';

export class FieldsetAttributes extends Attributes {
  /**
   * Returns the column @display
   * example: @display("User: {{name}}")
   */
  public get display() {
    return this.value<string>('display');
  }

  /**
   * Returns the column @label
   * example: @icon("user")
   */
  public get icon() {
    return this.value<string>('icon');
  }

  /**
   * Returns the column @label
   * example: @label("Some Label" "Some other label")
   */
  public get labels() {
    return this.args<string>('labels');
  }
};

export default class Fieldset extends FieldsetAttributes {
  //stores the registry
  public readonly registry: Registry;
  //name of the fieldset
  public readonly name: string;
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
  public get camelized() {
    return camelize(this.name);
  }

  /**
   * Returns the dashed fieldset name
   */
  public get dasherized() {
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
      //if no default
      if (typeof column.default === 'undefined' 
        || ( //or default is a generator
          typeof column.default === 'string'
          && generators.includes(column.default)
        )
      ) {
        continue;
      }
      defaults[column.name] = column.default;
    }
    return defaults;
  }

  /**
   * Returns a collection of descriptions
   */
  public get descriptions() {
    const descriptions: Record<string, string> = {};
    for (const column of this.columns.values()) {
      if (column.description) {
        descriptions[column.name] = column.description;
      }
    }
    return descriptions;
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
   * Returns a collection of example values
   */
  public get examples() {
    const examples: Record<string, any> = {};
    for (const column of this.columns.values()) {
      if (column.examples.length > 0) {
        examples[column.name] = column.examples;
      }
    }
    return examples;
  }

  /**
   * Returns all the field columns
   */
  public get fields() {
    return Array.from(this.columns.values()).filter(
      column => Boolean(column.field)
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
   * Returns all the filters columns
   */
  public get filters() {
    return Array.from(this.columns.values()).filter(
      column => Boolean(column.filter)
    );
  }

  /**
   * Returns all the listable columns
   */
  public get lists() {
    return Array.from(this.columns.values()).filter(
      column => column.list && column.list.name !== 'list.none'
    );
  }

  /**
   * Returns the lower cased fieldset name
   */
  public get lowerCase() {
    return this.name.toLocaleLowerCase();
  }

  /**
   * Returns the schema plural label
   */
  public get plural() {
    return this.labels[1] || this.name;
  }

  /**
   * Returns the schema singular label
   */
  public get singular() {
    return this.labels[0] || this.name;
  }

  /**
   * returns snake case name
   */
  public get snakeCase() {
    return snakerize(this.name);
  }

  /**
   * Returns all the span columns
   */
  public get spans() {
    return Array.from(this.columns.values()).filter(
      column => Boolean(column.span)
    );
  }

  /**
   * Returns the capitalized column name
   */
  public get titleCase() {
    return capitalize(camelize(this.name));
  }

  /**
   * Returns all the viewable columns
   */
  public get views() {
    return Array
      .from(this.columns.values())
      .filter(column => Boolean(column.view));
  }

  /**
   * Sets the fieldset and column information 
   */
  public constructor(
    registry: Registry,
    name: string, 
    attributes: Record<string, AttributeValue>, 
    columns: ColumnConfig[]
  ) {
    super(attributes);
    this.registry = registry;
    this.name = name;
    this.columns = new Map(columns.map(
      config => [ config.name, new Column(this, config) ]
    ));
  }

  /**
   * Asserts the values
   */
  public assert(values: Record<string, any> = {}, strict = true) {
    const errors: ErrorMap = {};
    for (const column of this.columns.values()) {
      if (column.model) continue;
      const value = column.unserialize(values[column.name]);
      const message = column.assert(value, strict);
      if (typeof message !== 'undefined' && message !== null) {
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
      if (column.snakeCase === name) {
        return column;
      }
    }
    return null;
  }

  /**
   * Removes values that are not columns or (strict) input fields
   */
  public input(values: Record<string, any>, strict = true) {
    const inputs: Record<string, any> = {};
    
    for (const [ name, value ] of Object.entries(values)) {
      if (this.fields.find(column => column.name === name)) {
        inputs[name] = value;
        continue;
      } else if (!strict) {
        const column = this.column(name);
        //if it's not a column or a model, skip it
        if (!column || column.model) continue;
        inputs[name] = value;
      }
    }
    return inputs;
  }

  /**
   * Renders a template given the data
   */
  public render(data: Record<string, any>) {
    if (!this.display) {
      return '';
    }
    return Mustache.render(this.display, data);
  }

  /**
   * Returns a function to generate a suggested label
   */
  public transformTemplate(to = '${data.%s}') {
    const template = this.display || '';
    return Array.from(
      template.matchAll(/\{\{([a-zA-Z0-9_\.]+)\}\}/g)
    ).reduce((result, match) => {
      return result.replace(match[0], to.replaceAll('%s', match[1]));
    }, template)
  }

  /**
   * Serializes values to be inserted into the database
   */
  public serialize(
    values: Record<string, any>,
    seed?: string, 
    options: SerializeOptions = {}
  ) {
    const {
      booleanToNumber = false,
      dateToString = false,
      objectToString = false
    } = options;
    const serialized: Record<string, string|number|boolean|Date|null|undefined> = {};
    for (const [ name, value ] of Object.entries(values)) {
      const column = this.columns.get(name);
      if (!column) {
        continue;
      }
      const scalar = column.type === 'Boolean' 
        ? booleanToNumber 
        : column.type === 'Date' 
          || column.type === 'Datetime' 
          || column.type === 'Time'
        ? dateToString
        : column.type === 'Object' 
          || column.type === 'Hash' 
          || column.type === 'Json'
        ? objectToString
        : false;
      serialized[column.snakeCase] = column.serialize(value, seed, scalar);
    }
    return serialized;
  }

  /**
   * Unserializes a value coming from the database
   */
  public unserialize(
    values: Record<string, any>, 
    seed?: string, 
    options: SerializeOptions = {}
  ) {
    const {
      booleanToNumber = false,
      dateToString = false,
      objectToString = false
    } = options;
    const unserialized: Record<string, any> = {};
    for (const [ name, value ] of Object.entries(values)) {
      const column = this.fromSnake(name);
      if (!column) {
        unserialized[name] = value;
        continue;
      }
      const scalar = column.type === 'Boolean' 
        ? booleanToNumber 
        : column.type === 'Date' 
          || column.type === 'Datetime' 
          || column.type === 'Time'
        ? dateToString
        : column.type === 'Object' 
          || column.type === 'Hash' 
          || column.type === 'Json'
        ? objectToString
        : false;
      unserialized[column.name] = column.unserialize(value, seed, scalar);
    }
    return unserialized;
  }
}