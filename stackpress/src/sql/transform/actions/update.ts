//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { renderCode } from '../../../schema/transform/helpers.js';

export default function generate(model: Model, definition: ClassDeclaration) {
  //public async update(query: StoreSelectFilters, input: Partial<Profile>) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'update',
    parameters: [
      { name: 'query', type: `StoreSelectFilters` }, 
      { name: 'input', type: model.name.toTypeName('Partial<%s>') }
    ],
    statements: renderCode(TEMPLATE.UPDATE, {
      assert: model.name.toTypeName('%sAssertInterfaceMap'),
      type: model.name.toTypeName(),
      uniques: model.store.uniques.size > 0,
      exists: model.store.uniques.map(
        column => ({ column: column.name.toString() })
      ).toArray()
    })
  });
};

export const TEMPLATE = {

//public async update(query: StoreSelectFilters, input: Partial<Profile>) {}
UPDATE:
`//sanitize input and map to the schema
const filtered = this.store.filter(input);
const serialized = this.store.serialize(filtered);
const unserialized = this.store.unserialize(serialized);
const defined = removeEmptyStrings(unserialized);
const sanitized = removeUndefined(defined);

//collect errors, if any
const errors = this.store.assert(sanitized) || {} as <%assert%>;
//if there were errors
if (Object.keys(errors).length > 0) {
  //throw errors
  throw Exception
    .for('Invalid parameters')
    .withCode(400)
    .withErrors(errors);
}

const rows = await this.findAll(query);
//even if there were results, we can't requery because the results 
// might be different after the update, so we have to manually merge 
// the input with the existing records
const results = rows.map(row => ({ ...row, ...sanitized })) as <%type%>[];
//if there are no rows, it doesn't make sense to update...
if (rows.length === 0) return results;
<%#uniques%>
  <%#exists%>
    //if there's a <%column%> value
    if (
      typeof sanitized.<%column%> !== 'undefined'
      && sanitized.<%column%> !== null
      && sanitized.<%column%> !== ''
    ) {
      //check to see if exists already
      const exists = await this.findAll({ 
        eq: { <%column%>: sanitized.<%column%> } 
      });
      //if it does exist
      if (exists.length > 0) {
        const same = rows.some(
          row => row.<%column%> === sanitized.<%column%>
        );
        if (!same) {
          //add a unique error
          errors.<%column%> = 'Already exists';
        }
      }
    }
  <%/exists%>
  //if there were unique errors
  if (Object.keys(errors).length > 0) {
    //throw errors
    throw Exception
      .for('Invalid parameters')
      .withCode(400)
      .withErrors(errors);
  }
<%/uniques%>

//okay to update now
const update = this.store.update(query, input, this.engine.dialect.q);
update.engine = this.engine;
//dont rely on native update... 
// pgsql returns different things than sqlite and mysql....
await update;
return results;`

};