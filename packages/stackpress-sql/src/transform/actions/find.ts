//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';

export default function generate(definition: ClassDeclaration) {
  //public async find(query: StoreSelectQuery) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'find',
    parameters: [{
      name: 'query',
      type: `StoreSelectQuery`
    }],
    statements: TEMPLATE.FIND
  });
};

export const TEMPLATE = {

//public async find(query: StoreSelectQuery) {}
FIND:
`const results = await this.findAll(query);
return results?.[0] || null;`

};