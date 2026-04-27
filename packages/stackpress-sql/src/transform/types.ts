//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import type Schema from 'stackpress-schema/Schema';
import { loadProjectFile } from 'stackpress-schema/transform/helpers';

export function generateModelTypes(directory: Directory, model: Model) {
  //relations like this: (foriegn keys)
  // owner User @relation({ name "connections" local "userId" foreign "id" })
  //not like this: (local keys)
  // users User[]
  const relations = model.store.foreignRelationships;
  const modelImported: string[] = [];

  const filepath = model.name.toPathName('%s/types.ts');
  //load Profile/ProfileSchema.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //import StoreInterface from 'stackpress-sql/StoreInterface';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress-sql/StoreInterface',
    defaultImport: 'StoreInterface'
  });
  //import ActionsInterface from 'stackpress-sql/ActionsInterface';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-sql/ActionsInterface',
    defaultImport: 'ActionsInterface'
  });
  //import ProfileStore from '../Profile/ProfileStore.js';
  for (const column of relations.values()) {
    //this should never happen...
    if (!column.type.model) continue;
    const store = column.type.model.name.toClassName('%sStore');
    if (modelImported.includes(store)) continue;
    modelImported.push(store);
    //import ProfileStore from '../Profile/ProfileStore.js';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: column.type.model.name.toPathName('../%s/%sStore.js'),
      defaultImport: store
    });
  }

  //export type AuthRelations = {
  //  profile: {
  //    store: ProfileStore;
  //    local: string;
  //    foreign: string;
  //    type: [ number, number ];
  //  },
  //  ...
  //};
  source.addTypeAlias({
    isExported: true,
    name: model.name.toTypeName('%sRelations'),
    type: (`{${
      relations.map(
        column => `${column.name.toString()}: {
          store: ${column.type.model!.name.toClassName('%sStore')},
          local: string,
          foreign: string,
          type: [ number, number ]
        }`
      ).toArray().join(', ')
    }}`)
  });

  //export interface ProfileStoreInterface extends StoreInterface<T, E, C, R> {};
  source.addInterface({
    isExported: true,
    name: `${model.name.toClassName()}StoreInterface`,
    extends: [
      `StoreInterface<${[
        model.name.toTypeName(),
        model.name.toTypeName('%sExtended'),
        model.name.toTypeName('%sColumns'),
        model.name.toTypeName('%sRelations')
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
        model.name.toTypeName('%sColumns'),
        model.name.toTypeName('%sRelations')
      ].join(', ')}>`
    ]
  });
};

export function generateTypes(directory: Directory, schema: Schema) {
  //load types.ts if it exists, if not create it
  const source = loadProjectFile(directory, 'types.ts');
  //clear source file (stackpress-schema originally generated this file)
  source.replaceWithText('');
  //export type * from './module/Profile/types.js';
  for (const model of schema.models.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: model.name.toPathName('./%s/types.js'),
      namedExports: [ 
        model.name.toTypeName(),
        model.name.toTypeName('%sInput'), 
        model.name.toTypeName('%sExtended'), 
        model.name.toTypeName('%sSchemaInterface'), 
        model.name.toTypeName('%sStoreInterface'), 
        model.name.toTypeName('%sActionsInterface')
      ]
    });
  }
  //export type * from './module/Address/types.js';
  for (const fieldset of schema.fieldsets.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: fieldset.name.toPathName('./%s/types.js'),
      namedExports: [ 
        fieldset.name.toTypeName(),
        fieldset.name.toTypeName('%sInput'), 
        fieldset.name.toTypeName('%sSchemaInterface')
      ]
    });
  }
};