//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../schema/Model.js';
//stackpress/schema/transform
import { loadProjectFile } from '../../schema/transform/helpers.js';

export default function generate(directory: Directory, model: Model) {
  //dont include columns that are models 
  //(those are more of relational information)
  const columns = model.columns.filter(
    column => !column.type.model
  );
  //relations like this: (foriegn keys)
  // owner User @relation({ name "connections" local "userId" foreign "id" })
  //not like this: (local keys)
  // users User[]
  const relations = model.store.foreignRelationships;

  const filepath = model.name.toPathName('%s/types.ts');
  //load Profile/ProfileSchema.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //import StoreInterface from 'stackpress/sql/StoreInterface';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/sql/StoreInterface',
    defaultImport: 'StoreInterface'
  });
  //import ActionsInterface from 'stackpress/sql/ActionsInterface';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql/ActionsInterface',
    defaultImport: 'ActionsInterface'
  });
  //import ProfileStore from '../Profile/ProfileStore.js';
  for (const column of relations.values()) {
    //this should never happen...
    if (!column.type.model) continue;
    //import ProfileStore from '../Profile/ProfileStore.js';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: column.type.model.name.toPathName('../%s/%sStore.js'),
      defaultImport: column.type.model.name.toClassName('%sStore')
    });
  }

  //export interface ProfileStoreInterface extends StoreInterface<T, E, C, R> {};
  source.addInterface({
    isExported: true,
    name: `${model.name.toClassName()}StoreInterface`,
    extends: [
      `StoreInterface<${[
        model.name.toTypeName(),
        model.name.toTypeName('%sExtended'),
        `{${
          columns.map(
            column => `${column.name.toString()}: ${
              column.type.fieldset 
                ? column.type.fieldset.name.toClassName('%sColumn')
                : column.name.toClassName('%sColumn')
            }`
          ).toArray().join(', ')
        }}`,
        `{${
          relations.map(
            column => `${column.name.toString()}: {
              store: ${column.name.toClassName('%sStore')},
              local: string,
              foreign: string,
              multiple: boolean,
              required: boolean
            }`
          ).toArray().join(', ')
        }}`
      ].join(', ')}>` 
    ]
  });

  //export interface ProfileActionsInterface extends ActionsInterface<T, E, C, R> {};
  source.addInterface({
    isExported: true,
    name: `${model.name.toClassName()}ActionsInterface`,
    extends: [
      `ActionsInterface<${[
        model.name.toTypeName(),
        model.name.toTypeName('%sExtended'),
        `{${
          columns.map(
            column => `${column.name.toString()}: ${
              column.type.fieldset 
                ? column.type.fieldset.name.toClassName('%sColumn')
                : column.name.toClassName('%sColumn')
            }`
          ).toArray().join(', ')
        }}`,
        `{${
          relations.map(
            column => `${column.name.toString()}: {
              store: ${column.name.toClassName('%sStore')},
              local: string,
              foreign: string,
              multiple: boolean,
              required: boolean
            }`
          ).toArray().join(', ')
        }}`
      ].join(', ')}>`
    ]
  });
};