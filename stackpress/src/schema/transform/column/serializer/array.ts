//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';

export default function generate(definition: ClassDeclaration) {
  //public serialize<T>(value: T) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'serialize',
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: TEMPLATE.SERIALIZE_ARRAY
  });
  //public unserialize<T>(value: T) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'unserialize',
    typeParameters: [{ name: 'T' }],
    parameters: [{
      name: 'value',
      type: 'T',
    }],
    statements: TEMPLATE.UNSERIALIZE_ARRAY
  });
};

export const TEMPLATE = {

SERIALIZE_ARRAY:
`if (!Array.isArray(value)) {
  return '[]';
}
const values = value
  .map(item => this._serialize(item))
  .filter(item => typeof item !== 'undefined' && item !== null);
return JSON.stringify(values);
`,

UNSERIALIZE_ARRAY:
`if (Array.isArray(value)) {
  return value
    .map(item => this._unserialize(item))
    .filter(item => typeof item !== 'undefined' && item !== null);
}
if (typeof value !== 'string') {
  return [];
}
try {
  const values = JSON.parse(value);
  if (!Array.isArray(values)) {
    return [];
  }
  return values
    .map(item => this._unserialize(item))
    .filter(item => typeof item !== 'undefined' && item !== null);
} catch (e) {
  return [];
}`

};