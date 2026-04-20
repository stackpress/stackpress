//stackpress-schema
import type { IdeaProjectPluginProps } from '../types.js';
import Schema from '../Schema.js';
import generateColumns from './columns.js';
import generateSchema from './schema.js';
import {
  generateFieldsetTypes,
  generateModelTypes
} from './types.js';
import generateEnums from './enums.js';
import generateSchemaTests from './tests/schema.js';

export default async function generate(props: IdeaProjectPluginProps) {
  //------------------------------------------------------------------//
  // 1. Config

  const schema = Schema.make(props.schema);
  const directory = props.directory;

  //------------------------------------------------------------------//
  // 2. Generators

  //enums.ts
  generateEnums(directory, schema);

  for (const fieldset of schema.fieldsets.values()) {
    //Address/columns/index.ts
    generateColumns(directory, fieldset);
    //Address/AddressSchema.ts
    generateSchema(directory, fieldset);
    //Address/tests
    generateSchemaTests(directory, fieldset);
    //Address/types.ts
    generateFieldsetTypes(directory, fieldset);
  }

  for (const model of schema.models.values()) {
    //Profile/columns/index.ts
    generateColumns(directory, model);
    //Profile/ProfileSchema.ts
    generateSchema(directory, model);
    //Profile/tests
    generateSchemaTests(directory, model);
    //Profile/types.ts
    generateModelTypes(directory, model);
  }
};