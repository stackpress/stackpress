# Research: Stackpress Desktop Application Target

## Decision: Use Electron Local HTTP Mode First

**Rationale**: Existing Stackpress apps already rely on HTTP-style routing,
page handlers, API handlers, sessions, generated views, and local service
behavior. Local HTTP mode lets Electron act as the native shell while
Stackpress continues to execute the app through its normal server lifecycle.
This gives the first milestone direct runtime evidence with the fewest adapter
changes.

**Alternatives considered**:

- Custom Electron protocol using `stackpress/whatwg`: reserved for later
  because it requires request/response adaptation and compatibility checks for
  cookies, redirects, uploads, streaming responses, and plugins that expect
  Node HTTP behavior.
- Static SPA packaging: rejected because it would not preserve backend
  handlers, sessions, server-rendered views, generated screens, and app
  plugin behavior.

## Decision: Keep Stackpress As App Runtime Owner

**Rationale**: Stackpress already owns configuration, plugin bootstrap,
`config`/`listen`/`route` lifecycle events, route registration, generated view
output, and app-owned local data. `stackpress-desktop` should register desktop
events and plugin values, then adapt the existing runtime into Electron
instead of creating a parallel app model.

**Alternatives considered**:

- A desktop-only frontend entry: rejected because it would require app authors
  to rewrite or duplicate app behavior.
- A separate desktop router: rejected because it would hide route ownership and
  create two sources of truth for page/API behavior.

## Decision: Build Desktop Output By Composing Existing Build

**Rationale**: The desktop build should invoke or compose the existing
Stackpress/Reactus build lifecycle, then add desktop-specific metadata,
allowed-route information, Electron main/preload files, and packaging inputs.
This preserves `stackpress-view` ownership of client assets and server page
output.

**Alternatives considered**:

- Reimplement Reactus/Vite build behavior in `stackpress-desktop`: rejected as
  unnecessary duplication and a maintenance risk.
- Package directly from source without a desktop manifest: rejected because
  route availability, app metadata, starting behavior, and packaging inputs
  need a stable inspectable contract.

## Decision: Route Filtering Uses Allowlist Rules

**Rationale**: If `desktop.routes` is omitted or empty, all registered routes
are available. Once a rule is configured, only matching routes are available.
Rules support exact paths, trailing path group wildcards such as `/admin/**`,
and `ALL` or specific HTTP methods. Filtering happens in build output and at
runtime so blocked routes are excluded when possible and still guarded when
opened directly.

**Alternatives considered**:

- Regular expression route rules: deferred because simple path rules are safer
  and easier to document.
- Plugin exclusion in the first milestone: deferred because excluding built-in
  plugins may require changes to aggregate plugin loading beyond the desktop
  package boundary.
- Build-time-only filtering: rejected because plugins can still register routes
  before desktop filtering and users can attempt direct navigation.

## Decision: Use A Desktop Plugin And Event Boundary

**Rationale**: The package should register a `desktop` plugin value exposing
Electron primitives, normalized desktop config, and a menu registry. It should
emit `desktop:config` before native initialization, `desktop:menu` before menu
compilation, `desktop:ready` after app/window/menu setup, and reserved update
events for later provider wiring. This fits Stackpress plugin composition and
keeps Electron access explicit.

**Alternatives considered**:

- Require app plugins to import Electron directly: rejected because it couples
  app/plugin code to the runtime shell and bypasses Stackpress composition.
- One global mutable menu template: rejected because it makes plugin ordering
  and ownership unclear.

## Decision: Use Electron-Builder As The First Packaging Adapter

**Rationale**: The first milestone needs an unsigned current-platform artifact
or an actionable failure, not full signing/notarization or platform parity.
electron-builder is a practical first adapter because it supports
current-platform package output and can later align with updater provider work.

**Alternatives considered**:

- electron-forge: viable, but choosing both immediately would expand test and
  documentation surface before the runtime model is proven.
- No packaging adapter: rejected because the feature spec requires a package
  command that produces an artifact or clear actionable failure.

## Decision: Conservative Electron Security Defaults

**Rationale**: Desktop mode should bind the local server to loopback, use an
ephemeral port by default, keep renderer Node integration disabled, keep
context isolation enabled, expose native capabilities through explicit preload
or app-controlled paths, block unexpected external navigation, and open allowed
external links outside the app.

**Alternatives considered**:

- Renderer Node integration: rejected as too broad for the first milestone.
- Allow arbitrary external navigation: rejected because it exposes the desktop
  shell to content outside the app's route and security model.

## Decision: Split The Milestone Into Implementation Slices

**Rationale**: The spec is intentionally broad. The plan should create slices
that each produce runtime or contract evidence: package skeleton, local HTTP
runtime, build composition, route filtering, menu/plugin contributions, blog
proof, and packaging.

**Alternatives considered**:

- One large implementation task list: rejected because it would make
  verification and review difficult.
- Packaging first: rejected because package output depends on a working
  runtime, manifest, and template proof.
