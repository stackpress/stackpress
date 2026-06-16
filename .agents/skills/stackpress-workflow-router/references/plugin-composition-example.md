# Plugin Composition Example

Use this as a domain-neutral example of Contract-First Parallel Plugin Build.
Do not treat any example domain, plugin name, or folder shape as required for
other apps.

## Pattern

A plugin-composed Stackpress app usually has:

- `schema.idea` for shared domain contracts
- generated client output for shared typed actions and types
- `package.json.plugins` for local plugin registration
- focused local plugins for app shell, feature domains, integrations,
  infrastructure, generation, or workflow-specific behavior
- config for runtime settings, access rules, client output, database behavior,
  and seed/populate data
- plugin-local tests or verification checks that assert important boundaries

## Generic Ownership Map

Example ownership map:

| Plugin role | Typical ownership |
| --- | --- |
| app shell plugin | home routes, shared page chrome, global errors |
| infrastructure plugin | database, external services, shared adapters |
| domain plugin | routes, events, handlers, and views for one business domain |
| integration plugin | webhook, API, email, payment, queue, or sync behavior |
| workflow plugin | multi-step user journey across one bounded flow |
| generation plugin | model-derived output emitted during `stackpress generate` |

Real apps should choose plugin names from their domain. Examples might include
`projects`, `billing`, `documents`, `messages`, `calendar`, `reports`,
`onboarding`, or `notifications`, depending on the app.

## Cross-Plugin Contracts

Before parallel plugin work starts, write down contracts such as:

- which model types each plugin reads or writes
- which route paths and HTTP methods each plugin owns
- which events each plugin emits or resolves
- what payload shape is shared between producer and consumer plugins
- which generated client types or exports are expected
- which config access rules are needed
- which seed data is required for local verification

Example contract statements:

- "The public detail page posts `{ recordId, quantity }` to the request plugin."
- "The reporting plugin reads generated search actions from the core domain."
- "The notification plugin listens for the workflow-completed event."
- "The integration plugin owns webhook ingestion and emits normalized events."

Keep these statements app-specific. Do not copy example names into a real app
unless they match the user's domain.

## Workflow

1. Define the shared schema contract.
2. Generate client/types before plugin implementation depends on them.
3. Write the plugin ownership map.
4. Write the cross-plugin contract map.
5. Implement plugins independently within their ownership lanes.
6. Run an integration pass for config, seed data, navigation, exports, and
   plugin-local tests.
7. Verify generation, plugin boundaries, and reachable route or event flow.

## Boundary Tests

Plugin-composed apps should include focused checks when boundaries matter:

- expected local plugins are registered
- infrastructure plugins do not absorb domain behavior
- domain plugins own their route or event registrations
- generated client types include expected models
- cross-plugin contracts have at least one direct verification point

Place plugin-specific checks under the owning plugin's `tests/` folder. These
tests keep architecture boundaries from drifting as app behavior changes.
