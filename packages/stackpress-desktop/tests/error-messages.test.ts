import { describe, it } from 'mocha';
import { expect } from 'chai';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { normalizeDesktopConfig } from '../src/config.js';
import { writeDesktopBuildOutput } from '../src/scripts/build.js';
import { packageDesktopOutput } from '../src/scripts/package.js';

describe('desktop/error messages', () => {
  it('should explain missing metadata without relying on a stack trace', () => {
    expect(() => normalizeDesktopConfig()).to.throw(
      Error,
      'Desktop app id is required.'
    );
  });

  it('should explain blocked starting routes with the blocked path', () => {
    expect(() => normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      server: { open: '/admin' },
      routes: [{ route: '/' }]
    })).to.throw(Error, 'Desktop starting route is blocked by route rules: /admin');
  });

  it('should explain unsupported protocol runtime with a next milestone cue', () => {
    expect(() => normalizeDesktopConfig({
      runtime: 'protocol',
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    })).to.throw(
      Error,
      'Desktop protocol runtime is reserved for a later milestone.'
    );
  });

  it('should explain stale or missing desktop output before packaging', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'stackpress-desktop-'));
    const config = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    });

    const artifact = await packageDesktopOutput(config, { cwd });

    expect(artifact.status).to.equal('failed');
    expect(artifact.message).to.include('run desktop:build before retrying');
    expect(artifact.message).to.include('missing the manifest');
    expect(artifact.message).to.not.match(/\n\s+at /);
    await fs.rm(cwd, { recursive: true, force: true });
  });

  it('should explain packaging adapter failures with an output location', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'stackpress-desktop-'));
    const config = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    });
    await writeDesktopBuildOutput(config, {
      cwd,
      registeredRoutes: [{ route: '/', method: 'GET' }]
    });

    const artifact = await packageDesktopOutput(config, {
      cwd,
      builder: async () => {
        throw new Error('builder unavailable');
      }
    });

    expect(artifact.status).to.equal('failed');
    expect(artifact.outputPath).to.equal(path.join(cwd, '.build/releases'));
    expect(artifact.message).to.include('Check desktop build output');
    expect(artifact.message).to.include('builder unavailable');
    expect(artifact.message).to.not.match(/\n\s+at /);
    await fs.rm(cwd, { recursive: true, force: true });
  });
});
