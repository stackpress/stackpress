# Phase 6 Baseline Answers A

## RET-001

For model-derived audit helpers, keep the producer and consumer together in the
package that owns the audit runtime contract:

- Put generation code under the owning package's `src/transform/` tree. Its
  transform should iterate the normalized `Schema.models`, emit one helper per
  model, update the generated client's index/registry, and extend generated
  package exports/types where direct imports are required.
- In that package's `plugin.ts`, register an `idea` listener. It obtains the
  active transformer, loads its schema, and appends the package-local
  `${dirname}/transform` path to `schema.plugin`. This is how the transform joins
  application generation.
- Register the generated helpers at startup from the same package plugin,
  normally during `listen`, after the generated client loader has run during
  `config`. Load the nullable `client` plugin, tolerate the not-yet-generated
  case, iterate the generated audit/helper registry or models, and attach their
  reusable events/listeners to the server. Use `route` only for request-facing
  exposure; generation alone must not expose audit operations externally.
- Ensure the aggregate plugin includes the owning package in an order that
  places generated-client loading before its runtime consumption. If audit is
  optional, the application must explicitly load its plugin.

Verify clean generation, repeat-generation stability, model rename/removal and
stale-file cleanup, generated package exports and compilation/importability,
pre-generation bootstrap tolerance, generated-client loading, `listen`
registration for every model, and an actual event invocation after startup. Also
verify authorization, caller identity propagation, status/error mapping, and
each exposed page/API/MCP surface; named events do not automatically supply
authorization or a unified audit identity.

## RET-002

- **Build a Stackpress package:** the package `build` script runs TypeScript
  compilation twice—CommonJS via `tsconfig.cjs.json` and ESM via
  `tsconfig.esm.json`—then writes package-local `package.json` files marking
  `cjs` as CommonJS and `esm` as modules. The root build orders package groups so
  dependencies build before consumers.
- **Generate an app client:** the runtime CLI bootstraps plugins, resolves
  `config`, `listen`, and `route`, then emits `generate`. Schema generation
  resolves the Idea input, creates one shared ts-morph project at the configured
  client output, resolves `idea` so enabled packages append their transforms,
  runs those transforms sequentially, and emits TypeScript or
  JavaScript/declarations plus generated exports and revision state.
- **Bootstrap an app:** create the Ingest server, apply config, discover/load
  plugins in declared order, then resolve `config` -> `listen` -> `route`.
  `config` installs services and loads the generated-client mechanism; `listen`
  installs reusable commands and generated model capabilities; `route` adds
  request-facing routes after those capabilities exist.
- **Build React views:** the `build` terminal event reaches `stackpress-view`. It
  creates a Reactus build engine from configured Vite/CSS/output paths, registers
  every Ingest view entry in the manifest, then conditionally builds clients,
  assets, and server pages for the configured output paths. The deployment event
  also writes build-package metadata and generate/start/postinstall scripts.
- **Handle a request:** the selected Node HTTP or WHATWG adapter normalizes the
  native request, loads its body, and calls the shared Ingest server handler.
  With no explicit action it emits `${METHOD} ${pathname}`. Route/page actions
  resolve capabilities and response state. For views, the Stackpress view engine
  skips redirects, no-view requests, and existing string bodies; otherwise it
  builds a browser-visible request/response/session snapshot, Reactus performs
  SSR, and the adapter dispatches the normalized status, headers, cookies, MIME
  type, and body. The browser later hydrates from the serialized snapshot.

## RET-003

For a framework generator, no: it belongs in the runtime-owning package's
transform folder and is contributed by that package's `idea` listener.

An application plugin can technically append a transform path during `idea`, so
app-local generation is valid when the application itself owns the generated
contract. A root helper has no automatic discovery contract at all unless
something explicitly contributes it.

Moving an owning-package generator elsewhere loses the package-owned
producer/consumer contract:

- installing or loading the runtime package no longer reliably contributes its
  required transform;
- generator and runtime versions, exports, metadata interpretation, and lifecycle
  registration can drift independently;
- aggregate transform order becomes an undeclared application/root convention;
- packed package contents and standalone package verification no longer prove
  that its generated runtime contract is present;
- clean/repeat generation, stale-file cleanup, generated imports/exports, and
  runtime reachability can no longer be reviewed as one package boundary.

The generated files remain disposable application state; the durable generator
and the runtime that consumes its output should stay together.
