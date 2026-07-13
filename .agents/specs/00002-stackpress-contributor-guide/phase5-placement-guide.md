# Phase 5 Placement Guide

## Exact Source Lanes

| Add or change | Put durable code in | Companion checks |
| --- | --- | --- |
| package lifecycle registration | owning `packages/<pkg>/src/plugin.ts` | config guard, phase, priority/order, plugin export |
| public root value/type | owning `src/index.ts` and/or `src/types.ts` | manifest `exports`, `typesVersions`, aggregate facade if intentionally selected |
| reusable operation | owning `src/scripts/<name>.ts` | event adapter and scripts index/export |
| named event handler | owning `src/events/<name>.ts` | plugin `listen` registration, event index, response/status behavior |
| small single event family | owning `src/events.ts` when one file stays clearer | root/package export if public |
| request handler | owning `src/pages/<name>.ts` or nested domain pages | import route and event dependencies |
| React presentation | owning `src/views/<name>.tsx` or nested domain views | view route, public runtime path, SSR/hydration/browser behavior |
| model-derived repeated output | owning package `src/transform/` | `idea` registration, package export, runtime consumer |
| generator package metadata | owning `src/transform/package.ts` | generated exports and declaration resolution |
| service/config mechanism | focused class/helper or `src/config/` | `config` registration and types |
| protocol/host/database adapter | focused named file/folder in semantic owner | intentional public subpath and target tests |
| app-only orchestration | app `plugins/<name>/plugin.ts` plus local events/pages/views | application manifest plugin list |
| default composition/facade | `packages/stackpress/src/plugin.ts` or forwarding source | aggregate inclusion rule and intentional order |

Use a folder when a capability has multiple focused files; do not create folders
only for symmetry. Keep domain-specific helpers near the domain that owns them.
Do not use the current SQL root helpers file as a placement example until its
maintainer-directed repair is complete.

## Package Entrypoints

Current packages use:

- `src/plugin.ts` for lifecycle wiring;
- `src/index.ts` for the root consumer surface;
- `src/types.ts` for shared public contracts;
- manifest subpath exports for intentional deep surfaces;
- `.js` source import suffixes so emitted ESM paths remain valid;
- separate CJS and ESM compiler outputs;
- `package.json.plugins` with a CJS plugin-discovery path.

For new work, change source first. Never edit `cjs/` or `esm/` as the durable
implementation. Ensure every public deep import used across packages is declared
in both runtime exports and type resolution.

## Plugin And Lifecycle Rules

- Immediate plugin execution may declare listeners or register state that has no
  unresolved environment dependency.
- Use `config` for configured services and mechanisms.
- Use `listen` for reusable events, generated listeners, and request hooks.
- Use `route` for request-facing bindings after capabilities exist.
- Use `idea` only to register package-owned generation transforms.
- Gate optional behavior on the owning config area where absence means disabled.
- Preserve intentional plugin and transform ordering.
- Keep access-surface authorization/validation at its external boundary; an
  internal event name does not grant public exposure or authorization.

## Event And Script Pair

The event owns the Ingest boundary: request extraction, response/status changes,
plugin lookup, early error handling, and the registered event name. The script
owns reusable mechanism with explicit dependencies. Avoid embedding reusable
mechanism entirely inside a terminal/event wrapper.

Export event/script indexes only when callers need direct reuse. One-file event
packages may remain flat.

## Page And View Pair

- Page modules own request behavior, validation, event calls, redirects, and
  response data/results.
- View modules own React presentation and server props/hooks.
- The owning plugin pairs both during `route` with matching method/path behavior.
- Public view specifiers must resolve from the built package.
- UI changes require SSR, hydration, interaction, layout, and accessibility
  evidence as applicable.

## Generator Recipe

1. Put the generator in the runtime consumer's source package under
   `src/transform/`.
2. Export a default async callback accepting the shared client-generation props.
3. Register its absolute transform path from the package plugin's `idea` listener
   with CJS/ESM-safe dirname resolution.
4. Organize subgenerators by emitted capability, not by arbitrary step count.
5. Use the shared project/directory and schema helpers; cooperate on shared files.
6. Patch generated `package.json` exports/types for every public artifact.
7. Add or update the later runtime consumer that loads/registers the output.
8. Preserve intentional transform order; do not reorder registrations casually.
9. Make repeat generation stable. Per-generator stale cleanup is not universally
   enforced outside schema; developers may purge the generated client.
10. Verify generation, emitted imports/types, runtime registration, and package
    tests/coverage.

Do not hand-edit generated output or reparse Idea at runtime to avoid adding a
proper transform.

## Aggregate Checklist

Update `packages/stackpress` only if the change intentionally affects a commonly
used cross-environment default or selected facade surface. Explicit web, mobile,
desktop, and AI packages stay optional. When an aggregate update is justified,
review plugin order, dependencies, forwarding source, exports, types, assets,
build, pack, and consumer imports separately.
