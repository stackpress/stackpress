//modules
import type { Directory, SourceFile } from 'ts-morph';
//stackpress/schema
import type Model from '../../schema/model/Model.js';
import type Fieldset from '../../schema/fieldset/Fieldset.js';
import type Schema from '../../schema/Schema.js';

const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Boolean: 'boolean',
  Date: 'string',
  Time: 'string',
  Datetime: 'string',
  Json: 'Record<string, string|number|boolean|null>',
  Object: 'Record<string, string|number|boolean|null>',
  Hash: 'Record<string, string|number|boolean|null>'
};

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, schema: Schema) {
  //-----------------------------//
  // 1. profile/types.ts
  //loop through models
  for (const model of schema.models.values()) {
    const file = model.name.toPathName('%s/types.ts');
    const source = directory.createSourceFile(file, '', { overwrite: true });
    //generate the model
    generateModel(source, model);
  }

  //-----------------------------//
  // 2. address/types.ts
  //loop through fieldsets
  for (const fieldset of schema.fieldsets.values()) {
    const file = fieldset.name.toPathName('%s/types.ts');
    const source = directory.createSourceFile(file, '', { overwrite: true });
    //generate the fieldset
    generateFieldset(source, fieldset);
  }

  //-----------------------------//
  // 3. types.ts
  const source = directory.createSourceFile('types.ts', '', { overwrite: true });

  //export type * from './module/Profile/types.js';
  for (const model of schema.models.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: model.name.toPathName('./%s/types.js'),
      namedExports: [ 
        model.name.toTypeName(),
        model.name.toTypeName('%sInput'), 
        model.name.toTypeName('%sExtended')
      ]
    });
  }
  //export type * from './module/Profile/types.js';
  for (const fieldset of schema.fieldsets.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: fieldset.name.toPathName('./%s/types.js'),
      namedExports: [ 
        fieldset.name.toTypeName(),
        fieldset.name.toTypeName('%sInput')
      ]
    });
  }
};

/**
 * Generate model types
 */
export function generateModel(source: SourceFile, model: Model) {
  const columns = model.columns.toArray();
  const enums = model.type.enums.toArray().map(column => column.type);
  //import all the enums needed for this type definition
  //import { ... } from '../enums.js'
  if (enums.length > 0) {
    source.addImportDeclaration({
      moduleSpecifier: '../enums.js',
      namedImports: enums
    });
  }
  //import all the models needed for this type definition
  for (const column of model.store.foreignRelationships.values()) {
    const model = column.type.model;
    if (!model) continue;
    //import type { Profile } from '../Profile/types.js'
    source.addImportDeclaration({
      moduleSpecifier: model.name.toPathName('../%s/types.js'),
      namedImports: [ model.name.toTypeName() ]
    });
  }
  //import all the fieldsets needed for this type definition
  for (const column of model.type.fieldsets.values()) {
    const fieldset = column.type.fieldset;
    if (!fieldset) continue;
    //import { ...} from '../Address/types.js'
    source.addImportDeclaration({
      moduleSpecifier: fieldset.name.toPathName('../%s/types.js'),
      namedImports: [ fieldset.name.toTypeName() ]
    });
  }
  //export type Profile
  source.addTypeAlias({
    isExported: true,
    name: model.name.titleCase,
    type: (`{
      ${columns.filter(
        //filter out columns that are not in the model map
        column => !!typemap[column.type.name] 
          || !!column.type.enum 
          || !!column.type.fieldset
      ).map(column => (
        //name?: string
        `${column.name.toTypeName()}${
          !column.type.required ? '?' : ''
        }: ${typemap[column.type.name] || column.type.name}${
          column.type.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
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
  //gather all the field inputs
  const inputs = columns
    .filter(column => !column.value.generated)
    .filter(column => [
      //should be a name on the map
      ...Object.keys(typemap.model),
      //...also include enum names
      ...model.type.enums.toArray().map(column => column.type.name),
      //...also include fieldset names
      ...model.type.fieldsets.toArray().map(
        column => column.type.fieldset?.name.toString()
      )
    ].includes(column.type.name));
  //export type ProfileInput
  source.addTypeAlias({
    isExported: true,
    name: `${model.name.titleCase}Input`,
    type: (`{
      ${inputs.map(column => (
        //name?: string
        `${column.name.toTypeName()}${!column.type.required 
          || typeof column.value.default !== 'undefined' ? '?' : ''
        }: ${typemap[column.type.name] || column.type.name}${
          column.type.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
};

/**
 * Generate fieldset types
 */
export function generateFieldset(source: SourceFile, fieldset: Fieldset) {
  const columns = fieldset.columns.toArray();
  const enums = fieldset.type.enums.toArray().map(column => column.type);
  //import {} from '../enums.js'
  if (enums.length > 0) {
    source.addImportDeclaration({
      moduleSpecifier: '../enums.js',
      namedImports: enums
    });
  }
  for (const column of fieldset.type.fieldsets.values()) {
    const fieldset = column.type.fieldset;
    if (!fieldset) continue;
    //import {} from '../Address/types.js'
    source.addImportDeclaration({
      moduleSpecifier: fieldset.name.toPathName('../%s/types.js'),
      namedImports: [ fieldset.name.toTypeName() ]
    });
  }
  //export type Profile
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
        `${column.name.toTypeName()}${
          !column.type.required ? '?' : ''
        }: ${typemap[column.type.name] || column.type.name}${
          column.type.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
  //gather all the field inputs
  const inputs = columns
    .filter(column => !column.value.generated)
    .filter(column => [ 
      //should be a name on the map
      ...Object.keys(typemap.model),
      //...also include enum names
      ...fieldset.type.enums.toArray().map(column => column.type.name),
      //...also include fieldset names
      ...fieldset.type.fieldsets.toArray().map(
        column => column.type.fieldset?.name.toString()
      )
    ].includes(column.type.name));
  //export type ProfileInput
  source.addTypeAlias({
    isExported: true,
    name: fieldset.name.toTypeName('%Input'),
    type: (`{
      ${inputs.map(column => (
        //name?: string
        `${column.name.toTypeName()}${!column.type.required 
          || typeof column.value.default !== 'undefined' ? '?' : ''
        }: ${typemap[column.type.name] || column.type.name}${
          column.type.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
};