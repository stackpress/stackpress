# Research Ledger: `@stackpress/lib`

## Scope And Status

Research unit: complete sibling repository `../lib` at version `0.10.6`.

Status: First deep ledger complete. Source, exports, tests, API specs, and
Stackpress intersections were inspected. No runtime proof was required because
representative behavior is explicit in source and focused tests. This is
research evidence, not promoted context truth.

Load [Detailed Evidence](research-lib-evidence.md) when verifying source anchors,
behavioral traces, public boundaries, or Stackpress import intersections. Skip
it when the synthesized patterns and topic candidates below are sufficient.

## Native Purpose

Source fact: The repository describes itself as shared low-level TypeScript
utilities for Stackpress projects and has no runtime dependencies.

Evidence-backed interpretation: `lib` is not merely a convenience collection.
It defines a compact control vocabulary that lets later Stackpress libraries
represent data, work, events, routes, requests, responses, errors, files,
modules, templates, and terminal commands with compatible semantics.

## Native Vocabulary

| Term | Behavioral meaning |
| --- | --- |
| `Nest` | Typed nested-object store with path access and boundary parsers. |
| Callable store | Function reads combined with class-like methods. |
| `ItemQueue` | Destructive priority queue with FIFO inside a priority. |
| `TaskQueue` | Sequential async work with cooperative abort and status results. |
| `EventEmitter` | Named task queues with priorities, composition, and hooks. |
| `ExpressEmitter` | Parameterized or regular-expression event names. |
| `Router` | Patterned events enriched with request, response, route, and context. |
| `Request` / `Response` | Transport-neutral wrappers around optional native resources. |
| Session revision | Deferred session set/removal intent with cookie options. |
| `Status` | Shared completion, absence, and abortion result vocabulary. |
| `Exception` | Structured error, status, position, and trace carrier. |
| `FileLoader` | Injected-filesystem path and module loading boundary. |

## Behavioral Conclusions

### Boundary Data Becomes One Nested Model

CLI arguments, query strings, multipart form data, path notation, post data,
route parameters, and explicit request data write through the same nested path
model. Contiguous numeric paths normalize into arrays.

Interpretation: Inputs are normalized early so handlers can use one data-access
model rather than transport-specific parsing branches.

### A Route Is A Prioritized Event Pipeline

Items become sequential tasks; tasks become named listeners; listener names gain
patterns; patterned events gain request, response, route, and context; terminal
commands resolve through the router model. Priorities determine order and
returning `false` cooperatively aborts the remaining pipeline.

Interpretation: Queue, event, route, and command behavior are a progression of
specializations, not separate execution systems.

### Transport Is Adapted At The Edges

Requests accept injected body loaders and preserve native resources. Responses
accept injected dispatchers and preserve native resources. Router resolution
works over normalized wrappers or plain data and returns status-shaped results.

Interpretation: Application flow is protected from transport details without
pretending the native transport does not exist.

### Session Mutation Is Deferred

Writable sessions mutate local state while recording set/remove revisions and
per-key cookie options. They do not own cookie writing or persistence.

Interpretation: State intent is separated from transport commitment so a later
adapter controls how revisions are applied.

## Repeated Patterns And Invariants

### P-LIB-01: Progressive Specialization

`ItemQueue -> TaskQueue -> EventEmitter -> ExpressEmitter -> Router -> Terminal`
adds capability while preserving ordered execution and status semantics.

Confidence: Strong evidence-backed interpretation.

### P-LIB-02: Callable Objects As Dual Interfaces

`map()`, `set()`, `nest()`, and `session()` return functions enhanced with the
underlying collection APIs. Simple reads stay terse while advanced callers keep
iteration, mutation, parsing, and metadata.

Confidence: Source fact; motivation is evidence-backed interpretation.

### P-LIB-03: Status Values Are Control Flow

Absence, completion, and cooperative interruption return status objects. Thrown
`Exception` values separately carry unexpected or structured error state and can
convert to and from response-shaped data.

Confidence: Strong evidence-backed interpretation.

### P-LIB-04: Composition Copies Canonical Registries

Emitter and router `use()` methods merge listener, expression, and route
registries into the receiver. A focused source fix protects already interpreted
listener keys from reinterpretation during composition.

Confidence: Source fact plus evidence-backed importance.

### P-LIB-05: Small Injected Boundaries

Filesystem behavior uses a small interface; request loaders, response
dispatchers, router context, template resolvers/helpers, and queue factories are
injection or override seams. Limited cookie and prompt behavior is implemented
locally to preserve zero runtime dependencies.

Confidence: Strong evidence-backed interpretation.

## Deliberate Tradeoffs And Exclusions

- Queues are destructive and sequential, favoring deterministic middleware order
  and cooperative stopping over parallel fan-out or replay.
- Frozen shallow copies protect registry replacement, not deep immutability.
- `Nest` is mutable plain-object data management, not schema validation,
  immutable state, or a general object graph.
- Transport wrappers normalize common state but retain native escape hatches.
- `TemplateEngine` is deliberately tiny and build-time-oriented; complex nested
  templating is explicitly unsupported.
- `NodeFS` is thin; portability comes from the injected interface rather than
  abstraction of every filesystem capability.

## Unique Or Surprising Concepts

- Event patterns and HTTP-like routes share matcher and queue semantics.
- CLI commands are router resolution over parsed command data.
- Route, query, post, and explicit values converge in one request data store.
- Session revisions carry per-key cookie policy without causing transport effects.
- Expected control flow uses statuses while unexpected error flow uses
  response-convertible exceptions.
- Build and module conventions are published beside runtime primitives.

## Stackpress Intersections

Provisional until the final Stackpress pass:

- Stackpress re-exports much of `lib`, making this vocabulary part of its public
  developer surface.
- Server extends `Terminal`; schema generation uses `FileLoader` and
  `TemplateEngine`; schema models use `DataMap` and `DataSet`; generated actions
  use `Nest`, `ScalarInput`, and `StatusResponse`.
- Stackpress packages inherit the published CJS/ESM TypeScript presets.
- Generated client code imports granular subpaths, making export stability a
  generated-code compatibility contract.

## Potential Deeper Topics

- `LIB-T01`: One execution grammar from queue to event, route, and command.
- `LIB-T02`: Boundary normalization through callable nested data.
- `LIB-T03`: Statuses, false-return aborts, and exceptions as control channels.
- `LIB-T04`: Transport-neutral adapters with native escape hatches.
- `LIB-T05`: Deferred state commitment through session revisions.
- `LIB-T06`: Dependency freedom as a portability and maintenance choice.
- `LIB-T07`: Generated-code contracts created by granular exports and presets.
- `LIB-T08`: Tiny purpose-limited infrastructure versus general abstractions.

## Open Questions And Proof Needs

- Does Ingest preserve `lib` status semantics or translate them at runtime edges?
- Is registry copying the primary plugin-composition mechanism?
- How do Node and WHATWG adapters apply loaders, dispatchers, and revisions?
- Is `TemplateEngine` used exclusively for generation/build-time work?
- Which granular `lib` exports are long-lived generated-code contracts?

