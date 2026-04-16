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
`<%#with timestamp%>
  //add timestamp to @timestamp column
  input.<%column%> = new Date();
<%/with%>

//serialize values and map filtered to the 
// relative SQL column names (snake case)
const values = this.scalarize(input);

//extract params
let { q: keywords, filter = {}, span = {} } = query;
//make the update builder
const update = new Update<<%type%>>(this.table);
//where
const where = this.where({ q: keywords, filter, span }, q);
if (where.clause) {
  update.where(where.clause, where.values);
}
return update.set(values);`,

};