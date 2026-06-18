//modules
import type Server from '@stackpress/ingest/Server';

//client
import { build, dev, package as packageDesktop } from './events/index.js';
import MenuRegistry from './MenuRegistry.js';
import type {
  DesktopConfig,
  DesktopMenuContribution,
  DesktopPlugin
} from './types.js';

//Reserved update lifecycle events are registered as placeholders so app code
// can target the future updater contract without failing event lookup.
const RESERVED_UPDATE_EVENTS = [
  'desktop:update-check',
  'desktop:update-available',
  'desktop:update-downloaded'
];

/**
 * Create the initial desktop plugin state registered on the Ingest server.
 */
function createDesktopPlugin(): DesktopPlugin {
  //seed Electron adapters as undefined because they are bound by runtime code
  // later, while config and menu contributions are available immediately.
  return {
    app: undefined,
    BrowserWindow: undefined,
    Menu: undefined,
    shell: undefined,
    dialog: undefined,
    ipcMain: undefined,
    nativeImage: undefined,
    config: {},
    menu: new MenuRegistry({ updatePlaceholder: true })
  };
}

//Desktop event patterns keep registration strict while matching Ingest's regex
// event registration style used by neighboring Stackpress packages.
const DESKTOP_BUILD_EVENT = /^desktop:build$/;
const DESKTOP_DEV_EVENT = /^desktop:dev$/;
const DESKTOP_PACKAGE_EVENT = /^desktop:package$/;

/**
 * Return the registered desktop plugin state or fail with a clear message.
 */
export function getDesktopPlugin(ctx: Server): DesktopPlugin {
  const desktop = ctx.plugin<DesktopPlugin>('desktop');

  //desktop helpers require the plugin to be registered before contribution
  // code runs, so fail early when the plugin is missing.
  if (!desktop) {
    throw new Error('Desktop plugin is not registered.');
  }
  return desktop;
}

/**
 * Ensure plugin authors contribute before the runtime has initialized.
 */
export function assertDesktopContributionOpen(
  desktop: DesktopPlugin,
  event: string
) {
  //once the desktop runtime is initialized, changing config or menu state would
  // desync generated Electron files from the active app session.
  if (desktop.initialized) {
    throw new Error(`${event} contributions must run before desktop initialization.`);
  }
}

/**
 * Merge a desktop config patch into the plugin-held desktop config.
 */
export function contributeDesktopConfig(
  ctx: Server,
  patch: DesktopConfig
) {
  const desktop = getDesktopPlugin(ctx);
  assertDesktopContributionOpen(desktop, 'desktop:config');

  //merge each nested config group so later contributors can provide partial
  // desktop config without erasing earlier contribution groups.
  desktop.config = {
    ...desktop.config,
    ...patch,
    app: { ...desktop.config.app, ...patch.app },
    server: { ...desktop.config.server, ...patch.server },
    window: { ...desktop.config.window, ...patch.window },
    security: { ...desktop.config.security, ...patch.security },
    menu: { ...desktop.config.menu, ...patch.menu },
    updater: { ...desktop.config.updater, ...patch.updater },
    data: { ...desktop.config.data, ...patch.data },
    build: { ...desktop.config.build, ...patch.build },
    package: { ...desktop.config.package, ...patch.package },
    electron: { ...desktop.config.electron, ...patch.electron },
    routes: patch.routes || desktop.config.routes
  };

  //return the live config reference so direct helper callers can inspect it
  return desktop.config;
}

/**
 * Add one or more desktop menu contributions to the plugin menu registry.
 */
export function contributeDesktopMenu(
  ctx: Server,
  contributions: DesktopMenuContribution | DesktopMenuContribution[]
) {
  const desktop = getDesktopPlugin(ctx);
  assertDesktopContributionOpen(desktop, 'desktop:menu');
  const registry = desktop.menu as MenuRegistry;
  const items = Array.isArray(contributions) ? contributions : [ contributions ];

  //for each contribution, delegate validation and deterministic ordering to
  // the registry instead of duplicating menu rules in the plugin layer.
  for (const item of items) {
    registry.add(item);
  }
  return registry;
}

/**
 * Dispatch a desktop menu event through the Stackpress event resolver.
 */
export async function dispatchDesktopMenuEvent(ctx: Server, event: string) {
  //menu actions intentionally stay inside Stackpress event resolution so app
  // plugins can reuse normal server-side lifecycle behavior.
  return await ctx.resolve(event);
}

/**
 * Mark the desktop plugin state as initialized.
 */
export function markDesktopInitialized(ctx: Server) {
  const desktop = getDesktopPlugin(ctx);

  //after this point late config or menu contributions are rejected
  desktop.initialized = true;
  return desktop;
}

/**
 * Placeholder handler for updater events that are reserved but not implemented.
 */
function reservedUpdateEvent() {
  //returning undefined keeps placeholder events no-op until updater support
  // provides concrete event behavior in a later milestone.
  return undefined;
}

/**
 * Register desktop plugin state and desktop event handlers on the server.
 */
export default function plugin(ctx: Server) {
  ctx.register('desktop', createDesktopPlugin());
  ctx.on('listen', ({ ctx }) => {
    //desktop:config lets app plugins contribute config before normalization
    ctx.on('desktop:config', ({ req, ctx }) => {
      const patch = req.data.get() as DesktopConfig;

      //ignore empty payloads so listeners can safely emit the lifecycle event
      if (patch && Object.keys(patch).length) {
        contributeDesktopConfig(ctx, patch);
      }
    });

    //desktop:menu lets app plugins contribute either one item or a batch
    ctx.on('desktop:menu', ({ req, ctx }) => {
      const contributions = req.data.get() as (
        DesktopMenuContribution | DesktopMenuContribution[]
      );

      //only payloads that look like menu contributions are passed to registry
      if (Array.isArray(contributions) || contributions?.id) {
        contributeDesktopMenu(ctx, contributions);
      }
    });

    //register terminal-facing desktop commands after contribution lifecycles
    ctx.on(DESKTOP_BUILD_EVENT, build);
    ctx.on(DESKTOP_DEV_EVENT, dev);
    ctx.on(DESKTOP_PACKAGE_EVENT, packageDesktop);

    //reserve update events without overriding handlers provided before listen
    for (const event of RESERVED_UPDATE_EVENTS) {
      if (!ctx.listeners[event]?.size) {
        ctx.on(event, reservedUpdateEvent);
      }
    }
  });
};
