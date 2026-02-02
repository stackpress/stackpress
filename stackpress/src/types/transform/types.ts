//modules
import type { Directory, SourceFile } from 'ts-morph';
//schema
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
    const file = `${model.name}/types.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
    //generate the model
    generateModel(source, model);
  }

  //-----------------------------//
  // 2. address/types.ts
  //loop through fieldsets
  for (const fieldset of schema.fieldsets.values()) {
    const file = `${fieldset.name}/types.ts`;
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
      moduleSpecifier: `./${model.name.toString()}/types.js`,
      namedExports: [ 
        model.name.titleCase, 
        `${model.name.titleCase}Input`, 
        `${model.name.titleCase}Extended` 
      ]
    });
  }
  //export type * from './module/Profile/types.js';
  for (const fieldset of schema.fieldsets.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: `./${fieldset.name.toString()}/types.js`,
      namedExports: [ 
        fieldset.name.titleCase, 
        `${fieldset.name.titleCase}Input` 
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
      moduleSpecifier: `../${model.name.toString()}/types.js`,
      namedImports: [ model.name.titleCase ]
    });
  }
  //import all the fieldsets needed for this type definition
  for (const column of model.type.fieldsets.values()) {
    const fieldset = column.type.fieldset;
    if (!fieldset) continue;
    //import { ...} from '../Address/types.js'
    source.addImportDeclaration({
      moduleSpecifier: `../${fieldset.name.toString()}/types.js`,
      namedImports: [ fieldset.name.titleCase ]
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
        `${column.name}${
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
      name: `${model.name.titleCase}Extended`,
      type: (`${model.name.titleCase} & {
        ${model.store.foreignRelationships.map(column => (
          //user?: User
          `${column.name}${
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
      name: `${model.name.titleCase}Extended`,
      type: model.name.titleCase
    });
  }
  //gather all the field inputs
  const inputs = columns
    .filter(column => !column.value.generated)
    .filter(column => [
      //should be a name on the map
      ...Object.keys(typemap.model),
      //...also include enum names
      ...model.type.enums.map(column => column.type),
      //...also include fieldset names
      ...model.type.fieldsets.map(
        column => column.type.fieldset?.name.titleCase
      )
    ].includes(column.type.name));
  //export type ProfileInput
  source.addTypeAlias({
    isExported: true,
    name: `${model.name.titleCase}Input`,
    type: (`{
      ${inputs.map(column => (
        //name?: string
        `${column.name}${!column.type.required 
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
    //import {} from '../Address/types.js'
    source.addImportDeclaration({
      moduleSpecifier: `../${column.type.name}/types.js`,
      namedImports: [ column.type.name ]
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
        `${column.name}${
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
      ...fieldset.type.enums.map(column => column.type),
      //...also include fieldset names
      ...fieldset.type.fieldsets.map(
        column => column.type.fieldset?.name.titleCase
      )
    ].includes(column.type.name));
  //export type ProfileInput
  source.addTypeAlias({
    isExported: true,
    name: `${fieldset.name.titleCase}Input`,
    type: (`{
      ${inputs.map(column => (
        //name?: string
        `${column.name}${!column.type.required 
          || typeof column.value.default !== 'undefined' ? '?' : ''
        }: ${typemap[column.type.name] || column.type.name}${
          column.type.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
};