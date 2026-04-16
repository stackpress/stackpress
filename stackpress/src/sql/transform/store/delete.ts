//modules
import type { SourceFile, ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { renderCode } from '../../../schema/transform/helpers.js';

export default function generate(
  source: SourceFile,
  model: Model,
  definition: ClassDeclaration
) {
  //------------------------------------------------------------------//
  // Import Modules

  //import Delete from '@stackpress/inquire/Delete';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/inquire/Delete',
    defaultImport: 'Delete'
  });

  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Store Methods

  //public delete(query: StoreSelectFilters = {}, q = '"') {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'delete',
    parameters: [
      {
        name: 'query',
        type: 'StoreSelectFilters',
        initializer: '{}'
      },
      {
        name: 'q',
        initializer: `'"'`
      }
    ],
    statements: renderCode(TEMPLATE.DELETE, {
      type: model.name.toTypeName(),
      searchable: model.columns.filter(column => column.store.searchable).size > 0,
      searchables: model.columns
        .filter(column => column.store.searchable)
        .map(column => ({ column: column.name.toString() }))
        .toArray()
    })
  });
};

export const TEMPLATE = {

DELETE:
`//make the delete builder
const remove = new Delete<<%type%>>(this.table);

//where
this.where(remove, query, q);

return remove;`,

};