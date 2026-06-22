//node
import type { ChildProcess } from 'node:child_process';
import type {
  IncomingMessage,
  Server as HttpServer,
  ServerResponse
} from 'node:http';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

//modules
import type Server from '@stackpress/ingest/Server';

//client
import MenuRegistry from './MenuRegistry.js';
import { matchDesktopRoute, normalizeDesktopRoutePath } from './routeRules.js';
import { createElectronMainSource } from './scripts/main.js';
import { createElectronPreloadSource } from './scripts/preload.js';
import type {
  DesktopCompiledMenuGroup,
  DesktopElectronMenuGroup,
  DesktopElectronMenuItem,
  DesktopMenuContribution,
  NormalizedDesktopConfig
} from './types.js';

//Runtime event servers expose optional Stackpress event resolution for private
// desktop routes such as menu command dispatch.
export type DesktopRuntimeEventServer = {
  resolve?: (event: string) => Promise<unknown>;
};

//The Ingest Server generic shape is not exported with concrete defaults here,
// so these anys preserve the package's existing server boundary while only
// picking the create method this runtime uses.
export type DesktopRuntimeServer = Pick<Server<any, any, any>, 'create'>
  & DesktopRuntimeEventServer;

//A started desktop runtime session owns the loopback HTTP service and its
// teardown function.
export type DesktopRuntimeSession = {
  allowDesktopEvents: (events: Iterable<string>) => void;
  desktopEventToken: string;
  host: string;
  port: number;
  url: string;
  service: HttpServer;
  close: () => Promise<void>;
};

//Electron window adapters let tests supply a small BrowserWindow substitute
// without importing the real Electron runtime.
export type ElectronWindowAdapter = {
  BrowserWindow: new (options: Record<string, unknown>) => {
    loadURL(url: string): unknown;
    on(event: string, listener: () => void): unknown;
  };
};

//Generated runtime files are returned so dev and tests can inspect the active
// main and preload entries.
export type DesktopRuntimeFiles = {
  mainPath: string;
  preloadPath: string;
};

//Desktop Electron process details pair the spawned child with generated files
// and an exit promise used by dev mode.
export type DesktopElectronProcess = {
  child: ChildProcess;
  files: DesktopRuntimeFiles;
  closed: Promise<number | null>;
};

//The spawn function type is exported so tests can inject a deterministic
// process launcher.
export type DesktopElectronSpawn = typeof spawn;

//Electron launch options control cwd, executable resolution, and process
// spawning for dev runtime startup.
export type DesktopElectronLaunchOptions = {
  cwd?: string;
  electronPath?: string;
  spawn?: DesktopElectronSpawn;
};

//Desktop event authorization is held by the runtime guard and updated when the
// generated Electron menu source is written for the active session.
type DesktopEventAuthorization = {
  allowedEvents: Set<string>;
  token: string;
};

//Runtime file generation can be exercised directly in tests or through a full
// runtime session that carries the private desktop event token.
type DesktopRuntimeFileSession = Pick<DesktopRuntimeSession, 'url'> & {
  desktopEventEvents?: string[];
  desktopEventToken?: string;
  menu?: DesktopCompiledMenuGroup[];
};

type ElectronPackage = {
  default?: unknown;
};

//Menu dispatch functions connect compiled Electron menu items back to
// Stackpress event names.
export type DesktopMenuDispatch = (event: string) => void | Promise<void>;

//Private route used by generated Electron code to dispatch desktop menu events
// into the local Stackpress runtime.
export const DESKTOP_EVENT_ROUTE = '/__stackpress_desktop_event';

//Private desktop event requests must prove they came from generated Electron
// menu code for the current runtime session.
export const DESKTOP_EVENT_TOKEN_HEADER = 'x-stackpress-desktop-event-token';

/**
 * Collect unique event names from compiled desktop menu groups.
 */
export function collectDesktopMenuEvents(groups: DesktopCompiledMenuGroup[]) {
  const events = new Set<string>();

  /**
   * Walk a menu contribution tree and remember every event-backed item.
   */
  function collect(items: DesktopMenuContribution[]) {
    for (const item of items) {
      if (item.event) {
        events.add(item.event);
      }
      if (item.submenu?.length) {
        collect(item.submenu);
      }
    }
  }

  for (const group of groups) {
    collect(group.items);
  }
  return [ ...events ];
}

/**
 * Decide whether a URL points outside the active desktop app origin.
 */
export function isExternalDesktopUrl(target: string, startUrl: string) {
  try {
    //parse both URLs so origin comparison handles ports and protocols correctly
    const targetUrl = new URL(target);
    const appUrl = new URL(startUrl);
    return targetUrl.origin !== appUrl.origin;
  } catch {
    //malformed URLs are treated as external so navigation stays closed by
    // default.
    return true;
  }
}

/**
 * Decide whether external navigation should be opened outside Electron.
 */
export function shouldOpenExternalDesktopUrl(
  config: NormalizedDesktopConfig,
  target: string,
  startUrl: string
) {
  //only true external URLs are eligible, and only when config opted in
  return (
    isExternalDesktopUrl(target, startUrl)
    && config.security.externalNavigation === 'open-external'
  );
}

/**
 * Resolve the desktop data directory for runtime storage.
 */
export function resolveDesktopDataPath(
  config: NormalizedDesktopConfig,
  options: {
    cwd?: string;
    userDataPath?: string;
  } = {}
) {
  const directory = config.data.directory || 'userData';

  //userData delegates to Electron's app data directory when provided
  if (directory === 'userData') {
    return options.userDataPath || 'userData';
  }

  //custom directories resolve against cwd so app config stays portable
  return resolveDesktopPath(options.cwd || process.cwd(), directory);
}

/**
 * Compile desktop menu groups into Electron menu template groups.
 */
export function compileDesktopMenuTemplate(
  groups: DesktopCompiledMenuGroup[],
  dispatch?: DesktopMenuDispatch
): DesktopElectronMenuGroup[] {
  //map every registry group into Electron's label/submenu structure
  return groups.map(group => ({
    label: MenuRegistry.labelForMenu(group.menu),
    submenu: group.items.map(item => compileDesktopMenuItem(item, dispatch))
  }));
}

/**
 * Compile one desktop menu contribution into an Electron menu item.
 */
export function compileDesktopMenuItem(
  item: DesktopMenuContribution,
  dispatch?: DesktopMenuDispatch
): DesktopElectronMenuItem {
  //start with the Electron-compatible fields shared by all menu items
  const compiled: DesktopElectronMenuItem = {
    id: item.id,
    label: item.label,
    role: item.role,
    enabled: item.enabled ?? true
  };

  //nested submenu items are compiled recursively with the same dispatcher
  if (item.submenu?.length) {
    compiled.submenu = item.submenu
      .map(child => compileDesktopMenuItem(child, dispatch));
  }

  //event-backed menu items close over the event name for later dispatch
  if (item.event) {
    const event = item.event;
    compiled.click = () => dispatch?.(event);
  }
  return compiled;
}

/**
 * Build the loopback URL used by Electron to open the local app.
 */
export function resolveDesktopUrl(
  config: NormalizedDesktopConfig,
  port: number
) {
  //read normalized defaults defensively because callers may pass partial-like
  // config in tests or future extension points.
  const host = config.server.host || '127.0.0.1';
  const open = config.server.open || '/';
  return `http://${host}:${port}${open}`;
}

/**
 * Resolve a possibly relative desktop path against the working directory.
 */
export function resolveDesktopPath(cwd: string, target: string) {
  //absolute paths are already stable, relative paths belong under cwd
  return path.isAbsolute(target) ? target : path.join(cwd, target);
}

/**
 * Decide whether a desktop request route is allowed by normalized config.
 */
export function isDesktopRouteAllowed(
  config: NormalizedDesktopConfig,
  route: string,
  method: string = 'GET'
) {
  //delegate route semantics to the shared route matcher used by manifests
  return matchDesktopRoute(config.routes, route, method);
}

/**
 * Write generated Electron main and preload files for the active dev session.
 */
export async function writeDesktopRuntimeFiles(
  config: NormalizedDesktopConfig,
  runtime: DesktopRuntimeFileSession,
  cwd = process.cwd()
): Promise<DesktopRuntimeFiles> {
  //resolve runtime entry targets from normalized build config
  const mainPath = resolveDesktopPath(
    cwd,
    config.build.main || '.build/desktop/main.js'
  );
  const preloadPath = resolveDesktopPath(
    cwd,
    config.build.preload || '.build/desktop/preload.js'
  );

  //ensure both target directories exist before writing generated source
  await fs.mkdir(path.dirname(mainPath), { recursive: true });
  await fs.mkdir(path.dirname(preloadPath), { recursive: true });

  //write the main process file with the active URL, preload path, and menu
  await fs.writeFile(
    mainPath,
    createElectronMainSource(config, {
      url: runtime.url,
      preload: preloadPath,
      menu: runtime.menu,
      desktopEventToken: runtime.desktopEventToken,
      desktopEventEvents: runtime.desktopEventEvents
        || collectDesktopMenuEvents(runtime.menu || [])
    })
  );

  //write preload capabilities from security config so renderer exposure stays
  // explicit and inspectable.
  await fs.writeFile(preloadPath, createElectronPreloadSource({
    nativeCapabilities: config.security.nativeCapabilities
  }));

  return { mainPath, preloadPath };
}

/**
 * Resolve the Electron executable path from an explicit path or dependency.
 */
export async function resolveElectronPath(electronPath?: string) {
  //explicit paths let tests and callers bypass dynamic package resolution
  if (electronPath) {
    return electronPath;
  }

  //Electron's package default export is expected to be the executable path
  const electron = await import('electron') as ElectronPackage;
  const resolved = electron.default;

  //fail clearly if the installed electron package shape is unexpected
  if (typeof resolved !== 'string') {
    throw new Error('The electron package did not resolve to an executable path.');
  }
  return resolved;
}

/**
 * Generate runtime files and spawn Electron for a desktop dev session.
 */
export async function launchDesktopElectron(
  config: NormalizedDesktopConfig,
  runtime: Pick<DesktopRuntimeSession, 'url'> & {
    allowDesktopEvents?: DesktopRuntimeSession['allowDesktopEvents'];
    desktopEventToken?: string;
    menu?: DesktopCompiledMenuGroup[];
  },
  options: DesktopElectronLaunchOptions = {}
): Promise<DesktopElectronProcess> {
  //resolve filesystem and executable inputs before spawning Electron
  const cwd = options.cwd || process.cwd();
  const desktopEventEvents = collectDesktopMenuEvents(runtime.menu || []);
  runtime.allowDesktopEvents?.(desktopEventEvents);
  const files = await writeDesktopRuntimeFiles(config, {
    ...runtime,
    desktopEventEvents
  }, cwd);
  const electronPath = await resolveElectronPath(options.electronPath);
  const spawnElectron = options.spawn || spawn;

  //pass the active runtime URL through the environment for generated code
  const child = spawnElectron(electronPath, [ files.mainPath ], {
    cwd,
    env: { ...process.env, STACKPRESS_DESKTOP_URL: runtime.url },
    stdio: 'inherit'
  });

  //surface process errors and exits through one promise consumed by dev mode
  const closed = new Promise<number | null>((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', code => resolve(code));
  });
  return { child, files, closed };
}

/**
 * Send the standard JSON response for a blocked desktop route.
 */
export function sendBlockedDesktopRoute(
  response: ServerResponse,
  route: string,
  method: string
) {
  //blocked routes intentionally look like not-found responses to the renderer
  response.statusCode = 404;
  response.statusMessage = 'Not Found';
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify({
    code: 404,
    status: 'Not Found',
    error: `Desktop route unavailable: ${method} ${route}`
  }));
}

/**
 * Wrap the Stackpress HTTP service with desktop route and event guards.
 */
export function installDesktopRouteGuard(
  service: HttpServer,
  config: NormalizedDesktopConfig,
  server?: DesktopRuntimeEventServer,
  authorization?: DesktopEventAuthorization
) {
  const canDispatchEvents = typeof server?.resolve === 'function';

  //when there are no allowlist rules and no event route, the service can stay
  // untouched.
  if (!config.routes.length && !canDispatchEvents) {
    return service;
  }

  //capture existing request listeners so the guard can decide when to forward
  // requests back into the Stackpress service.
  const listeners = service.listeners('request') as Array<(
    request: IncomingMessage,
    response: ServerResponse
  ) => void>;
  service.removeAllListeners('request');
  service.on('request', async (request, response) => {
    //normalize request route and method before matching against desktop rules
    const route = normalizeDesktopRoutePath(request.url || '/');
    const method = request.method || 'GET';

    //desktop menu dispatch uses a private route before normal route guards
    if (route === DESKTOP_EVENT_ROUTE) {
      await sendDesktopEventResult(request, response, server, authorization);
      return;
    }

    //blocked app routes never reach the underlying Stackpress service
    if (!isDesktopRouteAllowed(config, route, method)) {
      sendBlockedDesktopRoute(response, route, method);
      return;
    }

    //allowed requests are replayed through the original request listeners
    for (const listener of listeners) {
      listener.call(service, request, response);
    }
  });
  return service;
}

/**
 * Send the JSON result for a private desktop menu event request.
 */
export async function sendDesktopEventResult(
  request: IncomingMessage,
  response: ServerResponse,
  server?: DesktopRuntimeEventServer,
  authorization?: DesktopEventAuthorization
) {
  //parse the event name from the private runtime route query string
  const url = new URL(request.url || '/', 'http://127.0.0.1');
  const event = url.searchParams.get('event');
  const method = request.method || 'GET';
  response.setHeader('Content-Type', 'application/json');

  //menu dispatch is intentionally not a navigable/readable route
  if (method.toUpperCase() !== 'POST') {
    response.statusCode = 405;
    response.setHeader('Allow', 'POST');
    response.end(JSON.stringify({
      code: 405,
      status: 'Method Not Allowed',
      error: 'Desktop menu events require POST.'
    }));
    return;
  }

  //the per-session token keeps unrelated loopback web pages from invoking
  // events even though they can reach the local server port.
  const token = request.headers[DESKTOP_EVENT_TOKEN_HEADER];
  const isAuthorized = typeof token === 'string'
    && token === authorization?.token;
  if (!isAuthorized) {
    response.statusCode = 401;
    response.end(JSON.stringify({
      code: 401,
      status: 'Unauthorized',
      error: 'Desktop menu event authorization failed.'
    }));
    return;
  }

  //event is required because the route is shared by all menu contributions
  if (!event) {
    response.statusCode = 400;
    response.end(JSON.stringify({
      code: 400,
      status: 'Bad Request',
      error: 'Desktop menu event is required.'
    }));
    return;
  }

  //only events emitted by the generated Electron menu for this session are
  // eligible for Stackpress dispatch.
  if (!authorization.allowedEvents.has(event)) {
    response.statusCode = 403;
    response.end(JSON.stringify({
      code: 403,
      status: 'Forbidden',
      error: 'Desktop menu event is not registered for this session.'
    }));
    return;
  }

  //without a resolver, runtime event dispatch is unavailable in this session
  if (!server?.resolve) {
    response.statusCode = 501;
    response.end(JSON.stringify({
      code: 501,
      status: 'Not Implemented',
      error: 'Desktop menu events are unavailable for this runtime.'
    }));
    return;
  }

  //resolve the event through Stackpress and mirror its response code when set
  try {
    const result = await server.resolve(event);
    const data = result && typeof result === 'object'
      ? result as { code?: unknown }
      : {};
    const code = typeof data.code === 'number' && data.code
      ? data.code
      : 200;
    response.statusCode = code;
    response.end(JSON.stringify(result));
  } catch (error) {
    //serialize thrown errors so the Electron fetch receives a clear JSON body
    response.statusCode = 500;
    response.end(JSON.stringify({
      code: 500,
      status: 'Internal Server Error',
      error: error instanceof Error ? error.message : String(error)
    }));
  }
}

/**
 * Start the local Stackpress HTTP service for the desktop Electron shell.
 */
export async function startDesktopRuntime(
  server: DesktopRuntimeServer,
  config: NormalizedDesktopConfig
): Promise<DesktopRuntimeSession> {
  //create the app service through the Stackpress server boundary
  const service = server.create() as HttpServer;
  const authorization: DesktopEventAuthorization = {
    allowedEvents: new Set<string>(),
    token: randomBytes(32).toString('base64url')
  };
  installDesktopRouteGuard(service, config, server, authorization);
  const host = config.server.host || '127.0.0.1';
  const requestedPort = config.server.port ?? 0;

  //listen on the requested port, or let the OS choose one when port is zero
  await new Promise<void>((resolve, reject) => {
    service.once('error', reject);
    service.listen(requestedPort, host, () => {
      service.off('error', reject);
      resolve();
    });
  });

  //read the bound port from the service address once listening has completed
  const address = service.address();
  const port = typeof address === 'object' && address ? address.port : requestedPort;

  //return the runtime session and a close hook that handles already-closed
  // services cleanly.
  return {
    allowDesktopEvents(events) {
      for (const event of events) {
        authorization.allowedEvents.add(event);
      }
    },
    desktopEventToken: authorization.token,
    host,
    port,
    url: resolveDesktopUrl(config, port),
    service,
    close() {
      return new Promise<void>((resolve, reject) => {
        //if another path already closed the service, resolve idempotently
        if (!service.listening) {
          resolve();
          return;
        }

        //otherwise close the HTTP service and surface close errors
        service.close(error => error ? reject(error) : resolve());
      });
    }
  };
}

/**
 * Open an Electron BrowserWindow for an already-started desktop runtime.
 */
export async function openDesktopWindow(
  electron: ElectronWindowAdapter,
  config: NormalizedDesktopConfig,
  runtime: Pick<DesktopRuntimeSession, 'url'>
) {
  //construct BrowserWindow with normalized dimensions and renderer security
  const window = new electron.BrowserWindow({
    width: config.window.width,
    height: config.window.height,
    minWidth: config.window.minWidth,
    minHeight: config.window.minHeight,
    title: config.window.title,
    webPreferences: config.electron.webPreferences
  });

  //load the active local runtime URL into the native shell
  window.loadURL(runtime.url);
  return window;
}
