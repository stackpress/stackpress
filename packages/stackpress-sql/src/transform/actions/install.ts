//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';

export default function generate(definition: ClassDeclaration) {
  //public async install() {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'install',
    statements: TEMPLATE.INSTALL
  });
};

export const TEMPLATE = {

//public async install() {}
INSTALL:
`const create = this.store.create();
create.engine = this.engine;
await create;`

};