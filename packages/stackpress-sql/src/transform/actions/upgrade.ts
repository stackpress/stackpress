//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';

export default function generate(definition: ClassDeclaration) {
  //public async upgrade(to: Create) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'upgrade',
    parameters: [{
      name: 'to',
      type: 'Create'
    }],
    statements: TEMPLATE.UPGRADE
  });
};

export const TEMPLATE = {

//public async upgrade(to: Create) {}
UPGRADE:
`const alter = this.store.alter(to);
alter.engine = this.engine;
await alter;`,

};