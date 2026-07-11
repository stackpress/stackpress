# Cross-Ecosystem Pattern Matrix

## Purpose

Compare recurring design patterns without assuming identical implementation or
intent. Repetition strengthens the case that these are ecosystem-level habits.

| Pattern | Evidence across projects | Stackpress consequence | Confidence |
| --- | --- | --- | --- |
| Narrow responsibility | Every companion library explicitly excludes higher-level policy. | Stackpress composes capabilities rather than duplicating them. | Strong |
| Progressive specialization | lib queue/event/route/terminal; Ingest router facets/server; Stackpress package layers. | Higher surfaces preserve lower execution semantics. | Strong |
| Host-owned policy | Ingest app structure, Inquire domain/migrations, Reactus routes, Frui design, r22n locale loading. | Config and local plugins are first-class application policy owners. | Strong |
| Explicit adapters | lib filesystem/request/response; Ingest HTTP/WHATWG; Inquire drivers; Reactus host frameworks. | Portability is achieved at edges, not by erasing native capabilities. | Strong |
| Inspectable intermediate form | Idea AST/schema; Inquire builder/query; Reactus document/manifest; generated client source. | Debugging and tooling can inspect intent before execution. | Strong |
| Ordered composition | task queues, plugin bootstrap, schema merges, transforms, lifecycle phases. | Order requires governance and compatibility tests. | Strong |
| Status/cooperative abort | lib task/event statuses; Ingest request lifecycle; Stackpress commands/events. | Expected control flow can stop without exceptions. | Strong |
| Package-style reuse | Idea `use`, module imports, Reactus entries, Ingest plugins, Stackpress package schemas. | Domain/runtime/view capabilities can be distributed independently. | Strong |
| Granular export contracts | lib, Idea, Ingest, Inquire, Reactus, Frui, r22n subpaths. | Generated code turns export stability into ecosystem compatibility. | Strong |
| Open extension channels | Idea attributes/plugins; Ingest events/plugins; Inquire raw SQL/hooks; Reactus Vite plugins; React children. | Framework growth happens through extension points rather than core expansion. | Strong |
| Dual simple/advanced API | callable stores/classes, inferred/explicit routers, builders/raw SQL, hooks/components. | Beginners get concise paths while advanced callers retain direct control. | Moderate-strong |
| Generated artifact as contract | Idea outputs, Reactus builds, Stackpress client package. | Disposable source can still be operationally required and version-sensitive. | Strong |
| Server authority with client enhancement | Ingest runtime, Reactus SSR/hydration, Stackpress events and views. | Browser UI consumes server capabilities rather than defining them. | Strong |
| Metadata-driven symmetry | Idea attributes, Frui form/view pairs, Stackpress generators. | One model can coordinate editing, display, validation, and access concerns. | Strong |
| Minimal dependency preference | lib zero deps, r22n small API, focused libraries, lazy imports. | Bootstrap/runtime portability and optional capability loading are intentional. | Moderate-strong |

## Distinct Differences To Preserve

- `lib` and Ingest use status objects as execution control; Inquire primarily
  returns rows or throws driver/query errors.
- Idea's metadata is intentionally semantically open; Stackpress metadata has
  package-owned conventions and should not be documented as parser guarantees.
- Inquire keeps SQL/database specificity visible; Reactus and Ingest abstract
  host edges while preserving native resources.
- Frui refuses design-system ownership; Stackpress view adds layout, server
  context, theme, and brand above it.
- r22n uses source phrases as keys, unlike Idea/Stackpress named identifiers.
- Generated Stackpress code is both output and runtime input, a stronger contract
  than generic Idea artifacts.

## Candidate Ecosystem Principles

These phrases are research interpretations pending founder review:

1. Keep cores narrow; compose policy at the host.
2. Preserve inspectable intent before execution.
3. Adapt at boundaries while retaining native escape hatches.
4. Let extension ownership follow runtime responsibility.
5. Use one execution vocabulary across internal and external surfaces.
6. Treat generated artifacts as versioned contracts when runtime consumes them.

