//modules
import type { Field } from '@stackpress/inquire/types';
import { isObject } from '@stackpress/lib/Nest';
import Create from '@stackpress/inquire/Create';
//stackpress-schema
import type Column from 'stackpress-schema/Column';
import type Model from 'stackpress-schema/Model';

//map of column type to kind
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

/**
 * Determines the char length of a column based on its attributes
 */
export function getCharLength(column: Column) {
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
};

/**
 * Determines the column setup for sql table creation
 */
export function getFieldSetup(column: Column) {
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
    return {
      type: 'JSON',
      default: Array.isArray(column.value.default) 
        ? JSON.stringify(column.value.default)
        : isStringArray 
        ? column.value.default as string 
        : undefined,
      nullable: column.type.nullable,
      comment: comment ? String(comment) : undefined
    };
  } else if (type === 'json' || column.type.fieldset) {
    let isStringObject = false;
    try {
      isStringObject = typeof column.value.default === 'string' 
        && !!column.value.default 
        && typeof JSON.parse(column.value.default) === 'object';
    } catch(e) {}
    return {
      type: 'JSON',
      default: isObject(column.value.default) 
        ? JSON.stringify(column.value.default) 
        : isStringObject 
        ? column.value.default as string
        : undefined,
      nullable: column.type.nullable,
      comment: comment ? String(comment) : undefined
    };
  //char, varchar
  } else if (type === 'string') {
    const length = getCharLength(column);
    const hasDefault = typeof column.value.default === 'string'
      && !column.value.default.startsWith('uuid(')
      && !column.value.default.startsWith('cuid(')
      && !column.value.default.startsWith('nanoid(');
    return length[0] === length[1] ? {
      type: 'CHAR',
      length: length[1],
      default: hasDefault ? column.value.default : undefined,
      nullable: column.type.nullable,
      comment: comment ? String(comment) : undefined
    } : {
      type: 'VARCHAR',
      length: length[1],
      default: hasDefault ? column.value.default : undefined,
      nullable: column.type.nullable,
      comment: comment ? String(comment) : undefined
    };
  } else if (type === 'text') {
    return {
      type: 'TEXT',
      default: column.value.default,
      nullable: column.type.nullable,
      comment: comment ? String(comment) : undefined 
    };
  } else if (type === 'boolean') {
    return {
      type: 'BOOLEAN',
      default: column.value.default,
      nullable: column.type.nullable,
      comment: comment ? String(comment) : undefined
    };
  //integer, smallint, bigint, float
  } else if (type === 'number') {
    const { 
      minmax, 
      integerLength, 
      decimalLength 
    } = getNumberInfo(column);

    return decimalLength > 0 ? {
      type: 'FLOAT',
      length: [ integerLength + decimalLength, decimalLength ],
      default: column.value.default,
      nullable: column.type.nullable,
      unsigned: minmax[0] < 0,
      comment: comment ? String(comment) : undefined
    } : {
      type: 'INTEGER',
      length: integerLength,
      default: column.value.default,
      nullable: column.type.nullable,
      unsigned: minmax[0] < 0,
      comment: comment ? String(comment) : undefined
    };
  } else if (type === 'date') {
    return {
      type: 'DATE',
      default: column.value.default,
      nullable: column.type.nullable,
      comment: comment ? String(comment) : undefined
    };
  } else if (type === 'datetime') {
    return {
      type: 'DATETIME',
      default: column.value.default,
      nullable: column.type.nullable,
      comment: comment ? String(comment) : undefined  
    };
  } else if (type === 'time') {
    return {
      type: 'TIME',
      default: column.value.default,
      nullable: column.type.nullable,
      comment: comment ? String(comment) : undefined
    };
  //if it's an enum
  } else if (column.type.enum) {
    return {
      type: 'VARCHAR',
      length: 255,
      default: column.value.default,
      nullable: column.type.nullable,
      comment: comment ? String(comment) : undefined
    };
  }

  return false;
};

/**
 * Determines the numeric data of a column based on its 
 * attributes, such as min, max, step, and the length of 
 * the integer and decimal parts
 */
export function getNumberInfo(column: Column) {
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
};

/**
 * Generates a create query in runtime
 * This is used for migration scripts
 */
export function makeCreateQuery(
  model: Model,
  onDelete: 'CASCADE'|'SET NULL'|'RESTRICT' = 'CASCADE',
  onUpdate: 'CASCADE'|'SET NULL'|'RESTRICT' = 'RESTRICT'
) {
  const schema = new Create(model.name.snakeCase);
  for (const column of model.columns.values()) {
    //schema.addField(column.name.snakeCase, {})...
    const fieldSetup = getFieldSetup(column);
    if (fieldSetup) {
      schema.addField(column.name.snakeCase, fieldSetup as Field);
    }
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

/**
 * Determines the order to drop or create tables based on their 
 * foreign key relationships. 
 * 
 * If creating, then you should reverse the results...
 */
export function arrangeModelSequence(models: Model[]) {
  //LOGIC FOR DROPPING:
  //We can't drop a table if there is another table with a FK contraint
  //so we need to loop through all the tables multiple times, dropping 
  //the ones that don't have FK constraints, until all tables are dropped
  //
  //LOGIC FOR CREATING:
  //We cant create a table with a FK constraint if the table it depends 
  //on hasn't been created yet. So we need to loop through all the 
  //tables multiple times, creating the ones that don't have FK 
  //constraints, until all tables are created....
  //or, logically this is the dropped table list in reverse.
  const sequence: Model[] = [];
  while (sequence.length < models.length) {
    const floating = models.filter(
      //model doesn't exist in the sequence
      model => !sequence.find(order => order.name === model.name)
    );
    //loop through all the existing table create schemas
    for (const model of floating) {
      //does any of the existing tables depend on this table?
      const dependents = floating.filter(
        float => float.store.foreignRelationships
          .map(column => column.type.name)
          .find(table => table === model.name.toString())
      );
      //if no dependents, then we can drop the table
      if (!dependents.length) {
        //add to the dropped list
        sequence.push(model);
      }
    }
  }
  return sequence;
};