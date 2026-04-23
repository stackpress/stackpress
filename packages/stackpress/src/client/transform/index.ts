import { VariableDeclarationKind } from 'ts-morph';
//stackpress
import type { IdeaProjectPluginProps } from '../../types.js';
//stackpress/schema
import Schema from '../../schema/Schema.js';
import { loadProjectFile } from '../../schema/transform/helpers.js';
//stackpress/client
import generateConfig from './config.js';
import generateFieldset from './fieldset.js';
import generateModel from './model.js';
import generateTypes from './types.js';
import generatePackage from './package.js';

export default async function generate(props: IdeaProjectPluginProps) {
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

  for (const fieldset of schema.fieldsets.values()) {
    //Address/index.ts
    generateFieldset(directory, fieldset);
  }

  for (const model of schema.models.values()) {
    //Profile/index.ts
    generateModel(directory, model);
  }

  //------------------------------------------------------------------//
  // 3. config.ts

  generateConfig(directory, props.schema, loader, revisionPath);

  //------------------------------------------------------------------//
  // 4. types.ts

  generateTypes(directory, schema);

  //------------------------------------------------------------------//
  // 5. package.json

  generatePackage(directory, schema, loader.fs, packageName);

  //------------------------------------------------------------------//
  // 6. index.ts

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
  //import * as scripts from './scripts.js';
  source.addImportDeclaration({
    moduleSpecifier: './scripts.js',
    namespaceImport: 'scripts'
  });
  //import config from './config.js';
  source.addImportDeclaration({
    moduleSpecifier: './config.js',
    defaultImport: 'config'
  });

  //export { scripts, config };
  source.addExportDeclaration({
    namedExports: [ 'scripts', 'config' ]
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
};