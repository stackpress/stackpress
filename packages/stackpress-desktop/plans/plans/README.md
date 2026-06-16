# Stackpress Desktop

Proposal for adding a `stackpress-desktop` package that lets Stackpress apps ship as Electron desktop applications while preserving Stackpress routing, backend handlers, server-rendered views, API routes, sessions, and build behavior.

## 1. Summary

Stackpress should support a first-class desktop app target through a new package named `stackpress-desktop`.

The package should not turn Stackpress apps into static SPAs by default. Instead, it should wrap the existing Stackpress runtime inside Electron:

 - Electron owns the desktop shell, windows, menus, lifecycle, preload scripts, packaging, and native integration.
 - Stackpress continues to own routing, events, APIs, sessions, server-rendered pages, view generation, and app plugins.
 - Reactus continues to own view/client/assets build output.
 - Ingest route metadata can be used to discover lazy handlers, route boundaries, entries, and views during the desktop build.

This model matches how several mature Electron desktop tools work. For example, Eclipse Theia runs frontend and backend processes locally in Electron while using HTTP/WebSocket-style communication. JupyterLab Desktop also bundles a local backend server with an Electron shell.

## 2. Goals

The desktop package should make it possible to:

 - Build a Stackpress app into a desktop application using Electron.
 - Reuse existing Stackpress backend routing instead of requiring a separate SPA-only frontend.
 - Keep Stackpress page handlers, API handlers, generated admin routes, session logic, CSRF logic, and local database connections working.
 - Compose the existing `stackpress build` flow rather than duplicating Reactus build behavior.
 - Let apps restrict which routes are available in the desktop target.
 - Support local-first apps that use PGlite, SQLite, files, or other local resources.
 - Expose Electron primitives through a typed Stackpress plugin registration.
 - Let other Stackpress plugins contribute desktop config before Electron initializes.
 - Provide a Stackpress-shaped menu contribution model for app and plugin menus.
 - Provide a clear path for app update checks and in-app update prompts.
 - Provide a clear template workflow for development, build, and packaging.

## 3. Non-Goals

The first version should not try to:

 - Replace Electron with another desktop runtime.
 - Rewrite Stackpress views as a static SPA.
 - Add offline synchronization, code signing, notarization, or crash reporting as complete built-in systems.
 - Fully solve app updater provider setup in the first milestone.
 - Solve remote deployment and desktop packaging through one command.
 - Automatically make every web-only plugin safe for desktop.
 - Rework the aggregate `stackpress/plugin` package unless route filtering proves insufficient.

Those capabilities can be explored after the core runtime model is proven.

## 4. Proposed Runtime Model

The first supported runtime should be local HTTP mode. The config should still
reserve a `desktop.runtime` field so a future WHATWG custom protocol runtime can
be added without changing the public config shape.

In local HTTP mode:

 1. Electron starts.
 2. The Electron main process loads the desktop config.
 3. `stackpress-desktop` bootstraps the configured Stackpress app.
 4. Stackpress starts an HTTP server on `127.0.0.1` using an available port.
 5. Electron opens a `BrowserWindow` pointed at `http://127.0.0.1:<port>/`.
 6. Requests flow through normal Stackpress routing.
 7. Electron shuts down the local server when the app exits.

This preserves the current Stackpress runtime contract:

 - page routes still run page handlers
 - API routes still run backend handlers
 - sessions and cookies still work through HTTP
 - admin can work when included
 - generated client assets still load through HTTP routes
 - local stores can initialize during the normal `config` lifecycle

The default config should be explicit:

```ts
desktop: {
  runtime: 'http'
}
```

### 4.1. Optional Custom Protocol Mode

A later version can support a custom Electron protocol such as `stackpress://app/...`.

That mode would likely use `stackpress/whatwg` and adapt Electron protocol requests into WHATWG `Request` and `Response` objects.

This may be useful for a more native-looking app URL model, but it should not be the first default because local HTTP mode has fewer moving parts and better compatibility with current Stackpress behavior.

The config should reserve protocol-specific options even if the first
implementation only accepts `runtime: 'http'`:

```ts
desktop: {
  runtime: 'protocol',
  protocol: {
    scheme: 'stackpress',
    host: 'app'
  }
}
```

The first implementation can validate this as unsupported and return a clear
error. That keeps the long-term design visible without committing to the
adapter work too early.

## 5. Build Model

`desktop:build` should compose the existing Stackpress build flow.

The desktop build should:

 1. Bootstrap the configured Stackpress app.
 2. Resolve the normal `config`, `listen`, and `route` lifecycle events.
 3. Run or compose the existing `build` event registered by `stackpress-view`.
 4. Let Reactus build clients, assets, and server page output.
 5. Inspect Ingest route metadata:
    - `server.routes`
    - `server.imports`
    - `server.entries`
    - `server.views`
 6. Apply desktop route filters.
 7. Write a desktop manifest into the build directory.
 8. Copy or generate Electron main/preload/package files.
 9. Hand the build output to the selected Electron packaging tool.

The key point is that desktop build should compose this existing flow:

```ts
// existing view build event
// packages/stackpress-view/src/events/build.ts
ctx.on('build', build);
```

The desktop package should not duplicate Reactus internals. It should invoke the Stackpress build lifecycle and then add desktop-specific artifacts around the result.

## 6. Package Shape

Add a new workspace package:

```txt
packages/stackpress-desktop/
  LICENSE
  README.md
  package.json
  src/
    index.ts
    plugin.ts
    MenuRegistry.ts
    types.ts
    events/
      build.ts
      dev.ts
      package.ts
      index.ts
    scripts/
      build.ts
      dev.ts
      package.ts
      main.ts
      preload.ts
      index.ts
  tsconfig.json
  tsconfig.cjs.json
  tsconfig.esm.json
```

The package should follow existing Stackpress package conventions:

 - build to `cjs` and `esm`
 - expose `./plugin`, `./events`, `./scripts`, `./types`, and `.`
 - register plugin events during the `listen` lifecycle
 - keep public types in `src/types.ts`
 - keep menu collection and compilation in a focused registry class

Suggested root script:

```json
{
  "scripts": {
    "desktop": "yarn --cwd packages/stackpress-desktop"
  }
}
```

## 7. CLI Surface

The package should add desktop-specific events and corresponding scripts.

Suggested commands:

```bash
stackpress desktop:dev --b config/desktop -v
stackpress desktop:build --b config/desktop -v
stackpress desktop:package --b config/desktop -v
```

### 7.1. `desktop:dev`

Starts a desktop development session.

Expected behavior:

 - bootstraps the Stackpress app with desktop config
 - starts the Stackpress server locally
 - starts Electron
 - loads the local Stackpress URL
 - optionally watches files and restarts the Stackpress server

### 7.2. `desktop:build`

Builds desktop-ready Stackpress output without necessarily producing a signed installer.

Expected behavior:

 - composes normal `stackpress build`
 - writes desktop manifest output
 - prepares Electron main/preload files
 - copies app metadata and assets needed for packaging

### 7.3. `desktop:package`

Packages the desktop app for the current platform.

Expected behavior:

 - runs `desktop:build` if needed
 - invokes the selected packaging tool
 - outputs platform-specific artifacts

Packaging should be configurable so the package can support `electron-builder`, `electron-forge`, or a simple default later.

## 8. Config Shape

Add a `desktop` config namespace.

Example:

```ts
export const desktop = {
  runtime: 'http' as 'http',
  app: {
    id: 'io.stackpress.blog',
    name: 'Stackpress Blog',
    version: '1.0.0'
  },
  server: {
    host: '127.0.0.1',
    port: 0,
    open: '/'
  },
  protocol: {
    scheme: 'stackpress',
    host: 'app'
  },
  window: {
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 640,
    title: 'Stackpress Blog'
  },
  routes: [
    {
      method: 'ALL' as 'ALL',
      route: '/'
    },
    {
      method: 'ALL' as 'ALL',
      route: '/articles/**'
    },
    {
      method: 'GET' as 'GET',
      route: '/api/article/**'
    }
  ],
  security: {
    externalNavigation: 'deny',
    allowDevTools: true
  },
  menu: {
    enabled: true
  },
  updater: {
    enabled: false,
    autoCheck: true,
    autoDownload: false,
    menu: true
  },
  build: {
    directory: '.build/desktop',
    main: '.build/desktop/main.js',
    preload: '.build/desktop/preload.js',
    manifest: '.build/desktop/manifest.json'
  },
  package: {
    tool: 'electron-builder',
    icon: 'public/icon.png',
    output: '.build/releases'
  },
  electron: {
    browserWindow: {
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false
      }
    }
  }
};
```

The app bootstrap can then include it:

```ts
server.config.set({
  ...config,
  desktop
});
```

### 8.1. Desktop Types

The package should expose `DesktopConfig` and `DesktopPlugin` types so app
configs and plugins can infer the desktop shape without importing internal
implementation details.

Suggested public types:

```ts
export type DesktopConfig = {
  runtime?: 'http' | 'protocol',
  app?: DesktopAppConfig,
  server?: DesktopServerConfig,
  protocol?: DesktopProtocolConfig,
  window?: DesktopWindowConfig,
  routes?: DesktopRouteRule[],
  security?: DesktopSecurityConfig,
  menu?: DesktopMenuConfig,
  updater?: DesktopUpdaterConfig,
  data?: DesktopDataConfig,
  plugins?: DesktopPluginConfig,
  build?: DesktopBuildConfig,
  package?: DesktopPackageConfig,
  electron?: DesktopElectronConfig
};

export type DesktopPlugin = {
  app: Electron.App,
  BrowserWindow: typeof Electron.BrowserWindow,
  Menu: typeof Electron.Menu,
  shell: typeof Electron.shell,
  dialog: typeof Electron.dialog,
  ipcMain: typeof Electron.ipcMain,
  nativeImage: typeof Electron.nativeImage,
  autoUpdater?: typeof Electron.autoUpdater,
  config: DesktopConfig,
  menu: DesktopMenuRegistry
};
```

`DesktopPlugin` should be the value registered as `desktop` so other plugins can
use the normal Stackpress plugin lookup pattern:

```ts
const desktop = server.plugin<DesktopPlugin>('desktop');
```

### 8.2. Desktop Plugin Registration

`stackpress-desktop` should register Electron primitives under a `desktop`
plugin before Electron app initialization.

Suggested registration:

```ts
server.register('desktop', {
  app,
  BrowserWindow,
  Menu,
  shell,
  dialog,
  ipcMain,
  nativeImage,
  autoUpdater,
  config,
  menu
});
```

This keeps raw Electron access available while still giving Stackpress plugins a
stable composition point. App plugins should not need to import Electron just to
add a menu item, register an IPC handler, or inspect desktop config.

### 8.3. Raw Electron Config

The desktop package should expose an escape hatch for raw Electron config,
similar to how `stackpress-view` lets apps pass raw Vite config through
`view.engine.vite`.

Top-level desktop config should cover common and required options. Raw Electron
config should live under `desktop.electron` and be merged during desktop plugin
initialization.

Example:

```ts
desktop: {
  window: {
    width: 1200,
    height: 800
  },
  electron: {
    browserWindow: {
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false
      }
    },
    app: {
      name: 'Stackpress Blog'
    }
  }
}
```

Suggested merge order:

 1. `stackpress-desktop` defaults
 2. top-level `desktop` config
 3. raw `desktop.electron` config
 4. plugin-contributed config
 5. final runtime normalization

Top-level config should remain the recommended path. Raw config should be the
escape hatch for Electron options that Stackpress Desktop does not model yet.

### 8.4. Config Contribution Lifecycle

Other plugins should be able to contribute to desktop config before the Electron
app and windows are initialized.

Suggested lifecycle:

 1. Bootstrap the Stackpress app.
 2. Resolve normal `config` and `listen` events.
 3. Register Electron primitives as the `desktop` plugin.
 4. Create the initial desktop config from defaults and app config.
 5. Emit `desktop:config` so plugins can mutate or extend config.
 6. Normalize the final desktop config.
 7. Initialize Electron app, menus, windows, updater, and local server.

Suggested events:

```ts
server.on('desktop:config', ...)
server.on('desktop:menu', ...)
server.on('desktop:ready', ...)
server.on('desktop:update-check', ...)
server.on('desktop:update-available', ...)
server.on('desktop:update-downloaded', ...)
```

The important boundary is that `desktop:config` runs before Electron uses the
config to create native objects. `desktop:ready` runs after the app, menus, and
main window are available.

### 8.5. Menu Contributions

Electron menus are tree-shaped templates. Stackpress Desktop should offer a
small menu registry so packages can contribute menu items without manually
editing one shared template array.

The registry can be based on `Set` or a priority-aware collection from
`@stackpress/lib`. Its job is to collect menu items, sort them, and compile
them into `Menu.buildFromTemplate(...)`.

Suggested contribution shape:

```ts
desktop.menu.add({
  id: 'help.check-updates',
  menu: 'help',
  label: 'Check for Updates',
  priority: 100,
  event: 'desktop:update-check'
});
```

Plugins should also be able to contribute submenu items:

```ts
server.on('desktop:menu', ({ ctx }) => {
  const desktop = ctx.plugin<DesktopPlugin>('desktop');

  desktop.menu.add({
    id: 'app.about',
    menu: 'app',
    label: 'About',
    role: 'about'
  });

  desktop.menu.add({
    id: 'help.check-updates',
    menu: 'help',
    label: 'Check for Updates',
    event: 'desktop:update-check'
  });
});
```

The first implementation should support common app, file, edit, view, window,
and help menus. It can still allow raw Electron `MenuItemConstructorOptions` for
advanced cases.

### 8.6. Updater Support

The desktop config should reserve updater settings so desktop apps can offer a
standard "new version available" flow.

Suggested config:

```ts
desktop: {
  updater: {
    enabled: true,
    provider: 'github',
    owner: 'stackpress',
    repo: 'my-app',
    autoCheck: true,
    autoDownload: false,
    menu: true
  }
}
```

Expected behavior:

 1. App starts.
 2. Desktop package checks for updates when `autoCheck` is enabled.
 3. If an update is available, it emits `desktop:update-available`.
 4. The app shows a native dialog, notification, or menu state.
 5. The user chooses whether to download or install the update.
 6. The app emits progress and completion events.
 7. The user can restart to apply the update.

The first milestone can provision the config, menu entry, and events without
fully solving every provider. If packaging uses `electron-builder`,
`electron-updater` is likely the practical implementation path. Electron's
built-in `autoUpdater` should remain available through the registered desktop
plugin for apps that want direct access.

## 9. Route Filtering

Desktop builds need a way to restrict the routes included in a desktop target.

This should follow the same style as the `stackpress-session` access config:
route rules are plain objects with a `method` and `route`. The desktop package
should not add a separate `type` field for include or ignore behavior.

This matters because a desktop app may not want to ship every web route. A common example is allowing public article pages while leaving admin pages out of a public desktop build.

Proposed config:

```ts
desktop: {
  routes: [
    //Public Desktop Routes
    {
      method: 'ALL' as 'ALL',
      route: '/'
    },
    //Article Routes
    {
      method: 'ALL' as 'ALL',
      route: '/articles/**'
    },
    {
      method: 'GET' as 'GET',
      route: '/api/article/**'
    }
  ]
}
```

If `desktop.routes` is empty or omitted, every route is allowed by default. If
one or more routes are configured, desktop mode switches to allowlist behavior:
only matching routes are allowed, and all other routes are blocked by default.

Route filtering should apply in two places:

 - build-time manifest generation
 - runtime request guard

Build-time filtering prevents non-allowed lazy routes, entries, and views from being included in the desktop route manifest when possible.

Runtime filtering protects against routes that were registered by plugins before the desktop package had a chance to filter build output.

### 9.1. Matching Rules

Each route rule should use this shape:

```ts
type DesktopRouteRule = {
  method?: 'ALL' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS',
  route: string
};
```

The route matcher should support simple route patterns first:

 - exact paths, such as `/admin`
 - wildcard paths, such as `/admin/**`
 - all paths, such as `/**`

Regular expressions can be added later if needed, but simple patterns are easier to document and safer for app authors.

### 9.2. Allowlist Behavior

The proposed decision rule:

 1. If `desktop.routes` is empty or omitted, every registered route is allowed.
 2. If `desktop.routes` has one or more entries, a route must match at least one configured rule.
 3. If no configured rule matches, the route is blocked from the desktop target.

This makes the default permissive for simple apps while giving desktop builds a
clear allowlist when an app needs to ship only part of the web surface.

## 10. Plugin Exclusion

Route filtering is useful, but it happens after plugins register behavior.

For some desktop builds, it may be cleaner to avoid loading entire plugins. For example, excluding `stackpress-admin` at plugin load time is cleaner than registering admin routes and blocking them afterward.

Possible future config:

```ts
desktop: {
  plugins: {
    exclude: [
      'stackpress-admin'
    ]
  }
}
```

This would likely require a change to how the aggregate `stackpress/plugin` export loads built-in plugins. Because that affects shared package behavior, plugin exclusion should be treated as a later design step unless route filtering is not enough.

## 11. Template Changes

Start with `templates/blog` because it is the primary end-to-end example and exercises the important surfaces:

 - public pages
 - generated admin routes
 - API routes
 - sessions
 - local PGlite storage
 - Reactus build output
 - local plugins

Suggested additions:

```txt
templates/blog/config/desktop.ts
```

Suggested package scripts:

```json
{
  "scripts": {
    "desktop:dev": "dotenv -e .env -- stackpress desktop:dev --b config/desktop -v",
    "desktop:build": "dotenv -e .env -- stackpress desktop:build --b config/desktop -v",
    "desktop:package": "dotenv -e .env -- stackpress desktop:package --b config/desktop -v"
  }
}
```

A separate `templates/desktop` can be added later if the desktop target needs a dedicated starter.

## 12. Security Considerations

Desktop mode should use a conservative Electron setup by default.

Recommended defaults:

 - bind the Stackpress server to `127.0.0.1`
 - use an ephemeral port by default
 - disable Node integration in the renderer
 - enable context isolation
 - use a preload script for explicit native capabilities
 - block unexpected external navigation
 - open external links through Electron shell APIs
 - prevent arbitrary remote content from gaining access to preload APIs

Local HTTP mode means the local server may be reachable by local processes. This is acceptable for a first version if the server binds only to loopback and follows normal Stackpress auth/session rules, but it should be documented clearly.

## 13. Local Data

Desktop apps should be able to use local data paths that differ from development paths.

For example, a desktop app using PGlite should not necessarily write to `./.build/database` after packaging. It may need to write to Electron's user data directory.

Possible config:

```ts
desktop: {
  data: {
    directory: 'userData',
    database: 'database'
  }
}
```

The desktop package can expose helpers that resolve app-specific runtime paths:

```ts
import { desktopPath } from 'stackpress-desktop';

const databasePath = desktopPath('database');
```

This should be added carefully so normal web/server deployments do not inherit Electron assumptions.

## 14. Development Workflow

Expected developer workflow:

```bash
yarn blog generate
yarn blog generate:client
yarn blog push
yarn blog desktop:dev
```

Expected production-style workflow:

```bash
yarn blog generate
yarn blog generate:client
yarn blog push
yarn blog desktop:build
yarn blog desktop:package
```

The exact order may change if desktop build composes generation or database setup later, but the first version should stay explicit and consistent with existing Stackpress command flow.

## 15. Implementation Phases

### 15.1. Phase 1: Package Skeleton

 - Add `packages/stackpress-desktop`.
 - Add dual CJS/ESM build.
 - Add plugin entrypoint.
 - Register `desktop:dev`, `desktop:build`, and `desktop:package` events.
 - Add root `desktop` workspace shortcut.
 - Add `DesktopConfig`, `DesktopPlugin`, `DesktopRouteRule`, and menu registry
   types.
 - Add config types for `desktop.runtime`, `desktop.server`, reserved
   `desktop.protocol` settings, raw `desktop.electron` settings, and updater
   settings.
 - Support `runtime: 'http'` and return a clear unsupported-runtime error for
   `runtime: 'protocol'`.

### 15.2. Phase 2: Local HTTP Runtime

 - Register Electron primitives as the `desktop` plugin.
 - Merge defaults, top-level desktop config, raw Electron config, and
   plugin-contributed config.
 - Emit `desktop:config` before creating native Electron objects.
 - Implement local server launch helper.
 - Select available loopback port.
 - Start Electron with `BrowserWindow`.
 - Load the configured opening route.
 - Shut down server on app exit.

### 15.3. Phase 3: Build Composition

 - Compose existing Stackpress `build`.
 - Collect route/import/entry/view metadata from Ingest.
 - Write desktop manifest.
 - Generate or copy Electron main/preload files.

### 15.4. Phase 4: Route Filtering

 - Add desktop route rule config types.
 - Apply filters while generating the desktop manifest.
 - Add runtime guard for non-allowed routes.
 - Add tests for empty allow-all behavior, exact routes, wildcard routes,
   method matching, and default-blocked behavior once routes are configured.

### 15.5. Phase 5: Menu And Plugin Contributions

 - Implement a desktop menu registry.
 - Support app, file, edit, view, window, and help menu groups.
 - Emit `desktop:menu` before compiling the Electron menu.
 - Compile menu contributions into Electron menu templates.
 - Add a default updater menu item when updater menu config is enabled.

### 15.6. Phase 6: Template Proof

 - Add `templates/blog/config/desktop.ts`.
 - Add blog desktop scripts.
 - Verify public pages work.
 - Verify admin routes are unavailable when they are not in the configured desktop route list.
 - Verify API/session behavior still works for included routes.
 - Verify local database path behavior.
 - Verify local plugins can contribute menu items.

### 15.7. Phase 7: Packaging

 - Pick the first supported packager.
 - Generate packager config from Stackpress desktop config.
 - Package for at least macOS first, then Windows and Linux.
 - Document signing and notarization as follow-up tasks.

### 15.8. Future Phase: Updater Providers

 - Choose the first updater integration path.
 - Wire update check, available, progress, downloaded, error, and restart events.
 - Support a native update dialog or menu-driven update prompt.
 - Document provider-specific setup for packaged apps.

### 15.9. Future Phase: WHATWG Protocol Runtime

 - Register an Electron custom protocol.
 - Bootstrap a `stackpress/whatwg` server.
 - Adapt Electron protocol requests into WHATWG `Request` objects.
 - Adapt Stackpress WHATWG responses back into Electron protocol responses.
 - Verify cookies, sessions, redirects, uploads, streaming responses, and asset
   loading under the custom scheme.
 - Add compatibility checks for plugins that rely on Node HTTP-specific request
   or response objects.

## 16. Open Questions

 - Should `stackpress-desktop` use `electron-builder`, `electron-forge`, or expose both through config?
 - Should route filtering happen inside Stackpress core routing, or only inside the desktop package?
 - Should plugin exclusion be supported in the first version?
 - Which Electron primitives should be wrapped in Stackpress-shaped helpers, and which should stay raw?
 - What should the final merge behavior be for top-level desktop config, raw Electron config, and plugin-contributed config?
 - Should the menu registry use `Set`, a priority-aware collection from `@stackpress/lib`, or a dedicated class?
 - What should the compatibility requirements be before `runtime: 'protocol'` is enabled?
 - How should desktop apps resolve runtime data paths without leaking Electron concepts into normal Stackpress apps?
 - Should `desktop:build` run generation automatically, or should it require existing `generate` and `generate:client` commands to have already run?
 - How should app authors configure updater, signing, notarization, and platform-specific packaging?

## 17. Proposed First Milestone

The first useful milestone should be:

 - `stackpress-desktop` package exists
 - `desktop:dev` starts a Stackpress app inside Electron
 - `desktop:build` composes existing Stackpress/Reactus build behavior
 - route rule config works
 - `DesktopConfig` and `DesktopPlugin` types are available for inference
 - Electron primitives are registered through the `desktop` plugin
 - local plugins can contribute desktop menu items
 - updater config and events are reserved without requiring provider setup
 - `templates/blog` can run as a desktop app
 - admin can be excluded by configuring `desktop.routes` without `/admin/**`

This milestone proves the core design without committing too early to advanced
packaging, signing, updater provider implementation, or custom protocol behavior.

## 18. Discussion Prompt

Should Stackpress Desktop ship local HTTP mode as the first Electron runtime so existing Stackpress routing, backend handlers, sessions, API routes, server-rendered views, and lazy handlers continue to work?

If yes, the initial implementation can focus on `stackpress-desktop`, route filtering, build composition, and a `templates/blog` proof. The config can still reserve `desktop.runtime` and `desktop.protocol` so a future WHATWG custom protocol runtime has a stable place to land.
