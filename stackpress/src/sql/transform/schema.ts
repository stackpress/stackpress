//modules
import type { Directory } from 'ts-morph';
import { isObject } from '@stackpress/lib';
//schema
import type Column from '../../schema/spec/Column.js';
import type Registry from '../../schema/Registry.js';
//sql
import { clen, numdata } from '../schema.js';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const relations = model.relations.map(column => {
      const relation = column.parentRelation;
      const table = column.model?.snakeCase as string;
      const foreign = relation?.parent.key.snakeCase as string;
      const local = relation?.child.key.snakeCase as string;
      return { table, foreign, local, delete: 'CASCADE', update: 'RESTRICT' };
    });

    const source = directory.createSourceFile(
      `${model.name}/schema.ts`,
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
        const schema = new Create('${model.snakeCase}');
        ${Array
          .from(model.columns.values())
          .map(column => field(column))
          .filter(Boolean)
          .join('\n')
        }
        ${model.ids.map(
          column => `schema.addPrimaryKey('${column.snakeCase}');`
        ).join('\n')}
        ${model.uniques.map(
          column => `schema.addUniqueKey('${model.snakeCase}_${column.snakeCase}_unique', '${column.snakeCase}');`
        ).join('\n')}
        ${model.indexables.map(
          column => `schema.addKey('${model.snakeCase}_${column.snakeCase}_index', '${column.snakeCase}');`
        ).join('\n')}
        ${relations.map(relation => {
          return `schema.addForeignKey('${model.snakeCase}_${relation.local}_foreign', ${
            JSON.stringify(relation, null, 2)
          });`;
        }).join('\n')}
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
  const type = typemap[column.type];
  if (!type && !column.fieldset && !column.enum) {
    return false;
  }

  const comment = column.description;

  //array
  if (column.multiple) {
    let isStringArray = false;
    try {
      isStringArray = typeof column.default === 'string' 
        && Array.isArray(JSON.parse(column.default));
    } catch(e) {}
    return `schema.addField('${column.snakeCase}', ${JSON.stringify({
      type: 'JSON',
      default: Array.isArray(column.default) 
        ? JSON.stringify(column.default)
        : isStringArray 
        ? column.default as string 
        : undefined,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    }, null, 2)});`;
  } else if (type === 'json' || column.fieldset) {
    let isStringObject = false;
    try {
      isStringObject = typeof column.default === 'string' 
        && !!column.default 
        && typeof JSON.parse(column.default) === 'object';
    } catch(e) {}
    return `schema.addField('${column.snakeCase}', ${JSON.stringify({
      type: 'JSON',
      default: isObject(column.default) 
        ? JSON.stringify(column.default) 
        : isStringObject 
        ? column.default as string
        : undefined,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    }, null, 2)});`;
  //char, varchar
  } else if (type === 'string') {
    const length = clen(column);
    const hasDefault = typeof column.default === 'string'
      && !column.default.startsWith('uuid(')
      && !column.default.startsWith('cuid(')
      && !column.default.startsWith('nanoid(');
    if (length[0] === length[1]) {
      return `schema.addField('${column.snakeCase}', ${JSON.stringify({
        type: 'CHAR',
        length: length[1],
        default: hasDefault ? column.default : undefined,
        nullable: !column.required,
        comment: comment ? String(comment) : undefined
      }, null, 2)});`;
    } else {
      return `schema.addField('${column.snakeCase}', ${JSON.stringify({
        type: 'VARCHAR',
        length: length[1],
        default: hasDefault ? column.default : undefined,
        nullable: !column.required,
        comment: comment ? String(comment) : undefined
      }, null, 2)});`;
    }
  } else if (type === 'text') {
    return `schema.addField('${column.snakeCase}', ${JSON.stringify({
      type: 'TEXT',
      default: column.default ,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined 
    }, null, 2)});`;
  } else if (type === 'boolean') {
    return `schema.addField('${column.snakeCase}', ${JSON.stringify({
      type: 'BOOLEAN',
      default: column.default,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    }, null, 2)});`;
  //integer, smallint, bigint, float
  } else if (type === 'number') {
    const { minmax, integerLength, decimalLength } = numdata(column);

    if (decimalLength > 0) {
      const length = integerLength + decimalLength;
      return `schema.addField('${column.snakeCase}', ${JSON.stringify({
        type: 'FLOAT',
        length: `${length}, ${decimalLength}`,
        default: column.default,
        nullable: !column.required,
        unsigned: minmax[0] < 0,
        comment: comment ? String(comment) : undefined
      }, null, 2)});`;
    } else {
      return `schema.addField('${column.snakeCase}', ${JSON.stringify({
        type: 'INTEGER',
        length: integerLength,
        default: column.default,
        nullable: !column.required,
        unsigned: minmax[0] < 0,
        comment: comment ? String(comment) : undefined
      }, null, 2)});`;
    }
  } else if (type === 'date') {
    return `schema.addField('${column.snakeCase}', ${JSON.stringify({
      type: 'DATE',
      default: column.default,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    }, null, 2)});`;
  } else if (type === 'datetime') {
    return `schema.addField('${column.snakeCase}', ${JSON.stringify({
      type: 'DATETIME',
      default: column.default,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined  
    }, null, 2)});`;
  } else if (type === 'time') {
    return `schema.addField('${column.snakeCase}', ${JSON.stringify({
      type: 'TIME',
      default: column.default,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    }, null, 2)});`;
  //if it's an enum
  } else if (column.enum) {
    return `schema.addField('${column.snakeCase}', ${JSON.stringify({
      type: 'VARCHAR',
      length: 255,
      default: column.default,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    }, null, 2)});`;
  }

  return false;
};