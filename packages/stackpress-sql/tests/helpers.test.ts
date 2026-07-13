//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
//modules
import { Create, Engine, Mysql, Pgsql, Sqlite } from '@stackpress/inquire';
import PGLiteConnection from '@stackpress/inquire-pglite/Connection';
//src
import {
  toSqlString,
  toSqlBoolean,
  toSqlDate,
  toSqlInteger,
  toSqlFloat,
  flatten,
  getAlias,
  storePathToAlias,
  storeSelectorToSqlSelector
} from '../src/helpers.js';
import type { StorePath, StoreSelector } from '../src/types.js';
import {
  formatDestructiveSchemaMessage,
  getDestructiveAlterChanges,
  hasDestructiveAlterChanges,
  hasDestructiveSchemaChanges,
  inspectSchemaChanges
} from '../src/scripts/helpers.js';


describe('sql/helpers', () => {
  it('should coerce values into SQL-safe primitives', () => {
    //Confirm string conversion preserves nullish behavior and serializes objects.
    expect(toSqlString(undefined)).to.equal(undefined);
    expect(toSqlString(undefined, true)).to.equal('');
    expect(toSqlString(null)).to.equal(null);
    expect(toSqlString(null, true)).to.equal('');
    expect(toSqlString({ active: true })).to.equal('{"active":true}');
    expect(toSqlString(123)).to.equal('123');

    //Confirm boolean conversion keeps loose JavaScript truthiness rules.
    expect(toSqlBoolean(undefined)).to.equal(undefined);
    expect(toSqlBoolean(undefined, true)).to.equal(false);
    expect(toSqlBoolean(null)).to.equal(null);
    expect(toSqlBoolean(null, true)).to.equal(false);
    expect(toSqlBoolean('1')).to.equal(true);
    expect(toSqlBoolean(0)).to.equal(false);

    //Confirm numeric helpers normalize invalid and nullish values.
    expect(toSqlInteger(undefined)).to.equal(undefined);
    expect(toSqlInteger(undefined, true)).to.equal(0);
    expect(toSqlInteger(null)).to.equal(null);
    expect(toSqlInteger('42.9')).to.equal(42);
    expect(toSqlInteger('abc')).to.equal(0);
    expect(toSqlFloat(undefined)).to.equal(undefined);
    expect(toSqlFloat(undefined, true)).to.equal(0);
    expect(toSqlFloat(null)).to.equal(null);
    expect(toSqlFloat('42.9')).to.equal(42.9);
    expect(toSqlFloat('abc')).to.equal(0);
  });

  it('should coerce dates and fall back invalid values to epoch time', () => {
    const value = new Date('2024-01-02T03:04:05.000Z');

    //Return nullish values unchanged in non-strict mode.
    expect(toSqlDate(undefined)).to.equal(undefined);
    expect(toSqlDate(null)).to.equal(null);

    //Reuse the same date instance when one is already supplied.
    expect(toSqlDate(value)).to.equal(value);

    //Fallback invalid dates to the epoch so downstream SQL code stays stable.
    expect(toSqlDate('invalid-date')?.toISOString()).to.equal(
      '1970-01-01T00:00:00.000Z'
    );
    expect(toSqlDate(undefined, true).toISOString()).to.equal(
      '1970-01-01T00:00:00.000Z'
    );
  });

  it('should flatten nested records and optionally expand arrays', () => {
    const subject = {
      profile: {
        name: 'Ada',
        tags: [ 'admin', 'editor' ],
        address: {
          city: 'Manila'
        }
      },
      active: true
    };

    //Keep arrays intact by default while still flattening object paths.
    expect(flatten(subject)).to.deep.equal({
      'profile.name': 'Ada',
      'profile.tags': [ 'admin', 'editor' ],
      'profile.address.city': 'Manila',
      active: true
    });

    //Expand array indices into path segments when requested.
    expect(flatten(subject, true)).to.deep.equal({
      'profile.name': 'Ada',
      'profile.tags.0': 'admin',
      'profile.tags.1': 'editor',
      'profile.address.city': 'Manila',
      active: true
    });
  });

  it('should derive aliases and selector strings for nested store paths', () => {
    const path = {
      type: 'column',
      expression: 'feedbackNote.author.data:references.googleId',
      selector: [ 'feedbackNote', 'author', 'data' ],
      parents: [ 'category', 'article' ],
      table: 'ratings',
      column: 'feedbackNote',
      children: [ 'author', 'data' ],
      json: [ 'references', 'googleId' ],
      store: {} as never
    } satisfies StorePath;

    const selector = {
      alias: 'category__article__ratings__feedback_note__author__data',
      selector: [ 'category', 'article', 'ratings', 'feedback_note', 'author', 'data' ],
      parents: [ 'category', 'article', 'ratings' ],
      table: 'feedback_note',
      column: 'data',
      json: [ 'references', 'googleId' ],
      path
    } satisfies StoreSelector;

    //Convert dotted and camel-cased names into SQL-friendly aliases.
    expect(getAlias('feedbackNote.author-data')).to.equal(
      'feedback_note__author-data'
    );
    expect(getAlias('feedbackNote.author--data')).to.equal(
      'feedback_note__author_data'
    );

    //Preserve the original path structure while converting every selector piece.
    expect(storePathToAlias(path)).to.deep.equal({
      expression: 'feedback_note__author__data__references__google_id',
      selector: [ 'feedback_note', 'author', 'data' ],
      parents: [ 'category', 'article' ],
      table: 'ratings',
      column: 'feedback_note',
      children: [ 'author', 'data' ]
    });

    //Build the correct selector output for plain columns, nested tables, and JSON paths.
    expect(storeSelectorToSqlSelector({
      ...selector,
      parents: [],
      json: []
    })).to.equal('"feedback_note"."data"');
    expect(storeSelectorToSqlSelector({
      ...selector,
      json: []
    })).to.equal('"category__article__ratings"."data"');
    expect(storeSelectorToSqlSelector(selector)).to.equal(
      'category__article__ratings.data:references.googleId'
    );
    expect(storeSelectorToSqlSelector({
      ...selector,
      parents: [],
      table: '',
      json: [ 'references', 'googleId' ]
    })).to.equal('data:references.googleId');
    expect(storeSelectorToSqlSelector({
      ...selector,
      column: ''
    })).to.equal(null);
  });
});

describe('sql/destructive-guard', () => {
  it('should collect removed alter members and detect destructive changes', () => {
    const build = {
      fields: { remove: [ 'summary' ] },
      primary: { remove: [] },
      unique: { remove: [ 'article_slug_unique' ] },
      keys: { remove: [ 'article_summary_search' ] },
      foreign: { remove: [ 'article_author_id_foreign' ] }
    } as any;

    const changes = getDestructiveAlterChanges(build);

    expect(changes).to.deep.equal({
      fields: [ 'summary' ],
      primary: [],
      unique: [ 'article_slug_unique' ],
      keys: [ 'article_summary_search' ],
      foreign: [ 'article_author_id_foreign' ]
    });
    expect(hasDestructiveAlterChanges(changes)).to.equal(true);
  });

  it('should format an aggregate destructive warning message', () => {
    const changes = {
      alters: [
        {
          table: 'article',
          changes: {
            fields: [ 'summary', 'published' ],
            primary: [],
            unique: [],
            keys: [],
            foreign: [ 'article_author_id_foreign' ]
          }
        }
      ],
      drops: [ 'comment' ]
    };
    const message = formatDestructiveSchemaMessage(changes);

    expect(hasDestructiveSchemaChanges(changes)).to.equal(true);
    expect(message).to.include('Destructive schema changes detected.');
    expect(message).to.include('Table "article":');
    expect(message).to.include('Removed fields: summary, published');
    expect(message).to.include('Removed foreign keys: article_author_id_foreign');
    expect(message).to.include('Dropped tables: comment');
    expect(message).to.include('these destructive changes');
  });

  it('should treat empty removals as safe', () => {
    expect(hasDestructiveAlterChanges({
      fields: [],
      primary: [],
      unique: [],
      keys: [],
      foreign: []
    })).to.equal(false);
    expect(hasDestructiveSchemaChanges({
      alters: [],
      drops: []
    })).to.equal(false);
  });

  it('should detect destructive removals from real builder diffs', () => {
    for (const [ name, engine ] of makeIntegrationCases()) {
      const before = makeArticleSchema(engine);
      const after = makeArticleSchema(engine, {
        includeForeign: false,
        includeIndexes: false,
        includePrimary: false,
        removeSummary: true
      });

      const inspected = inspectSchemaChanges(engine, [ before ], [ after ]);

      expect(
        inspected.destructive,
        `Expected ${name} destructive diff to be collected before execution.`
      ).to.deep.equal({
        alters: [
          {
            table: 'article',
            changes: {
              fields: [ 'summary' ],
              primary: [ 'id' ],
              unique: [ 'article_summary_unique' ],
              keys: [ 'article_summary_index' ],
              foreign: [ 'article_author_id_foreign' ]
            }
          }
        ],
        drops: []
      });
      expect(
        inspected.queries,
        `Expected ${name} destructive diff to block generated queries until forced.`
      ).to.deep.equal([]);
    }
  });

  it('should emit real alter SQL from builder diffs when force is enabled', () => {
    for (const [ name, engine ] of makeIntegrationCases()) {
      const before = makeArticleSchema(engine);
      const after = makeArticleSchema(engine, {
        includeForeign: false,
        includeIndexes: false,
        includePrimary: false,
        removeSummary: true
      });

      const inspected = inspectSchemaChanges(engine, [ before ], [ after ], true);
      const queries = inspected.queries.map(query => query.query);

      expect(
        inspected.destructive,
        `Expected ${name} forced diff to skip destructive warnings.`
      ).to.deep.equal({ alters: [], drops: [] });
      expect(
        queries.length,
        `Expected ${name} forced diff to emit at least one alter query.`
      ).to.be.greaterThan(0);
      expect(
        queries.some(query => query.includes('summary')),
        `Expected ${name} forced diff to include the removed field in emitted SQL.`
      ).to.equal(true);
    }
  });

  it('should treat real no-op diffs as safe across builder dialects', () => {
    for (const [ name, engine ] of makeIntegrationCases()) {
      const before = makeArticleSchema(engine, {
        includeForeign: false,
        includeIndexes: false
      });
      const after = makeArticleSchema(engine, {
        includeForeign: false,
        includeIndexes: false
      });

      const inspected = inspectSchemaChanges(engine, [ before ], [ after ]);

      expect(
        inspected,
        `Expected ${name} no-op diff to stay empty.`
      ).to.deep.equal({
        queries: [],
        destructive: {
          alters: [],
          drops: []
        }
      });
    }
  });
});

function makeIntegrationCases() {
  return [
    [ 'pgsql', makeEngine(Pgsql) ],
    [ 'mysql', makeEngine(Mysql) ],
    [ 'sqlite', makeEngine(Sqlite) ],
    [ 'pglite', makePgliteEngine() ]
  ] as const;
}

function makeEngine(dialect: typeof Pgsql) {
  return new Engine({
    dialect,
    lastId: undefined,
    before: async() => undefined,
    format: request => request,
    async query() {
      return [];
    },
    async resource() {
      return null;
    },
    async transaction(callback) {
      return await callback(this as any);
    }
  });
}

function makePgliteEngine() {
  return new Engine(new PGLiteConnection({
    async exec() {
      return [{ rows: [] }];
    },
    async query() {
      return { rows: [] };
    }
  } as any));
}

function makeArticleSchema(
  engine: Engine,
  options: {
    includeForeign?: boolean,
    includeIndexes?: boolean,
    includePrimary?: boolean,
    removeSummary?: boolean
  } = {}
) {
  const schema = new Create('article', engine)
    .addField('id', { type: 'INTEGER' });

  if (options.includePrimary !== false) {
    schema.addPrimaryKey('id');
  }

  if (!options.removeSummary) {
    schema.addField('summary', { type: 'TEXT', nullable: true });
  }

  if (options.includeIndexes !== false) {
    schema
      .addUniqueKey('article_summary_unique', 'summary')
      .addKey('article_summary_index', 'summary');
  }

  if (options.includeForeign !== false) {
    schema.addForeignKey('article_author_id_foreign', {
      local: 'author_id',
      foreign: 'id',
      table: 'author'
    });
  }

  return schema;
}
