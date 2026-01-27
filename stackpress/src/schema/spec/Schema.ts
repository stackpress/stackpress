//modules
import type { 
  EnumConfig, 
  PluginConfig, 
  PropConfig, 
  SchemaConfig 
} from '@stackpress/idea-parser';
import { isObject } from '@stackpress/lib';
//stackpress/schema/spec/attribute
import type Attributes from './attribute/Attributes.js';
import Attribute from './attribute/Attribute.js';
//stackpress/schema/spec/column
import type Columns from './column/Columns.js';
import ColumnType from './column/ColumnType.js';
import Column from './column/Column.js';
//stackpress/schema/spec/fieldset
import Fieldset from './fieldset/Fieldset.js';
//stackpress/schema/spec/model
import type ModelColumns from './model/ModelColumns.js';
import ModelColumn from './model/ModelColumn.js';
import Model from './model/Model.js';

export default class Schema {
  /**
   * Populate a schema instance from a schema config
   */
  public static make(config: SchemaConfig) {
    const schema = new Schema();
    if (config.plugin && isObject(config.plugin)) {
      for (const key in config.plugin) {
        schema.makePlugin(key, config.plugin[key]);
      }
    }
    if (config.prop && isObject(config.prop)) {
      for (const key in config.prop) {
        schema.makeProp(key, config.prop[key]);
      }
    }
    if (config.enum && isObject(config.enum)) {
      for (const key in config.enum) {
        schema.makeEnum(key, config.enum[key]);
      }
    }
    if (config.type && isObject(config.type)) {
      for (const name in config.type) {
        const { attributes, columns } = config.type[name];
        schema.makeFieldset(
          name, 
          Object.entries(attributes).map(entry => new Attribute(...entry)), 
          columns.map(column => new Column(
            column.name, 
            new ColumnType(column.type, column.required, column.multiple), 
            Object.entries(column.attributes).map(entry => new Attribute(...entry))
          ))
        );
      }
    }
    if (config.model && isObject(config.model)) {
      for (const name in config.model) {
        const { attributes, columns } = config.model[name];
        schema.makeModel(
          name, 
          Object.entries(attributes).map(entry => new Attribute(...entry)), 
          columns.map(column => new ModelColumn(
            column.name, 
            new ColumnType(column.type, column.required, column.multiple), 
            Object.entries(column.attributes).map(entry => new Attribute(...entry))
          ))
        );
      }
    }
    return schema;
  }

  public readonly enums = new Map<string, EnumConfig>();
  public readonly fieldsets = new Map<string, Fieldset>();
  public readonly models = new Map<string, Model>();
  public readonly plugins = new Map<string, PluginConfig>();
  public readonly props = new Map<string, PropConfig>();

  /**
   * Adds a new enum to the schema and returns it
   */
  public makeEnum(name: string, options: EnumConfig) {
    this.enums.set(name, options);
    return this.enums.get(name)!;
  }

  /**
   * Creates a new fieldset, adds to the schema and returns it
   */
  public makeFieldset(
    name: string,
    attributes?: Attributes | Iterable<Attribute>,
    columns?: Columns | Iterable<Column>
  ) {
    const fieldset = new Fieldset(name, attributes, columns);
    this.fieldsets.set(name, fieldset);
    return fieldset;
  }

  /**
   * Creates a new model, adds to the schema and returns it
   */
  public makeModel(
    name: string,
    attributes?: Attributes | Iterable<Attribute>,
    columns?: ModelColumns | Iterable<ModelColumn>
  ) {
    const model = new Model(name, attributes, columns);
    this.models.set(name, model);
    return model;
  }

  /**
   * Adds a new plugin to the schema and returns it
   */
  public makePlugin(module: string, config: PluginConfig) {
    this.plugins.set(module, config);
    return this.plugins.get(module)!;
  }

  /**
   * Adds a new prop to the schema and returns it
   */
  public makeProp(name: string, value: PropConfig) {
    this.props.set(name, value);
    return this.props.get(name)!;
  }
}