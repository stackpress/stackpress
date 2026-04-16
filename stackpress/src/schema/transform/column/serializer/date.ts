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
    parameters: [{
      name: 'value',
      type: 'T',
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
<%#if nullable%>
  if (value === null) {
    return null;
  }
<%/if%>
//if value is a date
if (value instanceof Date) {
  return [
    value.toISOString().split('T')[0],
    value.toTimeString().split(' ')[0]
  ].join(' ');
  //if value is a number
} else if (typeof value === "number") {
  const stamp = new Date(value);
  return [
    stamp.toISOString().split('T')[0],
    stamp.toTimeString().split(' ')[0]
  ].join(' ');
}
//either way, try to convert to date (or date string)
let stamp = new Date(String(value));
if (isNaN(stamp.getTime())) {
  stamp = new Date(0);
}
return [
  stamp.toISOString().split('T')[0],
  stamp.toTimeString().split(' ')[0]
].join(' ');`,

UNSERIALIZE:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#if nullable%>
  if (value === null) {
    return null;
  }
<%/if%>
//if value is a date
if (value instanceof Date) {
  return value;
//if value is a number
} else if (typeof value === 'number') {
  return new Date(value);
}
//either way, try to convert to date (or date string)
let stamp = new Date(String(value));
if (isNaN(stamp.getTime())) {
  stamp = new Date(0);
}
return stamp;`

};