//modules
import type { Directory, SourceFile } from 'ts-morph';
//schema
import type Model from '../../schema/model/Model.js';
import type Fieldset from '../../schema/spec/Fieldset.js';
import type Registry from '../../schema/Registry.js';

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
export default function generate(directory: Directory, registry: Registry) {
  //-----------------------------//
  // 1. profile/types.ts
  //loop through models
  for (const model of registry.model.values()) {
    const file = `${model.name}/types.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
    //generate the model
    generateModel(source, model);
  }

  //-----------------------------//
  // 2. address/types.ts
  //loop through fieldsets
  for (const fieldset of registry.fieldset.values()) {
    const file = `${fieldset.name}/types.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
    //generate the fieldset
    generateFieldset(source, fieldset);
  }

  //-----------------------------//
  // 3. types.ts
  const source = directory.createSourceFile('types.ts', '', { overwrite: true });

  //export type * from './module/Profile/types.js';
  for (const model of registry.model.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: `./${model.name}/types.js`,
      namedExports: [ model.titleCase, `${model.titleCase}Input`, `${model.titleCase}Extended` ]
    });
  }
  //export type * from './module/Profile/types.js';
  for (const fieldset of registry.fieldset.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: `./${fieldset.name}/types.js`,
      namedExports: [ fieldset.titleCase, `${fieldset.titleCase}Input` ]
    });
  }
};

/**
 * Generate model types
 */
export function generateModel(source: SourceFile, model: Model) {
  const columns = Array.from(model.columns.values());
  const enums = Array.from(model.enums.values()).map(column => column.type);
  //import {} from '../enums.js'
  if (enums.length > 0) {
    source.addImportDeclaration({
      moduleSpecifier: '../enums.js',
      namedImports: enums
    });
  }
  for (const column of model.relations) {
    const relation = column.parentRelation;
    if (!relation) continue;
    const model = relation?.parent.model;
    //import type { Profile } from '../Profile/types.js'
    source.addImportDeclaration({
      moduleSpecifier: `../${model.name}/types.js`,
      namedImports: [ model.titleCase ]
    });
  }
  for (const column of model.fieldsets.values()) {
    //import {} from '../Address/types.js'
    source.addImportDeclaration({
      moduleSpecifier: `../${column.type}/types.js`,
      namedImports: [ column.type ]
    });
  }
  //export type Profile
  source.addTypeAlias({
    isExported: true,
    name: model.titleCase,
    type: (`{
      ${columns.filter(
        //filter out columns that are not in the model map
        column => !!typemap[column.type] || !!column.enum || !!column.fieldset
      ).map(column => (
        //name?: string
        `${column.name}${
          !column.required ? '?' : ''
        }: ${typemap[column.type] || column.type}${
          column.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
  //export type ProfileExtended
  if (model.relations.length) {
    source.addTypeAlias({
      isExported: true,
      name: `${model.titleCase}Extended`,
      type: (`${model.titleCase} & {
        ${model.relations.map(column => (
          //user?: User
          `${column.name}${
            !column.required ? '?' : ''
          }: ${column.type}${
            column.multiple ? '[]' : ''
          }`
        )).join(',\n')}
      }`)
    });
  } else {
    source.addTypeAlias({
      isExported: true,
      name: `${model.titleCase}Extended`,
      type: model.titleCase
    });
  }
  //gather all the field inputs
  const inputs = columns
    .filter(column => !column.generated)
    .filter(column => [
      //should be a name on the map
      ...Object.keys(typemap.model),
      //...also include enum names
      ...model.enums.map(column => column.type),
      //...also include fieldset names
      ...model.fieldsets.map(column => column.fieldset?.titleCase)
    ].includes(column.type));
  //export type ProfileInput
  source.addTypeAlias({
    isExported: true,
    name: `${model.titleCase}Input`,
    type: (`{
      ${inputs.map(column => (
        //name?: string
        `${column.name}${
          !column.required || typeof column.default !== 'undefined' ? '?' : ''
        }: ${typemap[column.type] || column.type}${
          column.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
};

/**
 * Generate fieldset types
 */
export function generateFieldset(source: SourceFile, fieldset: Fieldset) {
  const columns = Array.from(fieldset.columns.values());
  const enums = Array.from(fieldset.enums.values()).map(column => column.type);
  //import {} from '../enums.js'
  if (enums.length > 0) {
    source.addImportDeclaration({
      moduleSpecifier: '../enums.js',
      namedImports: enums
    });
  }
  for (const column of fieldset.fieldsets.values()) {
    //import {} from '../Address/types.js'
    source.addImportDeclaration({
      moduleSpecifier: `../${column.type}/types.js`,
      namedImports: [ column.type ]
    });
  }
  //export type Profile
  source.addTypeAlias({
    isExported: true,
    name: fieldset.titleCase,
    type: (`{
      ${columns.filter(
        //filter out columns that are not in the map
        column => !!typemap[column.type] || !!column.enum || !!column.fieldset
      ).map(column => (
        //name?: string
        `${column.name}${
          !column.required ? '?' : ''
        }: ${typemap[column.type] || column.type}${
          column.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
  //gather all the field inputs
  const inputs = columns
    .filter(column => !column.generated)
    .filter(column => [ 
      //should be a name on the map
      ...Object.keys(typemap.model),
      //...also include enum names
      ...fieldset.enums.map(column => column.type),
      //...also include fieldset names
      ...fieldset.fieldsets.map(column => column.fieldset?.titleCase)
    ].includes(column.type));
  //export type ProfileInput
  source.addTypeAlias({
    isExported: true,
    name: `${fieldset.titleCase}Input`,
    type: (`{
      ${inputs.map(column => (
        //name?: string
        `${column.name}${
          !column.required || typeof column.default !== 'undefined' ? '?' : ''
        }: ${typemap[column.type] || column.type}${
          column.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
};