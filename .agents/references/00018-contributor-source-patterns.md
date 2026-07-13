# Contributor Source Patterns

Use this reference after
[Extension And Contribution](../context/extension-and-contribution.md) selects a
semantic lane. It gives exact current locations and requirements for new work.

## Authority Labels

- **Current accepted shape:** source-backed behavior in this checkout.
- **Required for new work:** maintainer-approved standard, even when legacy code
  or test enforcement lags.
- **Known exception/defect:** do not copy; route as separate repair work.

## Package Anatomy Classes

| Class | Examples | Distinguishing shape |
| --- | --- | --- |
| small service | CSRF, email, language | focused plugin/types/index and mechanism |
| runtime commands | server | terminal, events, scripts, HTTP/WHATWG entrypoints |
| model/generation | schema, SQL | runtime model plus events/scripts/transforms |
| generated interface | view, admin | transforms plus component/route consumption |
| access surface | API, AI | pages/views or transports/tools over events |
| nested domain | session | auth/profile/session subfolders with local ownership |
| optional target | desktop | target runtime/config/events/scripts/adapters |
| aggregate facade | stackpress | default plugin order, forwarded exports, shared assets |

Current publishable packages use `src/index.ts`, `src/plugin.ts`, `src/types.ts`,
CJS/ESM builds, package export/type maps, and CJS plugin-discovery metadata. This
is a repository/package contract, not proof that Ingest requires those exact
source filenames in every external plugin.

## Seven Execution Phases

1. Source authoring changes durable `src/`, manifests, Idea, config, or tests.
2. Package compilation emits framework CJS and ESM output.
3. Plugin bootstrap discovers plugin paths and calls plugin functions.
4. Lifecycle initialization resolves `config`, `listen`, then `route`.
5. Idea generation runs intentionally ordered transforms against one shared
   project and emits application-specific client state.
6. Operational runtime invokes events, services, data, and integrations.
7. Request/render runtime adapts HTTP/import/view handlers and React rendering.

Reactus application build is separate from package compilation and Idea
generation even though all three may be called "build time."

## Exact Placement Matrix

| Add or change | Durable location | Companion contract |
| --- | --- | --- |
| lifecycle wiring | owning `packages/<pkg>/src/plugin.ts` | phase, config guard, priority/order |
| public value/type | owning `src/index.ts` and/or `src/types.ts` | CJS/ESM, exports/types, consumer import |
| reusable operation | owning `src/scripts/<name>.ts` | event adapter and scripts export when public |
| event adapter | owning `src/events/<name>.ts` | `listen` registration and status/error mapping |
| one small event family | owning `src/events.ts` | avoid a folder used only for symmetry |
| request behavior | owning `src/pages/<name>.ts` or domain page | import route and capability dependencies |
| React presentation | owning `src/views/<name>.tsx` or domain view | view route and browser/render checks |
| model-derived output | runtime owner's `src/transform/` | `idea` registration, export, runtime consumer |
| generated exports | owning `src/transform/package.ts` | runtime exports and type resolution |
| configured service | focused class/helper or `src/config/` | `config` registration and public types |
| adapter | focused file/folder in semantic owner | target test and public subpath |
| app-only behavior | app `plugins/<name>/` equivalents | app plugin list and integration |
| aggregate composition | `packages/stackpress/src/plugin.ts` or facade source | inclusion rule and intentional order |

Classify framework/domain ownership versus app-local customization before
choosing a package or `plugins/<name>/` path.

## Event And Script Pair

An event module owns the Ingest boundary: request extraction, response/status,
plugin lookup, early error handling, authorization/policy adaptation, and event
name. A script module owns reusable mechanism with explicit dependencies. Put a
CLI- and plugin-callable maintenance mechanism in `src/scripts/`, not an invented
`src/actions/` lane, and adapt it through `src/events/` during `listen`.

## Page And View Pair

The page owns validation, event calls, response data/results, redirects, and
request behavior. The TSX view owns presentation and server props/hooks. Pair
both in the semantic owner's `route` listener. Use app plugin folders only after
classifying the feature as app-owned rather than framework/domain behavior.
For package-owned new work, the owning package tests must pass above 90%
coverage; app-owned work must pass its application suite, plus the same package
target for any framework package changed.

## Generator Recipe

1. Put the transform under the runtime consumer's `src/transform/`.
2. Default-export an async callback accepting shared client-generation props.
3. Register its absolute path from the package `idea` listener with CJS/ESM-safe
   dirname resolution.
4. Organize subgenerators by emitted capability.
5. Cooperate on shared files and preserve intentional order.
6. Patch generated exports and `typesVersions` for public artifacts.
7. Update the later runtime loader/listener/route/tool/component consumer.
8. Prove clean/repeat generation, compile/import, and runtime registration.

Stackpress-schema promises pruning for its stale schema/model/column artifacts.
Other generators do not universally promise rename/removal cleanup. Developers
may purge the generated client and regenerate cleanly when needed.

## Aggregate Decision

Default composition contains commonly used capabilities applicable across most
web, mobile, and desktop cases. Explicit web-only, mobile-only, desktop-only, and
AI cases stay optional. Plugin membership, direct dependency, public facade
export, and root-build participation are separate decisions.

Update the aggregate only for an intentional change to default plugin
composition/order, selected facade exposure, required dependency, or shared
aggregate assets. Never centralize feature implementation there.

## Public Surface Checklist

- Edit `src/`, never `cjs/` or `esm/`, as durable implementation.
- Preserve `.js` import suffixes needed by emitted ESM.
- Build both module formats and declarations.
- Align source exports, manifest `exports`, and `typesVersions`.
- Test the actual consumer import, not only source presence.
- Run the exporting and affected consuming package tests above 90% coverage for
  new work.
- Forward through the aggregate only when deliberately part of its facade.

## Cross-Repository Change Checklist

Before recommending a fix in `packages/*`, inspect the relevant complete sibling
repository when the behavior may be owned by `stackpress/lib`, `stackpress/idea`,
`stackpress/ingest`, `stackpress/inquire`, `stackpress/reactus`,
`ossPhilippines/frui`, or `ossPhilippines/r22n`.

1. Identify the semantic owner of the primitive or contract.
2. Distinguish an upstream foundation defect from a Stackpress integration defect.
3. Recommend tandem changes when the upstream contract and its Stackpress
   consumer are both affected.
4. Verify the sibling package with its native tests and prove the affected
   Stackpress intersection.
5. State dependency-version, publication, and consumption sequencing when the
   Stackpress fix depends on a sibling release.

For example, if a SQL helper in `packages/stackpress-sql` duplicates or violates
behavior owned by Inquire, the repair recommendation should cover the reusable
change in `stackpress/inquire` and the corresponding consumption change in
`packages/stackpress-sql`. Do not preserve the duplicated helper merely because
the reported symptom or earlier pull request was local to this monorepo.

## Verification Target

Required for new work: every changed package has passing tests above 90%
coverage, plus contract-specific evidence. Root `yarn test` currently covers only
server, schema, and SQL; run other owning package suites directly.

Generator changes also require clean/repeat generation, generated compile/import,
and runtime registration. Page/view changes require affected route, SSR,
hydration, interaction, layout, and accessibility evidence. Access surfaces
require auth, validation, event invocation, and status/error mapping.

## Known Exceptions And Defects

- Do not copy `packages/stackpress-sql/src/helpers.ts`; the maintainer identifies
  it as a current violation pending repair.
- Current missing tests/coverage do not weaken the new-work target.

## Current Source Anchors

Root/package manifests and tsconfigs; `packages/*/src/plugin.ts`; generator
packages' `src/transform/`; server/schema/SQL/view event and script pairs;
API/session page-view routing; aggregate plugin/facade source; template plugin
lists and bootstrap configs. Reverify current source when these surfaces change.
