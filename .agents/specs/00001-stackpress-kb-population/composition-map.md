# Ecosystem Composition Map

## Purpose

Show what each ecosystem library owns and how Stackpress inherits, adapts,
coordinates, or raises it into a higher-level workflow. These are research
conclusions for deeper-topic selection, not promoted context truth.

## Library Roles

| Foundation | Native ownership | Stackpress relationship | Classification |
| --- | --- | --- | --- |
| `@stackpress/lib` | Nested data, statuses, queues, events, routes, transport wrappers, sessions, files, terminal. | Re-exports primitives and uses them as generated/runtime contracts. | Inherited plus public exposure. |
| Idea | Permissive schema syntax, AST, compiled schema, `use` merges, plugin execution. | Defines metadata conventions and discovers package transforms through `idea`. | Adapted and coordinated. |
| Ingest | Portable server, lifecycle/event routing, plugins, handler styles, adapters. | Uses conventional lifecycle events to assemble framework packages and capabilities. | Coordinated higher-level workflow. |
| Inquire | Visible SQL builders, dialects, connection adapters, schema diff primitive. | Adds generated models/stores/actions and database operational lifecycle. | Adapted and extended. |
| Reactus | Host-routed React SSR, hydration, manifests, Vite dev/build/serve. | Becomes Ingest's view engine with Stackpress server props and generated pages. | Adapted through view package. |
| Frui | Granular behavior-focused React form/view/base components. | Provides generated and handwritten UI primitives beneath Stackpress layout/theme/brand. | Inherited and generated against. |
| r22n | Phrase-keyed React translation and interpolation. | Renders configured server-selected language in generated and handwritten views. | Inherited under host locale policy. |

## Cross-Library Flow

1. `lib` provides the low-level data and execution vocabulary.
2. Idea represents an application model plus open metadata and generator plan.
3. Ingest hosts lifecycle phases and domain capability events.
4. Stackpress emits `idea`; package transforms convert schema metadata into a
   generated client package.
5. Generated data code uses Inquire through configured adapters.
6. Generated/handwritten page code is selected by Ingest and rendered by Reactus.
7. Frui supplies field/display interactions and r22n supplies phrase rendering.
8. Admin, API, MCP, CLI, auth/session, and custom plugins adapt external workflows
   into the shared event/model/config runtime.

## Stackpress-Specific Coordination

### Lifecycle Convention

Ingest permits arbitrary events. Stackpress assigns architectural meaning to
`config`, `listen`, `route`, and `idea`, then uses package registration order to
build a predictable framework lifecycle.

### Generator Discovery

Idea normally runs schema-declared plugins. Stackpress first emits `idea` so
installed framework packages append transforms, allowing generation ownership to
follow runtime package ownership.

### Executable Generated Client

Idea can generate any artifact. Stackpress standardizes an output package that
is dynamically loaded later to register models, events, routes, components,
admin behavior, and tools.

### Operational Data Lifecycle

Inquire intentionally stops at builders/dialects/connections. Stackpress adds
schema interpretation, migrations/revisions, safety policy, population, upgrade,
and generated model actions exposed as events.

### Host-Routed React Surface

Reactus leaves routing and app services to its host. Stackpress supplies Ingest
routes, server props, language, session, theme, generated views, Frui components,
and configuration while Reactus retains rendering/build ownership.

### Capability Adapters

API endpoints, admin pages, MCP tools, terminal commands, and views do not create
parallel domain layers. They resolve or expose named server capabilities.

## Ownership Boundaries

| Change | Primary owner |
| --- | --- |
| Nested data/status/event primitive | `lib` |
| `.idea` grammar, AST, merge, plugin runner | Idea |
| Server adapter, route lifecycle, plugin loading | Ingest |
| SQL syntax/dialect/driver abstraction | Inquire |
| SSR/hydration/Vite document build | Reactus |
| Generic React component behavior | Frui |
| Phrase translation/interpolation | r22n |
| Metadata convention or generated contract | Owning Stackpress package transform/runtime pair |
| Framework lifecycle and default composition | Aggregate Stackpress packages |
| Application policy and custom behavior | App config and local plugins |

## Unresolved Composition Risks

- Registration and plugin execution order may be a hidden compatibility contract.
- Generated client and runtime package versions need an explicit compatibility model.
- Open metadata namespaces need ownership and collision governance.
- Recursive schema composition loses some source provenance after merging.
- Phrase keys and granular component imports make generated output sensitive to
  upstream wording/export changes.

