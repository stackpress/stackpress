//stackpress
import { isObject } from '@stackpress/lib';
import Create from '@stackpress/inquire/Create';
//schema
import type Column from '../schema/column/Column.js';
import type Model from '../schema/model/Model.js';

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

export default function schema(
  model: Model,
  onDelete: 'CASCADE'|'SET NULL'|'RESTRICT' = 'CASCADE',
  onUpdate: 'CASCADE'|'SET NULL'|'RESTRICT' = 'RESTRICT'
) {
  const schema = new Create(model.name.snakeCase);
  for (const column of model.columns.values()) {
    //schema.addField(column.name.snakeCase, {})...
    field(column, schema);
  }

  for (const column of model.store.ids.values()) {
    schema.addPrimaryKey(column.name.snakeCase);
  }
  for (const column of model.store.uniques.values()) {
    schema.addUniqueKey(`${column.name.snakeCase}_unique`, column.name.snakeCase);
  }
  for (const column of model.store.indexables.values()) {
    schema.addKey(
      `${model.name.lowerCase}_${column.name.snakeCase}_index`, 
      column.name.snakeCase
    );
  }

  const relations = model.store.foreignRelationships.map(column => {
    const relation = column.store.foreignRelationship;
    const table = column.type.model!.name.snakeCase;
    const foreign = relation!.foreign.key.name.snakeCase;
    const local = relation!.local.key.name.snakeCase;
    return { table, foreign, local, delete: onDelete, update: onUpdate };
  });
  for (const relation of relations.values()) {
    schema.addForeignKey(`${model.name.snakeCase}_${relation.local}_foreign`, relation);
  }

  return schema;
};

export function field(column: Column, schema: Create) {
  const type = typemap[column.type.name];
  if (!type && !column.type.fieldset && !column.type.enum) {
    return;
  }
  const comment = column.document.description;

  //array
  if (column.type.multiple) {
    let isArrayString = false;
    try {
      isArrayString = typeof column.value.default === 'string' 
        && Array.isArray(JSON.parse(column.value.default));
    } catch(e) {}
    return schema.addField(column.name.snakeCase, {
      type: 'JSON',
      default: Array.isArray(column.value.default) 
        ? JSON.stringify(column.value.default) 
        : isArrayString 
        ? column.value.default as string 
        : undefined,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    });
  } else if (type === 'json' || column.type.fieldset) {
    let isObjectString = false;
    try {
      isObjectString = typeof column.value.default === 'string' 
        && !!column.value.default 
        && typeof JSON.parse(column.value.default) === 'object';
    } catch(e) {}
    return schema.addField(column.name.snakeCase, {
      type: 'JSON',
      default: isObject(column.value.default) 
        ? JSON.stringify(column.value.default) 
        : isObjectString 
        ? column.value.default as string 
        : undefined,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    });
  //char, varchar
  } else if (type === 'string') {
    const length = clen(column);
    const isComputer = typeof column.value.default === 'string'
      && !column.value.default.startsWith('uuid(')
      && !column.value.default.startsWith('cuid(')
      && !column.value.default.startsWith('nanoid(');
    return schema.addField(column.name.snakeCase, {
      type: length[0] === length[1] ? 'CHAR' : 'VARCHAR',
      length: length[1],
      default: isComputer ? column.value.default : undefined,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    });
  } else if (type === 'text') {
    return schema.addField(column.name.snakeCase, {
      type: 'TEXT',
      default: typeof column.value.default === 'string' 
        ? column.value.default as string 
        : undefined,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined 
    });
  } else if (type === 'boolean') {
    return schema.addField(column.name.snakeCase, {
      type: 'BOOLEAN',
      default: typeof column.value.default === 'boolean' 
        ? column.value.default 
        : undefined,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    });
  //integer, smallint, bigint, float
  } else if (type === 'number') {
    const { minmax, integerLength, decimalLength } = numdata(column);

    if (decimalLength > 0) {
      const length = integerLength + decimalLength;
      const number = Number(column.value.default);
      return schema.addField(column.name.snakeCase, {
        type: 'FLOAT',
        length: [ length, decimalLength ],
        default: !isNaN(number) ? number : undefined,
        nullable: !column.type.required,
        unsigned: minmax[0] < 0,
        comment: comment ? String(comment) : undefined
      });
    } else {
      const number = Number(column.value.default);
      return schema.addField(column.name.snakeCase, {
        type: 'INTEGER',
        length: integerLength,
        default: !isNaN(number) ? number : undefined,
        nullable: !column.type.required,
        unsigned: minmax[0] < 0,
        comment: comment ? String(comment) : undefined
      });
    }
  } else if (type === 'date') {
    return schema.addField(column.name.snakeCase, {
      type: 'DATE',
      default: column.value.default instanceof Date
        ? column.runtime.serialize(column.value.default, undefined, true) as string
        : typeof column.value.default === 'string'
        ? column.value.default as string
        : undefined,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    });
  } else if (type === 'datetime') {
    return schema.addField(column.name.snakeCase, {
      type: 'DATETIME',
      default: column.value.default instanceof Date
        ? column.runtime.serialize(column.value.default, undefined, true) as string
        : typeof column.value.default === 'string'
        ? column.value.default as string
        : undefined,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined  
    });
  } else if (type === 'time') {
    return schema.addField(column.name.snakeCase, {
      type: 'TIME',
      default: column.value.default instanceof Date
        ? column.runtime.serialize(column.value.default, undefined, true) as string
        : typeof column.value.default === 'string'
        ? column.value.default as string
        : undefined,
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    });
  //if it's an enum
  } else if (column.type.enum) {
    return schema.addField(column.name.snakeCase, {
      type: 'VARCHAR',
      length: 255,
      default: String(column.value.default),
      nullable: !column.type.required,
      comment: comment ? String(comment) : undefined
    });
  }
}

export function clen(column: Column) {
  //if is.ceq, is.cgt, is.clt, is.cge, is.cle
  const length: [ number, number ] = [ 0, 255 ];
  column.assertion.assertions.forEach(assertion => {
    if (assertion.name === 'ceq') {
      length[0] = assertion.args[0] as number;
      length[1] = assertion.args[0] as number;
    } else if (assertion.name === 'cgt') {
      length[0] = assertion.args[0] as number;
    } else if (assertion.name === 'clt') {
      length[1] = assertion.args[0] as number;
    } else if (assertion.name === 'cge') {
      length[0] = assertion.args[0] as number;
    } else if (assertion.name === 'cle') {
      length[1] = assertion.args[0] as number;
    }
  });
  //if length is less than 1, then 
  //it's invalid so set to 255
  if (length[1] < 1) {
    length[1] = 255;
  }
  return length;
}

export function numdata(column: Column) {
  const minmax: [ number, number ] = [ 0, 0 ];
  column.assertion.assertions.forEach(assertion => {
    if (assertion.name === 'eq') {
      minmax[0] = assertion.args[0] as number;
      minmax[1] = assertion.args[0] as number;
    } else if (assertion.name === 'gt') {
      minmax[0] = assertion.args[0] as number;
    } else if (assertion.name === 'lt') {
      minmax[1] = assertion.args[0] as number;
    } else if (assertion.name === 'ge') {
      minmax[0] = assertion.args[0] as number;
    } else if (assertion.name === 'le') {
      minmax[1] = assertion.args[0] as number;
    }
  });
  //check for @step(0.01)
  const step = column.number.step;
  const stepIntegerLength = step.toString().split('.')[0].length;
  const stepDecimalLength = (step.toString().split('.')[1] || '').length;
  //if minmax[1] is still 0, then default 10^(10 - decimalLength)
  if (minmax[1] === 0) {
    const minDecimalLength = (minmax[0].toString().split('.')[1] || '').length;
    const maxDecimalLength = (minmax[1].toString().split('.')[1] || '').length;
    const decimalLength = Math.max(minDecimalLength, maxDecimalLength, stepDecimalLength);
    minmax[1] = Number('1'+'0'.repeat(9 - decimalLength));
  }
  //determine the length of each min/max
  const minIntegerLength = minmax[0].toString().split('.')[0].length;
  const maxIntegerLength = minmax[1].toString().split('.')[0].length;
  const minDecimalLength = (minmax[0].toString().split('.')[1] || '').length;
  const maxDecimalLength = (minmax[1].toString().split('.')[1] || '').length;
  const integerLength = Math.max(minIntegerLength, maxIntegerLength, stepIntegerLength);
  const decimalLength = Math.max(minDecimalLength, maxDecimalLength, stepDecimalLength);

  return {
    step,
    minmax,
    minIntegerLength, 
    maxIntegerLength,
    minDecimalLength,
    maxDecimalLength,
    stepIntegerLength,
    stepDecimalLength,
    integerLength,
    decimalLength
  };
}