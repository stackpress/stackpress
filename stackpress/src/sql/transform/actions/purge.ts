//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';

export default function generate(definition: ClassDeclaration) {
  //public async purge(cascade = false) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'purge',
    parameters: [{
      name: 'cascade',
      type: 'boolean',
      initializer: 'false'
    }],
    statements: TEMPLATE.PURGE
  });
};

export const TEMPLATE = {

//public async purge(cascade = false) {}
PURGE:
`const query = this.engine.dialect.truncate(this.store.table, cascade);
await this.engine.query(query);`

};