//modules
import { VariableDeclarationKind } from 'ts-morph';
//stackpress-schema
import type { ClientPluginProps } from 'stackpress-schema/types';
import Schema from 'stackpress-schema/Schema';
import { loadProjectFile } from 'stackpress-schema/transform/helpers';
//stackpress-mcp
import generateTools from './tools.js';
import generatePackage from './package.js';

export default async function generate(props: ClientPluginProps) {
  //------------------------------------------------------------------//
  // 1. Config

  const schema = Schema.make(props.schema);
  const directory = props.directory;
  
  //------------------------------------------------------------------//
  // 2. tools.ts

  generateTools(directory, schema);

  //------------------------------------------------------------------//
  // 3. index.ts

  //load index.ts if it exists, if not create it
  const source = loadProjectFile(directory, 'index.ts');
  //clear source file (stackpress-schema originally generated this file)
  source.replaceWithText('');
  
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
  //import tools from './tools.js';
  source.addImportDeclaration({
    moduleSpecifier: './tools.js',
    defaultImport: 'tools'
  });
  //import config from './config.js';
  source.addImportDeclaration({
    moduleSpecifier: './config.js',
    defaultImport: 'config'
  });

  //export { scripts, config, tools };
  source.addExportDeclaration({
    namedExports: [ 'scripts', 'config', 'tools' ]
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
  // 4. package.json

  generatePackage(directory, schema);
};