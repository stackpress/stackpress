//modules
import type { WhereBuilder } from '@stackpress/inquire/types';
import Alter from '@stackpress/inquire/Alter';
import Create from '@stackpress/inquire/Create';
import Delete from '@stackpress/inquire/Delete';
import Insert from '@stackpress/inquire/Insert';
import Select from '@stackpress/inquire/Select';
import Update from '@stackpress/inquire/Update';
import { jsonCompare } from '@stackpress/inquire/helpers';
//stackpress-sql
import type {
  StoreJoin,
  StorePath,
  StoreSelectFilters,
  StoreSelector,
  StoreSelectOrWhere,
  StoreSelectQuery,
  ValuePrimitive,
  ValueScalar,
  JSONScalarValue
} from 'stackpress-sql/types';
import {
  getAlias,
  flatten,
  storePathToAlias,
  storeSelectorToSqlSelector,
  toSqlString,
  toSqlBoolean,
  toSqlDate
} from 'stackpress-sql/helpers';
//stackpress-session/profile
import ProfileStore from '../profile/ProfileStore.js';
//stackpress-session/auth
import type { Auth, AuthExtended, AuthStoreInterface } from './types.js';
import AuthSchema from './AuthSchema.js';

export default class AuthStore
  extends AuthSchema
  implements AuthStoreInterface
{
  public readonly relations;
  public readonly table = 'auth';

  public constructor(seed = '') {
    super(seed);
    this.relations = {
      profile: {
        store: new ProfileStore(seed),
        local: 'profile_id',
        foreign: 'id',
        type: [1, 2] as [number, number]
      }
    };
  }

  public alter(to?: Create) {
    //if no to is provided, return an empty
    // Alter object with the current table name
    if (!to) return new Alter(this.table);

    //start comparing the current table with the new table
    const build = { from: this.create().build(), to: to.build() };
    const alter = new Alter(build.from.table);
    //remove column if not in the new table
    //find fields that exists in both tables
    //and check if they are different
    for (const name in build.from.fields) {
      if (!build.to.fields[name]) {
        alter.removeField(name);
        continue;
      }
      const from = build.from.fields[name];
      const to = build.to.fields[name];
      //check for differences
      if (
        from.type !== to.type ||
        from.length !== to.length ||
        from.nullable !== to.nullable ||
        from.default !== to.default ||
        from.autoIncrement !== to.autoIncrement ||
        from.attribute !== to.attribute ||
        from.comment !== to.comment ||
        from.unsigned !== to.unsigned
      ) {
        alter.changeField(name, to);
      }
    }
    //remove primary key if not in the new table
    for (const name of build.from.primary) {
      if (!build.to.primary.includes(name)) {
        alter.removePrimaryKey(name);
      }
    }
    //remove unique key if not in the new table
    for (const name in build.from.unique) {
      if (!build.to.unique[name]) {
        alter.removeUniqueKey(name);
        continue;
      }
      //check if the unique key is different
      if (!jsonCompare(build.from.unique[name], build.to.unique[name])) {
        alter.removeUniqueKey(name);
        alter.addUniqueKey(name, build.to.unique[name]);
      }
    }
    //remove index if not in the new table
    for (const name in build.from.keys) {
      if (!build.to.keys[name]) {
        alter.removeKey(name);
        continue;
      }
      //check if the index is different
      if (!jsonCompare(build.from.keys[name], build.to.keys[name])) {
        alter.removeKey(name);
        alter.addKey(name, build.to.keys[name]);
      }
    }
    //remove foreign key if not in the new table
    for (const name in build.from.foreign) {
      if (!build.to.foreign[name]) {
        alter.removeForeignKey(name);
        continue;
      }
      //check if the foreign key is different
      if (!jsonCompare(build.from.foreign[name], build.to.foreign[name])) {
        alter.removeForeignKey(name);
        alter.addForeignKey(name, build.to.foreign[name]);
      }
    }
    //add field if not in the old table
    for (const name in build.to.fields) {
      if (!build.from.fields[name]) {
        alter.addField(name, build.to.fields[name]);
      }
    }
    //add primary key if not in the old table
    for (const name of build.to.primary) {
      if (!build.from.primary.includes(name)) {
        alter.addPrimaryKey(name);
      }
    }
    //add unique key if not in the old table
    for (const name in build.to.unique) {
      if (!build.from.unique[name]) {
        alter.addUniqueKey(name, build.to.unique[name]);
      }
    }
    //add index if not in the old table
    for (const name in build.to.keys) {
      if (!build.from.keys[name]) {
        alter.addKey(name, build.to.keys[name]);
      }
    }
    //add foreign key if not in the old table
    for (const name in build.to.foreign) {
      if (!build.from.foreign[name]) {
        alter.addForeignKey(name, build.to.foreign[name]);
      }
    }

    return alter;
  }

  public create() {
    const schema = new Create(this.table);
    schema.addField('id', {
      type: 'VARCHAR',
      length: 255,
      nullable: false,
      comment: 'Unique generated identifier.'
    });
    schema.addField('profile_id', {
      type: 'VARCHAR',
      length: 255,
      nullable: false,
      comment: 'Profile this auth belongs to.'
    });
    schema.addField('type', {
      type: 'VARCHAR',
      length: 255,
      default: 'username',
      nullable: false,
      comment: 'Type of authentication method (username, email, phone).'
    });
    schema.addField('token', {
      type: 'VARCHAR',
      length: 255,
      nullable: false,
      comment: 'The actual username, email, or phone (depending on type)'
    });
    schema.addField('secret', {
      type: 'VARCHAR',
      length: 255,
      nullable: false,
      comment: 'Password used to verify.'
    });
    schema.addField('verified', {
      type: 'BOOLEAN',
      default: false,
      nullable: false,
      comment: 'Indicates if the type has been verified (email, phone, etc.).'
    });
    schema.addField('consumed', {
      type: 'DATETIME',
      default: 'now()',
      nullable: false,
      comment: 'Timestamp when this auth was last used.'
    });
    schema.addField('active', {
      type: 'BOOLEAN',
      default: true,
      nullable: false,
      comment:
        'Special flag to indicate active rows. Inactive rows are not shown in the list view, but can be viewed in the detail view.'
    });
    schema.addField('created', {
      type: 'DATETIME',
      default: 'now()',
      nullable: false,
      comment: 'Generated timestamp when row was created.'
    });
    schema.addField('updated', {
      type: 'DATETIME',
      default: 'now()',
      nullable: false,
      comment:
        'Generated timestamp that is updated whenever the row has changed.'
    });
    schema.addPrimaryKey('id');
    schema.addUniqueKey('auth_token_unique', 'token');
    schema.addKey('auth_profile_id_index', 'profile_id');
    schema.addKey('auth_type_index', 'type');
    schema.addKey('auth_verified_index', 'verified');
    schema.addKey('auth_consumed_index', 'consumed');
    schema.addKey('auth_active_index', 'active');
    schema.addKey('auth_created_index', 'created');
    schema.addKey('auth_updated_index', 'updated');
    schema.addForeignKey('auth_profile_id_foreign', {
      table: 'profile',
      foreign: 'id',
      local: 'profile_id',
      delete: 'CASCADE',
      update: 'RESTRICT'
    });
    return schema;
  }

  public delete(query: StoreSelectFilters = {}, q = '"') {
    //make the delete builder
    const remove = new Delete<Auth>(this.table);

    //where
    this.where(remove, query, q);

    return remove;
  }

  public insert(input: Partial<Auth>) {
    //serialize values and map filtered to the
    // relative SQL column names (snake case)
    const values = this.scalarize(input);
    //make the insert builder
    const insert = new Insert<Auth>(this.table);
    return insert.values(values).returning('*');
  }

  public select<T = AuthExtended>(query: StoreSelectQuery = {}, q = '"') {
    //extract params
    //possible column patterns:
    // - createdAt
    // - user.emailAddress
    // - user.address.streetName
    // - user.address.*
    // - user.*
    // - *
    let { columns = ['*'], sort = {}, skip = 0, take = 50 } = query;
    //get all selectors based on the provided columns
    //example selector:
    // - alias: category__article__ratings__feedback_note__author__data__references__google_id
    // - selector: [ category, article, ratings, feedback_note, author, data ]
    // - parents: [ category, article, ratings, feedback_note ]
    // - table: author
    // - column: data
    // - json: [ references, googleId ]
    // - path: StorePath
    const selectors = this.selectors(columns)
      .filter((selector) => selector.column.length > 0)
      .map((selector) => {
        //ex. category__article__ratings__feedback_note__author
        const table = selector.parents.filter(Boolean).join('__');
        //ex. data
        const column = selector.column;
        //category__article__ratings__feedback_note__author__data__references__google_id
        const alias = selector.alias;
        return (
          table && alias !== column ? { table, column, alias }
          : table ? { table, column }
          : alias !== column ? { table: this.table, column, alias }
          : { table: this.table, column }
        );
      });

    //finally, make the select builder
    const select = new Select<T>(selectors).from({ name: this.table });
    //add all the joins
    this.joins(query).forEach((join) => {
      const { type, table, alias } = join;
      select.join(
        type,
        table !== alias ? { name: table, alias } : { name: table },
        { table: join.from.table, name: join.from.column },
        { table: join.to.table, name: join.to.column }
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
    //where
    this.where(select, query, q);
    //sort
    Object.entries(flatten(sort, true)).forEach(([key, value]) => {
      const direction = typeof value === 'string' ? value : '';
      if (
        direction.toLowerCase() !== 'asc' &&
        direction.toLowerCase() !== 'desc'
      ) {
        return;
      }
      //get the selector for the sort key
      const selector = this.selectors(key)[0];
      //if no selector found, skip
      if (!selector) return;
      const order = direction.toUpperCase() as 'ASC' | 'DESC';
      if (selector.json.length > 0) {
        const column =
          selector.table ?
            `${selector.table}.${selector.column}:${selector.json.join('.')}`
          : `${selector.column}:${selector.json.join('.')}`;
        select.order({ name: column }, order);
      } else if (selector.table) {
        select.order(
          {
            table: selector.parents.join('__'),
            name: selector.column
          },
          order
        );
      } else {
        select.order({ name: selector.column }, order);
      }
    });

    return select;
  }

  public selectors(expression: string | string[]) {
    if (!Array.isArray(expression)) {
      expression = [expression];
    }
    const selectors = new Map<string, StoreSelector>();
    expression.forEach((expression) => {
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
        Object.keys(last.store.columns).forEach((name) => {
          const expression = path.expression.replace('*', name);
          const newPath = {
            ...path,
            expression,
            //[ feedbackNote, author, data ]
            selector: [...path.selector.slice(0, -1), name],
            //feedbackNote
            column: name
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
            json: [...newPath.json],
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
        json: [...path.json],
        path
      });
    });
    return Array.from(selectors.values());
  }

  public joins(query: StoreSelectQuery) {
    const {
      columns = ['*'],
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
      ...(Array.isArray(columns) ? columns : [columns]),
      ...Object.keys(flatten(eq, true)),
      ...Object.keys(flatten(ne, true)),
      ...Object.keys(flatten(ge, true)),
      ...Object.keys(flatten(le, true)),
      ...Object.keys(flatten(has, true)),
      ...Object.keys(flatten(like, true)),
      ...Object.keys(flatten(hasnt, true)),
      ...Object.keys(flatten(sort, true))
    ]);
    const joins = new Map<string, StoreJoin>();
    expressions.forEach((expression) => {
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
      this.paths(expression).forEach((path) => {
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
        const fromTable =
          path.parents.length > 0 ?
            path.parents.map(getAlias).join('__')
          : this.table;
        const toTable = [...path.parents, table].map(getAlias).join('__');
        const alias = toTable;
        const from = { table: fromTable, column: relation.local };
        const to = { table: toTable, column: relation.foreign };
        joins.set([table, from.column, to.table, to.column, alias].join('-'), {
          type,
          table,
          alias,
          from,
          to
        });
      });
    });
    return Array.from(joins.values());
  }

  public paths(expression: string, paths: StorePath[] = []): StorePath[] {
    //IF: category.article.ratings.feedbackNote.author.data:references.googleId
    //                                  ^
    //   |                           expression                                |
    //   |                    selector                     |        json       |
    //   |    parents     | table |   column   | children  |        json       |
    const [selector = '', json = ''] = expression.split(':');
    const children = selector.split('.');
    const column = children.shift();
    //failsafe
    if (!column) return paths;
    const parents = [...paths.map((path) => path.column), this.table];
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
    if (column && column in this.relations) {
      //if this is a relation in the store
      const relation = this.relations[column as keyof typeof this.relations];
      return relation.store.paths(
        //from: auth.userProfile.addressLocation:references.googleId
        //  to: userProfile.addressLocation:references.googleId
        selector.substring(selector.indexOf('.') + 1),
        paths.concat([{ type: 'relation', ...path }])
      );
    }
    return paths;
  }

  public where(builder: WhereBuilder, query: StoreSelectFilters = {}, q = '"') {
    //extract params
    const {
      ne = {},
      ge = {},
      le = {},
      has = {},
      like = {},
      hasnt = {}
    } = query;
    const eq = { ...(query.eq || {}) };
    //default active value
    const name = 'active';
    if (typeof eq[name] === 'undefined') {
      builder.where(`${q}${this.table}${q}.${q}${name}${q} = ?`, [true]);
    } else if (eq[name] === -1) {
      delete eq[name];
    }

    //eq
    Object.entries(flatten(eq, true)).forEach(([key, value]) =>
      this.whereEquals(builder, key, value, q)
    );
    //like
    Object.entries(flatten(like, true)).forEach(([key, value]) =>
      this.whereLike(builder, key, value, q)
    );
    //ne
    Object.entries(flatten(ne, true)).forEach(([key, value]) =>
      this.whereNotEquals(builder, key, value, q)
    );
    //ge
    Object.entries(flatten(ge, true)).forEach(([key, value]) =>
      this.whereGreaterEquals(builder, key, value, q)
    );
    //le
    Object.entries(flatten(le, true)).forEach(([key, value]) =>
      this.whereLessEquals(builder, key, value, q)
    );
    //has
    Object.entries(flatten(has, true)).forEach(([key, value]) =>
      this.whereArrayContains(builder, key, value)
    );
    //hasnt
    Object.entries(flatten(hasnt, true)).forEach(([key, value]) =>
      this.whereArrayNotContains(builder, key, value)
    );
    return builder;
  }

  public whereEquals(
    builder: WhereBuilder,
    expression: string,
    value: unknown,
    q = '"'
  ) {
    //get selector from the expression
    const selector = this.selectors(expression)[0];
    //skip if no selector
    if (!selector) return;
    //get sql column
    const column = storeSelectorToSqlSelector(selector, q);
    //skip if no column
    if (!column) return;
    //for the sql clause
    const clause = `${column} = ?`;
    //bind clause to each value
    this._whereValues(builder, clause, value, selector.path);
  }

  public whereLike(
    builder: WhereBuilder,
    expression: string,
    value: unknown,
    q = '"'
  ) {
    //get selector from the expression
    const selector = this.selectors(expression)[0];
    //skip if no selector
    if (!selector) return;
    //get sql column
    const column = storeSelectorToSqlSelector(selector, q);
    //skip if no column
    if (!column) return;
    //for the sql clause
    const clause = `${column} ILIKE ?`;
    const values = !Array.isArray(value) ? [value] : value;
    const likeValues = values.map((value) =>
      typeof value === 'string' ? `%${value}%` : value
    );
    //bind clause to each value
    this._whereValues(builder, clause, likeValues, selector.path);
  }

  public whereNotEquals(
    builder: WhereBuilder,
    expression: string,
    value: unknown,
    q = '"'
  ) {
    //get selector from the expression
    const selector = this.selectors(expression)[0];
    //skip if no selector
    if (!selector) return;
    //get sql column
    const column = storeSelectorToSqlSelector(selector, q);
    //skip if no column
    if (!column) return;
    //for the sql clause
    const clause = `${column} != ?`;
    //bind clause to each value
    this._whereValues(builder, clause, value, selector.path);
  }

  public whereGreaterEquals(
    builder: WhereBuilder,
    expression: string,
    value: unknown,
    q = '"'
  ) {
    //get selector from the expression
    const selector = this.selectors(expression)[0];
    //skip if no selector
    if (!selector) return;
    //get sql column
    const column = storeSelectorToSqlSelector(selector, q);
    //skip if no column
    if (!column) return;
    //for the sql clause
    const clause = `${column} >= ?`;
    //bind clause to each value
    this._whereValues(builder, clause, value, selector.path);
  }

  public whereLessEquals(
    builder: WhereBuilder,
    expression: string,
    value: unknown,
    q = '"'
  ) {
    //get selector from the expression
    const selector = this.selectors(expression)[0];
    //skip if no selector
    if (!selector) return;
    //get sql column
    const column = storeSelectorToSqlSelector(selector, q);
    //skip if no column
    if (!column) return;
    //for the sql clause
    const clause = `${column} <= ?`;
    //bind clause to each value
    this._whereValues(builder, clause, value, selector.path);
  }

  public whereArrayContains(
    builder: WhereBuilder,
    expression: string,
    value: unknown
  ) {
    builder.whereJsonContains(expression, value as JSONScalarValue);
  }

  public whereArrayNotContains(
    builder: WhereBuilder,
    expression: string,
    value: unknown
  ) {
    builder.whereJsonContains(expression, value as JSONScalarValue);
    //builder.whereJsonNotContains(expression, value as JSONScalarValue);
  }

  protected _whereValues(
    builder: WhereBuilder,
    clause: string,
    value: unknown,
    path: StorePath
  ) {
    const {
      column: key,
      store: { columns }
    } = path;
    //it's easier if value was an array no matter what
    const values = !Array.isArray(value) ? [value] : value;
    //collect OR queries
    const or: StoreSelectOrWhere = { clause: [], values: [] };
    //for each value
    for (const value of values) {
      //serialize it
      const serialized =
        path.json.length > 0 ? value
        : key in columns ? columns[key].serialize(value, true)
        : value;
      //if serialized is invalid, skip it
      if (
        typeof serialized === 'undefined' ||
        serialized === null ||
        serialized === ''
      )
        continue;
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
      builder.where(`(${or.clause.join(' OR ')})`, or.values);
    }
  }

  public update(query: StoreSelectFilters = {}, input: Partial<Auth>, q = '"') {
    //add timestamp to @timestamp column
    input.updated = new Date();

    //serialize values and map filtered to the
    // relative SQL column names (snake case)
    const values = this.scalarize(input);

    //make the update builder
    const update = new Update<Auth>(this.table);
    //where
    this.where(update, query, q);

    return update.set(values);
  }

  public scalarize(values: Record<string, unknown>) {
    const scalarized: Record<string, ValueScalar> = {};
    for (const [name, value] of Object.entries(values)) {
      if (name === 'id' && typeof value !== 'undefined') {
        const column = this.columns.id;
        scalarized.id = this.toSqlValue(
          'id',
          column.serialize(value)
        )! as ValueScalar;
        continue;
      }
      if (name === 'profileId' && typeof value !== 'undefined') {
        const column = this.columns.profileId;
        scalarized.profile_id = this.toSqlValue(
          'profileId',
          column.serialize(value)
        )! as ValueScalar;
        continue;
      }
      if (name === 'type' && typeof value !== 'undefined') {
        const column = this.columns.type;
        scalarized.type = this.toSqlValue(
          'type',
          column.serialize(value)
        )! as ValueScalar;
        continue;
      }
      if (name === 'token' && typeof value !== 'undefined') {
        const column = this.columns.token;
        scalarized.token = this.toSqlValue(
          'token',
          column.serialize(value, true)
        )! as ValueScalar;
        continue;
      }
      if (name === 'secret' && typeof value !== 'undefined') {
        const column = this.columns.secret;
        scalarized.secret = this.toSqlValue(
          'secret',
          column.serialize(value, true)
        )! as ValueScalar;
        continue;
      }
      if (name === 'verified' && typeof value !== 'undefined') {
        const column = this.columns.verified;
        scalarized.verified = this.toSqlValue(
          'verified',
          column.serialize(value)
        )! as ValueScalar;
        continue;
      }
      if (name === 'consumed' && typeof value !== 'undefined') {
        const column = this.columns.consumed;
        scalarized.consumed = this.toSqlValue(
          'consumed',
          column.serialize(value)
        )! as ValueScalar;
        continue;
      }
      if (name === 'active' && typeof value !== 'undefined') {
        const column = this.columns.active;
        scalarized.active = this.toSqlValue(
          'active',
          column.serialize(value)
        )! as ValueScalar;
        continue;
      }
      if (name === 'created' && typeof value !== 'undefined') {
        const column = this.columns.created;
        scalarized.created = this.toSqlValue(
          'created',
          column.serialize(value)
        )! as ValueScalar;
        continue;
      }
      if (name === 'updated' && typeof value !== 'undefined') {
        const column = this.columns.updated;
        scalarized.updated = this.toSqlValue(
          'updated',
          column.serialize(value)
        )! as ValueScalar;
        continue;
      }
    }
    return scalarized;
  }

  public toSqlValue(column: string, value: unknown) {
    if (column === 'id') {
      return toSqlString(value, true);
    }
    if (column === 'profileId') {
      return toSqlString(value, true);
    }
    if (column === 'type') {
      return toSqlString(value, true);
    }
    if (column === 'token') {
      return toSqlString(value, true);
    }
    if (column === 'secret') {
      return toSqlString(value, true);
    }
    if (column === 'verified') {
      return toSqlBoolean(value, true);
    }
    if (column === 'consumed') {
      return toSqlDate(value, true)?.toISOString();
    }
    if (column === 'active') {
      return toSqlBoolean(value, true);
    }
    if (column === 'created') {
      return toSqlDate(value, true)?.toISOString();
    }
    if (column === 'updated') {
      return toSqlDate(value, true)?.toISOString();
    }
    return (
      typeof value === 'undefined' ? undefined
      : value === null ? null
      : String(value)
    );
  }

  public unscalarize(values: Record<string, unknown>): Partial<Auth> {
    const unscalarized: Record<string, ValuePrimitive> = {};
    for (const [name, value] of Object.entries(values)) {
      if (name === 'id' && typeof value !== 'undefined') {
        const column = this.columns.id;
        unscalarized.id = column.unserialize(value)! as ValuePrimitive;
        continue;
      }
      if (name === 'profile_id' && typeof value !== 'undefined') {
        const column = this.columns.profileId;
        unscalarized.profileId = column.unserialize(value)! as ValuePrimitive;
        continue;
      }
      if (name === 'type' && typeof value !== 'undefined') {
        const column = this.columns.type;
        unscalarized.type = column.unserialize(value)! as ValuePrimitive;
        continue;
      }
      if (name === 'token' && typeof value !== 'undefined') {
        const column = this.columns.token;
        unscalarized.token = column.unserialize(value, true)! as ValuePrimitive;
        continue;
      }
      if (name === 'secret' && typeof value !== 'undefined') {
        const column = this.columns.secret;
        unscalarized.secret = column.unserialize(value)! as ValuePrimitive;
        continue;
      }
      if (name === 'verified' && typeof value !== 'undefined') {
        const column = this.columns.verified;
        unscalarized.verified = column.unserialize(value)! as ValuePrimitive;
        continue;
      }
      if (name === 'consumed' && typeof value !== 'undefined') {
        const column = this.columns.consumed;
        unscalarized.consumed = column.unserialize(value)! as ValuePrimitive;
        continue;
      }
      if (name === 'active' && typeof value !== 'undefined') {
        const column = this.columns.active;
        unscalarized.active = column.unserialize(value)! as ValuePrimitive;
        continue;
      }
      if (name === 'created' && typeof value !== 'undefined') {
        const column = this.columns.created;
        unscalarized.created = column.unserialize(value)! as ValuePrimitive;
        continue;
      }
      if (name === 'updated' && typeof value !== 'undefined') {
        const column = this.columns.updated;
        unscalarized.updated = column.unserialize(value)! as ValuePrimitive;
        continue;
      }
    }
    return unscalarized;
  }
}
