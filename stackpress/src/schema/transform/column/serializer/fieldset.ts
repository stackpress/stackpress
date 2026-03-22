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
  const fieldset = column.type.fieldset!;

  //import { isObject } from '@stackpress/lib/Nest';
  source.addImportDeclaration({
    namedImports: [ 'isObject' ],
    moduleSpecifier: '@stackpress/lib/Nest'
  });
  //import { validJSONObjectString, parseJSONValue } from 'stackpress/schema/helpers';
  source.addImportDeclaration({
    namedImports: [ 'validJSONObjectString', 'parseJSONValue' ],
    moduleSpecifier: 'stackpress/schema/helpers'
  });

  // public serialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}serialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: renderCode(TEMPLATE.SERIALIZE, {
      nullable: column.type.nullable
    })
  });
  // public unserialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}unserialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: renderCode(TEMPLATE.UNSERIALIZE, {
      nullable: column.type.nullable,
      type: fieldset.name.toTypeName()
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
  if (validJSONObjectString(value)) {
    const input = JSON.parse(value) as Record<string, any>;
    const serialized = this._fieldset.serialize(input);
    const entries = Object.entries(serialized).map(
      ([key, value]) => [ key, parseJSONValue(value) ]
    );
    return JSON.stringify(Object.fromEntries(entries));
  }
  return '{}';
} else if (isObject(value)) {
  const serialized = this._fieldset.serialize(value as Record<string, any>);
  const entries = Object.entries(serialized).map(
    ([key, value]) => [ key, parseJSONValue(value) ]
  );
  return JSON.stringify(Object.fromEntries(entries));
}

return '{}';`,

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
  return validJSONObjectString(value) 
    ? this._fieldset.unserialize(JSON.parse(value) as Record<string, any>) 
    : {} as <%type%>;
}
return isObject(value)
  ? this._fieldset.unserialize(value as Record<string, any>) 
  : {} as <%type%>;`

};