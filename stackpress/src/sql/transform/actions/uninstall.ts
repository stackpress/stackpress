//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';

export default function generate(definition: ClassDeclaration) {
  //public async uninstall() {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'uninstall',
    statements: TEMPLATE.UNINSTALL
  });
};

export const TEMPLATE = {

//public async uninstall() {}
UNINSTALL:
`const query = this.engine.dialect.drop(this.store.table);
await this.engine.query(query);`

};