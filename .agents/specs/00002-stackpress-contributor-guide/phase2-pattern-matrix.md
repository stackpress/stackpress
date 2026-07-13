# Phase 2 Pattern Matrix

## Classification Key

- **Framework contract:** enforced by loader, transformer, compiler, or runtime.
- **Repository convention:** consistently wired across comparable packages.
- **Package specialization:** justified by that package's semantic role.
- **Inconsistency:** source/manifests disagree or comparable shapes drift.
- **Policy question:** source shows behavior but cannot establish future rules.

Accessed: 2026-07-12.

## Package Anatomy Classes

| Class | Packages | Distinguishing source shape |
| --- | --- | --- |
| small services | CSRF, email, language | root plugin/types/index plus focused service implementation |
| runtime command host | server | terminal, events, scripts, HTTP/WHATWG entrypoints |
| model/generation core | schema, SQL | object/runtime model plus events, scripts, transforms, generated tests |
| generated interface | view, admin | transform-produced components/pages/routes plus runtime registration |
| access surface | API, AI | external contract adapters over events; API pages/views; AI generator/transports |
| nested domain | session | auth/profile/session subdomains with their own plugins, handlers, views, stores |
| optional target | desktop | target config/runtime, contribution registry, events/scripts, packaging adapters |
| aggregate facade | stackpress | explicit plugin composition, public forwarding facade, shared assets/config |

The classes explain variations better than a single universal folder template.

## Shared Publishable-Package Shape

All 13 current workspaces have `src/index.ts`, `src/plugin.ts`, `src/types.ts`,
dual CJS/ESM TypeScript builds, `package.json.plugins` pointing at the CJS plugin,
and package export/type maps. This is a strong repository convention and current
packaging contract, not proof that Ingest requires those exact source filenames.

The compiler includes `src/**/*.ts` and usually TSX, excludes tests/build output,
and emits separate `cjs/` and `esm/` trees. Source imports use `.js` suffixes so
emitted ESM remains resolvable.

## Exact Placement Matrix

| Concern | Observed source location | Classification and boundary |
| --- | --- | --- |
| package lifecycle wiring | `src/plugin.ts` | Repository convention; keep implementation thin enough to expose phases and registrations. |
| public root API | `src/index.ts` | Repository convention; explicit types/values vary by package. |
| shared public contracts | `src/types.ts` | Repository convention; local subdomains may also own nearby types. |
| named operational handler | `src/events/<name>.ts` | Convention where several events exist; handler adapts request/response/context. |
| reusable operational mechanism | `src/scripts/<name>.ts` | Convention; event wrappers validate/resolve dependencies then call scripts. |
| generated client producer | `src/transform/index.ts` plus focused helpers | Framework discovery target and repository convention for generator packages. |
| generated package exports | `src/transform/package.ts` | Convention in all five generator packages. |
| request data/side effects | `src/pages/**/*.ts` | Access-surface convention; registered through import routes. |
| React response view | `src/views/**/*.tsx` or nested domain views | Access-surface convention; paired through view routes. |
| service construction/config | focused class/helper or `src/config/` | Package specialization; registered during `config`. |
| protocol/host/database adapter | named root file or focused folder | Package specialization; expose only intentional public subpaths. |
| nested capability family | `src/<domain>/` | Session specialization; domain may own plugin, events/pages/views, stores, types. |
| aggregate forwarding facade | `packages/stackpress/src/<domain>/` | Aggregate-only; forwards selected package/foundation APIs. |

## Lifecycle Placement Evidence

| Phase | Current use |
| --- | --- |
| immediate plugin call | declare listeners or register dependency-free state |
| `config` | configure/register client loader, language, CSRF, session, Reactus, database |
| `listen` | install reusable commands, domain events, request hooks, generated listeners |
| `route` | install import/view/HTTP routes after mechanisms and events exist |
| `idea` | append generator modules to the transformer's schema plugin map |
| ordinary named event | execute an operation through request/response/context |
| contribution event | accept extension input before a target initializes, as desktop demonstrates |

## Events Versus Scripts

Server, schema, SQL, view, AI, and desktop show a recurring separation:

- event modules fit Ingest handler signatures and own response status, request
  extraction, plugin lookup, early error handling, and external event names;
- script modules own reusable operational mechanisms and receive explicit
  dependencies such as server, database, terminal, or transport configuration;
- `events/index.ts` exports handlers and sometimes constructs an emitter bundle;
- `scripts/index.ts` exports direct mechanisms for reuse or public subpaths.

Email is a valid small-package variation with one `events.ts`; folder form is
not justified solely to satisfy symmetry.

## Pages And Views

API and session register request handlers through `ctx.import` and React entries
through `ctx.view`. Page handlers shape request/response behavior; TSX views read
server props/hooks and render presentation. Routes belong in the package/domain
plugin's `route` listener. Generated admin follows the same pairing but emits the
page/view/route modules under each generated model.

## Transform Package Shape

All five generator packages have:

- `src/transform/index.ts` default-exporting an async callback;
- a package `src/plugin.ts` `idea` listener that adds an absolute
  `${dirname}/transform` key to `schema.plugin`;
- `ClientPluginProps` carrying schema, shared ts-morph project/directory,
  terminal, transformer, config, and cwd;
- focused generators organized by emitted capability;
- `package.ts` patching generated `package.json` exports and `typesVersions`.

Schema owns shared helpers and initializes core generated files. SQL can replace
the root generated index; later view/admin/AI transforms extend generated shape.
This makes transform order and shared-file ownership observable compatibility
concerns, not cosmetic layout.

## Public Surface Pattern

Package `exports` and `typesVersions` are the consumer contract; `src/index.ts`
is only the root surface. Deep imports used by other packages must have matching
export/type entries. CJS is the plugin-discovery anchor in every manifest while
ESM remains available through explicit subpath imports.

The aggregate facade forwards selected values/types through domain folders and
its root index. It does not copy implementation into the aggregate.

## Inconsistencies Not Promoted As Rules

- Aggregate, API, email, and view manifests list `bin.ts`, but only server has a
  tracked `bin.ts`; aggregate also declares a bin pointing to the missing file.
- Aggregate `typesVersions` contains admin paths absent from its source and
  `exports` map.
- Schema exports `./config/typemaps`, but no matching current source/build file
  appears in the inspected tree.
- Several packages define test scripts but have no package test files.
- Root tests cover only server, schema, and SQL; package test availability is
  broader and uneven.
- Root `AGENTS.md` package classifications do not match desktop or the absent
  `packages/www` tree.

These require repair or maintainer classification before a contributor guide can
describe them as supported patterns.
