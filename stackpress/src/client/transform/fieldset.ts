//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress/schema
import type Fieldset from '../../schema/Fieldset.js';
import { loadProjectFile } from '../../schema/transform/helpers.js';

export default function generate(directory: Directory, fieldset: Fieldset) {
  const columns = fieldset.columns.filter(
    column => !column.type.model && !column.type.fieldset
  );

  const filepath = fieldset.name.toPathName('%s/index.ts');
  //load Address/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);
  
  //import ProfileSchema from './ProfileSchema.js';
  source.addImportDeclaration({
    moduleSpecifier: fieldset.name.toPathName('./%sSchema.js'),
    defaultImport: fieldset.name.toClassName('%sSchema')
  });
  //import { NameSchema } from './columns/index.js';
  source.addImportDeclaration({
    moduleSpecifier: './columns/index.js',
    namedImports: columns.map(
      column => column.name.toClassName('%sSchema')
    ).toArray()
  });

  //const columns = { name: NameSchema, ... };
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'columns',
      initializer: `{
        ${columns.map(
          column => [ 
            column.name.toString(),
            column.name.toClassName('%sSchema')
          ].join(': ')
        ).toArray().join(',\n')}
      }`
    }]
  });

  //export { AddressActions, AddressStore, events };
  source.addExportDeclaration({
    namedExports: [
      fieldset.name.toClassName('%sSchema'),
      'columns'
    ]
  });

  //export default { schema: ApplicationSchema, columns };
  source.addStatements(`
    const factory = {
      Schema: ${fieldset.name.toClassName('%sSchema')},
      columns
    };
    export default factory;
  `);
};