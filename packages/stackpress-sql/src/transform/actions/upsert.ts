//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { renderCode } from 'stackpress-schema/transform/helpers';

const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Date: 'Date',
  Time: 'Date',
  Datetime: 'Date',
  Json: 'Record<string, ScalarInput>',
  Object: 'Record<string, ScalarInput>',
  Hash: 'Record<string, ScalarInput>'
};

export default function generate(model: Model, definition: ClassDeclaration) {
  const ids = model.store.ids.filter(
    column => column.type.name in typemap
  );

  //public async upsert(input: Partial<Profile>) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'upsert',
    parameters: [{
      name: 'input',
      type: model.name.toTypeName('Partial<%s>')
    }],
    statements: renderCode(TEMPLATE.UPSERT, {
      update: ids.map(
        column => `typeof input.${column.name.toPropertyName()} !== 'undefined'`
      ).toArray().join(' && '),
      ids: ids.map(
        column => ({ column: column.name.toString() })
      ).toArray(),
      uniques: model.store.uniques.map(
        column => ({ column: column.name.toString() })
      ).toArray()
    })
  });
};

export const TEMPLATE = {

//public async upsert(input: Partial<Profile>) {}
UPSERT:
`<%#?:ids.length%>
  if (<%update%>) {
    const eq = { 
      <%#@:ids%>
        <%column%>: input.<%column%>,
      <%/@:ids%> 
    };
    const rows = await this.update({ eq }, input);
    return rows[0] || null;
  }
<%/?:ids.length%>
<%#@:uniques%>
  if (
    typeof input.<%column%> !== 'undefined'
    && input.<%column%> !== null
    && input.<%column%> !== ''
  ) {
    const eq = { <%column%>: input.<%column%> };
    const exists = await this.find({ eq });
    if (exists) {
      const rows = await this.update({ eq }, input);
      return rows[0] || null;
    }
  }
<%/@:uniques%>
return await this.create(input);`,

};