import { describe, it } from 'mocha';
import { expect } from 'chai';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { normalizeDesktopConfig } from '../src/config.js';
import build, { createDesktopBuildOutput } from '../src/events/build.js';
import { writeDesktopBuildOutput } from '../src/scripts/build.js';

/**
 * Create the smallest app bootstrap tree needed by packaged desktop builds.
 */
async function writeDesktopBootstrapSource(
  cwd: string,
  clientPackage = 'inventory-client'
) {
  await fs.mkdir(path.join(cwd, 'config'), { recursive: true });
  await fs.writeFile(
    path.join(cwd, 'package.json'),
    JSON.stringify({ type: 'module' })
  );
  await fs.writeFile(
    path.join(cwd, 'config/desktop.ts'),
    `import path from 'node:path';

export const config = {
  client: {
    package: '${clientPackage}',
    build: path.join(process.cwd(), 'node_modules', '${clientPackage}')
  }
};

export default async function bootstrap() {
  return {};
}
`
  );
}

describe('desktop/events/build', () => {
  it('should expose a desktop:build action handler', () => {
    expect(build).to.be.a('function');
  });

  it('should compose the Stackpress build lifecycle before writing artifacts', async () => {
    const steps: string[] = [];
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'stackpress-desktop-'));
    const config = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    });

    const output = await createDesktopBuildOutput(config, {
      cwd,
      registeredRoutes: [{ route: '/', method: 'GET' }],
      runStackpressBuild: async () => {
        steps.push('stackpress-build');
      }
    });

    steps.push('desktop-artifacts');
    expect(steps).to.deep.equal([ 'stackpress-build', 'desktop-artifacts' ]);
    expect(output.manifestPath).to.equal(path.join(cwd, '.build/desktop/manifest.json'));
    expect(output.mainPath).to.equal(path.join(cwd, '.build/desktop/main.js'));
    expect(output.preloadPath).to.equal(path.join(cwd, '.build/desktop/preload.js'));
    expect(output.packagingInputs.main).to.equal('.build/desktop/main.js');
    expect(output.packagingInputs.preload).to.equal('.build/desktop/preload.js');
    await fs.rm(cwd, { recursive: true, force: true });
  });

  it('should write manifest, main, preload, and package inputs', async function() {
    this.timeout(10000);
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'stackpress-desktop-'));
    await writeDesktopBootstrapSource(cwd);
    const config = normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' }
    });

    const output = await writeDesktopBuildOutput(config, {
      cwd,
      menu: [
        {
          menu: 'help',
          items: [
            {
              id: 'inventory:sync',
              menu: 'help',
              label: 'Sync Inventory',
              event: 'inventory:desktop-sync'
            }
          ]
        }
      ],
      registeredRoutes: [{ route: '/', method: 'GET' }]
    });
    const manifest = JSON.parse(await fs.readFile(output.manifestPath, 'utf8'));
    const main = await fs.readFile(output.mainPath, 'utf8');
    const preload = await fs.readFile(output.preloadPath, 'utf8');
    const bootstrap = await fs.readFile(
      path.join(cwd, '.build/desktop/app/config/desktop.js'),
      'utf8'
    );

    expect(manifest.app.name).to.equal('Blog');
    expect(manifest.files.main).to.equal('.build/desktop/main.js');
    expect(manifest.files.preload).to.equal('.build/desktop/preload.js');
    expect(manifest.package.output).to.equal('.build/releases');
    expect(main).to.include("import { startDesktopRuntime } from 'stackpress-desktop'");
    expect(main).to.not.include("'tsx'");
    expect(main).to.include("path.join(appRoot, 'config', 'desktop.js')");
    expect(main).to.include('runtime = await startDesktopRuntime(server, runtimeConfig)');
    expect(main).to.include('Menu.setApplicationMenu');
    expect(main).to.include('runtime.allowDesktopEvents(desktopEventEvents)');
    expect(main).to.include('inventory:desktop-sync');
    expect(main).to.include('X-Stackpress-Desktop-Event-Token');
    expect(main).to.include("new URL('./preload.js', import.meta.url).pathname");
    expect(bootstrap).to.include("package: 'inventory-client'");
    expect(preload).to.include('stackpressDesktop');
    await fs.rm(cwd, { recursive: true, force: true });
  });
});
