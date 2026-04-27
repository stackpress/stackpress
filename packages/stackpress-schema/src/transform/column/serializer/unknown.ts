//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress-schema
import type Column from '../../../Column.js';

export default function generate(
  definition: ClassDeclaration,
  column: Column
) {
  const notation = column.type.multiple ? '_' : '';
   // public serialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}serialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: TEMPLATE.SERIALIZE
  });
  // public unserialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}unserialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: TEMPLATE.UNSERIALIZE
  });
};

export const TEMPLATE = {

SERIALIZE:
`return value;`,

UNSERIALIZE:
`return value;`

};