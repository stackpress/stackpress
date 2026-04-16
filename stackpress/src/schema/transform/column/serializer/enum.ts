//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Column from '../../../Column.js';
//stackpress/schema/transform
import { renderCode } from '../../helpers.js';

export default function generate(
  definition: ClassDeclaration, 
  column: Column
) {
  const notation = column.type.multiple ? '_' : '';

  //public serialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}serialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: renderCode(TEMPLATE.SERIALIZE, {
      nullable: column.type.nullable
    })
  });
  //public unserialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}unserialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: renderCode(TEMPLATE.UNSERIALIZE, {
      nullable: column.type.nullable,
      type: column.type.name
    })
  });
};

export const TEMPLATE = {

SERIALIZE:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#if nullable%>
  if (value === null) {
    return null;
  }
<%/if%>
return String(value);`,

UNSERIALIZE:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#if nullable%>
  if (value === null) {
    return null;
  }
<%/if%>
return String(value) as <%type%>;`

};