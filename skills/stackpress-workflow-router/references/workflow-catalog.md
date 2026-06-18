# Workflow Catalog

Load only the workflow card needed for the task.

## 1. Linear App Build

Use for a new or straightforward Stackpress app.

Sequence:

1. discovery
2. scaffold
3. schema
4. generate
5. plugin routing
6. implementation
7. verification

Specialist skills:

- `stackpress-app-discovery`
- `stackpress-app-scaffold`
- `stackpress-idea-authoring`
- `stackpress-plugin-router`
- `stackpress-app-verification`

Best when the user wants a normal app and parallel plugin work is not yet
needed.

## 2. Schema-First Change

Use when the meaningful change starts in `schema.idea`.

Sequence:

1. inspect current schema and affected generated surfaces
2. revise `schema.idea`
3. run project generation command
4. inspect generated type or client output
5. push or migrate database when needed
6. verify dependent plugins and views

Specialist skills:

- `stackpress-idea-authoring`
- `stackpress-app-verification`

Best for fields, models, relations, validators, admin display metadata, or
generated list/view/filter behavior.

## 3. Contract-First Parallel Plugin Build

Use when multiple local plugins can be developed independently after shared
contracts are stable.

Sequence:

1. discovery
2. schema contract
3. generation gate
4. plugin ownership map
5. cross-plugin contract map
6. parallel plugin lanes
7. integration pass
8. verification pass

Contracts to stabilize before parallel work:

- models and generated types
- route names and methods
- event names and payloads
- shared response shapes
- config access rules
- seed data needed by more than one plugin

Specialist skills:

- `stackpress-app-coordinator`
- `stackpress-idea-authoring`
- `stackpress-plugin-router`
- `stackpress-plugin-scaffold`
- `stackpress-plugin-pages-events`
- `stackpress-plugin-views`
- `stackpress-app-verification`

Best for apps where separate local plugins own different domains, user
journeys, integrations, or infrastructure responsibilities while sharing schema,
generated output, routes, events, or config.

## 4. Vertical Slice Build

Use when the fastest learning comes from one complete user journey.

Sequence:

1. choose one narrow user journey
2. add only the schema needed for that journey
3. generate and push
4. implement route handler, view, and seed data for that journey
5. verify runtime behavior
6. expand to the next slice

Specialist skills:

- `stackpress-app-coordinator`
- `stackpress-idea-authoring`
- `stackpress-plugin-router`
- `stackpress-plugin-pages-events`
- `stackpress-plugin-views`
- `stackpress-app-verification`

Best for prototypes, uncertain app requirements, or demos where visible
behavior should guide later modeling.

Risk: repeated schema churn can disrupt parallel work. Switch to
Contract-First Parallel Plugin Build once contracts become clear.

## 5. Generator-First Build

Use when repeated output should be emitted from schema metadata.

Sequence:

1. prove the feature is model-derived and repeated
2. define schema metadata or built-in attributes needed by generation
3. scaffold or inspect the generation plugin
4. implement `idea` hook and `transform/`
5. emit generated files into configured client/build output
6. reconnect runtime to generated artifacts
7. verify generated output and consuming runtime behavior

Specialist skills:

- `stackpress-plugin-router`
- `stackpress-plugin-scaffold`
- `stackpress-plugin-idea-generator`
- `stackpress-app-verification`

Best for reusable model dashboards, generated registries, repeated pages,
client helpers, tool definitions, or exports derived from `schema.idea`.

Risk: over-generation. Do not choose this for one-off handwritten behavior.

## 6. Runtime Plugin Extension

Use when the work is app-specific runtime behavior.

Sequence:

1. classify plugin ownership
2. scaffold or inspect plugin shape
3. choose lifecycle hook: `config`, `listen`, `route`, or event handler
4. implement page/event/runtime behavior
5. update route registration and config access when needed
6. verify the smallest reachable behavior

Specialist skills:

- `stackpress-plugin-router`
- `stackpress-plugin-scaffold`
- `stackpress-plugin-pages-events`
- `stackpress-plugin-views`
- `stackpress-app-verification`

Best for route handlers, server events, integrations, request/session logic,
redirects, service registration, and feature-specific runtime flows.

## 7. Route/View Workflow

Use when a route and handwritten TSX view are the main change.

Sequence:

1. confirm route/view lane
2. inspect `server.import.*` and `server.view.*` pairing
3. implement or revise `pages/*.ts`
4. implement or revise `views/*.tsx`
5. verify rendered route and browser-safe imports

Specialist skills:

- `stackpress-plugin-pages-events`
- `stackpress-plugin-views`
- `stackpress-app-verification`

Best for public pages, account pages, custom admin-adjacent pages, and pages
that need custom layout rather than generated admin UI.

## 8. Architecture Sample Workflow

Use when the app's main purpose is to demonstrate Stackpress architecture.

Sequence:

1. state the architecture lesson explicitly
2. define plugin and layer boundaries before implementation
3. add boundary tests under the owning plugin's `tests/` folder when possible
4. implement only enough app behavior to prove the lesson
5. verify that the code still teaches the intended boundary

Specialist skills:

- `stackpress-app-coordinator`
- `stackpress-plugin-router`
- `stackpress-plugin-scaffold`
- `stackpress-app-verification`

Best for examples that demonstrate plugin separation, schema-driven generation,
runtime hooks, or source/generated/runtime boundaries.

Risk: architecture samples can become generic apps. Keep the teaching
goal visible.

## 9. Existing App Change Workflow

Use when modifying an existing Stackpress app.

Sequence:

1. inspect local source-of-truth files
2. classify the task by source layer
3. preserve existing plugin and config patterns
4. make the narrowest source change
5. regenerate only when source inputs require it
6. verify affected behavior

Specialist skills:

- `stackpress-plugin-router`
- `stackpress-idea-authoring`
- `stackpress-plugin-pages-events`
- `stackpress-plugin-views`
- `stackpress-app-verification`

Best for incremental work in a real app or template.

## 10. Verification / Repair Workflow

Use when the current state is uncertain or broken.

Sequence:

1. identify the failing phase
2. inspect source-of-truth files
3. inspect generated output only as evidence
4. run the smallest useful verification command
5. fix source input or plugin code
6. rerun verification

Specialist skills:

- `stackpress-app-verification`
- `stackpress-plugin-router`
- specialist skill for the failing layer

Best for broken generation, stale client types, route failures, database state
problems, missing plugin registration, or unexpected runtime behavior.
