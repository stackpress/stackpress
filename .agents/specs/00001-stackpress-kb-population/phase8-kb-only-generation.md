# Phase 8 KB-Only Document Generation

## Isolation Record

Generation input was restricted to `.agents/context/*.md` and the Reference
Files linked from those Context Files. Benchmark names and required artifact
kind came from the predeclared Phase 8 coverage matrix; `docs/`, package source,
tests, templates, and research/spec prose were excluded as content inputs.

Snapshot aggregate SHA-256:
`8cfcaa9cd9a23f4cc25fa94bc8a9df564a6ce38adb1046fcf422bb91a8c41483`.

Generated on 2026-07-11. These records are test artifacts, not KB authority.

## Record Schema

Every row supplies enough structure to draft the named page:

- **purpose/imports**: audience, use case, and canonical entrypoint;
- **contract**: exports, signatures/config/behavior, and defaults;
- **example**: source-backed example or router-page contents;
- **boundaries**: lifecycle, security, portability, destructive, or authority limits;
- **routing**: related detailed KB owners for links and expansion.

## Aggregate And Support Pages

| Target | Purpose/imports | Contract | Example or router contents | Boundaries | Routing |
| --- | --- | --- | --- | --- | --- |
| `docs/README.md` | API router for `stackpress` and focused subpaths | Group runtime, schema/generation, data, view/client, session/language, config, adapters, types, UnoCSS | “Most used” paths: root, types, server/http/whatwg, schema, sql/adapters, view/client, session, language | Root is mixed server/browser; exports do not imply support | REF-014 plus domain refs |
| `docs/stackpress.md` | Use aggregate facade when several domains are needed | Inventory primitives, Schema, runtime factories/classes, SQL, Session/Language, Reactus aliases/view helpers, events/scripts | Bootstrap HTTP server; inspect Schema; create Engine query | Ownership remains focused packages; use narrow subpaths for portability | REF-014, REF-004/006/010/012/013 |
| `docs/lib.md` | Use `stackpress/lib` for inherited primitives | Nest/callable maps, queues, emitters/routes, Request/Response/Status, file/terminal, parsing helpers, Transformer and bridge helpers | Parse query/form data and inspect nested request data | Inherited foundation behavior; native/terminal/file boundaries remain | REF-004, REF-005, REF-014 |
| `docs/types.md` | `import type ... from 'stackpress/types'` | Config/plugin, primitive/runtime, server/adapter, Idea/schema, SQL/store, session/auth/API, view/client families | Typed Config plus `RouteProps`/`StoreSelectQuery` imports | Type compatibility is not runtime validation; focused types avoid collisions | REF-014, REF-008 |
| `docs/plugin.md` | `stackpress/plugin` aggregate lifecycle | Exact order server->schema->language->csrf->sql->view->session->api->admin; phase responsibilities and optional AI/desktop exclusion | Local plugin using config/listen/route/idea | Order is checkout-sensitive, not dependency handshake | REF-009, architecture context |
| `docs/cli-reference.md` | Root bootstrap and installed runtime commands | create/skills flags; runtime `-b/-v/-f`; generate/build/serve/develop/emit/query/install/push/upgrade/migrate/populate/purge/uninstall/MCP/desktop prerequisites and effects | Generate, migrate, emit, skills dry-run recipes | Destructive commands, raw SQL, revisions not applied state; Idea key conflict | REF-009, REF-015 |
| `docs/config-reference.md` | Typed executable policy via `stackpress/types` | server, terminal, client, database, view, brand, language, session/auth, API, admin, email, cookie/CSRF, MCP/desktop keys/defaults/owners | Shared config plus environment nested spreads | No central validation/provenance; secrets and optional-plugin activation | REF-008, REF-015 |
| `docs/unocss.md` | `stackpress/unocss` preset factory | Responsive max-width variants; theme, hex/rgb/a, exact-pixel and calc rule families | `presets: [stackpressPreset()]` with Vite UnoCSS | Does not import CSS; dynamic scan/safelist; preset name is current artifact | REF-014 |

## Idea And Schema Pages

| Target | Purpose/imports | Contract | Example or router contents | Boundaries | Routing |
| --- | --- | --- | --- | --- | --- |
| `docs/idea-reference.md` | Author `.idea` domain declarations | use/enum/prop/type/model/plugin grammar; data forms; `?`, `[]`, `!`; built-ins; schema/column attrs; assertion families/aliases; field/view and derived roles; use merge/plugin execution | Complete User/Address/Role/plugin schema | Parser openness vs consumer semantics; transform order; unknown metadata inert | REF-007, REF-016 |
| `docs/schema.md` | `stackpress/schema` normalized model API | Export Schema/Model/Fieldset/Column/Attribute, lenses, dictionaries, interfaces, helpers | `Schema.make(compiledIdea)` and inspect model/column lenses | Not parser or SQL owner; process-global dictionaries | REF-006, REF-007 |
| `docs/schema/README.md` | Router for schema classes | Link Attribute, Column, Fieldset, Model, Schema and explain declaration->normalized object | Class index and one `Schema.make` orientation snippet | Router only; detail stays class pages | REF-006 |
| `docs/schema/Attribute.md` | Interpret one metadata attribute | constructor name/args; name/enabled/args/isFlag/isMethod/value; assertion/component/reference lenses | Construct flag and method attributes | Definition dictionary can override inferred flag/method semantics | REF-006, REF-007/016 |
| `docs/schema/Column.md` | Navigate one normalized column | make/constructor; name/type/attributes; assertion/component/document/number/store/value; parent guards; add/lookup attribute | Make required String column with attributes/parent | Missing parent throws; type schema propagation | REF-006 |
| `docs/schema/Fieldset.md` | Navigate reusable structured type | make/constructor; attributes/columns and semantic lenses; schema guards; add/lookup attrs/columns with name formats | Build fieldset then add column | Missing schema throws; model persistence is separate specialization | REF-006 |
| `docs/schema/Model.md` | Persistent Fieldset specialization | extends all Fieldset contracts and adds `store: ModelStore` | `Model.make` and inspect IDs/searchables/relations | Store lens is metadata interpretation, not live database | REF-006, REF-010 |
| `docs/schema/Schema.md` | Registry root | `Schema.make`; ordered enums/fieldsets/models/plugins/props; makeEnum/Fieldset/Model/Plugin/Prop | Compile config and retrieve model | Same-key insertion replaces; no duplicate validator at this layer | REF-006 |

## Runtime And Server Pages

| Target | Purpose/imports | Contract | Example or router contents | Boundaries | Routing |
| --- | --- | --- | --- | --- | --- |
| `docs/runtime/README.md` | Router for transport-neutral runtime | Link Request, Response, Router, Server; explain native generic resources and status/event flow | Minimal factory/request/response orientation | Use HTTP/WHATWG refs for edge behavior | REF-004, REF-005 |
| `docs/runtime/Request.md` | Normalized request state | constructor/options; resource, URL/method/mimetype, body, headers/query/post/session/data; loader/load and typed access | Construct request and load once | Native resource escape hatch; body cached; adapter owns parsing | REF-004, REF-005 |
| `docs/runtime/Response.md` | Build normalized status/results/body | constructor; code/status/body/results/error/errors/headers/session/data/total/stack/resource; status/body/error/redirect/dispatch/conversion methods | Set results/status then dispatch | Adapter serializes; session revisions/cookies; sent/redirect short-circuit | REF-004, REF-005 |
| `docs/runtime/Router.md` | Register/resolve event and method routes | on/once/use, method helpers/import/view routers, route overloads/priorities, emit/resolve status behavior | Register GET route and resolve event | Event invocation is not exposure/auth/transaction | REF-004 |
| `docs/runtime/Server.md` | Capability host and bootstrap | constructor/options; loader/config/router/view/plugin registry; bootstrap/register/plugin/request/response/handle/resolve/emit/listen | Create server, set config, bootstrap phases | Plugin bootstrap once per loader; gateway/handler adapter-specific | REF-004/005/009 |
| `docs/server.md` | `stackpress/server` exports/factories | Terminal/Transformer/control, runtime re-exports, loaders, shared helpers and both bridge families | Import server classes/helpers | Generic server entry is not one transport deployment | REF-005, REF-004 |
| `docs/server/README.md` | Router for Terminal and transports | Link Terminal, HTTP, WHATWG, runtime classes | Entry-point map | Router page only | REF-005 |
| `docs/server/Terminal.md` | Command event adapter | constructor args/server; server/verbose/force/config/brand/cwd; bootstrap/run/error pipeline | Construct through bin and run command | serve/develop rethrow; unknown 404 verbose; config key conflict | REF-005/009 |
| `docs/http.md` | `stackpress/http` Node adapter | aliases IM/SR, factories, Adapter/loader/dispatcher, URL/query/stream helpers, cookie/session/decorators | HTTP server with GET health action | forwarded proto trust, body limit semantics, native streams/multi-cookie check | REF-005 |
| `docs/whatwg.md` | `stackpress/whatwg` Web request adapter | Request/optional Response aliases, factory/gateway/handler, URL/query/stream helpers, dispatcher passthrough | Handle `new Request(...)` | Included gateway still Node listener; no body limit; header/cookie semantics | REF-005 |

## SQL And Adapter Pages

| Target | Purpose/imports | Contract | Example or router contents | Boundaries | Routing |
| --- | --- | --- | --- | --- | --- |
| `docs/sql.md` | `stackpress/sql` query/generated-store surface | builders/dialects/Engine, helpers, Store/Actions interfaces, event/scripts/types | Engine select and generated store query | Inquire owns mechanics; Stackpress owns generated workflows | REF-010 |
| `docs/sql/README.md` | Router for Engine/builders/dialects/connections | Link four detailed SQL topics | API map | Router only | REF-010/011 |
| `docs/sql/Engine.md` | Execute visible SQL | constructor/connection/dialect/before; six builders; query/sql/transaction; drop/rename/truncate/diff | Parameterized select and tagged SQL | before can short-circuit; diff excludes table names/semantic rename | REF-010 |
| `docs/sql/builders.md` | Chain structured SQL | constructors and full method groups for Create/Alter/Insert/Select/Update/Delete; build/query/then | Select with where/order/limit; create field/key | Raw clauses caller-owned; dialect/engine required; DDL multi-query transaction | REF-010 |
| `docs/sql/dialects.md` | Compare Mysql/Pgsql/Sqlite | shared alter/create/delete/drop/insert/json/rename/select/truncate/update, name/q | Render one builder with each dialect | SQL parity not textual/behavioral parity; integration test targets | REF-010 |
| `docs/sql/connections.md` | Common adapter abstraction | Connection dialect/lastId/before/format/query/raw/resource/transaction and lazy connector | Wrap native resource with connect | Native shutdown/results/errors; transaction resource affinity | REF-011 |
| `docs/mysql.md` | `stackpress/mysql` mysql2 adapter | Mysql2Connection/connect/types/facade; formatting, execute, insertId, native transaction | Connect mysql2 promise Connection | Pool needs acquired transaction client; native result tuple | REF-011 |
| `docs/pgsql.md` | `stackpress/pgsql` pg adapter | PGConnection/connect; `?`->$n validation, rows/raw, BEGIN/COMMIT/ROLLBACK, RETURNING | Connect Client/PoolClient | Same checked-out client; lastId undefined | REF-011 |
| `docs/pglite.md` | `stackpress/pglite` embedded pg adapter | PGLiteConnection/connect; shared Pgsql dialect; exec vs query and transaction | Connect new PGlite path | WASM persistence/concurrency differs from network pg | REF-011 |
| `docs/sqlite.md` | `stackpress/sqlite` better-sqlite3 adapter | BetterSqlite3Connection/connect; prepared all/run, boolean mapping, lastInsertRowid, transaction | Connect local Database | Sync native addon; historical sqlite3 package naming; local-file deployment | REF-011 |

## View, Session, And Language Pages

| Target | Purpose/imports | Contract | Example or router contents | Boundaries | Routing |
| --- | --- | --- | --- | --- | --- |
| `docs/view.md` | `stackpress/view` server/client facade | Reactus templates/helpers/plugins/classes; lifecycle/render snapshot; hooks/providers/layouts; notifications; setViewProps | Register/render page and consume response | Snapshot exposure, Node-only dev middleware, aggregate admin helper distinction | REF-012, REF-017 |
| `docs/view/README.md` | Router for hooks and setViewProps | Link client hooks/providers/layouts and server helper | View API map | Router only | REF-012 |
| `docs/view/hooks.md` | Browser snapshot access | useRequest/Response/Config/Session/Server returns and generics | Component reads typed response/config/session | Local wrappers, not live server; client can is UX only | REF-012/013 |
| `docs/view/setViewProps.md` | Copy safe config subsets before rendering | signature req/res/ctx; no-view skip; exact view/brand/language keys/defaults | Call after event data in page handler | Does not copy engine/full config; res.data becomes browser-visible | REF-012/017 |
| `docs/view-client.md` | Browser-safe aggregate entry | core hooks/providers/wrappers/layout/theme/r22n/notifier plus aggregate admin filter/order/paginate/LayoutAdmin | LayoutProvider/useResponse and query helper | `stackpress-view/client` lacks aggregate admin additions | REF-012 |
| `docs/session.md` | `stackpress/session` exports | Session, actions/AuthActions, matchAnyEvent/Route helpers/isRegExp and types | Check event and route patterns | Client counterpart is snapshot only; empty access allow-all | REF-013 |
| `docs/session/README.md` | Router for server Session | Link session class/config/access and view snapshot | Session API map | Router only | REF-013 |
| `docs/session/Session.md` | Signed session/authorization API | static access/seed/key/expires, configure/create/token/load/authorize; token/data/authorization/guest/can/permits/save | Create/save/load token and authorize route | Token read from request session; HS256/default seed; failed verify becomes Guest | REF-013 |
| `docs/language.md` | `stackpress/language` server locale API | Language and language data/map/config/plugin types | Configure/load/translate/save | r22n is browser renderer, separate persistence | REF-013 |
| `docs/language/README.md` | Router for server Language | Link locale loading/update/translation and browser r22n | Language API map | Router only | REF-013 |
| `docs/language/Language.md` | Locale class contract | static locales/key/configure/language/load; label/locale/translations; save/update/translate | Load request, update locale, translate `%s` | Source phrases are keys; only configured URL/data locales activate | REF-013 |

## Generation Result

All 47 benchmark targets have a complete structured record with a routed detail
owner. Full representative prose drafts are generated separately before opening
benchmark content. Any comparison mismatch must be classified as a KB gap,
routing gap, stale benchmark, or source conflict; this artifact is not edited
from benchmark prose after comparison.
