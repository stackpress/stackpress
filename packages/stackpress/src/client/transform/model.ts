//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress/schema
import type Model from '../../schema/Model.js';
import { loadProjectFile } from '../../schema/transform/helpers.js';

const allActions = [
  'batch',
  'create',
  'detail',
  'get',
  'purge',
  'remove',
  'restore',
  'search',
  'update',
  'upsert'
];

export default function generate(directory: Directory, model: Model) {
  const actions = allActions.filter(
    action => action !== 'restore' || model.store.restorable
  );
  const columns = model.columns.filter(
    column => !column.type.model && !column.type.fieldset
  );
  
  const filepath = model.name.toPathName('%s/index.ts');
  //load Profile/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);
  //import ProfileSchema from './ProfileSchema.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('./%sSchema.js'),
    defaultImport: model.name.toClassName('%sSchema')
  });
  //import ProfileStore from './ProfileStore.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('./%sStore.js'),
    defaultImport: model.name.toClassName('%sStore')
  });
  //import ProfileActions from './ProfileActions.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('./%sActions.js'),
    defaultImport: model.name.toClassName('%sActions')
  });
  //import { NameColumn } from './columns/index.js';
  source.addImportDeclaration({
    moduleSpecifier: './columns/index.js',
    namedImports: columns.map(
      column => column.name.toClassName('%sColumn')
    ).toArray()
  });
  //import listen from './events/index.js';
  source.addImportDeclaration({
    moduleSpecifier: './events/index.js',
    defaultImport: 'listen'
  });
  //import { batch, ... } from './events/index.js';
  source.addImportDeclaration({
    moduleSpecifier: './events/index.js',
    namedImports: actions
  });
  //import admin from './admin/routes.js';
  source.addImportDeclaration({
    moduleSpecifier: './admin/routes.js',
    defaultImport: 'admin'
  });

  //const columns = { name: NameColumn, ... };
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'columns',
      initializer: `{
        ${columns.map(
          column => [ 
            column.name.toString(),
            column.name.toClassName('%sColumn')
          ].join(': ')
        ).toArray().join(',\n')}
      }`
    }]
  });

  //const events = { batch, create, detail, get, purge, remove, restore, search, update, upsert };
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'events',
      initializer: `{ ${actions.join(', ')} }`
    }]
  });
  //export { AddressActions, AddressStore, events, admin };
  source.addExportDeclaration({
    namedExports: [
      model.name.toClassName('%sSchema'),
      model.name.toClassName('%sActions'),
      model.name.toClassName('%sStore'),
      'columns',
      'events',
      'listen',
      'admin'
    ]
  });

  //export default { schema: ApplicationSchema, actions: ApplicationActions, store: ApplicationStore, columns, events, listen };
  source.addStatements(`
    const factory = {
      Schema: ${model.name.toClassName('%sSchema')},
      Actions: ${model.name.toClassName('%sActions')},
      Store: ${model.name.toClassName('%sStore')},
      columns,
      events,
      listen,
      admin
    };
    export default factory;
  `);
};