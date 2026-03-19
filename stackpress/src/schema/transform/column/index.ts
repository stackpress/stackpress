//modules
import type { Directory } from 'ts-morph';
import { Scope } from 'ts-morph';
import { isObject } from '@stackpress/lib/Nest';
//stackpress
import { loadProjectFile, renderCode } from '../helpers.js';
//stackpress/schema
import type Column from '../../Column.js';
//stackpress/schema/transform
import generateAssert from './assert.js';
import generateShape from './shape.js';
import generateSerializer from './serializer.js';

const objects = [ 'Object', 'Json', 'Hash' ];

const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Boolean: 'boolean',
  Date: 'Date',
  Time: 'Date',
  Datetime: 'Date',
  Json: 'Record<string, ScalarInput>',
  Object: 'Record<string, ScalarInput>',
  Hash: 'Record<string, ScalarInput>',
  'String[]': 'string[]',
  'Text[]': 'string[]',
  'Number[]': 'number[]',
  'Integer[]': 'number[]',
  'Float[]': 'number[]',
  'Boolean[]': 'boolean[]',
  'Date[]': 'Date[]',
  'Time[]': 'Date[]',
  'Datetime[]': 'Date[]',
  'Json[]': 'Record<string, ScalarInput>[]',
  'Object[]': 'Record<string, ScalarInput>[]',
  'Hash[]': 'Record<string, ScalarInput>[]'
};

const serialmap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Boolean: 'boolean',
  Date: 'string',
  Time: 'string',
  Datetime: 'string',
  Json: 'string',
  Object: 'string',
  Hash: 'string',
  'String[]': 'string',
  'Text[]': 'string',
  'Number[]': 'string',
  'Integer[]': 'string',
  'Float[]': 'string',
  'Boolean[]': 'string',
  'Date[]': 'string',
  'Time[]': 'string',
  'Datetime[]': 'string',
  'Json[]': 'string',
  'Object[]': 'string',
  'Hash[]': 'string'
};

export const zodmap: Record<string, string> = {
  Boolean: 'z.ZodBoolean',
  Integer: 'z.ZodInt',
  Date: 'z.ZodDate',
  Datetime: 'z.ZodDate',
  Time: 'z.ZodDate',
  Number: 'z.ZodNumber',
  Float: 'z.ZodNumber',
  Object: 'z.ZodObject',
  Json: 'z.ZodObject',
  Hash: 'z.ZodObject',
  String: 'z.ZodString',
  Text: 'z.ZodString',
  Unknown: 'z.ZodType',
  'Boolean[]': 'z.ZodArray<z.ZodBoolean>',
  'Integer[]': 'z.ZodArray<z.ZodInt>',
  'Date[]': 'z.ZodArray<z.ZodDate>',
  'Datetime[]': 'z.ZodArray<z.ZodDate>',
  'Time[]': 'z.ZodArray<z.ZodDate>',
  'Number[]': 'z.ZodArray<z.ZodNumber>',
  'Float[]': 'z.ZodArray<z.ZodNumber>',
  'Object[]': 'z.ZodArray<z.ZodObject>',
  'Json[]': 'z.ZodArray<z.ZodObject>',
  'Hash[]': 'z.ZodArray<z.ZodObject>',
  'String[]': 'z.ZodArray<z.ZodString>',
  'Text[]': 'z.ZodArray<z.ZodString>',
  'Unknown[]': 'z.ZodArray<z.ZodType>'
};

export default function generate(directory: Directory, column: Column) {
  const defaults = column.value.default;
  const forCuid = String(defaults).match(/^cuid\(([0-9]+)\)$/);
  const forNano = String(defaults).match(/^nanoid\(([0-9]+)\)$/);
  const typemapKey = column.type.multiple 
    ? (column.type.name + '[]') 
    : column.type.name;

  //NOTE: column would never be model or fieldset. see schema.ts.
  const filepath = renderCode('<%fieldset%>/columns/<%column%>Column.ts', {
    fieldset: column.parent.name.toPathName(),
    column: column.name.toPathName(),
  });
  //load Address/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //import * as z from 'zod';
  source.addImportDeclaration({
    moduleSpecifier: 'zod',
    namespaceImport: 'z'
  });
  if (defaults === 'nanoid()' || forNano) {
    //import { nanoid } from 'nanoid';
    source.addImportDeclaration({
      moduleSpecifier: 'nanoid',
      namedImports: ['nanoid']
    });
  } else if (defaults === 'cuid()') {
    //import { createId as cuid } from '@paralleldrive/cuid2';
    source.addImportDeclaration({
      moduleSpecifier: '@paralleldrive/cuid2',
      namedImports: [ 'createId as cuid' ]
    });
  } else if (forCuid) {
    //import { init } from '@paralleldrive/cuid2';
    source.addImportDeclaration({
      moduleSpecifier: '@paralleldrive/cuid2',
      namedImports: [ 'init' ]
    });
  }
  //import ColumnInterface from 'stackpress/ColumnInterface';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/ColumnInterface',
    defaultImport: 'ColumnInterface'
  });
  //import type { ScalarInput } from '@stackpress/lib';
  if (defaults && objects.includes(column.type.name)) {
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/lib',
      namedImports: [ 'ScalarInput' ]
    });
  }
  if (column.type.enum) {
    //import type { Role } from '../../enum.js';
    source.addImportDeclaration({
      moduleSpecifier: '../../enums.js',
      namedImports: [ column.type.name ]
    });
  }

  //export default class StreetColumn implements ColumnInterface<D, S, U, Z> {};
  const definition = source.addClass({
    isDefaultExport: true,
    name: column.name.toClassName('%sColumn'),
    implements: [
      `ColumnInterface<${[
        //default type
        typeof defaults === 'undefined' ? 'undefined'
          : defaults === null ? 'null'
          : defaults === 'now()' ? 'Date'
          : typemapKey in typemap ? typemap[typemapKey] 
          : typeof defaults === 'string' ? 'string' 
          : typeof defaults === 'number' ? 'number' 
          : typeof defaults === 'boolean' ? 'boolean' 
          : isObject(defaults) ? 'Record<string, ScalarInput>'
          : 'undefined',
        //serialized return type
        column.type.nullable && typemapKey in serialmap 
          ? `${serialmap[typemapKey]} | null`
          : column.type.nullable && column.type.enum 
          ? 'string | null'
          : typemapKey in serialmap 
          ? serialmap[typemapKey]
          : column.type.enum 
          ? 'string'
          : 'unknown',
        //unserialized return type
        column.type.nullable && typemapKey in typemap 
          ? `${typemap[typemapKey]} | null`
          : column.type.nullable && column.type.enum 
          ? 'string | null'
          : typemapKey in typemap 
          ? typemap[typemapKey]
          : column.type.enum 
          ? 'string'
          : 'unknown',
        //zod shape type
        column.type.nullable && typemapKey in zodmap
          ? `z.ZodOptional<z.ZodNullable<${zodmap[typemapKey]}>>`
          : column.type.nullable && column.type.enum 
          ? `z.ZodOptional<z.ZodNullable<z.ZodEnum<typeof ${column.type.name}>>>`
          : typemapKey in zodmap ? zodmap[typemapKey]
          : column.type.enum ? `z.ZodEnum<typeof ${column.type.name}>`
          : 'z.ZodType'
      ].join(', ')}>`
    ]
  });
  //public name = 'streetAddress';
  definition.addProperty({
    scope: Scope.Public,
    name: 'name',
    initializer: JSON.stringify(column.name.toString())
  });
  //public shape = z.boolean()...
  generateShape(definition, column);
  //public get defaults() {}
  definition.addGetAccessor({
    name: 'defaults',
    scope: Scope.Public,
    statements: defaults === 'nanoid()' 
      ? `return ${defaults}` 
      
      : defaults === 'cuid()' 
      ? `return ${defaults}`
      
      : !isNaN(Number(forCuid?.[1])) 
      ? `return (init({ length: ${Number(forCuid?.[1])} }))();`
      
      : !isNaN(Number(forNano?.[1])) 
      ? `return nanoid(${Number(forNano?.[1])});`
      
      : defaults === 'now()' 
      ? `return new Date();`

      : defaults && objects.includes(column.type.name)
      ? `return this.unserialize(${JSON.stringify(defaults)})! as Record<string, ScalarInput>;`
      
      : typeof defaults !== 'undefined'
      ? `return this.unserialize(${JSON.stringify(defaults)})!;`
      
      : 'return undefined;'
  });
  //public assert<T>(value: T) {}
  generateAssert(definition);
  // public serialize<T>(value: T, scalar = false) {}
  // public unserialize<T>(value: T, scalar = false) {}
  generateSerializer(source, definition, column);
  return definition;
};