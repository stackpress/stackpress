import { describe, it } from 'mocha';
import { expect } from 'chai';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { normalizeDesktopConfig } from '../src/config.js';
import packageEvent from '../src/events/package.js';
import { writeDesktopBuildOutput } from '../src/scripts/build.js';
import { packageDesktopOutput } from '../src/scripts/package.js';

describe('desktop/events/package', () => {
  it('should expose a desktop:package action handler', () => {
    expect(packageEvent).to.be.a('function');
  });

  it('should report current-platform artifact success', async () => {
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
      builder: async options => {
        const directories = options.config.directories as { output: string };
        const files = options.config.files as unknown[];
        expect(options.projectDir).to.equal(cwd);
        expect(options.dir).to.equal(false);
        expect(options.config.asarUnpack).to.deep.include.members([
          'config/**/*',
          'plugins/**/*',
          'public/**/*',
          '.build/database/**/*',
          'node_modules/**/*',
          'package.json'
        ]);
        expect(files).to.deep.include.members([
          'package.json',
          'schema.idea',
          'tsconfig.json',
          'uno.config.ts'
        ]);
        expect(files).to.deep.include({
          from: path.join(cwd, 'config'),
          to: 'config'
        });
        expect(files).to.deep.include({
          from: path.join(cwd, 'plugins'),
          to: 'plugins'
        });
        expect(files).to.deep.include({
          from: path.join(cwd, 'public'),
          to: 'public'
        });
        expect(files).to.deep.include({
          from: path.join(cwd, '.build/database'),
          to: '.build/database',
          filter: [ '**/*', '!postmaster.pid' ]
        });
        expect(files).to.deep.include({
          from: path.join(cwd, 'node_modules/blog-client'),
          to: 'node_modules/blog-client'
        });
        await fs.mkdir(directories.output, { recursive: true });
        const outputPath = path.join(directories.output, 'Blog.dmg');
        await fs.writeFile(outputPath, '');
        return [ outputPath ];
      }
    });

    expect(artifact.status).to.equal('created');
    expect(artifact.tool).to.equal('electron-builder');
    expect(artifact.platform).to.match(/^[a-z]+-[a-z0-9]+$/);
    expect(artifact.outputPath).to.equal(path.join(cwd, '.build/releases/Blog.dmg'));
    expect(artifact.message).to.include('Created desktop package');
    await fs.rm(cwd, { recursive: true, force: true });
  });

  it('should return actionable packaging failures', async () => {
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
    await fs.rm(cwd, { recursive: true, force: true });
  });
});
