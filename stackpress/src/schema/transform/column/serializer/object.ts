//modules
import type { SourceFile, ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Column from '../../../Column.js';
//stackpress/schema/transform
import { renderCode } from '../../helpers.js';

export default function generate(
  source: SourceFile,
  definition: ClassDeclaration,
  column: Column
) {
  const notation = column.type.multiple ? '_' : '';

  //import { isObject } from '@stackpress/lib/Nest';
  source.addImportDeclaration({
    namedImports: [ 'isObject' ],
    moduleSpecifier: '@stackpress/lib/Nest'
  });
  //import { validJSONObjectString } from 'stackpress/schema/helpers';
  source.addImportDeclaration({
    namedImports: [ 'validJSONObjectString'],
    moduleSpecifier: 'stackpress/schema/helpers'
  });
  
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
      nullable: column.type.nullable
    })
  });
};

export const TEMPLATE = {

SERIALIZE:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
//if value is a string
if (typeof value === 'string') {
  return validJSONObjectString(value) ? value : '{}';
}
//let JSON serialize the value
return JSON.stringify(value);`,

UNSERIALIZE:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
//if value is a string
if (typeof value === 'string') {
  return validJSONObjectString(value) ? JSON.parse(value) : {};
}
return isObject(value) ? value : {};`

};