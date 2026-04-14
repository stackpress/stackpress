//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';

export default function generate(definition: ClassDeclaration) {
  //public async delete(query: StoreSelectFilters) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'delete',
    parameters: [{
      name: 'query',
      type: `StoreSelectFilters`
    }],
    statements: TEMPLATE.DELETE
  });
};

export const TEMPLATE = {

//public async delete(query: StoreSelectFilters) {}
DELETE:
`const rows = await this.findAll(query);
//if there are no rows, it doesn't make sense to delete...
if (rows.length > 0) {
  const remove = this.store.delete(query);
  remove.engine = this.engine;
  //dont rely on native delete... 
  // pgsql returns different things than sqlite and mysql....
  await remove;
}
return rows;`

};