# Phase 8 Document Coverage Matrix

## Baseline

Current benchmark: 47 Markdown documents under `docs/`, totaling class/API
references, configuration and Idea catalogs, operational guides, package export
pages, adapter pages, and index/router pages.

`docs/` defines coverage expectations, not accepted truth. Detailed KB material
must be rebuilt from owning source, manifests, types, tests, generated output,
and templates. Parity means the KB can produce a credible equivalent document,
not copy existing prose.

## Planned Reference IDs

| ID | Detailed knowledge owner |
| --- | --- |
| REF-004 | Runtime request, response, router, server contracts |
| REF-005 | Server factories, terminal, loaders, handlers, transport helpers |
| REF-006 | Schema classes, dictionaries, helpers, generators |
| REF-007 | Idea types, attributes, assertions, components, aliases |
| REF-008 | Configuration areas, keys, defaults, effects, examples |
| REF-009 | CLI commands, flags, plugin lifecycle, bootstrap usage |
| REF-010 | SQL engine, builders, dialects, helpers, stores |
| REF-011 | Database connectors and adapter-specific exports |
| REF-012 | View server/client APIs, Reactus templates, layouts, hooks |
| REF-013 | Session, authorization, language, translation contracts |
| REF-014 | Aggregate exports, type families, UnoCSS, generated contracts |
| REF-015 | Reusable end-to-end examples and operational recipes |
| REF-016 | Idea field/view components, aliases, and derived roles |
| REF-017 | Page/view, API, MCP, and cross-surface exposure recipes |

## Coverage Matrix

| Benchmark document | Required knowledge | Context owner | Detail owner |
| --- | --- | --- | --- |
| `docs/README.md` | reference routing and most-used surfaces | ecosystem | REF-014 |
| `docs/stackpress.md` | aggregate exports and use cases | ecosystem | REF-014 |
| `docs/lib.md` | Nest, runtime primitives, terminal, status, parsing | ecosystem | REF-004, REF-005 |
| `docs/types.md` | exported type families and import guidance | ecosystem | REF-014 |
| `docs/plugin.md` | aggregate plugin order and lifecycle behavior | architecture | REF-009 |
| `docs/cli-reference.md` | commands, flags, prerequisites, effects | runtime | REF-009 |
| `docs/config-reference.md` | all config areas, keys, defaults, consumers | runtime | REF-008 |
| `docs/idea-reference.md` | built-ins, attributes, assertions, UI components | modeling | REF-007, REF-016 |
| `docs/schema.md` | schema export inventory and integration | modeling | REF-006 |
| `docs/schema/README.md` | schema reference routing | modeling | REF-006 |
| `docs/schema/Attribute.md` | constructor, properties, component/assertion/reference views | modeling | REF-006 |
| `docs/schema/Column.md` | constructor, extensions, parent/type/attribute methods | modeling | REF-006 |
| `docs/schema/Fieldset.md` | constructor, extensions, columns/attributes methods | modeling | REF-006 |
| `docs/schema/Model.md` | fieldset specialization and store extension | modeling | REF-006 |
| `docs/schema/Schema.md` | registries and make methods | modeling | REF-006 |
| `docs/runtime/README.md` | runtime class routing | architecture | REF-004 |
| `docs/runtime/Request.md` | request state, loaders, data access | architecture | REF-004 |
| `docs/runtime/Response.md` | status/body/results/errors/redirect methods | architecture | REF-004 |
| `docs/runtime/Router.md` | route/event registration and resolution | architecture | REF-004 |
| `docs/runtime/Server.md` | bootstrap, handle, props, plugin registry | architecture | REF-004 |
| `docs/server.md` | server package exports and factories | architecture | REF-005 |
| `docs/server/README.md` | server detail routing | architecture | REF-005 |
| `docs/server/Terminal.md` | bootstrap/run properties and error behavior | runtime | REF-005, REF-009 |
| `docs/http.md` | Node HTTP factories, handlers, parsers, example | ecosystem | REF-005 |
| `docs/whatwg.md` | WHATWG factories and stream/query helpers | ecosystem | REF-005 |
| `docs/sql.md` | SQL exports, helpers, store interfaces | runtime | REF-010 |
| `docs/sql/README.md` | SQL detail routing | runtime | REF-010 |
| `docs/sql/Engine.md` | engine, query, transaction, diff | runtime | REF-010 |
| `docs/sql/builders.md` | Alter/Create/Delete/Insert/Select/Update patterns | runtime | REF-010 |
| `docs/sql/dialects.md` | MySQL/PostgreSQL/SQLite dialect behavior | ecosystem | REF-010 |
| `docs/sql/connections.md` | connection abstraction and adapters | ecosystem | REF-011 |
| `docs/mysql.md` | MySQL dialect, connector, connect helper | ecosystem | REF-011 |
| `docs/pgsql.md` | PostgreSQL dialect, connector, connect helper | ecosystem | REF-011 |
| `docs/pglite.md` | PGlite connector and connect helper | ecosystem | REF-011 |
| `docs/sqlite.md` | SQLite dialect, connector, connect helper | ecosystem | REF-011 |
| `docs/view.md` | templates, helpers, providers, layouts, notifications | interfaces | REF-012, REF-017 |
| `docs/view/README.md` | view detail routing | interfaces | REF-012 |
| `docs/view/hooks.md` | useResponse/useConfig/useSession/useServer | interfaces | REF-012 |
| `docs/view/setViewProps.md` | server-to-view config prop mapping | interfaces | REF-012 |
| `docs/view-client.md` | client exports, hooks, helpers, provider | interfaces | REF-012 |
| `docs/session.md` | session exports and matching helpers | interfaces | REF-013 |
| `docs/session/README.md` | session detail routing | interfaces | REF-013 |
| `docs/session/Session.md` | configure/create/load/authorize/save/can | interfaces | REF-013 |
| `docs/language.md` | language exports and use | interfaces | REF-013 |
| `docs/language/README.md` | language detail routing | interfaces | REF-013 |
| `docs/language/Language.md` | locale loading, saving, updating, translating | interfaces | REF-013 |
| `docs/unocss.md` | Stackpress UnoCSS preset/export behavior | ecosystem | REF-014 |

## Coverage Requirements Per Document

Each benchmark row must be reproducible with:

- purpose and when-to-use guidance;
- canonical imports and export inventory;
- signatures, constructor inputs, properties, methods, and return behavior;
- configuration keys, defaults, effects, and owning consumer where relevant;
- lifecycle, generated, adapter, or security boundaries;
- at least one source-backed example for non-router pages;
- related-reference routing;
- source anchors and checkout/version boundary in the detailed Reference File.

## Acceptance

Coverage is not complete when a row merely points to a context paragraph. It is
complete only when the linked Reference Files contain enough accepted detail to
draft the benchmark document without reopening `docs/` or source during the
generation test.
