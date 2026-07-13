# Concept Extraction

Phase 2 first pass. These source-backed interpretations are now hypotheses for
the deeper library research sequence. They are not an accepted taxonomy and are
not promoted `.agents/context/` truth.

Each card must receive one disposition after the ecosystem and Stackpress
ledgers are complete: confirm, revise, split, rename, or reject.

Confidence labels: Source fact, Source-backed interpretation, Needs
confirmation.

Unless a card says otherwise, confidence is source-backed interpretation.

## Concept Cards

### C-001: Model-to-surfaces framework

Meaning: Stackpress calls itself a content management framework, but the source
shape shows one domain model driving database operations, actions, views, admin,
API endpoints, MCP tools, desktop workflows, and generated client code. Use for
docs, diagrams, teaching, and positioning that explains why Stackpress is more
than a package bundle.

Evidence: `README.md:13-21`; `packages/stackpress/README.md:13-21`;
`templates/blog/schema.idea:1-359`; `templates/blog/package.json:6-30`;
`packages/stackpress-admin/src/plugin.ts`; `packages/stackpress-api/src/plugin.ts`;
`packages/stackpress-ai/src/plugin.ts`; `packages/stackpress-desktop/src/plugin.ts`.
Caution: working phrase, not a source label.

### C-002: `.idea` as product contract

Meaning: The `.idea` file carries identity, labels, display templates, joins,
relations, fields, filters, list rendering, view rendering, validation hints,
descriptions, and examples. Product decisions concentrate in a structured domain
contract instead of being scattered across DB, UI, API, and docs code.

Evidence: `templates/blog/schema.idea:1`; `templates/blog/schema.idea:15-90`;
`templates/blog/schema.idea:87-129`; `templates/blog/schema.idea:184-227`;
`skills/stackpress-idea-authoring/references/stackpress-idea-patterns.md:16-192`.
Caution: parser-valid syntax does not automatically mean built-in behavior.

### C-003: Event names as operational API

Meaning: Commands, database operations, rendering, API endpoints, MCP tools,
generated model listeners, and plugin behavior are event-shaped. The CLI
forwards events, plugins register events, API config maps routes to events,
generated models add listeners, and templates run daily work through commands.

Evidence: `bin/stackpress.mjs:132-149`; `bin/stackpress.mjs:552-563`;
`packages/stackpress-sql/src/plugin.ts:25-46`;
`templates/blog/config/common.ts:90-141`; `templates/blog/package.json:21-29`;
`node_modules/@stackpress/ingest/README.md:9`.
Caution: event names and HTTP routes are different surfaces.

### C-004: Lifecycle boundaries define package ownership

Confidence: Source fact plus source-backed interpretation.

Meaning: Packages plug into lifecycle phases such as `config`, `listen`,
`route`, and `idea`. Contributor routing should start with package ownership:
schema, SQL, view, auth/session, admin, API, language, CSRF, AI, desktop, and
server changes each have lifecycle-owned homes.

Evidence: `packages/stackpress/src/plugin.ts:14-24`; `packages/*/src/plugin.ts`;
`packages/stackpress-schema/src/plugin.ts:16-35`;
`packages/stackpress-view/src/plugin.ts:15-59`;
`packages/stackpress-sql/src/plugin.ts:25-64`.
Caution: preserve the actual aggregate plugin order.

### C-005: Generation is additive and plugin-owned

Meaning: Generation is not a single central generator. Packages add transform
paths during the `idea` lifecycle, and the idea transformer executes the
configured plugin set. This lets a package own generated code attached to its
runtime surface.

Evidence: `packages/stackpress-sql/src/plugin.ts:48-64`;
`packages/stackpress-view/src/plugin.ts:43-59`;
`packages/stackpress-admin/src/plugin.ts:30-44`;
`packages/stackpress-ai/src/plugin.ts:157-171`;
`node_modules/@stackpress/idea-transformer/README.md`;
`skills/stackpress-plugin-idea-generator/`.
Caution: not every package must generate code.

### C-006: Generated client as shared runtime contract

Meaning: Generated client code bridges `.idea` source, runtime plugins,
database models, views, and tools. Runtime packages consult it to load model
registries, register model events, and drive admin/view/API-like surfaces.

Evidence: `packages/stackpress-schema/src/plugin.ts:16-35`;
`packages/stackpress-sql/src/plugin.ts:36-46`; `templates/blog/package.json:22-23`;
`templates/blog/config/common.ts`.
Caution: generated output is disposable; inspect target output for exact docs.

### C-007: Configuration as operations console

Meaning: Template config assembles admin menus, API routes, webhooks, auth,
roles, email, language, brand, MCP, database seeds, view mode, and client
output. Typed config modules coordinate behavior that otherwise would be spread
across handwritten route code.

Evidence: `templates/blog/config/common.ts:19-64`;
`templates/blog/config/common.ts:66-143`;
`templates/blog/config/common.ts:145-180`;
`templates/blog/config/common.ts:430-490`.
Caution: do not imply "no code"; templates include plugins and handlers.

### C-008: SQL as lifecycle, not only query syntax

Meaning: Stackpress treats SQL work as install, migrate, purge, push, query,
populate, uninstall, upgrade, and generated model listener registration. Inquire
supplies typed builders and dialects without being an ORM; Stackpress-sql owns
the framework lifecycle around it.

Evidence: `packages/stackpress-sql/src/plugin.ts:25-46`;
`templates/blog/package.json:24-29`; `node_modules/@stackpress/inquire/README.md:17`;
`node_modules/@stackpress/inquire/esm/builder/`;
`node_modules/@stackpress/inquire/esm/dialect/`.
Caution: keep Inquire and Stackpress-sql distinct.

### C-009: Server-aware React infrastructure

Meaning: React in Stackpress is wired through server config, build events,
development routing, generated views, Reactus template behavior, Frui UI
primitives, and r22n translation. It is React inside server-side-first flows,
not a standalone SPA assumption.

Evidence: `packages/stackpress-view/src/plugin.ts:15-59`;
`node_modules/reactus/README.md:9`; `node_modules/frui/README.md:17`;
`node_modules/r22n/README.md:3`; `templates/blog/schema.idea:47-55`;
`templates/blog/schema.idea:176-227`.
Caution: Frui is component support, not a full design-system claim.

### C-010: Layered access surfaces over one model

Meaning: Admin, API, MCP, auth/session, desktop, and custom views are layered
access surfaces over shared model, event, config, and plugin foundations. This
supports "one model, many interfaces" for diagrams and product explanation,
subject to user confirmation.

Evidence: `templates/blog/package.json:6-11`;
`templates/blog/config/common.ts:19-143`;
`templates/blog/config/common.ts:466-490`;
`packages/stackpress-admin/src/plugin.ts`; `packages/stackpress-api/src/plugin.ts`;
`packages/stackpress-ai/src/plugin.ts`; `packages/stackpress-desktop/src/plugin.ts`.
Caution: working phrase until accepted.

### C-011: Bootstrap-first and agent-friendly distribution

Confidence: Source fact plus source-backed interpretation.

Meaning: The root package exposes a dependency-free CLI for `create`, `skills`,
and runtime event forwarding, and ships `bin/` plus `skills/`. Stackpress can be
used from GitHub/npm cache before workspace dependencies are installed, while
agent skills are part of the distribution surface.

Evidence: `package.json:6-12`; `bin/stackpress.mjs:21-45`;
`bin/stackpress.mjs:99-143`; `bin/stackpress.mjs:240-563`; root `AGENTS.md`.
Caution: CLI behavior is sensitive because it runs before dependency install.

### C-012: Focused companion libraries as architectural foundations

Meaning: Stackpress combines focused libraries for primitives, idea parsing,
generation, server/runtime, SQL building, React rendering, UI components, and
i18n. The KB should explain these as intentional foundations, not incidental
dependencies.

Evidence: `node_modules/@stackpress/lib/README.md:9`;
`node_modules/@stackpress/idea-parser/README.md:3`;
`node_modules/@stackpress/idea-transformer/README.md`;
`node_modules/@stackpress/ingest/README.md:9`;
`node_modules/@stackpress/inquire/README.md:17`;
`node_modules/reactus/README.md:9`; `node_modules/frui/README.md:17`;
`node_modules/r22n/README.md:3`.
Caution: verify live GitHub before promoting current upstream framing.

## Draft Operational Map

1. App builder writes `.idea` domain contract plus typed config.
2. Idea parser and transformer run plugin-owned transforms.
3. Generated client code becomes the shared model/runtime contract.
4. Server and package plugins register lifecycle hooks, routes, events, and
   access surfaces.
5. SQL, views, admin, API, MCP, desktop, auth/session, language, CSRF, and
   custom plugins operate over the shared model/event/config system.
6. Templates show intended day-to-day workflows; skills encode agent and
   contributor workflows.

## Superseded Taxonomy Candidates

The earlier candidates were product and positioning; architecture and lifecycle;
idea/schema; generation and generated client; runtime, events, and plugins; data
and SQL; view/admin/API/MCP/surfaces; ecosystem library roles; and contributor
routing and maintenance.

They no longer define the destination structure. Preserve them only as a record
of the first-pass interpretation and compare them against topics discovered by
the deeper research.
