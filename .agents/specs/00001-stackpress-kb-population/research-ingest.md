# Research Ledger: `@stackpress/ingest`

## Scope And Status

Research unit: complete sibling repository `../ingest`, package version `0.10.6`.
Source, tests, examples, concepts, adapters, routers, loaders, decorators, and
Stackpress intersections were inspected. No runtime proof was required. This is
research evidence, not promoted context truth.

## Native Purpose

Source fact: Ingest is an unopinionated, event-driven, pluggable server/less
framework that runs over Node HTTP, WHATWG Fetch, and serverless adapters.

Interpretation: Ingest turns `lib`'s event grammar into an application runtime
whose stable center is neither HTTP nor serverless. The center is a composable
router/server object; transports, route-loading styles, views, and plugins are
adapters around it.

## Native Vocabulary

| Term | Behavioral meaning |
| --- | --- |
| `Server` | Router plus config store, plugin registry/loader, gateway, and handler. |
| Lifecycle event | Named setup or request work resolved through the server. |
| Action router | Inline handler execution. |
| Entry router | File path recorded and loaded as a handler boundary. |
| Import router | Lazy module callback recorded as a handler boundary. |
| View router | Template identifier rendered through an injected engine. |
| Inferred route | Root route method chooses router from the supplied value. |
| Gateway | Creates a long-running native server from the portable server core. |
| Handler | Adapts one native request/response pair into the core lifecycle. |
| Plugin loader | Resolves configured modules and bootstraps them into one server. |
| Route process | Request hook, route action, response/error hook sequence. |

## Behavioral Conclusions

### One Router Exposes Multiple Organization Styles

`Router` owns action, entry, import, and view router facets while projecting one
route/listener/expression surface. Root methods infer action versus import versus
view from the value supplied; explicit facets preserve clarity when inference is
undesired. Evidence: `../ingest/ingest/src/Router.ts`; `src/plugin/*.ts`;
`tests/Router.test.ts`; `tests/RouterExtensions.test.ts`.

Interpretation: Ingest treats handler organization as a choice, not an
application architecture mandate. Inline, file, lazy, and template routes share
matching and lifecycle semantics.

### Request Handling Is A Three-Stage Event Lifecycle

`Route` emits `request`, executes the selected route action, then emits
`response`; missing work becomes a not-found response and thrown errors flow
through `error`. Abort statuses stop later stages. Evidence:
`../ingest/ingest/src/Route.ts`; `tests/Route.test.ts:67-162`;
`specs/concepts/request-lifecycle.md`.

Interpretation: Middleware, endpoint logic, response post-processing, and error
handling are one observable event pipeline rather than separate subsystems.

### Runtime Portability Comes From Paired Edge Adapters

Node HTTP and WHATWG adapters create Ingest request/response wrappers, install
loaders and dispatchers, invoke the same server, apply session revisions, and
translate the result back to the native transport. Evidence:
`../ingest/ingest/src/http/Adapter.ts`; `src/whatwg/Adapter.ts`;
`tests/whatwg.Adapter.test.ts`; `specs/concepts/runtimes-and-tooling.md`.

Interpretation: “Server/less” means shared application behavior with explicit
transport adaptation, not lowest-common-denominator request objects.

### Plugins Assemble A Shared Runtime Without Being Mandatory

`PluginLoader` accepts package configuration, arrays, nested inputs, local paths,
absolute paths, and package modules. Bootstrap calls function plugins with the
server and registers returned or exported objects. Manual wiring remains valid.
Evidence: `../ingest/ingest/src/Loader.ts`; `src/Server.ts:83-99`;
`tests/Loader.test.ts`; `specs/plugin-development.md`.

Interpretation: Plugins are distribution and composition units over ordinary
server APIs, not a privileged internal extension mechanism.

### Route Metadata Is Build-Time Information

Entry, import, and view routers retain maps of handler boundaries, while the
server exposes routes, imports, entries, and views. Evidence:
`../ingest/ingest/src/plugin/*.ts`; root `README.md` Build Support.

Interpretation: Runtime registration doubles as deployment discovery. The same
route declaration can inform bundling, manifests, lazy loading, and serving.

## Repeated Patterns And Invariants

- `P-ING-01`: Router facets share one action-router event core; extension styles
  do not fork lifecycle semantics. Confidence: source fact.
- `P-ING-02`: Handler props expose long and short aliases (`request`/`req`,
  `response`/`res`, `context`/`ctx`) built centrally for route, event, and direct
  actions. Evidence: `src/Server.ts:116-131`; tests. Confidence: source fact.
- `P-ING-03`: Config and plugin state live on the server and are callable nested
  stores inherited from `lib`. Confidence: source fact.
- `P-ING-04`: Runtime-specific behavior is injected as gateway, handler, request
  loader, response dispatcher, or view engine. Confidence: strong interpretation.
- `P-ING-05`: Status-based abort/not-found semantics from `lib` remain visible
  through request, route, response, and error processing. Confidence: source fact.
- `P-ING-06`: Decorators compile class metadata into ordinary route/event
  registration; they are an alternate authoring surface, not another runtime.
  Evidence: `src/decorators.ts`; `tests/Decorator.test.ts`.

## Deliberate Tradeoffs And Exclusions

- Ingest does not prescribe application folders, auth, persistence, rendering
  technology, or deployment provider.
- Plugin bootstrap mutates one server in configured order; order and shared
  state can be significant.
- Inferred routing is ergonomic but explicit router facets are safer when a
  function's shape is ambiguous.
- View rendering is an injected engine contract, not a bundled template system.
- Route metadata aids tooling but does not itself build deployment artifacts.
- Request lifecycle is sequential and cooperatively abortable, not parallel.

## Unique Or Surprising Concepts

- Events and HTTP routes are peers on the same application object.
- Four handler-organization styles coexist without changing route semantics.
- A server can be useful without creating a listening socket.
- Plugin modules can return named services that become typed runtime registry
  entries, not only register routes.
- Route registration is both executable behavior and build/deployment metadata.

## Stackpress Intersections

- Stackpress packages are Ingest plugins that register lifecycle listeners,
  services, routes, events, and Idea transforms on one server.
- `config`, `listen`, `route`, and `idea` are Stackpress conventions expressed as
  ordinary Ingest events, not built-in Ingest phases.
- Generated model modules register their event and admin route behavior through
  the same server APIs as handwritten plugins.
- Stackpress view injects Reactus into Ingest's view-router engine.
- Stackpress HTTP/WHATWG entrypoints inherit transport portability and session
  revision handling from Ingest.

## Potential Deeper Topics

- `ING-T01`: Server/less as transport-adapted application behavior.
- `ING-T02`: Events and routes as one operational namespace.
- `ING-T03`: Multiple routing authoring styles over one lifecycle.
- `ING-T04`: Plugin bootstrap as ordered runtime assembly and service registry.
- `ING-T05`: Route metadata as deployment/build intelligence.
- `ING-T06`: Stackpress lifecycle phases as conventions over generic events.
- `ING-T07`: Status-driven request, response, and error short-circuiting.
- `ING-T08`: Decorators as compiled registration metadata.

## Open Questions

- Which Stackpress packages depend on bootstrap order versus named phases alone?
- How are session revisions applied consistently by every active adapter?
- Where do route and event naming collisions become operational risks?
- Which route maps are consumed by Stackpress build tooling today?
- Does Stackpress expose all four routing styles intentionally to contributors?

