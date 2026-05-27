import assert from 'node:assert/strict';
import test from 'node:test';

import {
  formatArticleDate,
  getArticleSummary,
  getCommentCountLabel,
  getContentSignals,
  getFeaturedArticle,
  getReadingTimeLabel,
  getTopicHighlights
} from '../plugins/app/helpers.js';

test('getFeaturedArticle returns the first article and the remaining list', () => {
  const articles = [
    { title: 'First', slug: 'first', contents: '<p>Hello world</p>' },
    { title: 'Second', slug: 'second', contents: '<p>Another article</p>' }
  ];

  const [ featured, remaining ] = getFeaturedArticle(articles);

  assert.equal(featured?.slug, 'first');
  assert.deepEqual(remaining.map(article => article.slug), ['second']);
});

test('getArticleSummary strips markup and falls back to a readable default', () => {
  assert.equal(
    getArticleSummary({
      title: 'Markup',
      contents: '<p>Hello <strong>Stackpress</strong> builders.</p>'
    }, 80),
    'Hello Stackpress builders.'
  );

  assert.match(
    getArticleSummary({ title: 'Empty', contents: '' }, 80),
    /open the article/i
  );
});

test('getReadingTimeLabel returns a minimum one minute estimate', () => {
  assert.equal(getReadingTimeLabel('<p>Short post</p>'), '1 min read');
});

test('getContentSignals derives stable homepage metrics', () => {
  const signals = getContentSignals([
    { published: '2026-05-01T00:00:00.000Z', banner: '/a.png' },
    { published: '2026-05-03T00:00:00.000Z', banner: null }
  ]);

  assert.equal(signals[0]?.label, 'Published');
  assert.equal(signals[0]?.value, '2');
  assert.equal(signals[1]?.label, 'With Visuals');
  assert.equal(signals[1]?.value, '1');
  assert.equal(signals[2]?.label, 'Latest');
  assert.equal(
    signals[2]?.value,
    formatArticleDate('2026-05-03T00:00:00.000Z')
  );
});

test('getTopicHighlights returns four stable orientation statements', () => {
  assert.deepEqual(
    getTopicHighlights(),
    [
      'Systems and platform notes',
      'Design-aware implementation details',
      'Operational thinking for product builders',
      'Patterns that scale from content to application UI'
    ]
  );
});

test('getArticleSummary respects the requested character limit', () => {
  const summary = getArticleSummary({
    contents: `<p>${'word '.repeat(80)}</p>`
  }, 40);

  assert.ok(summary.length <= 43);
  assert.match(summary, /\.\.\.$/);
});

test('getCommentCountLabel returns readable singular and plural labels', () => {
  assert.equal(getCommentCountLabel([]), 'No comments yet');
  assert.equal(
    getCommentCountLabel([{ id: 'one', comment: 'First' }]),
    '1 comment'
  );
  assert.equal(
    getCommentCountLabel([
      { id: 'one', comment: 'First' },
      { id: 'two', comment: 'Second' }
    ]),
    '2 comments'
  );
});
