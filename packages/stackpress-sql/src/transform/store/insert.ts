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

  //import Insert from '@stackpress/inquire/Insert';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/inquire/Insert',
    defaultImport: 'Insert'
  });

  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Store Methods

  //public insert(input: PlaceInput) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'insert',
    parameters: [{ name: 'input', type: model.name.toTypeName('Partial<%s>') }],
    statements: renderCode(TEMPLATE.INSERT, {
      type: model.name.toTypeName()
    })
  });
};

export const TEMPLATE = {

INSERT:
`//serialize values and map filtered to the 
// relative SQL column names (snake case)
const values = this.scalarize(input);
//make the insert builder
const insert = new Insert<<%type%>>(this.table);
return insert.values(values).returning("*");`,

};