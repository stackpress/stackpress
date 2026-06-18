import { describe, it } from 'mocha';
import { expect } from 'chai';

import {
  collectDesktopRoutes,
  filterDesktopRoutes,
  matchDesktopRoute,
  normalizeRouteRules
} from '../src/routeRules.js';

describe('desktop/routeRules', () => {
  it('should allow all routes when no rules are configured', () => {
    expect(matchDesktopRoute([], '/admin', 'GET')).to.equal(true);
  });

  it('should match exact paths', () => {
    expect(matchDesktopRoute([{ route: '/articles' }], '/articles', 'GET')).to.equal(true);
    expect(matchDesktopRoute([{ route: '/articles' }], '/articles/1', 'GET')).to.equal(false);
  });

  it('should match trailing path group wildcards', () => {
    const rules = normalizeRouteRules([{ route: '/articles/**' }]);
    expect(matchDesktopRoute(rules, '/articles', 'GET')).to.equal(true);
    expect(matchDesktopRoute(rules, '/articles/', 'GET')).to.equal(true);
    expect(matchDesktopRoute(rules, '/articles/1', 'GET')).to.equal(true);
    expect(matchDesktopRoute(rules, '/authors/1', 'GET')).to.equal(false);
  });

  it('should match methods', () => {
    const rules = normalizeRouteRules([{ method: 'POST', route: '/api/comments' }]);
    expect(matchDesktopRoute(rules, '/api/comments', 'POST')).to.equal(true);
    expect(matchDesktopRoute(rules, '/api/comments', 'GET')).to.equal(false);
  });

  it('should reject invalid wildcard forms', () => {
    expect(() => normalizeRouteRules([{ route: '/admin*' }])).to.throw(/wildcard/i);
    expect(() => normalizeRouteRules([{ route: '/admin/**/edit' }])).to.throw(/wildcard/i);
  });

  it('should block by default when allowlist rules do not match', () => {
    expect(matchDesktopRoute([{ route: '/public/**' }], '/admin', 'GET')).to.equal(false);
  });

  it('should filter registered route metadata in allow-all mode', () => {
    const actual = filterDesktopRoutes([
      { route: '/', method: 'GET' },
      { route: '/admin', method: 'GET' }
    ]);

    expect(actual.allowed).to.deep.equal([
      { route: '/', method: 'GET' },
      { route: '/admin', method: 'GET' }
    ]);
    expect(actual.blocked).to.deep.equal([]);
    expect(actual.blockedSummary).to.deep.equal({
      count: 0,
      reasons: []
    });
  });

  it('should filter registered route metadata by exact allowlist', () => {
    const actual = filterDesktopRoutes([
      { route: '/', method: 'GET' },
      { route: '/admin', method: 'GET' }
    ], [{ route: '/' }]);

    expect(actual.allowed).to.deep.equal([{ route: '/', method: 'GET' }]);
    expect(actual.blocked).to.deep.equal([{ route: '/admin', method: 'GET' }]);
    expect(actual.blockedSummary).to.deep.equal({
      count: 1,
      reasons: [ 'GET /admin does not match desktop route allowlist.' ]
    });
  });

  it('should filter registered route metadata by wildcard allowlist', () => {
    const actual = filterDesktopRoutes([
      { route: '/articles', method: 'GET' },
      { route: '/articles/1', method: 'GET' },
      { route: '/admin', method: 'GET' }
    ], [{ route: '/articles/**' }]);

    expect(actual.allowed).to.deep.equal([
      { route: '/articles', method: 'GET' },
      { route: '/articles/1', method: 'GET' }
    ]);
    expect(actual.blocked).to.deep.equal([{ route: '/admin', method: 'GET' }]);
  });

  it('should filter registered route metadata by method-specific rules', () => {
    const actual = filterDesktopRoutes([
      { route: '/api/comments', method: 'GET' },
      { route: '/api/comments', method: 'POST' }
    ], [{ method: 'POST', route: '/api/comments' }]);

    expect(actual.allowed).to.deep.equal([
      { route: '/api/comments', method: 'POST' }
    ]);
    expect(actual.blocked).to.deep.equal([
      { route: '/api/comments', method: 'GET' }
    ]);
  });

  it('should collect route metadata from Ingest route maps', () => {
    const routes = new Map([
      [ 'GET /', { method: 'GET', path: '/' } ],
      [ 'GET /admin', { method: 'GET', path: '/admin' } ]
    ]);

    expect(collectDesktopRoutes({ routes })).to.deep.equal([
      { route: '/', method: 'GET' },
      { route: '/admin', method: 'GET' }
    ]);
  });
});
