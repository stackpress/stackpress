//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Column from '../../Column.js';

export default function generate(
  definition: ClassDeclaration, 
  column: Column
) {
  //public assert<T>(value: T) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'assert',
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: column.type.fieldset 
      ? TEMPLATE.FIELDSET 
      : TEMPLATE.ASSERT
  });
};

export const TEMPLATE = {

FIELDSET:
`return this._fieldset.assert(value || {});`,

ASSERT:
`const results = this.shape.safeParse(value);
if (results.success) {
  return null;
}
if (results.error.issues.length > 0) {
  return results
    .error
    .issues[0]
    .message
    .replaceAll('{{value}}', String(value));
}
return 'Invalid value';`,

};