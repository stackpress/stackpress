//node
import fs from 'node:fs/promises';
import path from 'node:path';

//client
import { createDesktopManifest } from '../manifest.js';
import MenuRegistry from '../MenuRegistry.js';
import {
  collectDesktopMenuEvents,
  resolveDesktopPath
} from '../runtime.js';
import { createElectronPreloadSource } from './preload.js';
import type { CreateDesktopManifestOptions } from '../manifest.js';
import type {
  DesktopBuildOutput,
  DesktopCompiledMenuGroup,
  DesktopMenuContribution,
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
  menu?: DesktopCompiledMenuGroup[];
};

//Generated packaged menu item model is serializable so click handlers can be
// rebuilt inside the Electron main process source.
type ElectronBuildMenuItem = {
  id?: string;
  label?: string;
  role?: string;
  enabled?: boolean;
  event?: string;
  submenu?: ElectronBuildMenuItem[];
};

//Generated packaged menu group model mirrors Electron's menu template shape.
type ElectronBuildMenuGroup = {
  label: string;
  submenu: ElectronBuildMenuItem[];
};

//Build-time TypeScript compiler surface used to emit package-safe JavaScript
// from app-owned config and plugin sources.
type TypeScriptModule = typeof import('typescript');

/**
 * Import TypeScript only when a desktop build needs to compile app bootstrap
 * sources.
 */
async function importTypeScript(): Promise<TypeScriptModule> {
  try {
    return await import('typescript');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      'Install typescript before building packaged desktop output. '
        + `Unable to compile config and plugin bootstrap files. ${message}`
    );
  }
}

/**
 * Return true when a path exists on disk.
 */
async function exists(target: string) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

/**
 * Walk a directory tree and return every contained file path.
 */
async function collectFiles(root: string): Promise<string[]> {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const entryPath = path.join(root, entry.name);
    return entry.isDirectory() ? await collectFiles(entryPath) : [ entryPath ];
  }));
  return files.flat();
}

/**
 * Normalize TypeScript output paths under the packaged app source root.
 */
function getPackagedSourceTarget(
  outputRoot: string,
  cwd: string,
  source: string
) {
  const relative = path.relative(cwd, source);
  const parsed = path.parse(relative);
  const extension = parsed.ext === '.ts' || parsed.ext === '.tsx'
    ? '.js'
    : parsed.ext;
  return path.join(outputRoot, parsed.dir, `${parsed.name}${extension}`);
}

/**
 * Load tsconfig compiler options for transpiling app bootstrap sources.
 */
async function getTypeScriptCompilerOptions(
  typescript: TypeScriptModule,
  cwd: string
) {
  const defaults = {
    jsx: typescript.JsxEmit.ReactJSX,
    module: typescript.ModuleKind.ESNext,
    moduleResolution: typescript.ModuleResolutionKind.Bundler,
    target: typescript.ScriptTarget.ES2022
  };
  const tsconfig = path.join(cwd, 'tsconfig.json');
  if (!(await exists(tsconfig))) {
    return defaults;
  }

  //read the app tsconfig so JSX and module settings follow the application
  // being packaged.
  const config = typescript.readConfigFile(tsconfig, typescript.sys.readFile);
  if (config.error) {
    const message = typescript.flattenDiagnosticMessageText(
      config.error.messageText,
      '\n'
    );
    throw new Error(`Unable to read desktop TypeScript config. ${message}`);
  }

  //parse config through TypeScript so extended configs and relative paths are
  // normalized before per-file transpilation.
  const parsed = typescript.parseJsonConfigFileContent(
    config.config,
    typescript.sys,
    cwd
  );
  return {
    ...defaults,
    ...parsed.options
  };
}

/**
 * Compile app config and plugin TypeScript into package-safe JavaScript.
 */
async function compilePackagedAppSources(cwd: string, buildDirectory: string) {
  const roots = [ 'config', 'plugins' ].map(root => (
    resolveDesktopPath(cwd, root)
  ));
  const sourceRoots: string[] = [];
  for (const root of roots) {
    if (await exists(root)) {
      sourceRoots.push(root);
    }
  }
  if (!sourceRoots.length) {
    return;
  }

  //the packaged Electron process imports from this generated app bundle, so
  // stale files are removed before each build.
  const outputRoot = path.join(
    resolveDesktopPath(cwd, buildDirectory),
    'app'
  );
  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.mkdir(path.join(outputRoot, 'config'), { recursive: true });
  await fs.mkdir(path.join(outputRoot, 'plugins'), { recursive: true });

  //transpile app sources at build time so production packages do not need tsx
  // or a TypeScript loader at startup.
  const typescript = await importTypeScript();
  const options = await getTypeScriptCompilerOptions(typescript, cwd);
  const files = (await Promise.all(sourceRoots.map(collectFiles))).flat();
  for (const file of files) {
    const target = getPackagedSourceTarget(outputRoot, cwd, file);
    await fs.mkdir(path.dirname(target), { recursive: true });

    //skip declaration files because they are not runtime inputs.
    if (file.endsWith('.d.ts')) {
      continue;
    }

    //TypeScript and TSX files become JavaScript next to any copied static
    // plugin/config assets.
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const source = await fs.readFile(file, 'utf8');
      const output = typescript.transpileModule(source, {
        compilerOptions: {
          ...options,
          declaration: false,
          declarationMap: false,
          inlineSourceMap: false,
          noEmit: false,
          outDir: undefined,
          sourceMap: false
        },
        fileName: file,
        reportDiagnostics: true
      });
      const diagnostics = output.diagnostics || [];
      const error = diagnostics.find(diagnostic => (
        diagnostic.category === typescript.DiagnosticCategory.Error
      ));
      if (error) {
        const message = typescript.flattenDiagnosticMessageText(
          error.messageText,
          '\n'
        );
        throw new Error(`Unable to compile desktop bootstrap source. ${message}`);
      }
      await fs.writeFile(target, output.outputText);
      continue;
    }

    //non-TypeScript files under config/plugins are preserved for plugin code
    // that loads local assets at runtime.
    await fs.copyFile(file, target);
  }
}

/**
 * Convert one desktop menu contribution into a serializable build model.
 */
function createBuildMenuItemModel(
  item: DesktopMenuContribution
): ElectronBuildMenuItem {
  //copy only data fields because packaged Electron source recreates callbacks
  return {
    id: item.id,
    label: item.label,
    role: item.role,
    enabled: item.enabled ?? true,
    event: item.event,
    submenu: item.submenu?.map(createBuildMenuItemModel)
  };
}

/**
 * Convert compiled menu groups into serializable Electron menu groups.
 */
function createBuildMenuModel(
  groups: DesktopCompiledMenuGroup[] = []
): ElectronBuildMenuGroup[] {
  //labels are resolved at build time so generated source stays data-only
  return groups.map(group => ({
    label: MenuRegistry.labelForMenu(group.menu),
    submenu: group.items.map(createBuildMenuItemModel)
  }));
}

/**
 * Create the Electron main process source used by packaged desktop builds.
 */
export function createElectronBuildMainSource(
  config: NormalizedDesktopConfig,
  options: {
    menu?: DesktopCompiledMenuGroup[];
  } = {}
) {
  //packaged builds bootstrap the app from bundled source, start the same
  //loopback runtime used by dev mode, and then open Electron against the bound
  //ephemeral port.
  const runtimeConfig = {
    ...config,
    server: { ...config.server, port: 0 }
  };
  const menu = createBuildMenuModel(options.menu);
  const desktopEventEvents = collectDesktopMenuEvents(options.menu || []);

  return `import { app, BrowserWindow, Menu } from 'electron';
	import fs from 'node:fs/promises';
	import path from 'node:path';
	import { pathToFileURL } from 'node:url';
	import { startDesktopRuntime } from 'stackpress-desktop';
	
	const runtimeConfig = ${JSON.stringify(runtimeConfig, null, 2)};
	const preload = new URL('./preload.js', import.meta.url).pathname;
	const menu = ${JSON.stringify(menu, null, 2)};
	const desktopEventEvents = ${JSON.stringify(desktopEventEvents, null, 2)};
	const desktopEventAllowlist = new Set(desktopEventEvents);
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

	function desktopEventUrl(event) {
	  const url = new URL('/__stackpress_desktop_event', runtime.url);
	  url.searchParams.set('event', event);
	  return url.toString();
	}

	function dispatchDesktopEvent(event) {
	  if (!runtime?.desktopEventToken || !desktopEventAllowlist.has(event)) {
	    return;
	  }
	  fetch(desktopEventUrl(event), {
	    method: 'POST',
	    headers: {
	      'X-Stackpress-Desktop-Event-Token': runtime.desktopEventToken
	    }
	  }).catch(error => {
	    console.error('Desktop menu event failed:', error);
	  });
	}

	function toMenuItemTemplate(item) {
	  const template = {
	    id: item.id,
	    label: item.label,
	    role: item.role,
	    enabled: item.enabled,
	    submenu: item.submenu?.map(toMenuItemTemplate)
	  };
	  if (item.event) {
	    template.click = () => dispatchDesktopEvent(item.event);
	  }
	  return template;
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
  const appRoot = await exists(path.join(unpackedRoot, 'config', 'desktop.js'))
    ? unpackedRoot
    : packagedRoot;
  process.chdir(appRoot);
  await preparePackagedDatabase(appRoot);

  const bootstrapPath = path.join(appRoot, 'config', 'desktop.js');
  if (!(await exists(bootstrapPath))) {
    throw new Error(
      'Packaged desktop bootstrap is missing at config/desktop.js. '
        + 'Run desktop:build before packaging.'
    );
  }
  const bootstrapUrl = pathToFileURL(bootstrapPath).href;
	  const bootstrap = await import(bootstrapUrl);
	  const server = await bootstrap.default();
	  runtime = await startDesktopRuntime(server, runtimeConfig);
	  runtime.allowDesktopEvents(desktopEventEvents);
	
	  if (menu.length) {
	    Menu.setApplicationMenu(Menu.buildFromTemplate(menu.map(group => ({
	      label: group.label,
	      submenu: group.submenu.map(toMenuItemTemplate)
	    }))));
	  }
	
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
  const buildDirectory = config.build.directory || '.build/desktop';

  //compile the app bootstrap tree before writing package metadata so desktop
  // packages can start without runtime TypeScript loaders.
  await compilePackagedAppSources(cwd, buildDirectory);

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
  await fs.writeFile(mainPath, createElectronBuildMainSource(config, {
    menu: options.menu
  }));
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
