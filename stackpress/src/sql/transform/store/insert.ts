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
  //import Insert from '@stackpress/inquire/Insert';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/inquire/Insert',
    defaultImport: 'Insert'
  });
  //public insert(input: PlaceInput) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'insert',
    parameters: [{ name: 'input', type: model.name.toTypeName('%sInput') }],
    statements: renderCode(TEMPLATE.INSERT, {
      type: model.name.toTypeName()
    })
  });
};

export const TEMPLATE = {

INSERT:
`//sanitize input and map to the schema
const filtered = this.filter(input);
const populated = this.populate(filtered);
const serialized = this.serialize(populated);
const unserialized = this.unserialize(serialized);
const defined = removeEmptyStrings(unserialized);
const sanitized = removeUndefined(defined);

//collect errors, if any
const errors = this.assert(sanitized, true);
//if there were errors
if (errors) {
  //throw errors
  throw Exception
    .for('Invalid parameters')
    .withCode(400)
    .withErrors(errors);
}
  
//serialize values and map filtered to the 
// relative SQL column names (snake case)
const values = this.scalarize(sanitized);
//make the insert builder
const insert = new Insert<<%type%>>(this.table);
return insert.values(values).returning("*");`,

};