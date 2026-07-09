import { describe, it } from 'mocha';
import { expect } from 'chai';

import { normalizeDesktopConfig } from '../src/config.js';
import {
  isExternalDesktopUrl,
  shouldOpenExternalDesktopUrl,
  writeDesktopRuntimeFiles
} from '../src/runtime.js';
import { createElectronMainSource } from '../src/scripts/main.js';
import { createElectronPreloadSource } from '../src/scripts/preload.js';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

describe('desktop/security', () => {
  it('should identify external navigation against the app origin', () => {
    const startUrl = 'http://127.0.0.1:49152/';

    expect(isExternalDesktopUrl('http://127.0.0.1:49152/articles', startUrl))
      .to.equal(false);
    expect(isExternalDesktopUrl('https://example.com', startUrl))
      .to.equal(true);
    expect(isExternalDesktopUrl('not a url', startUrl)).to.equal(true);
  });

  it('should block unexpected external navigation by default', () => {
    const config = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    });

    expect(shouldOpenExternalDesktopUrl(
      config,
      'https://example.com',
      'http://127.0.0.1:49152/'
    )).to.equal(false);
  });

  it('should open allowed external navigation outside the desktop app', () => {
    const config = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      security: { externalNavigation: 'open-external' }
    });
    const source = createElectronMainSource(config, {
      url: 'http://127.0.0.1:49152/'
    });

    expect(shouldOpenExternalDesktopUrl(
      config,
      'https://example.com',
      'http://127.0.0.1:49152/'
    )).to.equal(true);
    expect(source).to.include('shell.openExternal(target)');
    expect(source).to.include("return { action: 'deny' };");
    expect(source).to.include("window.webContents.on('will-navigate'");
  });

  it('should expose only explicit native capability names through preload', () => {
    const source = createElectronPreloadSource({
      nativeCapabilities: [ 'desktop:event', 'desktop:event' ]
    });

    expect(source).to.include('contextBridge.exposeInMainWorld');
    expect(source).to.include('"desktop:event"');
    expect(source).to.not.include('ipcRenderer');
    expect(source.match(/desktop:event/g)).to.have.length(1);
  });

  it('should write preload capability metadata from normalized config', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'stackpress-desktop-'));
    const config = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      security: { nativeCapabilities: [ 'desktop:event' ] }
    });

    const files = await writeDesktopRuntimeFiles(config, {
      url: 'http://127.0.0.1:49152/'
    }, cwd);
    const preload = await fs.readFile(files.preloadPath, 'utf8');

    expect(preload).to.include('"desktop:event"');
    await fs.rm(cwd, { recursive: true, force: true });
  });
});
