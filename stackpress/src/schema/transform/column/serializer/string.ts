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
  //import { encrypt, decrypt, hash } from 'stackpress/schema/helpers';
  if (column.value.encrypted || column.value.hashed) {
    source.addImportDeclaration({
      namedImports: [ 
        ...column.value.encrypted ? [ 'encrypt', 'decrypt' ] : [],
        ...column.value.hashed ? [ 'hash' ] : [],
      ],
      moduleSpecifier: 'stackpress/schema/helpers'
    });
  }

  //protected _seed: string;
  //public constructor(seed = '') {}
  if (column.value.encrypted) {
    //protected _seed: string;
    definition.addProperty({
      scope: Scope.Protected,
      name: '_seed',
      type: 'string'
    });
  }
  //public serialize<T>(value: T) {}
  //public serialize<T>(value: T, doEncrypt = false) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}serialize`,
    typeParameters: [{ name: 'T' }],
    parameters: column.value.encrypted || column.value.hashed ? [
      { name: 'value', type: 'T' },
      { name: 'doEncrypt', initializer: 'false' }
    ] : [
      { name: 'value', type: 'T' }
    ],
    statements: renderCode(TEMPLATE.SERIALIZE, {
      nullable: column.type.nullable,
      hashed: column.value.hashed,
      encrypted: column.value.encrypted,
      decrypted: !column.value.hashed && !column.value.encrypted
    })
  });
  //public unserialize<T>(value: T) {}
  //public unserialize<T>(value: T, doDecrypt = false) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}unserialize`,
    typeParameters: [{ name: 'T' }],
    parameters: column.value.encrypted ? [
      { name: 'value', type: 'T' }, 
      { name: 'doDecrypt', initializer: 'false' }
    ] : [
      { name: 'value', type: 'T' }
    ],
    statements: renderCode(TEMPLATE.UNSERIALIZE, {
      nullable: column.type.nullable,
      encrypted: column.value.encrypted 
        ? `return this._seed && value.length > 0 ? decrypt(String(value), this._seed) : String(value);` 
        : '',
      decrypted: !column.value.encrypted 
        ? 'return String(value);'
        : '',
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
let string = String(value);
//if value is a date
if (value instanceof Date) {
  string = [
    value.toISOString().split('T')[0],
    value.toTimeString().split(' ')[0]
  ].join(' ');
} else if (typeof value === 'object' && value?.constructor?.name === 'Object') {
  string = JSON.stringify(value);
} else if (typeof value?.toString === 'function') {
  string = value.toString();
}
<%#decrypted%>
  return string;
<%/decrypted%>
<%#encrypted%>
  if (doEncrypt) {
    return string.length > 0 ? encrypt(string, this._seed) : string;
  }
  return string;
<%/encrypted%>
<%#hashed%>
  if (doEncrypt) {
    return string.length > 0 ? hash(string) : string;
  }
  return string;
<%/hashed%>`,

UNSERIALIZE:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
//if value is a date
if (value instanceof Date) {
  return [
    value.toISOString().split('T')[0],
    value.toTimeString().split(' ')[0]
  ].join(' ');
} else if (typeof value === 'object' && value?.constructor?.name === 'Object') {
  return JSON.stringify(value);
} else if (typeof value?.toString === 'function') {
  value = value.toString() as T;
}
<%#decrypted%>
  return String(value);
<%/decrypted%>
<%#encrypted%>
  if (doDecrypt) {
    return String(value).length > 0 ? decrypt(String(value), this._seed) : String(value);
  }
  return String(value);
<%/encrypted%>`

};