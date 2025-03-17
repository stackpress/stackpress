//root
import type { SearchJoinMap, SearchPath } from '../types';
import Exception from '../Exception';
//schema
import type Model from '../schema/spec/Model';

//these are possible column types to map what formatter (below) to use
export const stringable = [ 'String', 'Text', 'Json', 'Object', 'Hash' ];
export const floatable = [ 'Number', 'Float' ];
export const dateable = [ 'Date', 'Time', 'Datetime' ];
export const boolable = [ 'Boolean' ];
export const intable = [ 'Integer' ];

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

/**
 * Gets all the columns, expands columns with *
 */
export function getColumns(
  column: string, 
  model: Model,
  prefixes: string[] = []
) {
  if (column === '*') {
    const columns: string[] = [];
    model.columns.forEach(column => {
      //if columns are relations
      if (column.model) {
        return;
      }
      const prefix = prefixes.length > 0 ? prefixes.join('.') + '.': '';
      //add columns as camelCase
      columns.push(`${prefix}${column.name}`);
    });
    return columns;
  }
  const path = column.split('.');
  if (path.length > 1) {
    const column = model.columns.get(path[0]);
    if (column && column.model) {
      return getColumns(
        path.slice(1).join('.'), 
        column.model, 
        [ ...prefixes, path[0] ]
      );
    }
  }
  if (prefixes.length > 0) {
    return [ `${prefixes.join('.')}.${column}` ];
  }
  return [ column ];
}

/**
 * Column info needed to create a search query dynamically
 * 
 * Case Study:
 * A product has a group of users that can buy it
 * A group has a list of owners and members both using the user table
 * A user has an address
 * product -> group.owner -> user
 * product -> group.member -> user 
 */
export function getColumnInfo(selector: string, model: Model) {
  //ex. group.owner.address.streetName
  // - name: group.owner.address.streetName
  // - table: group__owner__address
  // - column: street_name
  // - alias: group__owner__address__street_name
  // "group__owner__address"."street_name" AS "group__owner__address__street_name"
  // - from: product
  // - joins: 
  //   - group as group ON (product.group_id = group.id)
  //   - user as group__owner ON (group.owner_id = group__owner.id)
  //   - address as group__owner__address ON (group__owner.address_id = group__owner__address.id)
  
  //group.owner.address.streetName
  const name = selector;
  //group__owner__address
  const table = getAlias(
    selector.substring(0, selector.lastIndexOf('.'))
  );
  //street_name
  const column = getAlias(
    selector.substring(selector.lastIndexOf('.') + 1)
  );
  //group__owner__address__street_name
  const alias = getAlias(selector);
  const path = getColumnPath(selector, model);
  const last = path[path.length - 1];
  //group as group ON (product.group_id = group.id)
  //user as group__owner ON (group.owner_id = group__owner.id)
  //address as group__owner__address ON (group__owner.address_id = group__owner__address.id)
  const joins = getColumnJoins(selector, model);
  
  return { name, table, column, alias, path, last, joins };
}

/**
 * Validates and returns the model -> column path
 * used by `getColumnInfo()` above
 */
export function getColumnPath(
  selector: string, 
  model: Model, 
  path: SearchPath[] = []
) {
  //ex. user.address.streetName
  const selectors = selector.split('.');
  //ex. user or address or streetName
  const column = model.columns.get(selectors[0]);
  //if no column (this would happen if the column is not in the model)
  if (!column) {
    //return an empty array signifying that the selector is invalid
    return [];
  //if there is only one selector
  //ex. streetName
  } else if (selectors.length === 1) {
    return path.concat([{ model, column }]);
  }
  //there are at least 2 selectors
  //ex. user.address.streetName
  //ex. address.streetName
  //if the column is not a model
  if (!column.model) {
    //return an empty array signifying that the selector is invalid
    return [];
  }
  return getColumnPath(
    selectors.slice(1).join('.'), 
    column.model, 
    path.concat([{ model, column }])
  );
}

/**
 * Determines the joins needed to get the column
 * used by `getColumnInfo()` above
 */
export function getColumnJoins(
  selector: string, 
  model: Model, 
  index: number = 0,
  joins: SearchJoinMap = {}
) {
  //ex. group.owner.address.streetName
  //group as group ON (product.group_id = group.id)
  //user as group__owner ON (group.owner_id = group__owner.id)
  //address as group__owner__address ON (group__owner.address_id = group__owner__address.id)
  
  //[ group, owner, address, streetName ]
  const selectors = selector.split('.');
  //if we are at the end of the selectors
  if (selectors.length === (index + 1)) {
    return joins;
  }
  //group, group__owner, group__owner__address
  const alias = {
    parent: getAlias(selectors.slice(0, index).join('.')),
    child: getAlias(selectors.slice(0, index + 1).join('.'))
  };
  if (alias.parent.length > 0) {
    alias.parent += '.';
  }
  //model: product -> group
  const column = model.columns.get(selectors[index]);
  //if there is a relation
  if (column?.relation) {
    //get the relation
    const relation = column.relation;
    //get the table (should be the parent table)
    //group
    const table = relation.parent.model.snake;
    //get the from (should be the child column)
    const from = `${alias.parent}${relation.child.key.snake}`;
    //get the to (should be the parent column)
    const to = `${alias.child}.${relation.parent.key.snake}`;
    //make a record key
    const key = `INNER JOIN ${table} AS ${alias.child} ON (${from} = ${to})`;
    //add the join to the joins
    joins[key] = { table, from, to, alias: alias.child };
    //return the join info
    return getColumnJoins(
      selector,
      relation.parent.model as Model, 
      index + 1,
      joins
    );
  //if there is a related and its not multiple
  } else if (column?.related && !column?.related.parent.column.multiple) {
    //get the related
    const related = column.related;
    //get the table (should be the child table this time.)
    const table = related.child.model.snake;
    //redetermine the alias (if root it would be id, but id is ambiguous)
    //so if no alias then assume the parent table name
    const aliasParent = alias.parent || `${related.parent.model.snake}.`;
    //get the from (should be the parent column)
    const from = `${aliasParent}${related.parent.key.snake}`;
    //get the to (should be the child column)
    const to = `${alias.child}.${related.child.key.snake}`;
    //make a record key
    const key = `INNER JOIN ${table} AS ${alias.child} ON (${from} = ${to})`;
    //add the join to the joins
    joins[key] = { table, from, to, alias: alias.child };
    //return the join info
    return getColumnJoins(
      selector, 
      related.child.model as Model, 
      index + 1, 
      joins
    );
  }
  return {};
}

/**
 * Converts dot format to snake case (for an SQL query)
 * used by `getColumnInfo()` above
 */
export function getAlias(selector: string) {
  return selector.split('.').map(part => part.trim()
    //replace "someString" to "some_string"
    .replace(/([a-z])([A-Z0-9])/g, '$1_$2')
    //replace multiple lines with a single lines
    .replace(/-{2,}/g, '_')
    //trim lines from the beginning and end of the string
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
  ).join('__');
}