import { describe, it } from 'mocha';
import { expect } from 'chai';
import http from 'node:http';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { EventEmitter } from 'node:events';

import { normalizeDesktopConfig } from '../src/config.js';
import {
  compileDesktopMenuTemplate,
  launchDesktopElectron,
  openDesktopWindow,
  startDesktopRuntime,
  writeDesktopRuntimeFiles
} from '../src/runtime.js';

describe('desktop/runtime', () => {
  it('should listen on loopback with an ephemeral port', async () => {
    const service = http.createServer((_req, res) => {
      res.statusCode = 200;
      res.end('ok');
    });
    const runtime = await startDesktopRuntime({
      create: () => service
    }, normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    }));

    expect(runtime.host).to.equal('127.0.0.1');
    expect(runtime.port).to.be.greaterThan(0);
    expect(runtime.url).to.match(/^http:\/\/127\.0\.0\.1:\d+\/$/);
    await runtime.close();
  });

  it('should open the configured route', async () => {
    const opened: string[] = [];
    const window = await openDesktopWindow({
      BrowserWindow: class {
        loadURL(url: string) {
          opened.push(url);
        }
        on() {}
      }
    }, normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      server: { open: '/articles' }
    }), { url: 'http://127.0.0.1:49152/articles' });

    expect(window).to.exist;
    expect(opened).to.deep.equal([ 'http://127.0.0.1:49152/articles' ]);
  });

  it('should close the local service on shutdown', async () => {
    const service = http.createServer();
    const runtime = await startDesktopRuntime({
      create: () => service
    }, normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    }));

    await runtime.close();
    expect(service.listening).to.equal(false);
  });

  it('should write Electron runtime files for the active local URL', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'stackpress-desktop-'));
    const config = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    });

    const files = await writeDesktopRuntimeFiles(config, {
      url: 'http://127.0.0.1:49152/',
      menu: [
        {
          menu: 'help',
          items: [
            {
              id: 'blog:latest',
              menu: 'help',
              label: 'Latest Posts',
              event: 'blog:desktop-latest'
            }
          ]
        }
      ]
    }, cwd);
    const main = await fs.readFile(files.mainPath, 'utf8');
    const preload = await fs.readFile(files.preloadPath, 'utf8');

    expect(main).to.include('http://127.0.0.1:49152/');
    expect(main).to.include(files.preloadPath);
    expect(main).to.include('Menu.setApplicationMenu');
    expect(main).to.include('__stackpress_desktop_event');
    expect(main).to.include('blog:desktop-latest');
    expect(preload).to.include('stackpressDesktop');
    await fs.rm(cwd, { recursive: true, force: true });
  });

  it('should spawn Electron with the generated main entry', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'stackpress-desktop-'));
    const spawned: Array<{ command: string, args: string[] }> = [];
    const child = new EventEmitter() as EventEmitter & {
      once(event: string, listener: (...args: unknown[]) => void): typeof child;
    };
    const config = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    });

    const launch = await launchDesktopElectron(config, {
      url: 'http://127.0.0.1:49152/'
    }, {
      cwd,
      electronPath: '/bin/electron',
      spawn(command, args) {
        spawned.push({ command, args });
        return child as never;
      }
    });
    child.emit('exit', 0);

    expect(spawned).to.deep.equal([
      { command: '/bin/electron', args: [ launch.files.mainPath ] }
    ]);
    expect(await launch.closed).to.equal(0);
    await fs.rm(cwd, { recursive: true, force: true });
  });

  it('should compile event-backed menu items into Electron templates', async () => {
    const dispatched: string[] = [];
    const template = compileDesktopMenuTemplate([
      {
        menu: 'help',
        items: [
          {
            id: 'blog:latest',
            menu: 'help',
            label: 'Latest Posts',
            event: 'blog:desktop-latest'
          }
        ]
      }
    ], event => {
      dispatched.push(event);
    });

    await template[0].submenu[0].click?.();

    expect(template[0].label).to.equal('Help');
    expect(template[0].submenu[0]).to.include({
      id: 'blog:latest',
      label: 'Latest Posts',
      enabled: true
    });
    expect(dispatched).to.deep.equal([ 'blog:desktop-latest' ]);
  });
});
