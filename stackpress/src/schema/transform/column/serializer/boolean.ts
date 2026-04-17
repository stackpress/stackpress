//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Column from '../../../Column.js';
//stackpress/schema/view
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
    statements: renderCode(TEMPLATE.SERIALIZE_BOOLEAN, {
      nullable: column.type.nullable
    })
  });
  //public unserialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}unserialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{
      name: 'value',
      type: 'T',
    }],
    statements: renderCode(TEMPLATE.UNSERIALIZE_BOOLEAN, {
      nullable: column.type.nullable
    })
  });
};

export const TEMPLATE = {

SERIALIZE_BOOLEAN:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#?:nullable%>
  if (value === null) {
    return null;
  }
<%/?:nullable%>
return value === 'false' ? false
  : value === 'true' ? true
  : value === '0' ? false
  : value === '1' ? true
  : Boolean(value);`,

UNSERIALIZE_BOOLEAN:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#?:nullable%>
  if (value === null) {
    return null;
  }
<%/?:nullable%>
return Boolean(value);`

};