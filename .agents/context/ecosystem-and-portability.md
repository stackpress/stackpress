# Stackpress Ecosystem And Portability

## Ecosystem Roles

Stackpress composes focused open-source libraries:

### `@stackpress/lib`

Provides zero/low-dependency primitives for nested data, status, queues, events,
routes, requests/responses, sessions, files, and terminal behavior. Higher layers
preserve its ordered execution and status semantics.

### Idea

Provides the `.idea` language, AST, compiled schema, package-style `use`
composition, and transform runner. Stackpress adds metadata conventions and
discovers framework transforms through the `idea` event.

### Ingest

Provides the portable server, plugin loader, event/router lifecycle, handler
styles, and HTTP/WHATWG adapters. Stackpress assigns architectural meaning to
specific lifecycle events and uses the server as its capability host.

### Inquire

Provides visible SQL builders, dialects, schema diff primitives, connection
adapters, and transactions. Stackpress adds generated stores/actions/events and
the revision/install/upgrade/migration/population lifecycle.

### Reactus

Provides host-routed React SSR, hydration, document/manifest handling, Vite
development, build, and serving. Stackpress supplies Ingest routes, server props,
session/language policy, and generated page modules.

### Frui

Provides granular React form, list, view, and base components. It intentionally
does not own the application's design system, layout, theme, brand, routing, or
data policy.

### r22n

Provides phrase-keyed React translation and positional interpolation. Stackpress
selects locale/language policy and generates phrases into views.

## Explicit Adapter Portability

Portability is achieved at edges:

| Boundary | Adapter examples |
| --- | --- |
| server | Node HTTP and WHATWG; Ingest deployment examples |
| database | mysql2, pg, PGlite, sqlite3 connectors |
| rendering host | native HTTP and several Reactus framework examples |
| Stackpress entry | `stackpress/http` and `stackpress/whatwg` |
| AI | stdio, streamable HTTP, SSE |
| desktop | Electron over a local Stackpress HTTP runtime |

Native request, response, connection, stream, process, and build resources remain
available. Code using native escape hatches is not portable by definition.

## Evidence-Level Vocabulary

Use precise labels:

| Label | Meaning |
| --- | --- |
| architectural | core interface and adapter boundary exist |
| implemented | adapter source is present and builds |
| tested | current automated tests exercise the combination |
| demonstrated | maintained example shows an integration path |
| supported | the project promises maintenance/release compatibility |

Do not infer "supported" from an export, example, or architectural possibility.
Reactus or Ingest host examples do not automatically prove the full Stackpress
view/data/application combination on that host.

## Current Constraints

- stackpress-view development middleware uses Node HTTP resource checks;
- generated code and loaders require compatible module/filesystem behavior;
- database connectors have distinct native/WASM/runtime requirements;
- desktop deliberately uses a local HTTP runtime inside Electron;
- production rendering requires aligned generated client, page, and asset paths;
- dialect DDL, diff, and transaction behavior can differ.

## Package-Style Distribution

Stackpress architecture is distributed through several unit types:

| Unit | Carries |
| --- | --- |
| Idea schema | reusable domain declarations and metadata |
| Ingest plugin | lifecycle services, events, and routes |
| transform | generated contract for a runtime consumer |
| generated client | application-specific runtime registries and modules |
| package export | narrow code, type, style, or adapter entrypoint |
| React entry | routable Head/Page/document behavior |
| scaffold | baseline application structure |
| agent skill | supported developer workflow and embedded assets |

The dependency-free root CLI can create a project or install skills before
workspace dependencies exist. Runtime events delegate to the installed
TypeScript framework CLI.

## Distribution Rules

- State exactly which units a package ships.
- Keep generation beside the runtime consumer that requires it.
- Publish narrow exports and include non-code schema/style assets explicitly.
- Document lifecycle, events, metadata namespaces, config, and order dependencies.
- Test standalone and aggregate loading, packed contents, clean/repeat generation,
  and the target adapter path.

## Detailed Reference

Load [Server And Transport Contracts](../references/00005-server-and-transport-contracts.md)
for the precise HTTP/WHATWG portability boundary, native type aliases, stream
bridges, server factories, and adapter-specific limitations.

Load [SQL API Contracts](../references/00010-sql-api-contracts.md) when
distinguishing Inquire-owned query mechanics from Stackpress-generated model
workflows or comparing SQL dialect behavior.

Load [Database Adapter Contracts](../references/00011-database-adapter-contracts.md)
for connector setup, native resource ownership, formatting, transaction behavior,
and portability limits across MySQL, pg, PGlite, and SQLite.

Load [Exports, Types, And Generated Contracts](../references/00014-exports-types-generated-contracts.md)
for aggregate/subpath imports, type families, package assets, generated-client
shape and export maps, client loading, or the UnoCSS preset.
