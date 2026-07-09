//client
import { matchDesktopRoute, normalizeRouteRules } from './routeRules.js';
import type {
  DesktopConfig,
  DesktopRouteRecord,
  NormalizedDesktopConfig
} from './types.js';

//Options supplied by build-time callers that can validate configured startup
// routes against routes registered by the Stackpress app.
export type NormalizeDesktopConfigOptions = {
  registeredRoutes?: DesktopRouteRecord[];
};

/**
 * Normalize user desktop config into the fully defaulted runtime contract.
 */
export function normalizeDesktopConfig(
  config: DesktopConfig = {},
  options: NormalizeDesktopConfigOptions = {}
): NormalizedDesktopConfig {
  const app = config.app || {};

  //validate required app metadata first because downstream artifacts need it
  if (!app.id) {
    throw new Error('Desktop app id is required.');
  }
  if (!app.name) {
    throw new Error('Desktop app name is required.');
  }
  if (!app.version) {
    throw new Error('Desktop app version is required.');
  }

  //protocol mode is named in the public config but intentionally blocked until
  // the later runtime milestone can own a separate security review.
  if (config.runtime === 'protocol') {
    throw new Error('Desktop protocol runtime is reserved for a later milestone.');
  }

  //normalize allowlist rules before validating the configured startup route
  const routes = normalizeRouteRules(config.routes || []);
  const server = {
    host: '127.0.0.1' as const,
    port: config.server?.port || 0,
    open: config.server?.open || '/'
  };

  //if route rules are configured, the initial page must be reachable
  if (!matchDesktopRoute(routes, server.open, 'GET')) {
    throw new Error(`Desktop starting route is blocked by route rules: ${server.open}`);
  }

  //when registered routes are supplied, the start page must exist and pass the
  // same route guard that will be installed at runtime.
  if (options.registeredRoutes?.length) {
    const isRegistered = options.registeredRoutes.some(route => (
      route.route === server.open
      && matchDesktopRoute(routes, route.route, route.method || 'GET')
    ));
    if (!isRegistered) {
      throw new Error(`Desktop starting route is not registered or allowed: ${server.open}`);
    }
  }

  //Electron renderer defaults stay secure unless callers explicitly override
  // nested webPreferences with their own object.
  const electron = {
    ...config.electron,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      ...(
        typeof config.electron?.webPreferences === 'object'
          && config.electron.webPreferences !== null
          ? config.electron.webPreferences
          : {}
      )
    }
  };

  //return a single normalized shape so runtime, build, and packaging code do
  // not need to repeat optional config checks.
  return {
    runtime: 'http',
    app: {
      id: app.id,
      name: app.name,
      version: app.version
    },
    server,
    window: {
      width: config.window?.width || 1200,
      height: config.window?.height || 800,
      minWidth: config.window?.minWidth || 480,
      minHeight: config.window?.minHeight || 320,
      title: config.window?.title || app.name
    },
    routes,
    security: {
      externalNavigation: config.security?.externalNavigation || 'deny',
      allowDevTools: config.security?.allowDevTools || false,
      nativeCapabilities: [ ...new Set(config.security?.nativeCapabilities || []) ]
    },
    menu: {
      enabled: config.menu?.enabled ?? true
    },
    updater: {
      enabled: false,
      autoCheck: config.updater?.autoCheck || false,
      autoDownload: config.updater?.autoDownload || false,
      menu: config.updater?.menu ?? true
    },
    data: {
      directory: config.data?.directory || 'userData',
      database: config.data?.database
    },
    build: {
      directory: config.build?.directory || '.build/desktop',
      main: config.build?.main || '.build/desktop/main.js',
      preload: config.build?.preload || '.build/desktop/preload.js',
      manifest: config.build?.manifest || '.build/desktop/manifest.json'
    },
    package: {
      tool: config.package?.tool || 'electron-builder',
      icon: config.package?.icon,
      output: config.package?.output || '.build/releases'
    },
    electron
  };
}
