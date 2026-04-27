//modules
import type { SourceFile, ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { renderCode } from 'stackpress-schema/transform/helpers';

export default function generate(
  source: SourceFile,
  model: Model,
  definition: ClassDeclaration
) {
  //------------------------------------------------------------------//
  // Import Modules

  //import Update from '@stackpress/inquire/Update';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/inquire/Update',
    defaultImport: 'Update'
  });

  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Store Methods

  //public update(values: Partial<Place>, query: StoreSelectFilters = {}, q = '"') {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'update',
    parameters: [
      { name: 'query', type: 'StoreSelectFilters', initializer: '{}' }, 
      { name: 'input', type: model.name.toTypeName('Partial<%s>') },
      { name: 'q', initializer: `'"'` }
    ],
    statements: renderCode(TEMPLATE.UPDATE, {
      type: model.name.toTypeName(),
      timestamp: model.store.timestamp ? {
        column: model.store.timestamp.name.toString(),
      } : null,
    })
  });
};

export const TEMPLATE = {

UPDATE:
`<%#?:timestamp%>
  //add timestamp to @timestamp column
  input.<%timestamp.column%> = new Date();
<%/?:timestamp%>

//serialize values and map filtered to the 
// relative SQL column names (snake case)
const values = this.scalarize(input);

//make the update builder
const update = new Update<<%type%>>(this.table);
//where
this.where(update, query, q);

return update.set(values);`,

};