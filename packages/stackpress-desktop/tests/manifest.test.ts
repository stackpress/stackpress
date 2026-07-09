import { describe, it } from 'mocha';
import { expect } from 'chai';

import { normalizeDesktopConfig } from '../src/config.js';
import { createDesktopManifest } from '../src/manifest.js';

describe('desktop/manifest', () => {
  it('should assemble the manifest contract', () => {
    const config = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Stackpress Blog', version: '1.0.0' }
    });
    const actual = createDesktopManifest(config, {
      registeredRoutes: [{ route: '/', method: 'GET' }, { route: '/admin', method: 'GET' }],
      assets: '.build/public'
    });

    expect(actual.schemaVersion).to.equal(1);
    expect(actual.app).to.deep.equal({
      id: 'io.stackpress.blog',
      name: 'Stackpress Blog',
      version: '1.0.0'
    });
    expect(actual.runtime).to.deep.equal({
      mode: 'http',
      host: '127.0.0.1',
      open: '/'
    });
    expect(actual.window).to.deep.equal({
      width: 1200,
      height: 800,
      title: 'Stackpress Blog'
    });
    expect(actual.routes.mode).to.equal('allow-all');
    expect(actual.routes.rules).to.deep.equal([]);
    expect(actual.routes.allowed).to.deep.equal([
      { route: '/', method: 'GET' },
      { route: '/admin', method: 'GET' }
    ]);
    expect(actual.files).to.deep.equal({
      main: '.build/desktop/main.js',
      preload: '.build/desktop/preload.js',
      assets: '.build/public'
    });
    expect(actual.package).to.deep.equal({
      tool: 'electron-builder',
      output: '.build/releases'
    });
  });

  it('should exclude blocked routes from allowlist manifests', () => {
    const config = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Stackpress Blog', version: '1.0.0' },
      server: { open: '/articles/1' },
      routes: [{ route: '/articles/**' }]
    });
    const actual = createDesktopManifest(config, {
      registeredRoutes: [
        { route: '/', method: 'GET' },
        { route: '/articles/1', method: 'GET' },
        { route: '/admin', method: 'GET' }
      ],
      assets: '.build/public'
    });

    expect(actual.routes.mode).to.equal('allowlist');
    expect(actual.routes.allowed).to.deep.equal([
      { route: '/articles/1', method: 'GET' }
    ]);
  });

  it('should include enough route and package input metadata for packaging', () => {
    const config = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Stackpress Blog', version: '1.0.0' },
      server: { open: '/articles/1' },
      routes: [{ route: '/articles/**' }]
    });
    const actual = createDesktopManifest(config, {
      registeredRoutes: [
        { route: '/', method: 'GET' },
        { route: '/articles/1', method: 'GET' },
        { route: '/admin', method: 'GET' }
      ],
      assets: '.build/public'
    });

    expect(actual.app).to.deep.equal({
      id: 'io.stackpress.blog',
      name: 'Stackpress Blog',
      version: '1.0.0'
    });
    expect(actual.runtime.open).to.equal('/articles/1');
    expect(actual.routes).to.deep.equal({
      mode: 'allowlist',
      rules: [{ route: '/articles/**', method: 'ALL' }],
      allowed: [{ route: '/articles/1', method: 'GET' }],
      blockedSummary: {
        count: 2,
        reasons: [
          'GET / does not match desktop route allowlist.',
          'GET /admin does not match desktop route allowlist.'
        ]
      }
    });
    expect(actual.files).to.deep.equal({
      main: '.build/desktop/main.js',
      preload: '.build/desktop/preload.js',
      assets: '.build/public'
    });
    expect(actual.package).to.deep.equal({
      tool: 'electron-builder',
      output: '.build/releases'
    });
  });
});
