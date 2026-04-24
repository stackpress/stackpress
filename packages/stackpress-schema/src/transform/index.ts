//modules
import { VariableDeclarationKind } from 'ts-morph';
//stackpress-schema
import type { ClientPluginProps } from '../types.js';
import Schema from '../Schema.js';
import generateConfig from './config.js';
import generateColumns from './columns.js';
import generateFieldset from './fieldset.js';
import generateSchema from './schema.js';
import {
  generateFieldsetTypes,
  generateModelTypes,
  generateTypes
} from './types.js';
import generateEnums from './enums.js';
import generatePackage from './package.js';
import generateSchemaTests from './tests/schema.js';
import { loadProjectFile } from './helpers.js';

export default async function generate(props: ClientPluginProps) {
  //------------------------------------------------------------------//
  // 1. Config

  const { directory, terminal } = props;
  const schema = Schema.make(props.schema);
  const server = terminal.server;
  const loader = server.loader;
  const revisionPath = server.config.path<string>('client.revisions');
  const packageName = server.config.path('client.package', 'stackpress-client');

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
    //Address/index.ts
    generateFieldset(directory, fieldset);
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
    //Profile/index.ts
    generateFieldset(directory, model);
  }

  //------------------------------------------------------------------//
  // 3. config.ts

  generateConfig(directory, props.schema, loader, revisionPath);

  //------------------------------------------------------------------//
  // 4. types.ts

  generateTypes(directory, schema);

  //------------------------------------------------------------------//
  // 5. index.ts

  //load index.ts if it exists, if not create it
  const source = loadProjectFile(directory, 'index.ts');

  //import AddressFieldset from './Address/index.js';
  for (const fieldset of schema.fieldsets.values()) {
    source.addImportDeclaration({
      moduleSpecifier: fieldset.name.toPathName('./%s/index.js'),
      defaultImport: fieldset.name.toPropertyName('%sFieldset', true)
    });
  }
  //import ProfileModel from './Profile/index.js';
  for (const model of schema.models.values()) {
    source.addImportDeclaration({
      moduleSpecifier: model.name.toPathName('./%s/index.js'),
      defaultImport: model.name.toPropertyName('%sModel', true)
    });
  }
  //import config from './config.js';
  source.addImportDeclaration({
    moduleSpecifier: './config.js',
    defaultImport: 'config'
  });

  //export { config };
  source.addExportDeclaration({
    namedExports: [ 'config' ]
  });

  //export const fieldset = {};
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'model',
        initializer: `{
          ${Array.from(schema.models.values()).map(
            model => [ 
              model.name.toPropertyName(), 
              model.name.toPropertyName('%sModel', true) 
            ].join(': ')
          ).join(',\n')}
        }`
      }
    ]
  });
  //export const model = {};
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'fieldset',
        initializer: `{
          ${Array.from(schema.fieldsets.values()).map(
            fieldset => [ 
              fieldset.name.toPropertyName(), 
              fieldset.name.toPropertyName('%sFieldset', true) 
            ].join(': ')
          ).join(',\n')}
        }`
      }
    ]
  });

  //------------------------------------------------------------------//
  // 5. package.json

  generatePackage(directory, schema, packageName);
};