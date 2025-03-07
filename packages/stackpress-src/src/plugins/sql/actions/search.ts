//stackpress
import type { UnknownNest, StatusResponse } from '@stackpress/lib/dist/types';
import type Engine from '@stackpress/inquire/dist/Engine';
import Nest from '@stackpress/lib/dist/data/Nest';
//schema
import type Column from '@/schema/spec/Column';
import type Model from '@/schema/spec/Model';
//local
import type { SearchParams } from '../types';
import { 
  toSqlString,
  toSqlFloat,
  toSqlInteger,
  toSqlBoolean,
  toSqlDate,
  toResponse,
  toErrorResponse
} from '../helpers';

const stringable = [ 'String', 'Text', 'Json', 'Object', 'Hash' ];
const floatable = [ 'Number', 'Float' ];
const dateable = [ 'Date', 'Time', 'Datetime' ];
const boolable = [ 'Boolean' ];
const intable = [ 'Integer' ];

export type Join = {
  table: string,
  from: string,
  to: string,
  alias: string
}

export type Path = {
  model: Model,
  column: Column
};

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

//Case Study:
// A product has a group of users that can buy it
// A group has a list of owners and members both using the user table
// A user has an address
// product -> group.owner -> user
// product -> group.member -> user 

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

export function getColumnPath(
  selector: string, 
  model: Model, 
  path: Path[] = []
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

export function getColumnJoins(
  selector: string, 
  model: Model, 
  index: number = 0,
  joins: Record<string, Join> = {}
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
  //if the column is not in the model or it's not a relation
  if (!column || !column.relation) {
    return {};
  }
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
    relation.child.model as Model, 
    index + 1,
    joins
  );
}

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

/**
 * Searches the database table
 */
export default async function search<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  query: SearchParams = {}
): Promise<StatusResponse<M[]>> {
  //extract params
  let {
    q,
    columns = [ '*' ],
    filter = {},
    span = {},
    sort = {},
    skip = 0,
    take = 50,
    total: useTotal = true
  } = query;
  //valid columns: 
  // - createdAt
  // - user.emailAddress
  // - user.address.streetName
  // - user.address.*
  // - user.*
  // - *
  //reference: user User @relation({ local "userId" foreign "id" })
  columns = columns.map(column => getColumns(column, model)).flat();
  //collect info for each column
  //ex. group.owner.address.streetName
  // - name: group.owner.address.streetName
  // - table: group__owner__address
  // - column: street_name
  // - alias: group__owner__address__street_name
  // - joins: 
  //   - group as group ON (product.group_id = group.id)
  //   - user as group__owner ON (group.owner_id = group__owner.id)
  //   - address as group__owner__address ON (group__owner.address_id = group__owner__address.id)
  
  const info = columns
    .map(column => getColumnInfo(column, model))
    .filter(column => column.path.length > 0);
  //make a selectors map
  const selectors = info.map(selector => {
    const q = engine.dialect.q;
    const column = selector.table.length > 0
      ? `${q}${selector.table}${q}.${q}${selector.column}${q}`
      : `${q}${model.snake}${q}.${q}${selector.column}${q}`;

    //address.street_name AS user__address__street_name
    return `${column} AS ${q}${selector.alias}${q}`;
  })

  //finally, make the select builder
  const select = engine.select<M>(selectors).from(model.snake);
  //also make the count builder
  const count = engine
    .select<{ total: number }>('COUNT(*) as total')
    .from(model.snake);
  //make a joins map
  const joins: Record<string, Join> = {};
  info.forEach(selector => Object.assign(joins, selector.joins));
  Object.values(joins).forEach(({ table, from, to, alias }) => {
    const q = engine.dialect.q;
    select.join(
      'inner', 
      table, 
      from.replaceAll('.', `${q}.${q}`), 
      to.replaceAll('.', `${q}.${q}`),
      alias
    );
    count.join(
      'inner', 
      table, 
      from.replaceAll('.', `${q}.${q}`), 
      to.replaceAll('.', `${q}.${q}`),
      alias
    );
  });
  //if skip
  if (skip) {
    select.offset(skip);
  }
  //if take
  if (take) {
    select.limit(take);
  }
  //searchable
  if (q && model.searchables.length > 0) {
    select.where(
      model.searchables.map(
        column => `${column.snake} ILIKE ?`
      ).join(' OR '), 
      model.searchables.map(_ => `%${q}%`)
    );
    count.where(
      model.searchables.map(
        column => `${column.snake} ILIKE ?`
      ).join(' OR '), 
      model.searchables.map(_ => `%${q}%`)
    );
  }

  //default active value
  if (model.active) {
    if(typeof filter[model.active.name] === 'undefined') {
      filter[model.active.name] = true;
    } else if (filter[model.active.name] == -1) {
      delete filter[model.active.name];
    }
  }
  //filters
  Object.entries(filter).forEach(([ key, value ]) => {
    const info = getColumnInfo(key, model).last;
    if (!info) return;
    const q = engine.dialect.q;
    const selector = `${q}${info.model.snake}${q}.${q}${info.column.snake}${q}`;
    const serialized = stringable.includes(info.column.type)
      ? toSqlString(value)
      : floatable.includes(info.column.type)
      ? toSqlFloat(value)
      : intable.includes(info.column.type)
      ? toSqlInteger(value)
      : boolable.includes(info.column.type)
      ? toSqlBoolean(value)
      : dateable.includes(info.column.type)
      ? toSqlDate(value)?.toISOString()
      : String(value);
    select.where(`${selector} = ?`, [ serialized || String(value) ]);
    count.where(`${selector} = ?`, [ serialized || String(value) ]);
  });
  //spans
  Object.entries(span).forEach(([ key, value ]) => {
    const info = getColumnInfo(key, model).last;
    if (!info) return;
    const q = engine.dialect.q;
    const selector = `${q}${info.model.snake}${q}.${q}${info.column.snake}${q}`;
    if (typeof value[0] !== 'undefined'
      && value[0] !== null
      && value[0] !== ''
    ) {
      const serialized = stringable.includes(info.column.type)
        ? toSqlString(value[0])
        : floatable.includes(info.column.type)
        ? toSqlFloat(value[0])
        : intable.includes(info.column.type)
        ? toSqlInteger(value[0])
        : boolable.includes(info.column.type)
        ? toSqlBoolean(value[0])
        : dateable.includes(info.column.type)
        ? toSqlDate(value[0])?.toISOString()
        : String(value[0]);
      select.where(`${selector} >= ?`, [ serialized || String(value[0]) ]);
      count.where(`${selector} >= ?`, [ serialized || String(value[0]) ]);
    }
    if (typeof value[1] !== 'undefined'
      && value[1] !== null
      && value[1] !== ''
    ) {
      const serialized = stringable.includes(info.column.type)
        ? toSqlString(value[1])
        : floatable.includes(info.column.type)
        ? toSqlFloat(value[1])
        : intable.includes(info.column.type)
        ? toSqlInteger(value[1])
        : boolable.includes(info.column.type)
        ? toSqlBoolean(value[1])
        : dateable.includes(info.column.type)
        ? toSqlDate(value[1])?.toISOString()
        : String(value[1]);
      select.where(`${selector} <= ?`, [ serialized || String(value[1]) ]);
      count.where(`${selector} <= ?`, [ serialized || String(value[1]) ]);
    }
  });
  //sort
  Object.entries(sort).forEach(([ key, value ]) => {
    const direction = typeof value === 'string' ? value : '';
    if (direction.toLowerCase() !== 'asc' 
      && direction.toLowerCase() !== 'desc'
    ) {
      return;
    }
    const info = getColumnInfo(key, model).last;
    if (!info) return;
    const q = engine.dialect.q;
    const selector = `${q}${info.model.snake}${q}.${q}${info.column.snake}${q}`;
    select.order(selector, direction.toUpperCase() as 'ASC' | 'DESC');
  });

  try {
    const results = await select;
    const total = useTotal ? await count : [ { total: 0 } ];
    const rows: M[] = [];
    results.forEach(row => {
      const nest = new Nest();
      //ex. created_at: "2021-01-01T00:00:00.000Z"
      //ex. user__email_address: "john@doe.com"
      //ex. user__address__street_name: "123 Main St"
      Object.entries(row).forEach(([ alias, value ]) => {
        const selector = info.find(selector => selector.alias === alias);
        if (!selector) {
          return nest.withPath.set(
            alias.trim()
              //user__address__street_name -> user.address.street_name
              .replaceAll('__', '.')
              //user.address.street_name -> user.address.streetName
              .replace(
                /([a-z])_([a-z0-9])/ig, 
                (_, a, b) => a + b.toUpperCase()
              ),
            value
          );
        }
        nest.withPath.set(
          selector.name, 
          selector.last.column.unserialize(value)
        );
      });
      rows.push(nest.get<M>());
    });
    return toResponse(rows, total[0].total) as StatusResponse<M[]>;
  } catch (e) {
    return toErrorResponse(e as Error) as StatusResponse<M[]>;
  }
};