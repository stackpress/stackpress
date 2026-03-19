//modules
import type { SourceFile, ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { renderCode } from '../../../schema/transform/helpers.js';

export default function generate(
  source: SourceFile,
  model: Model,
  definition: ClassDeclaration
) {
  //relations like this: (foriegn keys)
  // owner User @relation({ name "connections" local "userId" foreign "id" })
  //not like this: (local keys)
  // users User[]
  const relations = model.store.foreignRelationships;
  
  //import type { FlatValue } from '@stackpress/inquire/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/types',
    namedImports: [ 'FlatValue' ]
  });
  //import Select from '@stackpress/inquire/Select';
  source.addImportDeclaration({
    defaultImport: 'Select',
    moduleSpecifier: '@stackpress/inquire/Select'
  });
  //public select(query: StoreSelectQuery = {}, q = '"') {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'select',
    parameters: [
      { name: 'query', type: 'StoreSelectQuery', initializer: '{}' }, 
      { name: 'q', initializer: `'"'` }
    ],
    statements: renderCode(TEMPLATE.SELECT, {
      extended: model.name.toTypeName('%sExtended')
    })
  });
  //public getColumnInfo(selector: string) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'getColumnInfo',
    parameters: [{ name: 'selector', type: 'string' }],
    statements: TEMPLATE.GET_COLUMN_INFO
  });
  //public getColumnJoins(selector: string, index = 0, joins: StoreSelectJoinMap = {}) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'getColumnJoins',
    parameters: [
      { name: 'selector', type: 'string' },
      { name: 'index', type: 'number', initializer: '0' },
      { name: 'joins', type: 'StoreSelectJoinMap', initializer: '{}' }
    ],
    statements: renderCode(TEMPLATE.GET_COLUMN_JOINS, {
      relations: relations.size > 0
    })
  });
  //public getColumnPath(selector: string, path: Array<SearchPath> = []) {}
  definition.addMethod({
    name: 'getColumnPath',
    scope: Scope.Public,
    parameters: [
      { name: 'selector', type: 'string' },
      { 
        name: 'path', 
        type: `Array<StoreSelectColumnPath>`, 
        initializer: '[]' 
      }
    ],
    returnType: `Array<StoreSelectColumnPath>`,
    statements: renderCode(TEMPLATE.GET_COLUMN_PATH, {
      relations: relations.size > 0
    })
  });
  //public getColumnSelectors(column: string, prefixes: string[] = []) {}
  definition.addMethod({
    name: 'getColumnSelectors',
    scope: Scope.Public,
    parameters: [
      { name: 'column', type: 'string' },
      { name: 'prefixes', type: 'string[]', initializer: '[]' }
    ],
    statements: renderCode(TEMPLATE.GET_COLUMN_SELECTORS, {
      relations: relations.size > 0
    })
  });
  //public where(query: StoreSelectFilters = {}, q = '"') {}
  definition.addMethod({
    name: 'where',
    scope: Scope.Public,
    parameters: [
      { name: 'query', type: 'StoreSelectFilters', initializer: '{}' }, 
      { name: 'q', initializer: `'"'` }
    ],
    statements: renderCode(TEMPLATE.WHERE, {
      searchable: model.columns.filter(column => column.store.searchable).size > 0,
      searchables: model.columns
        .filter(column => column.store.searchable)
        .map(column => ({ column: column.name.toString() }))
        .toArray(),
      active: model.columns.findValue(column => column.store.active)?.name.toString()
    })
  });
};

export const TEMPLATE = {

SELECT:
`//extract params
let {
  q: keywords,
  columns = [ '*' ],
  filter = {},
  span = {},
  sort = {},
  skip = 0,
  take = 50
} = query;
//valid columns: 
// - createdAt
// - user.emailAddress
// - user.address.streetName
// - user.address.*
// - user.*
// - *
//reference: user User @relation({ local "userId" foreign "id" })
columns = columns.map(column => this.getColumnSelectors(column)).flat();
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
  .map(column => this.getColumnInfo(column))
  .filter(column => column.path.length > 0);
//make a selectors map
const selectors = info.map(selector => {
  const column = selector.table.length > 0
    ? \`\${q}\${selector.table}\${q}.\${q}\${selector.column}\${q}\`
    : \`\${q}\${this.table}\${q}.\${q}\${selector.column}\${q}\`;

  //address.street_name AS user__address__street_name
  return \`\${column} AS \${q}\${selector.alias}\${q}\`;
});

//finally, make the select builder
const select = new Select<<%extended%>>(selectors).from(this.table);
//make a joins map
const joins: StoreSelectJoinMap = {};
info.forEach(selector => Object.assign(joins, selector.joins));
Object.values(joins).forEach(({ table, from, to, alias }) => select.join(
  'inner', 
  table, 
  from.replaceAll('.', \`\${q}.\${q}\`), 
  to.replaceAll('.', \`\${q}.\${q}\`),
  alias
));
//if skip
if (skip) {
  select.offset(skip);
}
//if take
if (take) {
  select.limit(take);
}
//where
const where = this.where({ q: keywords, filter, span }, q);
if (where.clause) {
  select.where(where.clause, where.values);
}
//sort
Object.entries(sort).forEach(([ key, value ]) => {
  const direction = typeof value === 'string' ? value : '';
  if (direction.toLowerCase() !== 'asc' 
    && direction.toLowerCase() !== 'desc'
  ) {
    return;
  }
  const info = this.getColumnInfo(key).last;
  if (!info) return;
  //NOTE: inquire already adds the quotes around the column name
  const selector = \`\${info.store.table}\${q}.\${q}\${info.column}\`;
  select.order(selector, direction.toUpperCase() as 'ASC' | 'DESC');
});

return select;`,

GET_COLUMN_INFO:
`//ex. group.owner.address.streetName
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
const table = getAlias(selector.substring(0, selector.lastIndexOf(".")));
//street_name
const column = getAlias(selector.substring(selector.lastIndexOf(".") + 1));
//group__owner__address__street_name
const alias = getAlias(selector);
const path = this.getColumnPath(selector);
const last = path[path.length - 1];
//group as group ON (product.group_id = group.id)
//user as group__owner ON (group.owner_id = group__owner.id)
//address as group__owner__address ON (group__owner.address_id = group__owner__address.id)
const joins = this.getColumnJoins(selector);

return { name, table, column, alias, path, last, joins };`,

GET_COLUMN_JOINS:
`//ex. group.owner.address.streetName
//group as group ON (product.group_id = group.id)
//user as group__owner ON (group.owner_id = group__owner.id)
//address as group__owner__address ON (group__owner.address_id = group__owner__address.id)

//[ group, owner, address, streetName ]
const selectors = selector.split(".");
//if we are at the end of the selectors
if (selectors.length === index + 1) {
  return joins;
}
//group, group__owner, group__owner__address
const alias = {
  parent: getAlias(selectors.slice(0, index).join(".")),
  child: getAlias(selectors.slice(0, index + 1).join(".")),
};
if (alias.parent.length > 0) {
  alias.parent += '.';
} else {
  alias.parent = this.table + '.';
}
<%#relations%>
  //model: product -> group
  const relation = this.relations[
    selectors[index] as keyof typeof this.relations
  ];
  //if there is a relation
  if (relation) {
    //get the table (should be the parent table)
    const table = relation.store.table;
    //get the from (should be the child column)
    const from = \`\${alias.parent}\${relation.local}\`;
    //get the to (should be the parent column)
    const to = \`\${alias.child}.\${relation.foreign}\`;
    //make a record key
    const key = \`INNER JOIN \${table} AS \${alias.child} ON (\${from} = \${to})\`;
    //add the join to the joins
    joins[key] = { table, from, to, alias: alias.child };
    //return the join info
    return relation.store.getColumnJoins(selector, index + 1, joins);
  }
<%/relations%>
return joins;`,

GET_COLUMN_PATH:
`//ex. user.address.streetName
const selectors = selector.split(".");
//ex. user or address or streetName
const column = selectors[0];
<%^relations%>
//if no column (this would happen if the column is not in the schema)
if (!(column in this.columns)) {
  //return an empty array signifying that the selector is invalid
  return [];
  //if there is only one selector
  //ex. streetName
} else if (selectors.length === 1) {
  return path.concat([{ type: 'column', column, store: this }]);
}
<%/relations%>
<%#relations%>
  if (column in this.columns) {
    if (selectors.length === 1) {
      return path.concat([{ type: 'column', column, store: this }]);
    } else if (selectors.length === 1) {
      return path.concat([{ type: 'column', column, store: this }]);
    }
  //there are at least 2 selectors
  //ex. user.address.streetName
  //ex. address.streetName
  //if selector is a relation
  } else if (column in this.relations) {
    const relation = column as keyof typeof this.relations;
    return this.relations[relation].store.getColumnPath(
      selectors.slice(1).join("."),
      path.concat([{ type: 'relation', column, store: this }])
    );
  }
<%/relations%>
//return an empty array signifying that the selector is invalid
return [];`,

GET_COLUMN_SELECTORS:
`const prefix = prefixes.length > 0 
  ? prefixes.join('.') + '.'
  : '';
if (column === '*') {
  return Object.keys(this.columns).map(
    column => \`\${prefix}\${column}\`
  );
}
<%#relations%>
  const path = column.split('.');
  if (path.length > 1 && path[0] in this.relations) {
    const relation = path[0] as keyof typeof this.relations;
    return this.relations[relation].store.getColumnSelectors(
      path.slice(1).join('.'), 
      [ ...prefixes, path[0] ]
    );
  }
<%/relations%>
if (prefixes.length > 0) {
  return [ \`\${prefixes.join('.')}.\${column}\` ];
}
return [ column ];`,

WHERE:
`//extract params
<%#searchable%>
  let { q: keywords, filter = {}, span = {} } = query;
<%/searchable%>
<%^searchable%>
  let { filter = {}, span = {} } = query;
<%/searchable%>
const where: string[] = [];
const values: FlatValue[] = [];
<%#searchable%>
  //searchable
  if (keywords) {
    where.push(\`(\${[
      <%#searchables%>
        '<%column%> ILIKE ?',
      <%/searchables%>
    ].join(' OR ')})\`);
    values.push(...[
      <%#searchables%>
        \`%\${keywords}%\`,
      <%/searchables%>
    ]);
  }
<%/searchable%>

//default active value
<%#active%>
  const name = '<%active%>';
  if (typeof filter[name] === 'undefined') {
    filter = { ...filter, [name]: true };
  } else if (filter[name] == -1) {
    filter = { ...filter, [name]: -1 };
    delete filter[name];
  }
<%/active%>
//filters
Object.entries(filter).forEach(([ key, value ]) => {
  const info = this.getColumnInfo(key).last;
  if (!info) return;
  const selector = \`\${q}\${info.store.table}\${q}.\${q}\${getAlias(info.column)}\${q}\`;
  const serialized = info.store.columns[info.column].serialize(value, true);
  if (typeof serialized !== 'undefined' 
    && serialized !== null 
    && serialized !== ''
  ) {
    const scalar = this.toSqlValue(info.column, serialized);
    if (typeof scalar !== 'undefined') {
      where.push(\`\${selector} = ?\`);
      values.push(scalar);
    }
  }
});
//spans
Object.entries(span).forEach(([ key, values ]) => {
  const info = this.getColumnInfo(key).last;
  if (!info) return;
  const selector = \`\${q}\${info.store.table}\${q}.\${q}\${getAlias(info.column)}\${q}\`;
  if (typeof values[0] !== 'undefined'
    && values[0] !== null
    && values[0] !== ''
  ) {
    const serialized = info.store.columns[info.column].serialize(values[0], true);
    if (typeof serialized !== 'undefined' 
      && serialized !== null
      && serialized !== ''
    ) {
      const scalar = this.toSqlValue(info.column, serialized);
      if (typeof scalar !== 'undefined') {
        where.push(\`\${selector} >= ?\`);
        values.push(scalar);
      }
    }
  }
  if (typeof values[1] !== 'undefined'
    && values[1] !== null
    && values[1] !== ''
  ) {
    const serialized = info.store.columns[info.column].serialize(values[1], true);
    if (typeof serialized !== 'undefined' 
      && serialized !== null
      && serialized !== ''
    ) {
      const scalar = this.toSqlValue(info.column, serialized);
      if (typeof scalar !== 'undefined') {
        where.push(\`\${selector} <= ?\`);
        values.push(scalar);
      }
    }
  }
});
return { clause: where.join(' AND '), values };`

};