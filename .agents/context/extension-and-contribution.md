# Stackpress Extension And Contribution

## Guidance Authority

- **Current accepted shape** describes behavior contributors must understand.
- **Required for new work** is the maintainer-approved standard even where
  legacy source or current coverage has not caught up.
- **Known exception or defect** must not be copied as a repository pattern.

Choose semantic ownership before choosing a path. Similar-looking nearby code is
not sufficient placement evidence.

When answering where contribution code belongs, always close the answer with
verification: every changed package's tests must pass above 90% coverage for new
work, plus the change-class evidence in this file. For app-only work, require the
application suite and apply the package target to any framework package changed.

## Ownership-First Routing

Route a change by semantic ownership and runtime consumption, not by the nearest
folder.

```mermaid
flowchart TD
  CHANGE["Requested change"] --> DOMAIN{"Domain structure or metadata?"}
  DOMAIN -->|Yes| IDEA["Idea/schema lane"]
  DOMAIN -->|No| REPEAT{"Repeated model-derived output?"}
  REPEAT -->|Yes| GEN["Owning transform plus runtime consumer"]
  REPEAT -->|No| POLICY{"Environment or static policy?"}
  POLICY -->|Yes| CONFIG["Config lane"]
  POLICY -->|No| PAGE{"Request presentation?"}
  PAGE -->|Yes| VIEW["Page handler plus view entry"]
  PAGE -->|No| EDGE{"Host, DB, or protocol edge?"}
  EDGE -->|Yes| ADAPTER["Adapter lane"]
  EDGE -->|No| RUNTIME["Runtime plugin/event lane"]
```

Split mixed features across lanes instead of forcing them into one plugin.

## Lane Rules

### Idea/Schema

Use for models, fields, relations, validation, persistence metadata, and
generated-interface metadata. Do not patch runtime code to compensate for a
missing domain declaration.

### Generation

Use when output repeats per model or metadata and runtime depends on emitted
registries, helpers, pages, components, routes, or tools. Change the transform
and runtime consumer as one contract.

### Configuration

Use for static application/environment policy, selected adapters, exposure maps,
brand/locale values, output paths, and config-driven population.

### Runtime Plugin/Event

Use for orchestration, services, side effects, integrations, and custom behavior
that is not naturally model-derived.

For a reusable operation, put the Ingest request/response/status adapter in
`src/events/<name>.ts` and the mechanism in `src/scripts/<name>.ts`. Register the
event during `listen`. Small one-event packages may stay flat as `events.ts`;
do not invent an `actions/` lane only for symmetry.

### Page/View

Use for custom request presentation. Pair page handlers and route registration
with the selected React view entry and rendering contract.

Classify framework/domain ownership versus app-local customization before giving
exact paths. Framework code uses the owning package or nested domain's
`src/pages/`, `src/views/`, and `src/plugin.ts`; app-only behavior uses the
application's `plugins/<name>/` equivalents.

### Adapter/Foundation

Use narrow adapter packages for host, database, protocol, or native-resource
differences. Change foundation libraries only when the primitive itself owns the
behavior.

## Lifecycle Placement

| Phase | Put here |
| --- | --- |
| plugin registration | dependency-free state and phase listeners |
| `config` | services and environment-derived mechanism setup |
| `listen` | reusable operations and generated listeners |
| `route` | request routes after capabilities exist |
| `idea` | package-owned transforms |
| package contribution event | extensible registry input before initialization |

Package compilation, Idea generation, Reactus application build, plugin
bootstrap, lifecycle initialization, operational events, and request/render
runtime are distinct phases. Do not reduce them to one build-time/runtime pair.

## Change Procedure

1. State intended behavior and affected callers.
2. Identify semantic owner and whether output is generated.
3. Map producer, generated artifact, runtime consumer, and access surfaces.
4. Select the narrow package and lifecycle phase.
5. Check current versions, exports, adapters, and order dependencies.
6. Implement without making generated output the durable source.
7. Run the smallest convincing proof for every affected contract.
8. Expand verification according to shared behavior and blast radius.
9. Update exports, examples, docs, scaffolds, or skills when their contract moved.

## Verification Matrix

| Change class | Minimum convincing evidence |
| --- | --- |
| Idea/schema | parse/compile and expected normalized schema |
| transform | clean generation, repeat generation, removal/rename behavior |
| generated/runtime pair | generated compile/import and lifecycle registration |
| data | dialect query assertions and transactional workflow proof |
| page/view | route, SSR/hydration/interaction/snapshot, plus owning package tests above 90% or app suite |
| access surface | auth, validation, event invocation, status/error mapping |
| adapter | native integration and target-specific test |
| public export/manifest | CJS/ESM/types, pack/import, plus exporting and consuming package tests above 90% |
| scaffold/skill | clean copy/install acceptance and current command workflow |
| cross-package | narrow package tests plus affected template/end-to-end path |

Fresh evidence is required after the relevant change. Source presence alone does
not prove generation, wiring, importability, or runtime reachability.

Required for new work: every changed package should have passing tests above 90%
coverage, plus the contract-specific evidence above. Root `yarn test` currently
covers only server, schema, and SQL, so run other owning package suites directly.

## Contributor Boundaries

- Preserve package responsibilities instead of centralizing feature code in the
  aggregate package.
- Treat lifecycle priority and transform order as compatibility-sensitive.
- Prefer config-driven static seeds over custom population code when no logic is
  required.
- Test generated UI in a browser when behavior, hydration, layout, or
  accessibility is affected.
- Distinguish illustrative skill/scaffold examples from required package names or
  application domains.
- Add a package to default aggregate composition only when it is commonly used
  and applies across most web, mobile, and desktop cases. Explicit web-only,
  mobile-only, desktop-only, and AI packages remain optional.
- Treat aggregate plugin composition, direct dependencies, facade exports, and
  build participation as separate decisions.
- Do not copy `packages/stackpress-sql/src/helpers.ts` as canonical placement or
  design guidance; it is a maintainer-declared current violation pending repair.

No project-wide maintainer map, CODEOWNERS policy, or mandatory public-contract
review gate is an accepted current guarantee.

## Detailed Reference

Load [CLI And Plugin Contracts](../references/00009-cli-and-plugin-contracts.md)
when adding a package plugin, lifecycle listener, generated transform, runtime
command, root CLI behavior, or command-level verification.

Load [Operational Examples](../references/00015-operational-examples.md) for
source-backed end-to-end recipes covering bootstrap, generation/data lifecycle,
database registration, handwritten pages, API/MCP exposure, build, and upgrades.

Load [Interface Exposure Examples](../references/00017-interface-exposure-examples.md)
for focused page/view, API, MCP, and cross-surface adaptation recipes.

Load [Contributor Source Patterns](../references/00018-contributor-source-patterns.md)
for exact package anatomy, source-placement rules, generator and aggregate
checklists, current exceptions, and verification expectations.
