# Data Model: Stackpress Desktop Application Target

## Desktop App Configuration

Represents the app-authored desktop settings merged with defaults, raw Electron
settings, and plugin contributions before native initialization.

**Fields**:

- `runtime`: `http` for the first milestone; `protocol` is reserved and must
  return an unsupported-runtime error.
- `app.id`, `app.name`, `app.version`: required metadata for build and package
  output.
- `server.host`, `server.port`, `server.open`: loopback host, requested or
  ephemeral port, and starting route.
- `window`: initial window size, minimum size, title, and BrowserWindow-safe
  options.
- `routes`: zero or more Desktop Route Rules.
- `security`: external navigation and developer tool policy.
- `menu`: menu enablement and default groups.
- `updater`: disabled placeholder settings and reserved event names.
- `data`: desktop local data path strategy.
- `build`: desktop output directory and manifest/main/preload paths.
- `package`: packaging adapter, icon, output directory, and platform options.
- `electron`: raw Electron escape hatch for options not modeled directly.

**Validation rules**:

- `app.name` and `app.version` are required before build/package output.
- `server.host` must default to `127.0.0.1`.
- `runtime: protocol` is accepted only as reserved configuration and fails
  with clear guidance in this milestone.
- Renderer defaults must keep `contextIsolation: true` and
  `nodeIntegration: false` unless an explicit documented override is provided.
- The starting route must be available under the final route rules.

## Desktop Route Rule

Represents one allowlist entry for the desktop route surface.

**Fields**:

- `method`: `ALL` or a supported HTTP method. Missing method defaults to `ALL`.
- `route`: exact path or trailing path group wildcard such as `/articles/**`.

**Validation rules**:

- `route` must start with `/`.
- Wildcards are limited to the full trailing `/**` segment.
- If no rules exist, all registered routes are allowed.
- If at least one rule exists, a request must match one rule by path and method.

## Desktop Build Output

Represents desktop-ready build output created after the normal Stackpress build
lifecycle runs.

**Fields**:

- `manifestPath`: path to the desktop manifest.
- `mainPath`: generated or copied Electron main entry.
- `preloadPath`: generated or copied preload entry.
- `appMetadata`: normalized app id, name, version, and icon metadata.
- `startRoute`: route opened by the desktop window.
- `allowedRoutes`: filtered route records for desktop mode.
- `blockedRoutesSummary`: count and reason summary for excluded routes.
- `packagingInputs`: files and directories consumed by packaging.
- `generatedAt`: build timestamp.

**Validation rules**:

- Output must identify app configuration errors, route availability errors,
  missing metadata, and packaging preparation errors separately.
- Route availability must match the same rule evaluation used at runtime.
- Output location must be clear to the app author.

## Desktop Package Artifact

Represents the current-platform package result.

**Fields**:

- `status`: `created` or `failed`.
- `tool`: packaging adapter used.
- `platform`: current operating system and architecture.
- `outputPath`: artifact path when created.
- `message`: success summary or actionable failure.

**Validation rules**:

- The first milestone may produce unsigned artifacts.
- Failure must include the output location checked or the next action to take.
- Signing, notarization, and provider-specific updater setup are future work.

## Desktop Menu Contribution

Represents one app or plugin menu item.

**Fields**:

- `id`: stable unique contribution id.
- `menu`: common group such as `app`, `file`, `edit`, `view`, `window`, or
  `help`.
- `label`: user-visible menu label.
- `priority`: optional sort value.
- `role`: optional Electron menu role.
- `event`: optional app-defined desktop event.
- `enabled`: optional enabled state.
- `submenu`: optional child contributions.

**Validation rules**:

- Duplicate ids are rejected or reported clearly.
- Contributions are sorted deterministically by group, priority, and insertion
  order.
- A menu item with an `event` must trigger app-defined behavior through the
  Stackpress desktop event boundary.
- The update menu item is present but disabled when updater providers are out
  of scope.

## Desktop Plugin Contribution

Represents behavior contributed by app or Stackpress plugins before desktop
initialization completes.

**Fields**:

- `configPatch`: optional changes provided during `desktop:config`.
- `menuItems`: optional Desktop Menu Contributions provided during
  `desktop:menu`.
- `eventHandlers`: optional handlers for app-defined desktop events.

**Validation rules**:

- `desktop:config` contributions must run before native Electron app/window
  objects are initialized from config.
- `desktop:menu` contributions must run before the menu is compiled.
- Late contributions must fail clearly instead of silently changing only part
  of the desktop experience.

## Example Blog App Proof

Represents the acceptance fixture for the first milestone.

**Fields**:

- `desktopConfigPath`: `templates/blog/config/desktop.ts`.
- `scripts`: `desktop:dev`, `desktop:build`, and `desktop:package`.
- `routeCases`: allow-all, exact allowlist, and wildcard allowlist.
- `behaviorChecks`: public pages, allowed services, sessions, local data,
  generated screens, route exclusion, external navigation, and menu
  contribution.

**Validation rules**:

- The blog app must open at the configured starting route.
- Admin routes are unavailable when not allowlisted.
- Allowed public pages and services must continue to behave as Stackpress app
  behavior, not desktop-only rewrites.
