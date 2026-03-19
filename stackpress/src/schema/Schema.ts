//modules
import type { 
  EnumConfig, 
  PluginConfig, 
  PropConfig, 
  SchemaConfig 
} from '@stackpress/idea-parser';
import { isObject } from '@stackpress/lib/Nest';
import DataMap from '@stackpress/lib/Map';
//stackpress/schema
import type { AttributesToken, ColumnToken } from './types.js';
//stackpress/schema/fieldset
import Fieldset from './Fieldset.js';
//stackpress/schema/model
import Model from './Model.js';

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
          attributes, 
          columns.map(column => ({
            name: column.name, 
            type: {
              name: column.type,
              required: column.required,
              multiple: column.multiple
            },
            attributes: column.attributes
          }))
        );
      }
    }
    if (config.model && isObject(config.model)) {
      for (const name in config.model) {
        const { attributes, columns } = config.model[name];
        schema.makeModel(
          name, 
          attributes, 
          columns.map(column => ({
            name: column.name, 
            type: {
              name: column.type,
              required: column.required,
              multiple: column.multiple
            },
            attributes: column.attributes
          }))
        );
      }
    }
    return schema;
  }

  public readonly enums = new DataMap<string, EnumConfig>();
  public readonly fieldsets = new DataMap<string, Fieldset>();
  public readonly models = new DataMap<string, Model>();
  public readonly plugins = new DataMap<string, PluginConfig>();
  public readonly props = new DataMap<string, PropConfig>();

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
    attributes?: AttributesToken,
    columns?: Array<ColumnToken>
  ) {
    const fieldset = Fieldset.make(name, attributes, columns, this);
    this.fieldsets.set(name, fieldset);
    return fieldset;
  }

  /**
   * Creates a new model, adds to the schema and returns it
   */
  public makeModel(
    name: string,
    attributes?: AttributesToken,
    columns?: Array<ColumnToken>
  ) {
    const model = Model.make(name, attributes, columns, this);
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