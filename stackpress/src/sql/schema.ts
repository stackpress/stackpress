//stackpress
import { isObject } from '@stackpress/lib';
import Create from '@stackpress/inquire/Create';
//schema
import type Column from '../schema/spec/Column.js';
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
  const schema = new Create(model.snakeCase);
  for (const column of model.columns.values()) {
    //schema.addField(column.snakeCase, {})...
    field(column, schema);
  }

  for (const column of model.ids) {
    schema.addPrimaryKey(column.snakeCase);
  }
  for (const column of model.uniques) {
    schema.addUniqueKey(`${column.snakeCase}_unique`, column.snakeCase);
  }
  for (const column of model.indexables) {
    schema.addKey(`${model.lowerCase}_${column.snakeCase}_index`, column.snakeCase);
  }

  const relations = model.relations.map(column => {
    const relation = column.parentRelation;
    const table = column.model?.snakeCase as string;
    const foreign = relation?.parent.key.snakeCase as string;
    const local = relation?.child.key.snakeCase as string;
    return { table, foreign, local, delete: onDelete, update: onUpdate };
  });
  for (const relation of relations) {
    schema.addForeignKey(`${model.snakeCase}_${relation.local}_foreign`, relation);
  }

  return schema;
};

export function field(column: Column, schema: Create) {
  const type = typemap[column.type];
  if (!type && !column.fieldset && !column.enum) {
    return;
  }
  const comment = column.description;

  //array
  if (column.multiple) {
    let isArrayString = false;
    try {
      isArrayString = typeof column.default === 'string' 
        && Array.isArray(JSON.parse(column.default));
    } catch(e) {}
    return schema.addField(column.snakeCase, {
      type: 'JSON',
      default: Array.isArray(column.default) 
        ? JSON.stringify(column.default) 
        : isArrayString 
        ? column.default as string 
        : undefined,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    });
  } else if (type === 'json' || column.fieldset) {
    let isObjectString = false;
    try {
      isObjectString = typeof column.default === 'string' 
        && !!column.default 
        && typeof JSON.parse(column.default) === 'object';
    } catch(e) {}
    return schema.addField(column.snakeCase, {
      type: 'JSON',
      default: isObject(column.default) 
        ? JSON.stringify(column.default) 
        : isObjectString 
        ? column.default as string 
        : undefined,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    });
  //char, varchar
  } else if (type === 'string') {
    const length = clen(column);
    const isComputer = typeof column.default === 'string'
      && !column.default.startsWith('uuid(')
      && !column.default.startsWith('cuid(')
      && !column.default.startsWith('nanoid(');
    return schema.addField(column.snakeCase, {
      type: length[0] === length[1] ? 'CHAR' : 'VARCHAR',
      length: length[1],
      default: isComputer ? column.default : undefined,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    });
  } else if (type === 'text') {
    return schema.addField(column.snakeCase, {
      type: 'TEXT',
      default: typeof column.default === 'string' 
        ? column.default as string 
        : undefined,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined 
    });
  } else if (type === 'boolean') {
    return schema.addField(column.snakeCase, {
      type: 'BOOLEAN',
      default: typeof column.default === 'boolean' 
        ? column.default 
        : undefined,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    });
  //integer, smallint, bigint, float
  } else if (type === 'number') {
    const { minmax, integerLength, decimalLength } = numdata(column);

    if (decimalLength > 0) {
      const length = integerLength + decimalLength;
      const number = Number(column.default);
      return schema.addField(column.snakeCase, {
        type: 'FLOAT',
        length: [ length, decimalLength ],
        default: !isNaN(number) ? number : undefined,
        nullable: !column.required,
        unsigned: minmax[0] < 0,
        comment: comment ? String(comment) : undefined
      });
    } else {
      const number = Number(column.default);
      return schema.addField(column.snakeCase, {
        type: 'INTEGER',
        length: integerLength,
        default: !isNaN(number) ? number : undefined,
        nullable: !column.required,
        unsigned: minmax[0] < 0,
        comment: comment ? String(comment) : undefined
      });
    }
  } else if (type === 'date') {
    return schema.addField(column.snakeCase, {
      type: 'DATE',
      default: column.default instanceof Date
        ? column.serialize(column.default, undefined, true) as string
        : typeof column.default === 'string'
        ? column.default as string
        : undefined,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    });
  } else if (type === 'datetime') {
    return schema.addField(column.snakeCase, {
      type: 'DATETIME',
      default: column.default instanceof Date
        ? column.serialize(column.default, undefined, true) as string
        : typeof column.default === 'string'
        ? column.default as string
        : undefined,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined  
    });
  } else if (type === 'time') {
    return schema.addField(column.snakeCase, {
      type: 'TIME',
      default: column.default instanceof Date
        ? column.serialize(column.default, undefined, true) as string
        : typeof column.default === 'string'
        ? column.default as string
        : undefined,
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    });
  //if it's an enum
  } else if (column.enum) {
    return schema.addField(column.snakeCase, {
      type: 'VARCHAR',
      length: 255,
      default: String(column.default),
      nullable: !column.required,
      comment: comment ? String(comment) : undefined
    });
  }
}

export function clen(column: Column) {
  //if is.ceq, is.cgt, is.clt, is.cge, is.cle
  const length: [ number, number ] = [ 0, 255 ];
  column.assertions.forEach(assertion => {
    if (assertion.method === 'ceq') {
      length[0] = assertion.args[0] as number;
      length[1] = assertion.args[0] as number;
    } else if (assertion.method === 'cgt') {
      length[0] = assertion.args[0] as number;
    } else if (assertion.method === 'clt') {
      length[1] = assertion.args[0] as number;
    } else if (assertion.method === 'cge') {
      length[0] = assertion.args[0] as number;
    } else if (assertion.method === 'cle') {
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
  column.assertions.forEach(assertion => {
    if (assertion.method === 'eq') {
      minmax[0] = assertion.args[0] as number;
      minmax[1] = assertion.args[0] as number;
    } else if (assertion.method === 'gt') {
      minmax[0] = assertion.args[0] as number;
    } else if (assertion.method === 'lt') {
      minmax[1] = assertion.args[0] as number;
    } else if (assertion.method === 'ge') {
      minmax[0] = assertion.args[0] as number;
    } else if (assertion.method === 'le') {
      minmax[1] = assertion.args[0] as number;
    }
  });
  //check for @step(0.01)
  const step = Array.isArray(column.step)
    ? column.step[0]
    : column.type.toLowerCase() === 'float'
    ? 10000000.01
    : 0;
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