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

  //------------------------------------------------------------------//
  // Import Modules
  
  //import type { WhereBuilder } from '@stackpress/inquire/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/types',
    namedImports: [ 'WhereBuilder' ]
  });
  //import Select from '@stackpress/inquire/Select';
  source.addImportDeclaration({
    defaultImport: 'Select',
    moduleSpecifier: '@stackpress/inquire/Select'
  });

  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Store Methods

  //public select<T = AuthExtended>(query: StoreSelectQuery = {}, q = '"') {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'select',
    typeParameters: [
      { name: 'T', default: model.name.toTypeName('%sExtended') }
    ],
    parameters: [
      { name: 'query', type: 'StoreSelectQuery', initializer: '{}' },
      { name: 'q', initializer: `'"'` }
    ],
    statements: renderCode(TEMPLATE.SELECT, {
      relations: relations.size > 0
    })
  });
  //public selectors(expression: string|string[]) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'selectors',
    parameters: [
      { name: 'expression', type: 'string | string[]' }
    ],
    statements: TEMPLATE.SELECTORS
  });
  //public joins(query: StoreSelectQuery) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'joins',
    parameters: [{ 
      name: relations.size > 0 ? 'query': '_query', 
      type: 'StoreSelectQuery' 
    }],
    statements: relations.size > 0 ? TEMPLATE.JOINS : 'return [];'
  });
  //public paths(expression: string, paths: StorePath[] = []): StorePath[] {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'paths',
    parameters: [
      { name: 'expression', type: 'string' },
      { name: 'paths', type: 'StorePath[]', initializer: '[]' }
    ],
    returnType: 'StorePath[]',
    statements: renderCode(TEMPLATE.PATHS, {
      relations: relations.size > 0
    })
  });
  //public where(builder: WhereBuilder, query: StoreSelectFilters = {}, q = '"') {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'where',
    parameters: [
      { name: 'builder', type: 'WhereBuilder' },
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
  //public whereEquals(builder: WhereBuilder, expression: string, value: unknown, q = '"') {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'whereEquals',
    parameters: [
      { name: 'builder', type: 'WhereBuilder' },
      { name: 'expression', type: 'string' },
      { name: 'value', type: 'unknown' },
      { name: 'q', initializer: `'"'` }
    ],
    statements: TEMPLATE.WHERE_EQUALS
  });
  //public whereLike(builder: WhereBuilder, expression: string, value: unknown, q = '"') {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'whereLike',
    parameters: [
      { name: 'builder', type: 'WhereBuilder' },
      { name: 'expression', type: 'string' },
      { name: 'value', type: 'unknown' },
      { name: 'q', initializer: `'"'` }
    ],
    statements: TEMPLATE.WHERE_LIKE
  });
  //public whereNotEquals(builder: WhereBuilder, expression: string, value: unknown, q = '"') {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'whereNotEquals',
    parameters: [
      { name: 'builder', type: 'WhereBuilder' },
      { name: 'expression', type: 'string' },
      { name: 'value', type: 'unknown' },
      { name: 'q', initializer: `'"'` }
    ],
    statements: TEMPLATE.WHERE_NOT_EQUALS
  });
  //public whereGreaterEquals(builder: WhereBuilder, expression: string, value: unknown, q = '"') {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'whereGreaterEquals',
    parameters: [
      { name: 'builder', type: 'WhereBuilder' },
      { name: 'expression', type: 'string' },
      { name: 'value', type: 'unknown' },
      { name: 'q', initializer: `'"'` }
    ],
    statements: TEMPLATE.WHERE_GREATER_EQUALS
  });
  //public whereLessEquals(builder: WhereBuilder, expression: string, value: unknown, q = '"') {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'whereLessEquals',
    parameters: [
      { name: 'builder', type: 'WhereBuilder' },
      { name: 'expression', type: 'string' },
      { name: 'value', type: 'unknown' },
      { name: 'q', initializer: `'"'` }
    ],
    statements: TEMPLATE.WHERE_LESS_EQUALS
  });
  //public whereArrayContains(builder: WhereBuilder, expression: string, value: unknown) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'whereArrayContains',
    parameters: [
      { name: 'builder', type: 'WhereBuilder' },
      { name: 'expression', type: 'string' },
      { name: 'value', type: 'unknown' }
    ],
    statements: TEMPLATE.WHERE_ARRAY_CONTAINS
  });
  //public whereArrayNotContains(builder: WhereBuilder, expression: string, value: unknown) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'whereArrayNotContains',
    parameters: [
      { name: 'builder', type: 'WhereBuilder' },
      { name: 'expression', type: 'string' },
      { name: 'value', type: 'unknown' }
    ],
    statements: TEMPLATE.WHERE_ARRAY_NOT_CONTAINS
  });
  //protected _whereValues(builder: WhereBuilder, clause: string, value: unknown, path: StorePath) {}
  definition.addMethod({
    scope: Scope.Protected,
    name: '_whereValues',
    parameters: [
      { name: 'builder', type: 'WhereBuilder' },
      { name: 'clause', type: 'string' },
      { name: 'value', type: 'unknown' },
      { name: 'path', type: 'StorePath' }
    ],
    statements: TEMPLATE.WHERE_VALUES
  });
};

export const TEMPLATE = {

SELECT:
`//extract params
//possible column patterns:
// - createdAt
// - user.emailAddress
// - user.address.streetName
// - user.address.*
// - user.*
// - *
let {
  columns = [ '*' ],
  sort = {},
  skip = 0,
  take = 50
} = query;
//get all selectors based on the provided columns
//example selector:
// - alias: category__article__ratings__feedback_note__author__data__references__google_id
// - selector: [ category, article, ratings, feedback_note, author, data ]
// - parents: [ category, article, ratings, feedback_note ]
// - table: author
// - column: data
// - json: [ references, googleId ]
// - path: StorePath
const selectors = this
  .selectors(columns)
  .filter(selector => selector.column.length > 0)
  .map(selector => {
    //ex. category__article__ratings__feedback_note__author
    const table = selector.parents.filter(Boolean).join('__');
    //ex. data
    const column = selector.column;
    //category__article__ratings__feedback_note__author__data__references__google_id
    const alias = selector.alias;
    return table && alias !== column
      ? { table, column, alias } 
      : table
      ? { table, column }
      : alias !== column
      ? { table: this.table, column, alias }
      : { table: this.table, column };
  });

//finally, make the select builder
const select = new Select<T>(selectors).from({ name: this.table });
<%#?:relations%>
  //add all the joins
  this.joins(query).forEach(join => {
    const { type, table, alias } = join;
    select.join(
      type, 
      table !== alias ? { name: table, alias } : { name: table },
      { table: join.from.table, name: join.from.column },
      { table: join.to.table, name: join.to.column }
    );
  });
<%/?:relations%>
//if skip
if (skip) {
  select.offset(skip);
}
//if take
if (take) {
  select.limit(take);
}
//where
this.where(select, query, q);
//sort
Object.entries(flatten(sort, true)).forEach(([key, value]) => {
  const direction = typeof value === 'string' ? value : '';
  if (direction.toLowerCase() !== 'asc' 
    && direction.toLowerCase() !== 'desc'
  ) {
    return;
  }
  //get the selector for the sort key
  const selector = this.selectors(key)[0];
  //if no selector found, skip
  if (!selector) return;
  const order = direction.toUpperCase() as 'ASC' | 'DESC';
  if (selector.json.length > 0) {
    const column = selector.table
      ? \`\${selector.table}.\${selector.column}:\${selector.json.join('.')}\`
      : \`\${selector.column}:\${selector.json.join('.')}\`;
    select.order({ name: column }, order);
  } else if (selector.table) {
    select.order({
      table: selector.parents.join('__'), 
      name: selector.column
    }, order);
  } else {
    select.order({ name: selector.column }, order);
  }
});

return select;`,

//public selectors(expression: string|string[]) {}
SELECTORS:
`if (!Array.isArray(expression)) {
  expression = [ expression ];
}
const selectors = new Map<string, StoreSelector>();
expression.forEach(expression => {
  //if the selector has already been parsed, then we can skip
  if (selectors.has(expression)) return;
  //IF: category.article.ratings.feedbackNote.author.data:references.googleId
  //   |                           expression                                |
  //   |                    selector                     |        json       |
  //   |    parents     | table |   column   | children  |        json       |
  //collection all the expression paths
  const paths = this.paths(expression);
  //get the first and last path
  const first = paths[0];
  const last = paths[paths.length - 1];
  if (!first || !last) return;
  const path = {
    //use the first path as the basis
    ...first,
    //column
    type: 'column',
    //use the last parents
    parents: last.parents,
    //use the last table
    table: last.table,
    //use the last column 
    column: last.column,
    //use the last store
    store: last.store
  };
  //if last path is a wildcard
  if (last.type === 'wildcard') {
    //expand * to all columns in the last store
    Object.keys(last.store.columns).forEach(name => {
      const expression = path.expression.replace('*', name);
      const newPath = {
        ...path,
        expression,
        //[ feedbackNote, author, data ]
        selector: [ ...path.selector.slice(0, -1), name ],
        //feedbackNote
        column: name,
      };
      const alias = storePathToAlias(newPath);
      selectors.set(expression, {
        //category__article__ratings__feedback_note__author__data__references__google_id
        alias: alias.expression,
        //[ category, article, ratings, feedback_note, author, data ]
        selector: alias.selector,
        //[ category, article, ratings, feedback_note ]
        parents: alias.parents,
        //author
        table: alias.table,
        //data
        column: alias.column,
        //[ references, googleId ]
        json: [ ...newPath.json ],
        path: newPath
      });
    });
    return;
  }
  const alias = storePathToAlias(path);
  selectors.set(expression, {
    //category__article__ratings__feedback_note__author__data__references__google_id
    alias: alias.expression,
    //[ category, article, ratings, feedback_note, author, data ]
    selector: alias.selector,
    //[ category, article, ratings, feedback_note ]
    parents: alias.parents,
    //author
    table: alias.table,
    //data
    column: alias.column,
    //[ references, googleId ]
    json: [ ...path.json ],
    path
  });
});
return Array.from(selectors.values());`,

//public joins(query: StoreSelectQuery) {}
JOINS:
`const {
  columns = [ '*' ],
  eq = {},
  ne = {},
  ge = {},
  le = {},
  has = {},
  like = {},
  hasnt = {},
  sort = {}
} = query;
const expressions = new Set([
  ...Array.isArray(columns) ? columns : [ columns ],
  ...Object.keys(flatten(eq, true)),
  ...Object.keys(flatten(ne, true)),
  ...Object.keys(flatten(ge, true)),
  ...Object.keys(flatten(le, true)),
  ...Object.keys(flatten(has, true)),
  ...Object.keys(flatten(like, true)),
  ...Object.keys(flatten(hasnt, true)),
  ...Object.keys(flatten(sort, true)),
]);
const joins = new Map<string, StoreJoin>();
expressions.forEach(expression => {
  //possible column patterns:
  // - createdAt
  // - user.emailAddress
  // - user.address.streetName
  // - user.address.*
  // - user.*
  // - *
  //if auth.userProfile.addressLocation.references.googleId
  //THEN:
  // - type: inner, left, right, outer, etc
  // - table: ex. user_profile
  // - alias: auth__user_profile
  // - from: { table: string, column: string }
  //   ex. auth__user_profile.id
  // - to: { table: string, column: string }
  //   ex. auth.profile_id  
  this.paths(expression).forEach(path => {
    //if this particular path in the list of expressions (2D array)
    // is not a relation, then we can skip because it doesn't 
    // require a join.
    if (!(path.column in path.store.relations)) return;
    //get the relation
    const relation = path.store.relations[path.column];
    //ex. path.store == Auth -> profile: 
    // - store: ProfileStore, 
    // - local: profile_id, 
    // - foreign: id
    // - multiple: true
    // - required: false
    const type = relation.type[0] === 0 ? 'left' : 'inner';
    const table = relation.store.table;
    const fromTable = path.parents.map(getAlias).join('__');
    const toTable = [ ...path.parents, table ].map(getAlias).join('__');
    const alias = toTable;
    const from = { table: fromTable, column: relation.local };
    const to = { table: toTable, column: relation.foreign };
    joins.set(
      [ table, from.column, to.table, to.column, alias ].join('-'), 
      { type, table, alias, from, to }
    );
  });
});
return Array.from(joins.values());`,

//public paths(expression: string, paths: StorePath[] = []): StorePath[] {}
PATHS:
`//IF: category.article.ratings.feedbackNote.author.data:references.googleId
//                                  ^
//   |                           expression                                |
//   |                    selector                     |        json       |
//   |    parents     | table |   column   | children  |        json       |
const [ selector = '', json = '' ] = expression.split(':');
const children = selector.split('.');
const column = children.shift();
//failsafe
if (!column) return paths;
const parents = [ ...paths.map(path => path.column), this.table ];
const table = parents.pop()!;
const path = {
  //feedbackNote.author.data:references.googleId
  expression,
  //[ feedbackNote, author, data ]
  selector: selector.split('.'),
  //[ category, article ]
  parents,
  //ratings
  table,
  //feedbackNote
  column,
  //[ author, data ]
  children,
  //[]
  json: json.split('.').filter(Boolean),
  store: this
};
//if wildcard
if (column && column === '*') {
  return paths.concat([{ type: 'wildcard', ...path }]);
//if this is a column in the store
} else if (column && column in this.columns) {
  //then return the path with the column selector appended
  //NOTE: doesn't make sense for the next expression
  // to be another column or relation...
  return paths.concat([{ type: 'column', ...path }]);
} 
<%#?:relations%>
  if (column && column in this.relations) {
    //if this is a relation in the store
    const relation = this.relations[
      column as keyof typeof this.relations
    ];
    return relation.store.paths(
      //from: auth.userProfile.addressLocation:references.googleId
      //  to: userProfile.addressLocation:references.googleId
      selector.substring(selector.indexOf('.') + 1), 
      paths.concat([{ type: 'relation', ...path }])
    );
  }
<%/?:relations%>
return paths;`,

//public where(builder: WhereBuilder, query: StoreSelectFilters = {}) {}
WHERE:
`<%#?:active%>
  //extract params
  const {
    ne = {},
    ge = {},
    le = {},
    has = {},
    like = {},
    hasnt = {}
  } = query
  const eq = { ...(query.eq || {}) };
  //default active value
  const name = '<%active%>';
  if (typeof eq[name] === 'undefined') {
    builder.where(
      \`\${q}\${this.table}\${q}.\${q}\${name}\${q} = ?\`, 
      [ true ]
    );
  } else if (eq[name] === -1) {
    delete eq[name];
  }
<%|%>
//extract params
const {
  eq = {},
  ne = {},
  ge = {},
  le = {},
  has = {},
  like = {},
  hasnt = {}
} = query;
<%/?:active%>
<%#?:searchable%>
  //searchable
  if (query.q) {
    builder.where(
      \`(\${[
        <%#@:searchables%>
          \`\${q}\${this.table}\${q}.\${q}<%column%>\${q} ILIKE ?\`,
        <%/@:searchables%>
      ].join(' OR ')})\`,
      [
        <%#@:searchables%>
          \`%\${query.q}%\`,
        <%/@:searchables%>
      ]
    );
  }
<%/?:searchable%>
//eq
Object.entries(flatten(eq, true)).forEach(
  ([ key, value ]) => this.whereEquals(builder, key, value, q)
);
//like
Object.entries(flatten(like, true)).forEach(
  ([ key, value ]) => this.whereLike(builder, key, value, q)
);
//ne
Object.entries(flatten(ne, true)).forEach(
  ([ key, value ]) => this.whereNotEquals(builder, key, value, q)
);
//ge
Object.entries(flatten(ge, true)).forEach(
  ([ key, value ]) => this.whereGreaterEquals(builder, key, value, q)
);
//le
Object.entries(flatten(le, true)).forEach(
  ([ key, value ]) => this.whereLessEquals(builder, key, value, q)
);
//has
Object.entries(flatten(has, true)).forEach(
  ([ key, value ]) => this.whereArrayContains(builder, key, value)
);
//hasnt
Object.entries(flatten(hasnt, true)).forEach(
  ([ key, value ]) => this.whereArrayNotContains(builder, key, value)
);
return builder;`,

//public whereEquals(builder: WhereBuilder, expression: string, value: unknown) {}
WHERE_EQUALS:
`//get selector from the expression
const selector = this.selectors(expression)[0];
//skip if no selector
if (!selector) return;
//get sql column
const column = storeSelectorToSqlSelector(selector, q);
//skip if no column
if (!column) return;
//for the sql clause
const clause = \`\${column} = ?\`;
//bind clause to each value
this._whereValues(builder, clause, value, selector.path);`,

//public whereLike(builder: WhereBuilder, expression: string, value: unknown) {}
WHERE_LIKE:
`//get selector from the expression
const selector = this.selectors(expression)[0];
//skip if no selector
if (!selector) return;
//get sql column
const column = storeSelectorToSqlSelector(selector, q);
//skip if no column
if (!column) return;
//for the sql clause
const clause = \`\${column} ILIKE ?\`;
const values = !Array.isArray(value) ? [value] : value;
const likeValues = values.map(
  value => typeof value === 'string' ? \`%\${value}%\` : value
);
//bind clause to each value
this._whereValues(builder, clause, likeValues, selector.path);`,

//public whereNotEquals(builder: WhereBuilder, expression: string, value: unknown) {}
WHERE_NOT_EQUALS:
`//get selector from the expression
const selector = this.selectors(expression)[0];
//skip if no selector
if (!selector) return;
//get sql column
const column = storeSelectorToSqlSelector(selector, q);
//skip if no column
if (!column) return;
//for the sql clause
const clause = \`\${column} != ?\`;
//bind clause to each value
this._whereValues(builder, clause, value, selector.path);`,

//public whereGreaterEquals(builder: WhereBuilder, expression: string, value: unknown) {}
WHERE_GREATER_EQUALS:
`//get selector from the expression
const selector = this.selectors(expression)[0];
//skip if no selector
if (!selector) return;
//get sql column
const column = storeSelectorToSqlSelector(selector, q);
//skip if no column
if (!column) return;
//for the sql clause
const clause = \`\${column} >= ?\`;
//bind clause to each value
this._whereValues(builder, clause, value, selector.path);`,

//public whereLessEquals(builder: WhereBuilder, expression: string, value: unknown) {}
WHERE_LESS_EQUALS:
`//get selector from the expression
const selector = this.selectors(expression)[0];
//skip if no selector
if (!selector) return;
//get sql column
const column = storeSelectorToSqlSelector(selector, q);
//skip if no column
if (!column) return;
//for the sql clause
const clause = \`\${column} <= ?\`;
//bind clause to each value
this._whereValues(builder, clause, value, selector.path);`,

//public whereArrayContains(builder: WhereBuilder, expression: string, value: unknown) {}
WHERE_ARRAY_CONTAINS:
`builder.whereJsonContains(expression, value as JSONScalarValue);`,

//public whereArrayNotContains(builder: WhereBuilder, expression: string, value: unknown) {}
WHERE_ARRAY_NOT_CONTAINS:
`builder.whereJsonContains(expression, value as JSONScalarValue);
//builder.whereJsonNotContains(expression, value as JSONScalarValue);`,

//protected _whereValues(builder: WhereBuilder, clause: string, value: unknown, path: StorePath) {}
WHERE_VALUES:
`const { column: key, store: { columns } } = path;
//it's easier if value was an array no matter what
const values = !Array.isArray(value) ? [value] : value;
//collect OR queries
const or: StoreSelectOrWhere = { clause: [], values: [] };
//for each value
for (const value of values) {
  //serialize it
  const serialized = path.json.length > 0
    ? value
    : key in columns
    ? columns[key].serialize(value, true)
    : value;
  //if serialized is invalid, skip it
  if (typeof serialized === 'undefined'
    || serialized === null
    || serialized === ''
  ) continue;
  //to SQL scalar value
  const scalar = this.toSqlValue(key, serialized);
  //if scalar is invalid, skip it
  if (typeof scalar === 'undefined') continue;
  //add to OR
  or.clause.push(clause);
  or.values.push(scalar);
}
//if there's an OR
if (or.clause.length > 0 && or.values.length > 0) {
  builder.where(\`(\${or.clause.join(' OR ')})\`, or.values);
}`

};