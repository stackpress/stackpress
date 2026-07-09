# Stackpress Desktop

Desktop application target for existing Stackpress apps.

The first milestone uses Electron in local HTTP mode. Electron owns the native
shell, window, menu, preload boundary, and current-platform packaging adapter.
The Stackpress app continues to own routes, services, sessions, generated
views, local data, and app plugins.

## Commands

```bash
stackpress desktop:dev --b config/desktop -v
stackpress desktop:build --b config/desktop -v
stackpress desktop:package --b config/desktop -v
```

From the monorepo root, the package shortcut is:

```bash
yarn desktop build
yarn desktop test
```

## Configuration

Apps configure desktop mode under `desktop` in the selected Stackpress config:

```ts
desktop: {
  runtime: 'http',
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
  routes: [],
  security: {
    externalNavigation: 'deny',
    allowDevTools: false,
    nativeCapabilities: []
  },
  data: {
    directory: 'userData',
    database: 'blog.sqlite'
  },
  build: {
    directory: '.build/desktop',
    main: '.build/desktop/main.js',
    preload: '.build/desktop/preload.js',
    manifest: '.build/desktop/manifest.json'
  },
  package: {
    tool: 'electron-builder',
    output: '.build/releases'
  }
}
```

Required app metadata is `app.id`, `app.name`, and `app.version`.
`runtime: 'protocol'` is reserved for a later milestone and fails with explicit
guidance. The runtime binds to `127.0.0.1`; `port: 0` requests an ephemeral
port. Renderer defaults keep `contextIsolation: true` and
`nodeIntegration: false`.

## Route Rules

Missing or empty `routes` means every registered route is available. Once at
least one route rule exists, desktop mode becomes allowlist-only:

```ts
routes: [
  { route: '/' },
  { route: '/articles/**' },
  { method: 'POST', route: '/api/search' }
]
```

Rules support exact paths, trailing path group wildcards ending in `/**`, and
`ALL` or specific HTTP methods. The configured `server.open` route must be
registered and allowed. Blocked routes are excluded from desktop-ready
manifest output when possible and still guarded at runtime with a safe JSON
result.

## Menus

Plugins can contribute menu items during `desktop:menu`:

```ts
desktop.menu.contribute({
  id: 'blog:latest',
  menu: 'help',
  label: 'Open Latest Posts',
  priority: 10,
  event: 'blog:desktop-latest'
});
```

Common groups include `app`, `file`, `edit`, `view`, `window`, and `help`.
Contributions are sorted deterministically by group, priority, label, and
insertion order. Event-backed items dispatch through the private loopback
desktop event route. The first milestone also reserves update events and shows
a disabled update placeholder when updater providers are not configured.

## Security

External navigation is denied by default. With
`security.externalNavigation: 'open-external'`, external URLs are still denied
inside the desktop renderer and opened through Electron `shell.openExternal`.
Native capabilities are not exposed through preload unless the app names them
explicitly in `security.nativeCapabilities`; the default preload exposes only
a frozen `window.stackpressDesktop` object with that declared capability list.

## Packaging

`desktop:build` composes the normal Stackpress build lifecycle, then writes the
desktop manifest, Electron main entry, preload entry, and packaging inputs.
`desktop:package` uses `electron-builder` as the first adapter and currently
builds an unsigned current-platform app directory under the configured release
directory. Signing, notarization, updater provider setup, protocol mode, and
cross-platform parity are out of scope for this milestone.

## Foundational Validation

The foundational public contracts currently live in:

- `src/config.ts` for desktop config normalization and validation.
- `src/routeRules.ts` for allow-all, exact route, wildcard route, and method
  matching.
- `src/manifest.ts` for desktop build manifest assembly.
- `src/MenuRegistry.ts` for deterministic menu contribution collection.
- `src/plugin.ts` for the initial Stackpress desktop plugin boundary and
  reserved update events.

Validation run:

```bash
yarn desktop build
yarn desktop test
```

Result: build passed and 19 foundational tests passed.

## Desktop Development Validation

The blog template was prepared with:

```bash
yarn blog generate
yarn blog generate:client
yarn blog push
```

Then the desktop development session was started with:

```bash
yarn blog desktop:dev
```

Result: Electron launched against the generated blog desktop runtime at a
loopback URL, and the home route executed the expected article queries through
the Stackpress app runtime. The command remains active until the Electron app
is closed.

## Route Availability Validation

User Story 2 route availability is covered by package tests for:

- allow-all route filtering when no desktop route rules are configured.
- exact route allowlists.
- trailing `/**` wildcard route allowlists.
- method-specific allowlist entries.
- blocked route summaries for no-match routes.
- runtime direct-access guarding for blocked desktop routes.
- pass-through handling for allowed desktop routes.
- registered Ingest route metadata collection from `server.routes`.

Validation run:

```bash
yarn desktop build
yarn desktop test
```

Result: build passed and 30 desktop tests passed. The first sandboxed test run
failed with `listen EPERM` on the loopback bind, and the same command passed
when rerun with loopback binding allowed.

## Desktop Build And Package Validation

User Story 3 build and package output is covered by package tests for:

- `desktop:build` composing the normal Stackpress build lifecycle before
  writing desktop artifacts.
- manifest, Electron main, preload, and packaging input generation.
- manifest route availability and blocked-route summaries needed by packaging.
- current-platform package success reporting when an electron-builder adapter
  is available.
- actionable package failure reporting when packaging cannot run.

Validation run:

```bash
yarn desktop build
yarn desktop test
yarn blog desktop:build
yarn blog desktop:package
```

Result: package build passed, desktop tests passed, and
`yarn blog desktop:build` wrote
`templates/blog/.build/desktop/manifest.json`. After switching the packaging
adapter to electron-builder directory mode, `yarn blog desktop:package`
completed and wrote the unsigned current-platform app output under
`templates/blog/.build/releases`.

## Troubleshooting

- Missing app id, name, or version: add `desktop.app` metadata before build or
  package.
- Blocked starting route: add an exact route rule for `server.open` or widen
  the allowlist with a trailing `/**` group.
- Unsupported protocol runtime: use `runtime: 'http'` for this milestone.
- Loopback bind errors in sandboxed tests: rerun tests with loopback binding
  allowed.
- Stale package output: run `desktop:build` before `desktop:package` and check
  the configured `package.output` directory.
