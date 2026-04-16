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
import generateSerializer from './serializer/index.js';

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

const zodmap: Record<string, string> = {
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

  //------------------------------------------------------------------//
  // Address/columns/NameColumn.ts

  //NOTE: column would never be model or fieldset. see schema.ts.
  const filepath = renderCode('<%fieldset%>/columns/<%column%>Column.ts', {
    fieldset: column.parent.name.toPathName(),
    column: column.name.toPathName(),
  });
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import * as z from 'zod';
  source.addImportDeclaration({
    moduleSpecifier: 'zod',
    namespaceImport: 'z'
  });
  //import { nanoid } from 'nanoid';
  if (defaults === 'nanoid()' || forNano) {
    source.addImportDeclaration({
      moduleSpecifier: 'nanoid',
      namedImports: ['nanoid']
    });
  //import { createId as cuid } from '@paralleldrive/cuid2';
  } else if (defaults === 'cuid()') {
    source.addImportDeclaration({
      moduleSpecifier: '@paralleldrive/cuid2',
      namedImports: [ 'createId as cuid' ]
    });
  //import { init } from '@paralleldrive/cuid2';
  } else if (forCuid) {
    source.addImportDeclaration({
      moduleSpecifier: '@paralleldrive/cuid2',
      namedImports: [ 'init' ]
    });
  }
  //import type { ScalarInput } from '@stackpress/lib';
  if (defaults && objects.includes(column.type.name)) {
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/lib',
      namedImports: [ 'ScalarInput' ]
    });
  }

  //------------------------------------------------------------------//
  // Import Stackpress
  
  //import ColumnInterface from 'stackpress/ColumnInterface';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/ColumnInterface',
    defaultImport: 'ColumnInterface'
  });

  //------------------------------------------------------------------//
  // Import Client

  //import type { Role } from '../../enum.js';
  if (column.type.enum) {
    source.addImportDeclaration({
      moduleSpecifier: '../../enums.js',
      namedImports: [ column.type.name ]
    });
  }
  //import type { Address, AddressColumns } from '../../Address/types.js';
  //import AddressSchema from '../../Address/AddressSchema.js';
  if (column.type.fieldset) {
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: column.type.fieldset.name.toPathName('../../%s/types.js'),
      namedImports: [ 
        column.type.fieldset.name.toClassName(),
        column.type.fieldset.name.toClassName('%sColumns') 
      ]
    });
    source.addImportDeclaration({
      moduleSpecifier: column.type.fieldset.name.toPathName('../../%s/%sSchema.js'),
      defaultImport: column.type.fieldset.name.toClassName('%sSchema')
    });
  }

  //------------------------------------------------------------------//
  // Exports
  
  //export default class StreetColumn implements ColumnInterface<D, S, U, Z> {};
  const definition = source.addClass({
    isDefaultExport: true,
    name: column.name.toClassName('%sColumn'),
    implements: [
      `ColumnInterface<${[
        //default type
        column.type.fieldset ? renderCode(
          `{ [key in keyof <%columns%>]: <%columns%>[key]['defaults'] }`, 
          { columns: column.type.fieldset.name.toClassName('%sColumns') }
        )
          : typeof defaults === 'undefined' ? 'undefined'
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
          : column.type.nullable && column.type.fieldset 
          ? 'string | null'
          : typemapKey in serialmap 
          ? serialmap[typemapKey]
          : column.type.enum 
          ? 'string'
          : column.type.fieldset 
          ? 'string'
          : 'unknown',
        //unserialized return type
        column.type.nullable && typemapKey in typemap 
          ? `${typemap[typemapKey]} | null`
          : column.type.multiple && column.type.enum 
          ? 'string[]'
          : column.type.nullable && column.type.enum 
          ? 'string | null'
          : column.type.multiple && column.type.fieldset 
          ? `Array<${column.type.fieldset.name.toTypeName()}>`
          : column.type.nullable && column.type.fieldset 
          ? `${column.type.fieldset.name.toTypeName()} | null`
          : typemapKey in typemap 
          ? typemap[typemapKey]
          : column.type.enum 
          ? 'string'
          : column.type.fieldset 
          ? column.type.fieldset.name.toTypeName()
          : 'unknown',
        //zod shape type
        column.type.nullable && typemapKey in zodmap
          ? `z.ZodOptional<z.ZodNullable<${zodmap[typemapKey]}>>`
          : column.type.multiple && column.type.enum 
          ? `z.ZodArray<z.ZodEnum<typeof ${column.type.name}>>`
          : column.type.nullable && column.type.enum 
          ? `z.ZodOptional<z.ZodNullable<z.ZodEnum<typeof ${column.type.name}>>>`
          : column.type.multiple && column.type.fieldset 
          ? renderCode(
            `z.ZodArray<z.ZodObject<{ [key in keyof <%columns%>]: <%columns%>[key]['shape'] }>>`, 
            { columns: column.type.fieldset.name.toClassName('%sColumns') }
          )
          : column.type.nullable && column.type.fieldset 
          ? renderCode(
            `z.ZodOptional<z.ZodNullable<z.ZodObject<{ [key in keyof <%columns%>]: <%columns%>[key]['shape'] }>>>`, 
            { columns: column.type.fieldset.name.toClassName('%sColumns') }
          )
          : typemapKey in zodmap ? zodmap[typemapKey]
          : column.type.enum ? `z.ZodEnum<typeof ${column.type.name}>`
          : column.type.fieldset 
          ? renderCode(
            `z.ZodObject<{ [key in keyof <%columns%>]: <%columns%>[key]['shape'] }>`, 
            { columns: column.type.fieldset.name.toClassName('%sColumns') }
          )
          : 'z.ZodType'
      ].join(', ')}>`
    ]
  });
  //public readonly name = 'streetAddress';
  definition.addProperty({
    scope: Scope.Public,
    isReadonly: true,
    name: 'name',
    initializer: JSON.stringify(column.name.toString())
  });
  //public shape = z.boolean()...
  const shape =generateShape(definition, column);
  //protected _fieldset: AddressSchema;
  if (column.type.fieldset) {
    definition.addProperty({
      scope: Scope.Protected,
      name: '_fieldset',
      type: column.type.fieldset.name.toClassName('%sSchema')
    });
  }
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

      : column.type.fieldset
      ? 'return this._fieldset.defaults;'
      
      : 'return undefined;'
  });
  //public assert<T>(value: T) {}
  generateAssert(definition, column);
  //public constructor(seed = '') {}
  definition.addConstructor({
    scope: Scope.Public,
    parameters: column.value.encrypted ? [{
      name: 'seed',
      initializer: "''"
    }] : [],
    statements: renderCode(TEMPLATE.CONSTRUCTOR, {
      shape,
      seed: column.value.encrypted,
      fieldset: column.type.fieldset
        ? column.type.fieldset.name.toClassName('%sSchema') 
        : null
    })
  });
  // public serialize<T>(value: T, scalar = false) {}
  // public unserialize<T>(value: T, scalar = false) {}
  generateSerializer(source, definition, column);
  return definition;
};

export const TEMPLATE = {

CONSTRUCTOR:
`<%#if seed%>
  this._seed = seed;
<%/if%>
<%#if fieldset%>
  this._fieldset = new <%fieldset%>(<%#if seed%>seed<%/if%>);
<%/if%>
this.shape = <%shape%>;`,

};