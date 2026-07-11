# Research Ledger: `reactus`

## Scope And Status

Research unit: complete sibling repository `../reactus`, package version `0.10.6`.
Runtime, server-only exports, Vite integration, document/build abstractions,
examples, tests, specifications, and Stackpress intersections were inspected.

## Native Purpose

Source fact: Reactus is a reactive React template engine providing SSR,
hydration, development middleware, builds, and production rendering while
leaving routing and application services to the host server.

Interpretation: Reactus makes a React page behave like a server-selectable
template artifact rather than making the entire application adopt a React
framework's router, data model, or deployment conventions.

## Native Vocabulary

| Term | Behavioral meaning |
| --- | --- |
| Entry | React page module address, local or package-based. |
| Document | Stable identity and coordinated loader/render/builder for one entry. |
| Manifest | Entry-to-document registry with persisted IDs. |
| Virtual server | Vite-facing in-memory modules and resources. |
| Document loader | Resolves and imports page modules. |
| Document render | Produces head, markup, serialized props, and hydration client. |
| Document builder | Emits page, client, and asset artifacts. |
| `dev()` | Vite middleware, HMR, direct source import, and SSR. |
| `build()` | Prepares server pages, hydration clients, and assets. |
| `serve()` | Renders through previously built server modules. |

## Behavioral Conclusions

### The Page Entry Is The Unit Of Work

Entries are resolved into documents with stable IDs. Each document coordinates
source loading, server rendering, client entry generation, asset collection, and
build output; manifests make the set discoverable and persistable. Evidence:
`../reactus/reactus/src/Document.ts`; `DocumentLoader.ts`;
`DocumentRender.ts`; `DocumentBuilder.ts`; `Manifest.ts`;
`ServerManifest.ts`; tests for those classes.

Interpretation: Reactus organizes SSR around independently addressable page
artifacts, making pages reusable across workspaces and hosts.

### SSR And Hydration Are One Document Contract

Rendering imports the page and optional `Head`, renders markup, serializes props,
and injects a browser entry that hydrates the same component. React nodes remain
ordinary React code. Evidence: `DocumentRender.ts`; templates/constants;
`specs/getting-started.md`; render tests.

Interpretation: Hydration is generated from the same entry and props as SSR,
reducing the need for parallel server/client page definitions.

### Development, Build, And Serve Are Explicit Modes

Development delegates HMR and transformed modules to Vite before host routes.
Build emits assets, client entries, and server page modules. Serve renders from
built modules but leaves static files and routing to the host. Evidence:
`../reactus/reactus/src/index.ts`; `Builder.ts`; `Server.ts`;
`ServerResource.ts`; development and build/serve guides.

Interpretation: Reactus separates operational modes rather than hiding a build
pipeline behind a single magical server.

### The Host Retains Application Authority

Reactus does not define HTTP routes, auth, sessions, API conventions, static-file
policy, or route data loading. Examples integrate with node:http, Express,
Fastify, Hapi, Koa, Nest, and Restify. Evidence: root workspace examples;
`specs/guides/framework-integration.md`; `spa-style-routing.md`.

Interpretation: Reactus is rendering infrastructure, not an application shell.

### Vite Is A Pluggable Resource Boundary

Virtual modules supply document, page, and client code; Vite plugins and CSS
files remain host-configurable. Built stylesheet URLs are passed to `Head`
instead of injected opaquely. Evidence: `VirtualServer.ts`, `plugins.ts`,
`ServerResource.ts`, CSS framework guide.

Interpretation: Build tooling is exposed as configuration and artifacts while
page-level document ownership remains explicit.

## Repeated Patterns And Invariants

- `P-REA-01`: One entry identity links loader, SSR, hydration, assets, and build
  output. Confidence: source fact.
- `P-REA-02`: Dev/build/serve share document/manifest concepts but use different
  resource paths. Confidence: source fact.
- `P-REA-03`: Host server policy remains outside Reactus. Confidence: explicit
  documentation fact.
- `P-REA-04`: Virtual modules bridge server-discovered entries into Vite's client
  graph. Confidence: strong interpretation.
- `P-REA-05`: Page `Head` is an explicit server document extension point for
  metadata and generated styles. Confidence: source fact.
- `P-REA-06`: Package-style entries make rendered pages distributable like code
  modules. Confidence: source/documentation fact.

## Deliberate Tradeoffs And Exclusions

- No built-in router, auth, sessions, APIs, persistence, or route-loader system.
- Production hosts must serve static files and decide caching/deployment policy.
- SPA routing is supported but explicitly not the primary optimized model.
- Vite and React are peers/tooling requirements, not hidden implementation details.
- Server and browser exports are separated to avoid leaking Node behavior into
  hydrated code.
- Manifests identify artifacts but do not define application navigation.

## Unique Or Surprising Concepts

- React pages are server-selected templates without a framework router.
- The same entry can be rendered from source in development and built modules in
  production.
- Stable short IDs connect virtual modules, clients, assets, and manifests.
- Page packages can be imported and rendered across workspace boundaries.
- Generated styles are handed to the page's `Head`, preserving document control.

## Stackpress Intersections

- `stackpress-view` injects Reactus as Ingest's view engine and maps Stackpress
  view config into development, build, and production engines.
- Ingest remains responsible for route matching and request/response lifecycle;
  Reactus renders the selected view entry.
- Stackpress supplies server request, response, session, config, language, brand,
  and theme data as serializable page props/providers.
- Stackpress generation emits reusable React components and admin pages that
  Reactus can render and hydrate.

## Potential Deeper Topics

- `REA-T01`: React pages as host-routed server templates.
- `REA-T02`: One document identity across SSR, hydration, assets, and builds.
- `REA-T03`: Explicit development/build/serve operational modes.
- `REA-T04`: Virtual modules as the server-to-Vite bridge.
- `REA-T05`: Package-distributed page entries.
- `REA-T06`: Stackpress's Ingest-to-Reactus view adapter.
- `REA-T07`: Server props as the hydration-safe application boundary.

## Open Questions

- Which Stackpress props are guaranteed serializable across hydration?
- How are render errors routed through Ingest's error lifecycle?
- Which manifest/build artifacts are disposable versus operational contracts?
- How does Stackpress ensure generated and handwritten views share one contract?
- Where is client/server module safety enforced during generation?

