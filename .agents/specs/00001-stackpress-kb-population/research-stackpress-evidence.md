# Detailed Evidence: Stackpress

Owner: [Research Ledger: Stackpress](research-stackpress.md).

Load when: Verifying package ownership, lifecycle order, generation, generated
runtime registration, operational commands, access surfaces, or distribution.

Skip when: The owner ledger's synthesis is sufficient.

## Root Distribution

- Root package exposes `bin/stackpress.mjs`, publishes only `bin` and `skills`,
  and coordinates package/template workspaces. Evidence: `package.json`.
- Root CLI implements dependency-free `create` and skill installation, then
  delegates runtime events to `packages/stackpress-server/bin.ts` when available.
  Evidence: `bin/stackpress.mjs`.
- Scaffold handoff explicitly recommends install, generate, push, and dev.
- Skills source: `skills/stackpress-*`; root CLI target handling and skill tests.

## Bootstrap And Command Lifecycle

- Runtime CLI loads `--bootstrap`/`-b` or `BOOTSTRAP`, creates an Ingest HTTP
  server, applies config, registers server behavior, and bootstraps plugins.
  Evidence: `packages/stackpress-server/bin.ts:8-88`.
- Terminal registers itself as `terminal`, then resolves `config`, `listen`, and
  `route` in order. Evidence: `packages/stackpress-server/src/Terminal.ts:34-63`.
- Runtime commands are emitted as events with `terminal/arguments`; errors may be
  handled through the `error` event. Evidence: same file `:69-96`.
- Aggregate plugin order is server, schema, language, CSRF, SQL, view, session,
  API, admin. Evidence: `packages/stackpress/src/plugin.ts:14-24`.

## Package Lifecycle Ownership

| Package | Main lifecycle responsibility |
| --- | --- |
| server | `listen`: develop, emit, serve runtime commands. |
| schema | `config`: generated-client loader; `listen`: generate; `idea`: schema transform. |
| SQL | `listen`: database/model events; `idea`: stores/actions/models. |
| view | `config`: Reactus mode; `listen`: build; `route`: dev/render; `idea`: components. |
| session | auth/session services, events, routes, views, and reusable schema. |
| API | configured OAuth/API/webhook routes mapped to events. |
| admin | generated model admin route registration and admin transforms. |
| language | locale config and request/session language behavior. |
| CSRF | configured request protection. |
| email | registered email-send event when configured. |
| AI | generated/configured MCP tools mapped to events and transport entrypoints. |

Evidence: `packages/*/src/plugin.ts`; event/script indexes and package tests.

## Generation Trace

1. `generate` selects `.idea` from CLI/config and validates client configuration.
   Evidence: `packages/stackpress-schema/src/events/generate.ts:15-44`.
2. Stackpress creates an Idea transformer with the server filesystem/cwd and a
   ts-morph project at the configured client build path.
3. It resolves `idea` so package plugins append their transform paths.
4. Transformer runs plugins with terminal, project, and directory extras.
5. Output is formatted/saved as TypeScript or emitted as JS/declarations.
   Evidence: `packages/stackpress-schema/src/scripts/generate.ts:11-105`.
6. Package registrations: schema, SQL, view, admin, and AI plugin entrypoints.

## Generated Runtime Contract

- Schema config registers `client` as a dynamic importer of the generated module.
  Evidence: `packages/stackpress-schema/src/plugin.ts:14-28`.
- During `listen`, SQL loads generated model registries and calls each model's
  `listen`; during `route`, admin calls model `admin`. Evidence:
  `packages/stackpress-sql/src/plugin.ts:24-47` and
  `packages/stackpress-admin/src/plugin.ts:14-28`.
- Generated trees under `templates/*/client-source/` contain package config,
  column/schema classes, model actions/stores, events, components, admin routes,
  pages/views, and optional tools.
- Generators emit imports against `@stackpress/lib`, Ingest, Inquire, Frui, r22n,
  and Stackpress package subpaths, making those exports compatibility contracts.

## Data Operations

- SQL plugin registers install, migrate, purge, push, query, populate, uninstall,
  and upgrade events. Evidence: `packages/stackpress-sql/src/plugin.ts:24-46`.
- Package transforms emit stores, action classes, model classes, and event
  registration. Evidence: `packages/stackpress-sql/src/transform/`.
- Templates expose these operations as scripts and keep migrations/revisions in
  `.build`. Evidence: template manifests and `config/common.ts` database/client.
- Inquire adapters are selected through Stackpress SQL exports/config.

## Rendering And UI

- View plugin configures Reactus development/production, build event, dev route,
  and Idea transform. Evidence: `packages/stackpress-view/src/plugin.ts` and
  `src/config/*`.
- Page handlers and view entries are paired through Ingest import/view routers.
- Server providers expose request, response, session, config, theme, and language
  state to hydrated React pages. Evidence: `packages/stackpress-view/src/client/`.
- Generated view/admin transforms import Frui granular components and r22n.
- Templates include Reactus/Frui/UnoCSS assets through view config.

## Access Surfaces

- API config maps methods/routes/scopes to event names; webhooks observe events.
  Evidence: `packages/stackpress-api/src/plugin.ts` and template API config.
- Admin uses generated model registration and schema metadata.
- MCP normalizes configured/generated tools, validates JSON Schema input, applies
  auth visibility, and resolves each tool's Stackpress event. Evidence:
  `packages/stackpress-ai/src/plugin.ts` and helper/tests.
- Session package owns auth, signup/signin/signout, profile/session routes, 2FA,
  generated schema models, and views. Evidence: package tree/plugin/schema.

## Template And Contribution Evidence

- Blog is the broadest operational example; Store proves custom domain plugins
  and event composition; Website is a smaller content/view baseline.
- Common config assembles admin, API, auth, brand, client, CSRF, database, email,
  language, MCP, server, session, terminal, and view policy.
- Skills formalize intended app sequence and contribution boundaries:
  discovery, scaffold, Idea authoring, generation, plugin routing/scaffolding,
  pages/events, views, coordination, and verification.
- `packages/www` and `packages/stackpress-desktop` are active workspaces.
  Desktop includes plugin, runtime, build, packaging, and tests; its updater
  lifecycle is explicitly reserved but not implemented. Studio remains
  planning-only. This live-source finding supersedes stale repository guidance
  that classified both desktop and studio as planning-only.

## Confidence Notes

- Lifecycle hooks, package ownership, generation flow, and runtime registrations
  are source facts.
- “Operational composition layer,” “capability bus,” and “executable runtime
  contract” are evidence-backed interpretations pending user acceptance.
- Product/brand implications and broader-than-CMS framing require founder review.
