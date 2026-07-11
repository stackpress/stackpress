# Source Inventory

## Purpose

This file records the Phase 1 source map for rebuilding the Stackpress KB. It
does not promote facts into `.agents/context/`; it identifies where Phase 2
should extract source-backed concepts and operating principles.

## Local Stackpress Sources

| Source group | Paths | Evidence value | Phase 2 readiness |
| --- | --- | --- | --- |
| Active packages | `packages/*/package.json`, `packages/*/src/` | Package ownership, lifecycle hooks, config surfaces, plugin registration, transform boundaries, public exports, test focus. | Ready |
| Aggregate package | `packages/stackpress/src/`, `packages/stackpress/src/plugin.ts` | Default bundle, public API shelf, intended default composition order. | Ready |
| Templates | `templates/blog/`, `templates/store/`, `templates/website/` | Real app structure, config module shape, schema idea usage, generated client outputs, command workflows. | Ready |
| Root CLI | `bin/`, root `package.json` | First-run distribution, dependency-free `npx` behavior, root workspace command routing. | Ready |
| Skills | `skills/stackpress-*` | Agent-facing contribution model, app scaffolding assumptions, idea authoring rules, plugin generation workflows. | Ready |
| Current docs | `docs/` | Output examples, terminology reuse, public API expectations. Do not use as the primary KB taxonomy. | Ready as cross-check |
| Tests | `packages/*/tests`, `templates/*/tests` | Behavioral expectations, regression boundaries, package risk areas. | Ready |
| Archives | `archives/` | Historical context only. Avoid unless a question explicitly asks about history. | Deferred |

## Complete Ecosystem Repositories

Complete local sibling repositories are available and are the primary sources
for deep design-intent research.

| Library | Repository | Research value |
| --- | --- | --- |
| `@stackpress/lib` | `../lib` | Source, tests, specifications, exports, primitives, and shared implementation conventions. |
| `@stackpress/idea-*` | `../idea` | Parser, transformer, language tooling, examples, tests, and idea-language design. |
| `@stackpress/ingest` | `../ingest` | Runtime source, tests, specifications, adapters, and plugin/event architecture. |
| `@stackpress/inquire` | `../inquire` | Builder, dialect, engine, migration, tests, and SQL abstraction boundaries. |
| `reactus` | `../reactus` | Rendering runtime, integration source, tests, browser fixtures, and build/development behavior. |
| `frui` | `../frui` | Component source, tests or examples, exports, styling, and composition conventions. |
| `r22n` | `../r22n` | Translation source, tests or examples, exports, and React integration decisions. |

Follow [Library Research Strategy](library-research-strategy.md) rather than
extracting concepts directly from this inventory.

## Version Boundary

The complete sibling repositories currently expose `0.10.6` for `lib`, Idea,
Ingest, Inquire, and Reactus, while this Stackpress checkout's installed copies
include `0.10.5` for several of those packages. Frui and r22n match the installed
versions recorded below.

Use sibling source to discover current repository design intent and internal
patterns. Use `node_modules/` and this monorepo's manifests when a claim depends
on exact behavior or compatibility in the current Stackpress checkout. Record
material drift instead of silently treating either source as universally
authoritative.

## Installed Ecosystem Sources

The following packages are installed locally in `node_modules/`. Use them to
verify the exact dependency version consumed by this checkout, not as a
substitute for full repository research.

| Library | Local path | Installed version | Package description | Evidence value |
| --- | --- | --- | --- | --- |
| `@stackpress/lib` | `node_modules/@stackpress/lib` | `0.10.5` | Shared library used across Stackpress projects. | Data containers, events, router, terminal, filesystem, exceptions, queues, status primitives. |
| `@stackpress/idea-parser` | `node_modules/@stackpress/idea-parser` | `0.10.5` | Parses ideas to AST and readable JSON. | Idea-file grammar and parse model. |
| `@stackpress/idea-transformer` | `node_modules/@stackpress/idea-transformer` | `0.10.5` | CLI that calls external transformers to make relevant code. | Transform lifecycle and code-generation orchestration. |
| `@stackpress/ingest` | `node_modules/@stackpress/ingest` | `0.10.5` | Unopinionated, event driven, pluggable, server/less framework. | Runtime, plugin, event, route, HTTP, WHATWG model. |
| `@stackpress/inquire` | `node_modules/@stackpress/inquire` | `0.10.6` | Generic typed SQL query builder, dialects, and composite engine. | SQL builders, dialects, query engine, migration/diff semantics. |
| `reactus` | `node_modules/reactus` | `0.10.5` | Reactive React template engine. | Server-aware React rendering, Vite/dev/build/preview behavior. |
| `frui` | `node_modules/frui` | `0.2.9` | Vanilla React components written in TypeScript. | UI primitives and component conventions. |
| `r22n` | `node_modules/r22n` | `1.0.10` | Zero-configuration React translation interface. | View-layer translation model. |

## Live GitHub Verification

These public repository pages were checked at strategy level:

- `https://github.com/stackpress/lib`
- `https://github.com/stackpress/idea`
- `https://github.com/stackpress/ingest`
- `https://github.com/stackpress/inquire`
- `https://github.com/stackpress/reactus`

Browser fetches for `https://github.com/ossPhilippines/frui` and
`https://github.com/ossPhilippines/r22n` did not return usable page content in
this pass. Use the installed local packages first, and verify live upstream
later if a promoted claim depends on current public positioning.

## Questions Each Source Group Can Answer

| Question type | Primary sources |
| --- | --- |
| What is Stackpress trying to be? | Root README, aggregate package, templates, skills, package composition. |
| How does an idea become an app? | `schema.idea`, idea parser/transformer, package transforms, generated client outputs. |
| Why are packages separated this way? | Package `plugin.ts`, package dependencies, event/script indexes, tests. |
| How does runtime behavior flow? | Ingest, server package, route/event plugins, templates, tests. |
| How does data flow? | Schema package, SQL package, Inquire, templates, generated stores/actions. |
| How does UI/rendering flow? | View package, Reactus, Frui, r22n, templates, generated views/admin. |
| How should contributors route work? | Package boundaries, tests, skills, root AGENTS, package scripts. |
| What content can be made from the KB? | Extracted concepts, user goals, existing docs examples, marketing-safe decisions. |

## Initial Extraction Targets

The first pass started with these concept clusters. They are now research prompts
rather than required outcomes:

- Stackpress as an idea-to-app operating system.
- Event-driven runtime and command model.
- Plugin lifecycle as the architecture boundary.
- Generation transform pipeline as the source-to-code bridge.
- Schema, SQL, view, admin, API, MCP, and desktop as layered surfaces.
- Templates as proof of intended app operations.
- Skills as contributor and app-builder workflow encoding.
- Ecosystem libraries as composable foundations rather than incidental deps.
