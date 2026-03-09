//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';

export default function generate(definition: ClassDeclaration) {
  //public assert<T>(value: T) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'assert',
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: TEMPLATE.ASSERT
  });
};

export const TEMPLATE = {

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