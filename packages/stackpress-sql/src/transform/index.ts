//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress-schema
import type { ClientPluginProps } from 'stackpress-schema/types';
import type Model from 'stackpress-schema/Model';
import Schema from 'stackpress-schema/Schema';
import { loadProjectFile } from 'stackpress-schema/transform/helpers';
//stackpress-sql
import generateActions from './actions/index.js';
import generateEvents from './events/index.js';
import generateStore from './store/index.js';
import generateScripts from './scripts.js';
import { 
  generateModelTypes,
  generateTypes 
} from './types.js';
import generateModelIndex from './model.js';
import generatePackage from './package.js';
import generateActionsTests from './tests/actions.js';
import generateEventsTests from './tests/events.js';
import generateStoreTests from './tests/store.js';

export default async function generate(props: ClientPluginProps) {
  //------------------------------------------------------------------//
  // 1. Config

  const schema = Schema.make(props.schema);
  const directory = props.directory;

  //------------------------------------------------------------------//
  // 2. Generators

  for (const model of schema.models.values()) {
    generateModel(directory, model);
  }

  //------------------------------------------------------------------//
  // 3. scripts.ts

  generateScripts(directory, schema);

  //------------------------------------------------------------------//
  // 4. types.ts

  generateTypes(directory, schema);

  //------------------------------------------------------------------//
  // 5. index.ts

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

  //------------------------------------------------------------------//
  // 6. package.json

  generatePackage(directory, schema);
};

export function generateModel(directory: Directory, model: Model) {
  //------------------------------------------------------------------//
  // 1. Profile/ProfileStore.ts

  generateStore(directory, model);

  //------------------------------------------------------------------//
  // 2. Profile/ProfileActions.ts

  generateActions(directory, model);

  //------------------------------------------------------------------//
  // 3. Profile/events/*.ts

  generateEvents(directory, model);

  //------------------------------------------------------------------//
  // 4. Profile/types.ts

  generateModelTypes(directory, model);

  //------------------------------------------------------------------//
  // 5. Profile/index.ts

  generateModelIndex(directory, model);

  //------------------------------------------------------------------//
  // 6. Profile/tests/ProfileStore.test.ts

  generateStoreTests(directory, model);

  //------------------------------------------------------------------//
  // 7. Profile/tests/ProfileActions.test.ts

  generateActionsTests(directory, model);

  //------------------------------------------------------------------//
  // 8. Profile/tests/events.test.ts

  generateEventsTests(directory, model);
}