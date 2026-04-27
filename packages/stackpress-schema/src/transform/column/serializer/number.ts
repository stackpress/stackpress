//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress-schema
import type Column from '../../../Column.js';
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
    parameters: [{
      name: 'value',
      type: 'T',
    }, {
      name: 'toNumber',
      type: 'boolean',
      initializer: 'false',
    }],
    statements: renderCode(TEMPLATE.UNSERIALIZE, {
      nullable: column.type.nullable
    })
  });
};

export const TEMPLATE = {

SERIALIZE:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#?:nullable%>
  if (value === null) {
    return null;
  }
<%/?:nullable%>
return value instanceof Date 
  ? value.getTime()
  : this.unserialize(value);`,

UNSERIALIZE:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#?:nullable%>
  if (value === null) {
    return null;
  }
<%/?:nullable%>
//either way, try to convert to number
const number = Number(value);
return !isNaN(number) ? number : 0;`

};