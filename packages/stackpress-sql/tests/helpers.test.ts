//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
//stackpress-schema
import Schema from 'stackpress-schema/Schema';
//src
import {
  toSqlString,
  toSqlBoolean,
  toSqlDate,
  toSqlInteger,
  toSqlFloat,
  flatten,
  getAlias,
  planColumnRenames,
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

describe('sql/rename-plan', () => {
  it('should plan a one-to-one rename for same-shape fields', () => {
    const from = Schema.make(makeArticleSchema([
      makeColumn('summary')
    ]));
    const to = Schema.make(makeArticleSchema([
      makeColumn('seoSummary')
    ]));

    //Treat a simple same-shape remove/add pair as a rename plan.
    expect(planColumnRenames(from, to)).to.deep.equal({
      ambiguous: [],
      renames: [{
        model: 'Article',
        table: 'article',
        from: 'summary',
        fromField: 'summary',
        to: 'seoSummary',
        toField: 'seo_summary'
      }]
    });
  });

  it('should preserve rename matches for unique and indexable fields', () => {
    const from = Schema.make(makeArticleSchema([
      makeColumn('summary', {
        attributes: { unique: true, searchable: true }
      })
    ]));
    const to = Schema.make(makeArticleSchema([
      makeColumn('seoSummary', {
        attributes: { unique: true, searchable: true }
      })
    ]));

    //Ignore generated index names so role-equivalent fields still rename cleanly.
    expect(planColumnRenames(from, to).renames).to.deep.equal([{
      model: 'Article',
      table: 'article',
      from: 'summary',
      fromField: 'summary',
      to: 'seoSummary',
      toField: 'seo_summary'
    }]);
  });

  it('should preserve rename matches for foreign-key columns', () => {
    const from = Schema.make(makeRelationSchema('basicId'));
    const to = Schema.make(makeRelationSchema('primaryBasicId'));

    //Match the foreign-key column by semantics even though the local key name changes.
    expect(planColumnRenames(from, to).renames).to.deep.equal([{
      model: 'KitchenSink',
      table: 'kitchen_sink',
      from: 'basicId',
      fromField: 'basic_id',
      to: 'primaryBasicId',
      toField: 'primary_basic_id'
    }]);
  });

  it('should fail safe when multiple same-shape rename candidates exist', () => {
    const from = Schema.make(makeArticleSchema([
      makeColumn('summary'),
      makeColumn('teaser')
    ]));
    const to = Schema.make(makeArticleSchema([
      makeColumn('seoSummary'),
      makeColumn('seoTeaser')
    ]));

    const plan = planColumnRenames(from, to);

    //Refuse to guess when more than one new field could explain the same removal set.
    expect(plan.renames).to.deep.equal([]);
    expect(plan.ambiguous).to.have.length(1);
    expect(plan.ambiguous[0]).to.include({
      model: 'Article',
      table: 'article'
    });
    expect(plan.ambiguous[0].fromFields).to.deep.equal([
      'summary',
      'teaser'
    ]);
    expect(plan.ambiguous[0].toFields).to.deep.equal([
      'seo_summary',
      'seo_teaser'
    ]);
  });
});

/**
 * Builds one article-model schema around the supplied columns.
 */
function makeArticleSchema(columns: Array<Record<string, any>>) {
  return {
    model: {
      Article: {
        name: 'Article',
        mutable: true,
        attributes: {},
        columns
      }
    }
  };
}

/**
 * Builds one schema column with optional attribute overrides.
 */
function makeColumn(
  name: string,
  options: {
    attributes?: Record<string, unknown>,
    required?: boolean,
    type?: string
  } = {}
) {
  return {
    name,
    type: options.type || 'String',
    required: options.required ?? false,
    multiple: false,
    attributes: options.attributes || {}
  };
}

/**
 * Builds a relation-backed schema that exposes a foreign-key storage column.
 */
function makeRelationSchema(keyName: string) {
  return {
    model: {
      BasicModel: {
        name: 'BasicModel',
        mutable: false,
        attributes: {},
        columns: [
          {
            name: 'id',
            type: 'String',
            attributes: { id: true },
            required: true,
            multiple: false
          },
          {
            name: 'sink',
            type: 'KitchenSink',
            attributes: {},
            required: true,
            multiple: true
          }
        ]
      },
      KitchenSink: {
        name: 'KitchenSink',
        mutable: false,
        attributes: {},
        columns: [
          {
            name: keyName,
            type: 'String',
            attributes: { id: true },
            required: true,
            multiple: false
          },
          {
            name: 'basic',
            type: 'BasicModel',
            attributes: {
              relation: [ { local: keyName, foreign: 'id' } ]
            },
            required: true,
            multiple: false
          }
        ]
      }
    }
  };
}
