# Drift Control

Use this reference for long, parallel, ambiguous, or architecture-significant
Stackpress work.

## Context Window Rules

- Load only the selected workflow reference.
- Read local source files before relying on examples.
- Summarize decisions instead of reloading large files repeatedly.
- Keep the active phase and source-of-truth files visible in status updates.
- If context has shifted, reclassify the workflow before editing.

## Source Of Truth By Layer

| Layer | Source of truth | Generated or evidence-only |
| --- | --- | --- |
| Domain model | `schema.idea` | generated client types, `.build/revisions` |
| Runtime config | `config/*.ts` | running server behavior |
| Plugin registration | `package.json.plugins` | loaded route/event behavior |
| Route handlers | `plugins/*/pages/*.ts` | HTTP responses |
| Events | `plugins/*/events/*.ts` | `emit` or `resolve` output |
| Views | `plugins/*/views/*.tsx` | rendered HTML/browser output |
| Generator behavior | plugin `idea` hook and `transform/` | generated files |
| Seed data | `database.populate` or local populate source | database rows |

Do not edit generated output as the fix unless the task is specifically to
debug generation internals.

## Phase Evidence

Every phase needs fresh evidence before the workflow advances.

- Discovery: buildable app brief or explicit task scope
- Scaffold: expected baseline files exist
- Schema: `schema.idea` expresses the intended contract
- Generation: generated output includes the expected model/type/artifact
- Plugin wiring: plugin entry is registered and lifecycle hook is present
- Route/view: route registration and view binding both exist
- Runtime: route, event, or command returns the expected behavior
- Data: push/populate/query evidence matches the intended state

Use `stackpress-app-verification` for evidence gates.

## ADR Triggers

Write a lightweight architecture decision note when a decision is significant,
non-obvious, or likely to be revisited.

Good ADR triggers:

- plugin split or ownership model
- schema-first versus runtime-only behavior
- generator-first versus handwritten implementation
- database/runtime target choice
- auth/session/access model
- config-driven population versus custom populate code
- feature flag or staged rollout strategy

Keep ADRs short:

```text
Title
Context
Options
Decision
Consequences
Verification
```

Do not create ADRs for routine file edits.

## Parallel Work Rules

Parallel plugin lanes are allowed only after the shared contracts are explicit:

- schema models and generated type names
- route methods and paths
- event names and payloads
- response shapes consumed by views
- config access rules
- seed data assumptions
- ownership of shared helpers

If a lane needs to change a shared contract, pause parallel work and reclassify.

## Reclassification Triggers

Stop and re-run workflow selection when:

- local files contradict the chosen workflow
- generated output is stale or missing
- a one-off runtime feature becomes repeated/model-driven
- a generated feature needs custom runtime behavior
- plugin boundaries become unclear
- verification fails in a different layer than expected
- the user's goal changes from app delivery to architecture demonstration

Reclassification is not failure. It is how the workflow avoids drift.
