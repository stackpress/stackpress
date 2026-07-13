# Detailed Evidence: `@stackpress/lib`

Owner: [Research Ledger: lib](research-lib.md).

Load when: Verifying the `lib` ledger's source anchors, public boundaries,
behavioral traces, Stackpress intersections, or confidence labels.

Skip when: The synthesized patterns and potential topics in the owner ledger are
enough for the current task.

## Public Shape

- Broad root and granular subpath exports cover types, runtime, data, emitters,
  queues, routing, terminal, and system boundaries. Evidence:
  `../lib/package.json` `exports` and `typesVersions`;
  `../lib/src/index.ts:1-172`.
- CJS and ESM builds come from one TypeScript tree with aligned declarations.
  Evidence: `../lib/package.json` build scripts; `../lib/AGENTS.md`.
- TypeScript presets are published API. Evidence: `../lib/package.json` exports
  `./tsconfig/cjs` and `./tsconfig/esm`.
- `src/` and tests are authoritative; `cjs/` and `esm/` are generated. Evidence:
  `../lib/AGENTS.md` layout and edit rules.
- The template engine explicitly excludes complex/runtime templating. Evidence:
  `../lib/src/Template.ts:17-25`.

## Trace A: Boundary Data

1. `Nest` owns a plain-object store and attaches CLI, query, multipart, and path
   processors. Evidence: `../lib/src/data/Nest.ts:20-76`.
2. All processors write through `Nest.set()`. Evidence:
   `../lib/src/data/Nest.ts:82-168`; processors under
   `../lib/src/data/processors/`.
3. Numeric contiguous paths normalize into arrays. Evidence:
   `../lib/src/data/Nest.ts:151-166`, `:272-291`.
4. `Request` merges query, post, and explicit input into callable `data`;
   `Router` adds matched params and wildcard args. Evidence:
   `../lib/src/router/Request.ts:110-199`;
   `../lib/src/router/Router.ts:225-265`.
5. Tests cover nested access and input processors. Evidence:
   `../lib/tests/Nest.test.ts`, `QueryString.test.ts`, `FormData.test.ts`,
   `ArgString.test.ts`.

## Trace B: Work To Route

1. `ItemQueue` is priority-first and FIFO within a priority. Evidence:
   `../lib/src/queue/ItemQueue.ts:4-69`; `../lib/tests/ItemQueue.test.ts:7-23`.
2. `TaskQueue` executes sequentially and returns `NOT_FOUND`, `ABORT`, or `OK`.
   Evidence: `../lib/src/queue/TaskQueue.ts:7-55`;
   `../lib/tests/TaskQueue.test.ts:8-157`.
3. `EventEmitter` turns matches into queues and supports priorities, hooks, abort,
   and composition. Evidence: `../lib/src/emitter/EventEmitter.ts:16-225`;
   `../lib/tests/EventEmitter.test.ts`.
4. `ExpressEmitter` adds named parameters, wildcards, and regular expressions.
   Evidence: `../lib/src/emitter/ExpressEmitter.ts:13-233`;
   `../lib/tests/ExpressEmitter.test.ts`.
5. `Router` converts method/path into events, enriches request data, and passes
   context. Evidence: `../lib/src/router/Router.ts:24-265`;
   `../lib/tests/Router.test.ts`; `CaseStudy.test.ts:7-22`.
6. `Terminal.run()` resolves its command through the router. Evidence:
   `../lib/src/terminal/Terminal.ts:10-85`.

## Trace C: Transport Edges

- `Request<R>` preserves a native resource and accepts an async loader. Evidence:
  `../lib/src/router/Request.ts:18-199`.
- `Response<S>` preserves a native resource and accepts a dispatcher. Evidence:
  `../lib/src/router/Response.ts:23-447`.
- Router resolution accepts wrappers or plain data and returns normalized status
  responses. Evidence: `../lib/src/router/Router.ts:60-220`.
- Tests exercise request, response, routing, and custom child context. Evidence:
  `../lib/tests/Request.test.ts`, `Response.test.ts`, `Router.test.ts`,
  `CaseStudy.test.ts`.

## Trace D: Deferred Sessions

`WriteSession` records `set` or `remove` revisions and per-key cookie options
without owning persistence. Evidence: `../lib/src/router/Session.ts:13-114`;
`../lib/tests/Session.test.ts:34-236`.

## Pattern Anchors

- Callable stores: `../lib/src/data/Map.ts:110`, `Set.ts:105`,
  `Nest.ts:293-345`, `../lib/src/router/Session.ts:101-114`, and callable types
  in `../lib/src/types.ts:134-151`, `:304-306`.
- Status/error split: `../lib/src/queue/TaskQueue.ts:35-55`,
  `../lib/src/emitter/EventEmitter.ts:74-84`,
  `../lib/src/Exception.ts:14-249`,
  `../lib/src/router/Response.ts:256-447`.
- Registry composition: `../lib/src/emitter/EventEmitter.ts:165-198`,
  `ExpressEmitter.ts:66-80`, `Router.ts:132-147`, and commit `5f6fe3a`.
- Injection seams: `../lib/src/types.ts:371-380`,
  `../lib/src/system/NodeFS.ts:6-40`, `FileLoader.ts:28-286`,
  `../lib/src/router/Request.ts:103-105`, `Response.ts:167-169`, and
  `../lib/src/Template.ts:27-108`.
- Dependency-free local boundaries: `../lib/package.json` dependencies,
  `../lib/src/data/cookie.ts:1-5`, and `../lib/src/terminal/input.ts:100-105`.

## Stackpress Intersection Anchors

- Re-exports: `packages/stackpress/src/lib/index.ts:1-103` and
  `packages/stackpress/src/lib/types.ts:1-56`.
- Server: `packages/stackpress-server/src/Terminal.ts`, `bin.ts`, and
  `src/scripts/emit.ts`.
- Schema: `packages/stackpress-schema/src/Revisions.ts`, `src/scripts/generate.ts`,
  `src/transform/helpers.ts`, and collection/model sources.
- Generated contracts: `packages/stackpress-sql/src/transform/actions/index.ts`,
  `packages/stackpress-schema/src/transform/types.ts`, and generated
  `templates/*/client-source/` imports.
- Build presets: package `tsconfig.cjs.json` and `tsconfig.esm.json` files that
  extend `@stackpress/lib/tsconfig/*`.

## Confidence Notes

- Direct behavior and public boundaries are source facts.
- "Control vocabulary," "progressive specialization," and the inferred reasons
  for callable interfaces or zero dependencies are evidence-backed
  interpretations, not accepted founder statements.
- Stackpress relationships remain provisional until the final composition pass.
