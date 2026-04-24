//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Fieldset from '../Fieldset.js';
import type Model from '../Model.js';
import type Schema from '../Schema.js';
import { loadProjectFile } from './helpers.js';

const objects = [ 'Json', 'Object', 'Hash' ];

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
  Hash: 'Record<string, ScalarInput>'
};

export function generateFieldsetTypes(directory: Directory, fieldset: Fieldset) {
  const columns = fieldset.columns.filter(
    column => !column.type.model
  ).toArray();
  const enums = fieldset.type.enums.toArray().map(column => column.type);
  const fieldsets = fieldset.type.fieldsets
    .map(column => column.type.fieldset!)
    .toArray()
    .filter((value, index, self) => self.findIndex(
      fieldset => fieldset.name.toString() === value.name.toString()
    ) === index);
  const inputs = columns
    .filter(column => !column.value.generated)
    .filter(column => [ 
      //should be a name on the map
      ...Object.keys(typemap),
      //...also include enum names
      ...fieldset.type.enums.toArray().map(column => column.type.name),
      //...also include fieldset names
      ...fieldset.type.fieldsets.toArray().map(
        column => column.type.fieldset?.name.toString()
      )
    ].includes(column.type.name));

  //------------------------------------------------------------------//
  // Address/types.ts

  const filepath = fieldset.name.toPathName('%s/types.ts');
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import type { ScalarInput } from '@stackpress/lib/types';
  if (columns.some(column => objects.includes(column.type.name))) {
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/lib/types',
      namedImports: [ 'ScalarInput' ]
    });
  }

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { 
  //  AssertInterfaceMap, 
  //  SerializeInterfaceMap, 
  //  UnserializeInterfaceMap 
  //} from 'stackpress/schema/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/schema/types',
    namedImports: [
      'AssertInterfaceMap',
      'SerializeInterfaceMap',
      'UnserializeInterfaceMap'
    ]
  });
  //import type { SchemaInterface } from 'stackpress/schema';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/schema',
    namedImports: [ 'SchemaInterface' ]
  });

  //------------------------------------------------------------------//
  // Import Client

  //import { Roles } from '../enums.js'
  if (enums.length > 0) {
    source.addImportDeclaration({
      moduleSpecifier: '../enums.js',
      //filter out duplicate enums
      namedImports: enums.filter((value, index, self) => self.findIndex(
        enumType => enumType.name === value.name) === index
      )
    });
  }
  //import type { Address } from '../Address/types.js'
  for (const fieldset of fieldsets) {
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: fieldset.name.toPathName('../%s/types.js'),
      namedImports: [ fieldset.name.toTypeName() ]
    });
  }
  //import type StreetColumn from './columns/StreetColumn.js'
  for (const column of columns.values()) {
    //import type StreetColumn from './columns/StreetColumn.js';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: column.name.toPathName('./columns/%sColumn.js'),
      defaultImport: column.name.toClassName('%sColumn')
    });
  }

  //------------------------------------------------------------------//
  // Exports

  //export type Address
  source.addTypeAlias({
    isExported: true,
    name: fieldset.name.titleCase,
    type: (`{
      ${columns.filter(
        //filter out columns that are not in the map
        column => !!typemap[column.type.name] 
          || !!column.type.enum 
          || !!column.type.fieldset
      ).map(column => (
        //name?: string
        `${column.name.toTypeName()}: ${
          typemap[column.type.name] || column.type.name
        }${
          column.type.multiple ? '[]' : ''
        }${!column.type.required ? ' | null' : ''}`
      )).join(',\n')}
    }`)
  });
  //export type AddressInput
  source.addTypeAlias({
    isExported: true,
    name: fieldset.name.toTypeName('%sInput'),
    type: (`{
      ${inputs.map(column => (
        //name?: string
        `${column.name.toTypeName()}${!column.type.required 
          || typeof column.value.default !== 'undefined' ? '?' : ''
        }: ${typemap[column.type.name] || column.type.name}${
          column.type.multiple ? '[]' : ''
        }${!column.type.required ? ' | null' : ''}`
      )).join(',\n')}
    }`)
  });
  //export type AddressColumns = { street: StreetColumn, ... };
  source.addTypeAlias({
    isExported: true,
    name: fieldset.name.toTypeName('%sColumns'),
    type: (`{${
      columns.map(
        column => `${column.name.toString()}: ${column.name.toClassName('%sColumn')}`
      ).join(', ')
    }}`)
  });
  //export type AddressAssertInterfaceMap = AssertInterfaceMap<AddressColumns>;
  source.addTypeAlias({
    isExported: true,
    name: fieldset.name.toTypeName('%sAssertInterfaceMap'),
    type: fieldset.name.toTypeName('AssertInterfaceMap<%sColumns>')
  });
  //export type AddressSerializeInterfaceMap = SerializeInterfaceMap<AddressColumns>;
  source.addTypeAlias({
    isExported: true,
    name: fieldset.name.toTypeName('%sSerializeInterfaceMap'),
    type: fieldset.name.toTypeName('SerializeInterfaceMap<%sColumns>')
  });
  //export type AddressUnserializeInterfaceMap = UnserializeInterfaceMap<AddressColumns>;
  source.addTypeAlias({
    isExported: true,
    name: fieldset.name.toTypeName('%sUnserializeInterfaceMap'),
    type: fieldset.name.toTypeName('UnserializeInterfaceMap<%sColumns>')
  });
  //export interface AddressSchemaInterface extends SchemaInterface<T, C> {};
  source.addInterface({
    isExported: true,
    name: `${fieldset.name.toClassName()}SchemaInterface`,
    extends: [
      `SchemaInterface<${[
        fieldset.name.toTypeName(), 
        fieldset.name.toTypeName('%sColumns')
      ].join(', ')}>`
    ]
  });

  return source;
};

export function generateModelTypes(directory: Directory, model: Model) {
  const models = model.store.foreignRelationships
    .map(column => column.type.model!)
    .toArray()
    .filter((value, index, self) => self.findIndex(
      model => model.name.toString() === value.name.toString()
    ) === index);

  //load profile/types.ts if it exists, if not create it
  const source = generateFieldsetTypes(directory, model);

  //------------------------------------------------------------------//
  // Import Modules
  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client

  //import type { Profile } from '../Profile/types.js'
  for (const model of models) {
    source.addImportDeclaration({
      moduleSpecifier: model.name.toPathName('../%s/types.js'),
      namedImports: [ model.name.toTypeName() ]
    });
  }

  //------------------------------------------------------------------//
  // Exports

  //export type ProfileExtended
  if (model.store.foreignRelationships.size > 0) {
    source.addTypeAlias({
      isExported: true,
      name: model.name.toTypeName('%sExtended'),
      type: (`${model.name.toTypeName()} & {
        ${model.store.foreignRelationships.map(column => (
          //user?: User
          `${column.name.toTypeName()}${
            !column.type.required ? '?' : ''
          }: ${column.type.name}${
            column.type.multiple ? '[]' : ''
          }`
        )).toArray().join(',\n')}
      }`)
    });
  } else {
    source.addTypeAlias({
      isExported: true,
      name: model.name.toTypeName('%sExtended'),
      type: model.name.toTypeName()
    });
  }
};

export function generateTypes(directory: Directory, schema: Schema) {
  //load types.ts if it exists, if not create it
  const source = loadProjectFile(directory, 'types.ts');

  //export type * from './module/Profile/types.js';
  for (const model of schema.models.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: model.name.toPathName('./%s/types.js'),
      namedExports: [ 
        model.name.toTypeName(),
        model.name.toTypeName('%sInput'), 
        model.name.toTypeName('%sExtended'), 
        model.name.toTypeName('%sSchemaInterface')
      ]
    });
  }
  //export type * from './module/Address/types.js';
  for (const fieldset of schema.fieldsets.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: fieldset.name.toPathName('./%s/types.js'),
      namedExports: [ 
        fieldset.name.toTypeName(),
        fieldset.name.toTypeName('%sInput'), 
        fieldset.name.toTypeName('%sSchemaInterface')
      ]
    });
  }
};