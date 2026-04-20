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

export default function generate(
  model: Model,
  definition: ClassDeclaration
) {
  const ids = model.store.ids.filter(
    column => column.type.name in typemap
  );

  //public async create(input: Partial<Profile>) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'create',
    parameters: [{
      name: 'input',
      type: model.name.toTypeName('Partial<%s>')
    }],
    statements: renderCode(TEMPLATE.CREATE, {
      assert: model.name.toTypeName('%sAssertInterfaceMap'),
      oneid: ids.size === 1 ? ids.first().name.toString() : null,
      multid: ids.size > 1,
      type: model.name.toTypeName(),
      noid: ids.size === 0,
      ids: ids.map(
        column => ({ column: column.name.toString() })
      ).toArray(),
      exists: model.store.uniques.map(
        column => ({ column: column.name.toString() })
      ).toArray()
    })
  });
};

export const TEMPLATE = {

//public async create(input: Partial<Profile>) {}
CREATE:
`//sanitize input and map to the schema
const filtered = this.store.filter(input);
const populated = this.store.populate(filtered);
const serialized = this.store.serialize(populated);
const unserialized = this.store.unserialize(serialized);
const defined = removeEmptyStrings(unserialized);
const sanitized = removeUndefined(defined);

//collect errors, if any
const errors = this.store.assert(sanitized, true) || {} as <%assert%>;

<%#@:exists%>
  //if there's a <%column%> value
  if (
    typeof sanitized.<%column%> !== 'undefined'
    && sanitized.<%column%> !== null
    && sanitized.<%column%> !== ''
  ) {
    //check to see if exists already
    const exists = await this.find({ 
      eq: { <%column%>: sanitized.<%column%> } 
    });
    //if it does exist
    if (exists) {
      //add a unique error
      errors.<%column%> = 'Already exists';
    }
  }
<%/@:exists%>

//if there were errors
if (Object.keys(errors).length > 0) {
  //throw errors
  throw Exception
    .for('Invalid parameters')
    .withCode(400)
    .withErrors(errors);
}

const insert = this.store.insert(sanitized);
insert.engine = this.engine;
//dont rely on native insert... 
// pgsql returns different things than sqlite and mysql....
const rows = await insert;
//if there are rows, then it's pgsql...
if (rows.length > 0) {
  return this.store.unserialize(rows[0]);
}
//must be mysql or sqlite...
<%#?:oneid%>
  if (this.engine.connection.lastId) {
    const eq = { <%oneid%>: this.engine.connection.lastId };
    return await this.find({ eq }) || input as unknown as <%type%>;
  }
  return input as unknown as <%type%>;
<%/?:oneid%>
<%#?:multid%>
  const eq = { <%#@:ids%><%column%>: input.<%column%>!, <%/@:ids%> };
  return await this.find({ eq }) || input as unknown as <%type%>;
<%/?:multid%>
<%#?:noid%>
  return input as unknown as <%type%>;
<%/?:noid%>
`

};