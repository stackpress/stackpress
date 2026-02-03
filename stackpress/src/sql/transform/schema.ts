//modules
import type { Directory } from 'ts-morph';
import { isObject } from '@stackpress/lib';
//schema
import type Column from '../../schema/column/Column.js';
import type Schema from '../../schema/Schema.js';
//sql
import { clen, numdata } from '../schema.js';

export default function generate(directory: Directory, schema: Schema) {
  //loop through models
  for (const model of schema.models.values()) {
    const relations = model.store.foreignRelationships.map(column => {
      const relation = column.store.foreignRelationship!;
      const table = column.type.model?.name.snakeCase as string;
      const foreign = relation.foreign.key.name.snakeCase as string;
      const local = relation.local.key.name.snakeCase as string;
      return { table, foreign, local, delete: 'CASCADE', update: 'RESTRICT' };
    });

    const source = directory.createSourceFile(
      `${model.name.toString()}/schema.ts`,
      '', 
      { overwrite: true }
    );

    //import Create from '@stackpress/inquire/Create';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/inquire/Create',
      defaultImport: 'Create'
    });
    //export function create() {}
    source.addFunction({
      name: 'create',
      isExported: true,
      statements: (`
        const schema = new Create('${model.name.snakeCase}');
        ${Array
          .from(model.columns.values())
          .map(column => field(column))
          .filter(Boolean)
          .join('\n')
        }
        ${model.store.ids.map(
          column => `schema.addPrimaryKey('${column.name.snakeCase}');`
        ).toArray().join('\n')}
        ${model.store.uniques.map(
          column => `schema.addUniqueKey('${model.name.snakeCase}_${column.name.snakeCase}_unique', '${column.name.snakeCase}');`
        ).toArray().join('\n')}
        ${model.store.indexables.map(
          column => `schema.addKey('${model.name.snakeCase}_${column.name.snakeCase}_index', '${column.name.snakeCase}');`
        ).toArray().join('\n')}
        ${relations.map(relation => {
          return `schema.addForeignKey('${model.name.snakeCase}_${relation.local}_foreign', ${
            JSON.stringify(relation, null, 2)
          });`;
        }).toArray().join('\n')}
        return schema;
      `)
    });
    //const schema = create();
    //export default schema;
    source.addStatements(`
      const schema = create();
      export default schema;
    `);
  }
};

//map from column types to sql types and helpers
export const typemap: Record<string, string> = {
  String: 'string',
  Text: 'text',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Boolean: 'boolean',
  Date: 'date',
  Datetime: 'datetime',
  Time: 'time',
  Json: 'json',
  Object: 'json',
  Hash: 'json'
};

export function field(column: Column) {
  const type = typemap[column.type.name];
  if (!type && !column.type.fieldset && !column.type.enum) {
    return false;
  }

  const comment = column.document.description;

  //array
  if (column.type.multiple) {
    let isStringArray = false;
    try {
      isStringArray = typeof column.value.default === 'string' 
        && Array.isArray(JSON.parse(column.value.default));
    } catch(e) {}
    return `schema.addField('${column.name.snakeCase}', ${JSON.stringify({
      type: 'JSON',
      default: Array.isArray(column.value.default) 
        ? JSON.stringify(column.value.default)
        : isStringArray 
        ? column.value.default as string 
        : undefined,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    }, null, 2)});`;
  } else if (type === 'json' || column.type.fieldset) {
    let isStringObject = false;
    try {
      isStringObject = typeof column.value.default === 'string' 
        && !!column.value.default 
        && typeof JSON.parse(column.value.default) === 'object';
    } catch(e) {}
    return `schema.addField('${column.name.snakeCase}', ${JSON.stringify({
      type: 'JSON',
      default: isObject(column.value.default) 
        ? JSON.stringify(column.value.default) 
        : isStringObject 
        ? column.value.default as string
        : undefined,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    }, null, 2)});`;
  //char, varchar
  } else if (type === 'string') {
    const length = clen(column);
    const hasDefault = typeof column.value.default === 'string'
      && !column.value.default.startsWith('uuid(')
      && !column.value.default.startsWith('cuid(')
      && !column.value.default.startsWith('nanoid(');
    if (length[0] === length[1]) {
      return `schema.addField('${column.name.snakeCase}', ${JSON.stringify({
        type: 'CHAR',
        length: length[1],
        default: hasDefault ? column.value.default : undefined,
        nullable: !column.type.required,
        comment: comment ? String(comment) : undefined
      }, null, 2)});`;
    } else {
      return `schema.addField('${column.name.snakeCase}', ${JSON.stringify({
        type: 'VARCHAR',
        length: length[1],
        default: hasDefault ? column.value.default : undefined,
        nullable: !column.type.required,
        comment: comment ? String(comment) : undefined
      }, null, 2)});`;
    }
  } else if (type === 'text') {
    return `schema.addField('${column.name.snakeCase}', ${JSON.stringify({
      type: 'TEXT',
      default: column.value.default ,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined 
    }, null, 2)});`;
  } else if (type === 'boolean') {
    return `schema.addField('${column.name.snakeCase}', ${JSON.stringify({
      type: 'BOOLEAN',
      default: column.value.default,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    }, null, 2)});`;
  //integer, smallint, bigint, float
  } else if (type === 'number') {
    const { minmax, integerLength, decimalLength } = numdata(column);

    if (decimalLength > 0) {
      const length = integerLength + decimalLength;
      return `schema.addField('${column.name.snakeCase}', ${JSON.stringify({
        type: 'FLOAT',
        length: [length, decimalLength ],
        default: column.value.default,
        nullable: !column.type.required,
        unsigned: minmax[0] < 0,
        comment: comment ? String(comment) : undefined
      }, null, 2)});`;
    } else {
      return `schema.addField('${column.name.snakeCase}', ${JSON.stringify({
        type: 'INTEGER',
        length: integerLength,
        default: column.value.default,
        nullable: !column.type.required,
        unsigned: minmax[0] < 0,
        comment: comment ? String(comment) : undefined
      }, null, 2)});`;
    }
  } else if (type === 'date') {
    return `schema.addField('${column.name.snakeCase}', ${JSON.stringify({
      type: 'DATE',
      default: column.value.default,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    }, null, 2)});`;
  } else if (type === 'datetime') {
    return `schema.addField('${column.name.snakeCase}', ${JSON.stringify({
      type: 'DATETIME',
      default: column.value.default,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined  
    }, null, 2)});`;
  } else if (type === 'time') {
    return `schema.addField('${column.name.snakeCase}', ${JSON.stringify({
      type: 'TIME',
      default: column.value.default,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    }, null, 2)});`;
  //if it's an enum
  } else if (column.type.enum) {
    return `schema.addField('${column.name.snakeCase}', ${JSON.stringify({
      type: 'VARCHAR',
      length: 255,
      default: column.value.default,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    }, null, 2)});`;
  }

  return false;
};