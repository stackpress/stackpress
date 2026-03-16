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
  //import Update from '@stackpress/inquire/Update';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/inquire/Update',
    defaultImport: 'Update'
  });
  //public update(values: Partial<Place>, query: StoreSelectFilters = {}, q = '"') {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'update',
    parameters: [
      { name: 'query', type: 'StoreSelectFilters', initializer: '{}' }, 
      { name: 'input', type: `Partial<${model.name.toTypeName('%sInput')}>` },
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
`//sanitize input and map to the schema
const filtered = this.filter(input);
const serialized = this.serialize(filtered);
const unserialized = this.unserialize(serialized);
const defined = removeEmptyStrings(unserialized);
const sanitized = removeUndefined(defined);

//collect errors, if any
const errors = this.assert(sanitized);
//if there were errors
if (errors) {
  //throw errors
  throw Exception
    .for('Invalid parameters')
    .withCode(400)
    .withErrors(errors);
}

<%#timestamp%>
  //add timestamp to @timestamp column
  sanitized.<%column%> = new Date();
<%/timestamp%>

//serialize values and map filtered to the 
// relative SQL column names (snake case)
const values = this.scalarize(sanitized);

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