//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
//modules
import { Create, Engine, Mysql, Pgsql, Sqlite } from '@stackpress/inquire';
import PGLiteConnection from '@stackpress/inquire-pglite/Connection';
//stackpress-schema
import Schema from 'stackpress-schema/Schema';
//src
import Migrations from '../src/Migrations.js';
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

    const changes = Migrations.getDestructiveAlterChanges(build);

    expect(changes).to.deep.equal({
      fields: [ 'summary' ],
      primary: [],
      unique: [ 'article_slug_unique' ],
      keys: [ 'article_summary_search' ],
      foreign: [ 'article_author_id_foreign' ]
    });
    expect(Migrations.hasDestructiveAlterChanges(changes)).to.equal(true);
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
    const message = Migrations.formatWarning([], changes) || '';

    expect(Migrations.hasDestructiveChanges(changes)).to.equal(true);
    expect(message).to.include('Destructive schema changes detected.');
    expect(message).to.include('Table "article":');
    expect(message).to.include('Removed fields: summary, published');
    expect(message).to.include('Removed foreign keys: article_author_id_foreign');
    expect(message).to.include('Dropped tables: comment');
    expect(message).to.include('Re-run with `--force`');
  });

  it('should treat empty removals as safe', () => {
    expect(Migrations.hasDestructiveAlterChanges({
      fields: [],
      primary: [],
      unique: [],
      keys: [],
      foreign: []
    })).to.equal(false);
    expect(Migrations.hasDestructiveChanges({
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

      const inspected = Migrations.inspectSchemaChanges(
        engine,
        [ before ],
        [ after ]
      );

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
        `Expected ${name} destructive diff to retain reviewable SQL.`
      ).to.not.deep.equal([]);
    }
  });

  it('should return destructive SQL and warning metadata together', () => {
    for (const [ name, engine ] of makeIntegrationCases()) {
      const before = makeArticleSchema(engine);
      const after = makeArticleSchema(engine, {
        includeForeign: false,
        includeIndexes: false,
        includePrimary: false,
        removeSummary: true
      });

      const inspected = Migrations.inspectSchemaChanges(
        engine,
        [ before ],
        [ after ]
      );
      const queries = inspected.queries.map(query => query.query);

      expect(
        inspected.destructive,
        `Expected ${name} destructive diff to retain warning metadata.`
      ).to.not.deep.equal({ alters: [], drops: [] });
      expect(
        queries.length,
        `Expected ${name} destructive diff to emit at least one alter query.`
      ).to.be.greaterThan(0);
      expect(
        queries.some(query => query.includes('summary')),
        `Expected ${name} destructive diff to include the removed field in emitted SQL.`
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

      const inspected = Migrations.inspectSchemaChanges(
        engine,
        [ before ],
        [ after ]
      );

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

describe('sql/rename-plan', () => {
  it('should plan a clear one-to-one same-semantics field rename', () => {
    const from = Schema.make(makeRenameSchemaConfig([ 'profileName' ]));
    const to = Schema.make(makeRenameSchemaConfig([ 'name' ]));

    //Match the Idea columns through the SQL field names Inquire will receive.
    expect(Migrations.planRenames(from, to)).to.deep.equal({
      renames: [{
        model: 'Profile',
        table: 'profile',
        from: 'profileName',
        fromField: 'profile_name',
        to: 'name',
        toField: 'name'
      }],
      ambiguous: []
    });
  });

  it('should refuse to guess across multiple same-shape candidates', () => {
    const from = Schema.make(makeRenameSchemaConfig([
      'profileName',
      'displayName'
    ]));
    const to = Schema.make(makeRenameSchemaConfig([
      'name',
      'title'
    ]));
    const plan = Migrations.planRenames(from, to);

    //Keep the candidate group unresolved so no arbitrary rename reaches SQL.
    expect(plan.renames).to.deep.equal([]);
    expect(plan.ambiguous).to.deep.equal([{
      model: 'Profile',
      table: 'profile',
      fromFields: [ 'display_name', 'profile_name' ],
      toFields: [ 'name', 'title' ]
    }]);
    expect(Migrations.formatAmbiguousWarning(plan.ambiguous)).to.include(
      'Stackpress found multiple same-shape rename candidates'
    );
  });

  it('should delegate rename SQL to every supported Inquire dialect', () => {
    const from = Schema.make(makeRenameSchemaConfig([ 'profileName' ]));
    const to = Schema.make(makeRenameSchemaConfig([ 'name' ]));
    const plan = Migrations.planRenames(from, to);

    for (const [ dialect, engine ] of makeIntegrationCases()) {
      //Build the same remove/add pair that renameField must reconcile.
      const before = new Create('profile', engine)
        .addField('profile_name', {
          type: 'VARCHAR',
          length: 255,
          nullable: true
        });
      const after = new Create('profile', engine)
        .addField('name', {
          type: 'VARCHAR',
          length: 255,
          nullable: true
        });

      //Apply the Stackpress plan before destructive inspection and SQL output.
      const inspected = Migrations.inspectSchemaChanges(
        engine,
        [ before ],
        [ after ],
        plan.renames
      );
      const sql = inspected.queries.map(query => query.query).join('\n');

      //The emitted statement belongs to Inquire and must preserve the column.
      expect(inspected.destructive, dialect).to.deep.equal({
        alters: [],
        drops: []
      });
      expect(sql, dialect).to.include('RENAME COLUMN');
      expect(sql, dialect).to.include('profile_name');
      expect(sql, dialect).to.include('name');
      expect(sql, dialect).to.not.include('DROP COLUMN');
      expect(sql, dialect).to.not.include('ADD COLUMN');
    }
  });

  it('should allow equivalent renamed keys and constraints', () => {
    const engine = makeEngine(Pgsql);
    const from = Schema.make(makeRenameSchemaConfig([ 'profileName' ]));
    const to = Schema.make(makeRenameSchemaConfig([ 'name' ]));
    const plan = Migrations.planRenames(from, to);

    //Model constraint names that change because the generated field name changed.
    const before = new Create('profile', engine)
      .addField('profile_name', { type: 'VARCHAR', length: 255 })
      .addPrimaryKey('profile_name')
      .addUniqueKey('profile_profile_name_unique', 'profile_name')
      .addKey('profile_profile_name_index', 'profile_name')
      .addForeignKey('profile_profile_name_foreign', {
        local: 'profile_name',
        foreign: 'id',
        table: 'account'
      });
    const after = new Create('profile', engine)
      .addField('name', { type: 'VARCHAR', length: 255 })
      .addPrimaryKey('name')
      .addUniqueKey('profile_name_unique', 'name')
      .addKey('profile_name_index', 'name')
      .addForeignKey('profile_name_foreign', {
        local: 'name',
        foreign: 'id',
        table: 'account'
      });

    //Equivalent replacement constraints should not turn a safe rename destructive.
    const inspected = Migrations.inspectSchemaChanges(
      engine,
      [ before ],
      [ after ],
      plan.renames
    );

    expect(inspected.destructive).to.deep.equal({ alters: [], drops: [] });
    expect(inspected.queries.map(query => query.query).join('\n')).to.include(
      'RENAME COLUMN'
    );
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

/**
 * Build one minimal schema revision around rename candidate fields.
 */
function makeRenameSchemaConfig(columnNames: string[]) {
  return {
    model: {
      Profile: {
        name: 'Profile',
        mutable: true,
        attributes: {},
        columns: columnNames.map(name => ({
          name,
          type: 'String',
          required: false,
          multiple: false,
          attributes: {
            label: [ 'Profile name' ]
          }
        }))
      }
    }
  };
}
