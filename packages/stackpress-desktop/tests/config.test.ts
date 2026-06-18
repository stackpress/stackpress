import { describe, it } from 'mocha';
import { expect } from 'chai';

import { normalizeDesktopConfig } from '../src/config.js';
import { resolveDesktopDataPath } from '../src/runtime.js';

describe('desktop/config', () => {
  it('should apply safe defaults', () => {
    const actual = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    });

    expect(actual.runtime).to.equal('http');
    expect(actual.server).to.deep.equal({
      host: '127.0.0.1',
      port: 0,
      open: '/'
    });
    expect(actual.window.width).to.equal(1200);
    expect(actual.window.height).to.equal(800);
    expect(actual.window.title).to.equal('Blog');
    expect(actual.security).to.deep.equal({
      externalNavigation: 'deny',
      allowDevTools: false,
      nativeCapabilities: []
    });
  });

  it('should require app metadata', () => {
    expect(() => normalizeDesktopConfig()).to.throw(/app id/i);
    expect(() => normalizeDesktopConfig({ app: { id: 'x' } })).to.throw(/app name/i);
    expect(() => normalizeDesktopConfig({
      app: { id: 'x', name: 'Blog' }
    })).to.throw(/app version/i);
  });

  it('should reject reserved protocol runtime', () => {
    expect(() => normalizeDesktopConfig({
      runtime: 'protocol',
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    })).to.throw(/protocol.*reserved/i);
  });

  it('should reject blocked starting routes', () => {
    expect(() => normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      server: { open: '/admin' },
      routes: [{ route: '/' }]
    })).to.throw(/starting route.*blocked/i);
  });

  it('should reject missing registered starting routes', () => {
    expect(() => normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      server: { open: '/missing' }
    }, {
      registeredRoutes: [{ route: '/', method: 'GET' }]
    })).to.throw(/starting route.*not registered/i);
  });

  it('should preserve Electron renderer security defaults', () => {
    const actual = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    });

    expect(actual.electron.webPreferences).to.deep.equal({
      contextIsolation: true,
      nodeIntegration: false
    });
  });

  it('should support desktop-specific local data paths', () => {
    const actual = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      data: {
        directory: '.build/desktop-data',
        database: 'blog.sqlite'
      }
    });

    expect(actual.data).to.deep.equal({
      directory: '.build/desktop-data',
      database: 'blog.sqlite'
    });
    expect(resolveDesktopDataPath(actual, { cwd: '/app' }))
      .to.equal('/app/.build/desktop-data');
  });

  it('should keep normal app data behavior unchanged by default', () => {
    const actual = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    });

    expect(actual.data).to.deep.equal({
      directory: 'userData',
      database: undefined
    });
    expect(resolveDesktopDataPath(actual, {
      cwd: '/app',
      userDataPath: '/Users/demo/Library/Application Support/Blog'
    })).to.equal('/Users/demo/Library/Application Support/Blog');
  });
});
