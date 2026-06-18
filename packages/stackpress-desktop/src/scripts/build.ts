//node
import fs from 'node:fs/promises';
import path from 'node:path';

//client
import { createDesktopManifest } from '../manifest.js';
import { resolveDesktopPath } from '../runtime.js';
import { createElectronPreloadSource } from './preload.js';
import type { CreateDesktopManifestOptions } from '../manifest.js';
import type {
  DesktopBuildOutput,
  DesktopRouteRecord,
  NormalizedDesktopConfig
} from '../types.js';

//Build output options control where generated files are written and what route
// metadata is included in the desktop manifest.
export type WriteDesktopBuildOutputOptions = {
  cwd?: string;
  registeredRoutes?: DesktopRouteRecord[];
  routeSource?: CreateDesktopManifestOptions['routeSource'];
  assets?: string;
  generatedAt?: string;
};

/**
 * Create the Electron main process source used by packaged desktop builds.
 */
export function createElectronBuildMainSource(config: NormalizedDesktopConfig) {
  //packaged builds bootstrap the app from bundled source, start the same
  //loopback runtime used by dev mode, and then open Electron against the bound
  //ephemeral port.
  const runtimeConfig = {
    ...config,
    server: { ...config.server, port: 0 }
  };
  return `import { app, BrowserWindow } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { startDesktopRuntime } from 'stackpress-desktop';

const runtimeConfig = ${JSON.stringify(runtimeConfig, null, 2)};
const preload = new URL('./preload.js', import.meta.url).pathname;
let runtime;

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function preparePackagedDatabase(appRoot) {
  const dataRoot = runtimeConfig.data.directory === 'userData'
    ? app.getPath('userData')
    : path.resolve(appRoot, runtimeConfig.data.directory);
  const database = runtimeConfig.data.database || 'database';
  const target = path.join(dataRoot, database);
  const seed = path.join(appRoot, '.build', 'database');
  const marker = path.join(target, '.stackpress-desktop-seed');

  process.env.DATABASE_URL = target;
  if (await exists(marker) || !(await exists(seed))) {
    return;
  }

  await fs.rm(target, { recursive: true, force: true });
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.cp(seed, target, {
    recursive: true,
    filter(source) {
      return path.basename(source) !== 'postmaster.pid';
    }
  });
  await fs.writeFile(marker, runtimeConfig.app.version || 'seeded');
}

function showStartupError(error) {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  const window = new BrowserWindow({
    width: ${config.window.width},
    height: ${config.window.height},
    minWidth: ${config.window.minWidth},
    minHeight: ${config.window.minHeight},
    title: ${JSON.stringify(config.window.title)}
  });
  window.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(
    '<!doctype html><title>Stackpress Desktop Error</title>'
      + '<body style="font-family:system-ui;padding:24px">'
      + '<h1>Desktop startup failed</h1><pre style="white-space:pre-wrap">'
      + message.replace(/[&<>]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char]))
      + '</pre></body>'
  ));
}

async function createWindow() {
  const packagedRoot = app.getAppPath();
  const unpackedRoot = packagedRoot.endsWith('.asar')
    ? packagedRoot.replace(/\\.asar$/, '.asar.unpacked')
    : packagedRoot;
  const appRoot = await exists(path.join(unpackedRoot, 'config', 'desktop.ts'))
    ? unpackedRoot
    : packagedRoot;
  process.chdir(appRoot);
  await import(pathToFileURL(
    path.join(appRoot, 'node_modules', 'tsx', 'dist', 'esm', 'index.mjs')
  ).href);
  await preparePackagedDatabase(appRoot);

  const bootstrapUrl = pathToFileURL(path.join(appRoot, 'config', 'desktop.ts')).href;
  const bootstrap = await import(bootstrapUrl);
  const server = await bootstrap.default();
  runtime = await startDesktopRuntime(server, runtimeConfig);

  const window = new BrowserWindow({
    width: ${config.window.width},
    height: ${config.window.height},
    minWidth: ${config.window.minWidth},
    minHeight: ${config.window.minHeight},
    title: ${JSON.stringify(config.window.title)},
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload
    }
  });
  window.loadURL(runtime.url);
}

app.whenReady().then(createWindow).catch(showStartupError);

app.on('window-all-closed', async () => {
  await runtime?.close();
  app.quit();
});
`;
}

/**
 * Write the desktop build manifest, main entry, and preload entry.
 */
export async function writeDesktopBuildOutput(
  config: NormalizedDesktopConfig,
  options: WriteDesktopBuildOutputOptions = {}
): Promise<DesktopBuildOutput> {
  //resolve all output targets before touching the filesystem
  const cwd = options.cwd || process.cwd();
  const manifestTarget = config.build.manifest || '.build/desktop/manifest.json';
  const mainTarget = config.build.main || '.build/desktop/main.js';
  const preloadTarget = config.build.preload || '.build/desktop/preload.js';

  //build the manifest from normalized config and caller-provided route context
  const manifest = createDesktopManifest(config, {
    registeredRoutes: options.registeredRoutes,
    routeSource: options.routeSource,
    assets: options.assets
  });
  const manifestPath = resolveDesktopPath(cwd, manifestTarget);
  const mainPath = resolveDesktopPath(cwd, mainTarget);
  const preloadPath = resolveDesktopPath(cwd, preloadTarget);

  //create target directories independently because callers may place files in
  // separate folders.
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.mkdir(path.dirname(mainPath), { recursive: true });
  await fs.mkdir(path.dirname(preloadPath), { recursive: true });

  //write the JSON manifest and generated Electron source files
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  await fs.writeFile(mainPath, createElectronBuildMainSource(config));
  await fs.writeFile(preloadPath, createElectronPreloadSource());

  //return a build summary that terminal actions and tests can inspect
  return {
    manifestPath,
    mainPath,
    preloadPath,
    appMetadata: manifest.app,
    startRoute: manifest.runtime.open,
    allowedRoutes: manifest.routes.allowed,
    blockedRoutesSummary: manifest.routes.blockedSummary,
    packagingInputs: manifest.files,
    generatedAt: options.generatedAt || new Date().toISOString()
  };
}

/**
 * Invoke the desktop build event through a Stackpress server instance.
 */
export default async function build(
  server: { resolve(event: string): Promise<unknown> }
) {
  //scripts stay thin wrappers around the event lifecycle
  return await server.resolve('desktop:build');
}
