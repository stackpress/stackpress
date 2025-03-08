//root
import Exception from '../Exception';
//schema
import type Model from '../schema/spec/Model';

/**
 * Wraps any errors or exceptions in a reponse payload. 
 * This is for prisma, instead of throwing errors
 * 
 * Example: `const response = errorToResponse(e)`
 * Example: `await prisma.create().catch(errorToResponse)`
 */
export function toErrorResponse(e: Error|Exception, code = 400) {
  //@ts-ignore Property 'toResponse' does not exist on type 'Error'.
  if (typeof e.toResponse !== 'function') {
    e = Exception.upgrade(e, code);
  }
  const error = e as Exception;
  return error.toResponse();
};

/**
 * Wraps any results in a reponse payload. 
 * This is for prisma, instead of throwing errors
 * 
 * Example: `await prisma.create().then(resultsToResponse)`
 */
export function toResponse(results: any, total?: number) {
  if (typeof total === 'number') {
    return { code: 200, status: 'OK', results, total: total as number };
  }
  return { code: 200, status: 'OK', results };
};

/**
 * Formats an inputted value to an acceptable SQL string
 */
export function toSqlString<
  Strict = string|null|undefined
>(value: any, strict = false): Strict {
  if (typeof value === 'undefined') {
    return (strict ? '': undefined) as Strict;
  } else if (value === null) {
    return (strict ? '': null) as Strict;
  } else if (typeof value === 'object') {
    return JSON.stringify(value) as Strict;
  }
  return value.toString() as Strict;
}

/**
 * Formats an inputted value to an acceptable SQL boolean
 */
export function toSqlBoolean<
  Strict = boolean|null|undefined
>(value: any, strict = false): Strict {
  if (typeof value === 'undefined') {
    return (strict ? false: undefined) as Strict;
  } else if (value === null) {
    return (strict ? false: null) as Strict;
  }
  return Boolean(value) as Strict;
}

/**
 * Formats an inputted value to an acceptable SQL date string
 */
export function toSqlDate<
  Strict = Date|null|undefined
>(value: any, strict = false): Strict {
  if (!strict) {
    if (typeof value === 'undefined') {
      return undefined as Strict;
    } else if (value === null) {
      return null as Strict;
    }
  }
  
  let date = value instanceof Date ? value : new Date(value);
  //if invalid date
  if (isNaN(date.getTime())) {
    //soft error
    date = new Date(0);
  }

  return date as Strict;
}

/**
 * Formats an inputted value to an acceptable SQL integer
 */
export function toSqlInteger<
  Strict = number|null|undefined
>(value: any, strict = false): Strict {
  if (typeof value === 'undefined') {
    return (strict ? 0: undefined) as Strict;
  } else if (value === null) {
    return (strict ? 0: null) as Strict;
  }
  return (parseInt(value) || 0) as Strict;
}

/**
 * Formats an inputted value to an acceptable SQL float
 */
export function toSqlFloat<
  Strict = number|null|undefined
>(value: any, strict = false): Strict {
  if (typeof value === 'undefined') {
    return (strict ? 0: undefined) as Strict;
  } else if (value === null) {
    return (strict ? 0: null) as Strict;
  }
  return (parseFloat(value) || 0) as Strict;
}

export function sequence(models: Model[]) {
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
      const dependents = floating.filter(float => float.relations
        .map(column => column.type)
        .find(table => table === model.name)
      );
      //if no dependents, then we can drop the table
      if (!dependents.length) {
        //add to the dropped list
        sequence.push(model);
      }
    }
  }
  return sequence;
}