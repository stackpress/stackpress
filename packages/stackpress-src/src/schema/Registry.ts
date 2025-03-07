//stackpress
import type { 
  EnumConfig, 
  SchemaConfig 
} from '@stackpress/idea-parser/dist/types';
import { isHash } from '@stackpress/ingest/dist/helpers';
//local
import Fieldset from './spec/Fieldset';
import Model from './spec/Model';

export default class Registry {
  /**
   * Loads the schema from the configuration file
   */
  public constructor(schema: SchemaConfig) {
    if (schema.enum && isHash(schema.enum)) {
      for (const key in schema.enum) {
        this.enum.set(key, schema.enum[key]);
      }
    }
    if (schema.type && isHash(schema.type)) {
      for (const name in schema.type) {
        const { attributes, columns } = schema.type[name];
        this.fieldset.set(name, new Fieldset(this, name, attributes, columns));
      }
    }
    if (schema.model && isHash(schema.model)) {
      for (const name in schema.model) {
        const { attributes, columns } = schema.model[name];
        this.model.set(name, new Model(this, name, attributes, columns));
      }
    }
  }

  //stores the enum configuration
  public readonly enum = new Map<string, EnumConfig>();
  //stores the fieldset configuration
  public readonly fieldset = new Map<string, Fieldset>();
  //stores the model configuration
  public readonly model = new Map<string, Model>();
};
