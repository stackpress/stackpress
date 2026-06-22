//client
import { collectDesktopRoutes, filterDesktopRoutes } from './routeRules.js';
import type {
  DesktopBuildManifest,
  DesktopRouteRecord,
  NormalizedDesktopConfig
} from './types.js';

//Manifest creation options let callers pass known routes directly or provide a
// route metadata source that can be collected during manifest assembly.
export type CreateDesktopManifestOptions = {
  registeredRoutes?: DesktopRouteRecord[];
  routeSource?: Parameters<typeof collectDesktopRoutes>[0];
  assets?: string;
};

/**
 * Create the build manifest consumed by desktop packaging and diagnostics.
 */
export function createDesktopManifest(
  config: NormalizedDesktopConfig,
  options: CreateDesktopManifestOptions = {}
): DesktopBuildManifest {
  //prefer explicit registered routes, then collect route metadata from source
  const registeredRoutes = options.registeredRoutes
    || (options.routeSource ? collectDesktopRoutes(options.routeSource) : []);

  //filter routes through the normalized allowlist so the manifest explains
  // both the desktop surface and any routes excluded from that surface.
  const filtered = filterDesktopRoutes(registeredRoutes, config.routes);

  //serialize only the stable build contract needed by generated runtime files
  // and packaging adapters.
  return {
    schemaVersion: 1,
    app: {
      id: config.app.id!,
      name: config.app.name!,
      version: config.app.version!
    },
    runtime: {
      mode: 'http',
      host: config.server.host!,
      open: config.server.open!
    },
    window: {
      width: config.window.width!,
      height: config.window.height!,
      title: config.window.title!
    },
    routes: {
      mode: config.routes.length ? 'allowlist' : 'allow-all',
      rules: config.routes,
      allowed: filtered.allowed,
      blockedSummary: filtered.blockedSummary
    },
    files: {
      main: config.build.main!,
      preload: config.build.preload!,
      assets: options.assets || '.build/public'
    },
    package: {
      tool: config.package.tool,
      output: config.package.output
    }
  };
}
