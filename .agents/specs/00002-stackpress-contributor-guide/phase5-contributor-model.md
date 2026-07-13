# Phase 5 Contributor Model

## Authority Labels

The final guide should visibly separate:

- **Current accepted shape:** source-backed behavior contributors must understand
  when changing this checkout.
- **Required for new work:** maintainer-approved standard even when legacy source
  or current test coverage has not caught up.
- **Known exception/defect:** evidence that must not be copied as a pattern.

`packages/stackpress-sql/src/helpers.ts` is a known temporary violation and is
not canonical evidence. Recorded manifest/export drift is later repair work.

## Contributor Decision Sequence

For every change:

1. State the behavior and callers.
2. Choose the semantic owner, not the nearest folder.
3. Identify the execution phase and dependencies available there.
4. Decide whether behavior repeats from Idea/model metadata.
5. Map source producer, generated artifact, runtime consumer, and access surface.
6. Select the narrow package and exact source lane.
7. Update intentional public, aggregate, template, skill, or documentation
   surfaces only where the contract reaches them.
8. Verify the narrow contract, changed package, generated/runtime pairing, and
   broader integration proportional to blast radius.
9. Keep package tests passing above the accepted 90% coverage target.

## Semantic Ownership

| Question | Owner |
| --- | --- |
| Idea grammar/import/transform runner? | Idea sibling library |
| Stackpress schema meaning or normalized model? | `stackpress-schema` |
| Generated persistence/actions/model events? | `stackpress-sql` |
| Generated components and Reactus integration? | `stackpress-view` |
| Generated admin workflow? | `stackpress-admin` |
| MCP tool generation/transports? | optional `stackpress-ai` |
| Framework terminal/server commands? | `stackpress-server` |
| Auth/session/profile behavior? | `stackpress-session` domain subfolder |
| API/OAuth/webhook adaptation? | `stackpress-api` |
| Small reusable service? | owning service package such as CSRF/language/email |
| Desktop target behavior? | optional `stackpress-desktop` |
| App-specific behavior? | application `plugins/<name>/` |
| Default composition/public facade only? | aggregate `packages/stackpress` |

Foundation changes belong in their sibling library when the primitive itself is
wrong; Stackpress packages should adapt or coordinate foundations rather than
fork their responsibility.

## Seven Execution Phases

| Phase | Contributor meaning |
| --- | --- |
| source authoring | durable implementation under `src/`, manifests, Idea, config, or tests |
| package compilation | framework source becomes CJS and ESM package output |
| plugin bootstrap | loader discovers plugin paths and calls plugin functions |
| lifecycle initialization | `config`, `listen`, then `route` install mechanisms, capabilities, and access |
| Idea generation | intentional ordered transforms emit application-specific client state |
| operational runtime | named events run services, commands, data, and integrations |
| request/render runtime | import/view routes adapt requests and render React surfaces |

Do not collapse package compilation, Idea generation, Reactus application build,
bootstrap, and request runtime into one "build-time/runtime" pair.

## Package Classes

- Small service packages keep focused state/mechanism behind a lifecycle plugin.
- Runtime command packages pair event adapters with reusable scripts.
- Generator packages pair `idea` registration, transform source, generated
  exports, and later runtime consumption.
- Access-surface packages adapt capabilities through pages, views, API, MCP, or
  target protocols without owning underlying domain authority.
- Nested domain packages may own sub-plugins and colocated domain code.
- Optional target packages remain separately installed and configured.
- The aggregate package composes defaults and forwards public API; it is not a
  home for cross-package implementation.

## Aggregate Inclusion Rule

Add a package to default aggregate composition only when it is commonly used and
can apply across most web, mobile, and desktop cases. Explicit web-only,
mobile-only, desktop-only, and AI cases remain optional and excluded.

Aggregate changes are justified only by intentional changes to:

- default plugin composition or order;
- selected public facade exports;
- required aggregate dependencies;
- shared aggregate Idea, CSS, tsconfig, UnoCSS, or CLI-facing assets.

Direct dependencies, plugin membership, and facade re-exports are separate
decisions. Preserve the current intentional transform/plugin order.

## Current Versus New Work

Current code may lack package tests, cleanup, or consistent manifests. New work
must follow the accepted placement and verification standard rather than copying
those omissions. Do not silently repair unrelated legacy exceptions inside a
feature contribution; record or route them as separate work.
