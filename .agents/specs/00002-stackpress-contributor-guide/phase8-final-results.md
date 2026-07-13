# Phase 8 Final Results

## Promotion

The user approved the Phase 7 map. Promotion updated:

- architecture/composition;
- compatibility/maintenance;
- extension/contribution;
- modeling/generation;
- the context router;
- CLI/plugin reference guidance;
- new REF-018 contributor source patterns.

No product source, manifest, root `AGENTS.md`, generated output, or SQL helpers
were changed.

## Retrieval Sequence

Baseline: 3/9 pass.

First failed-fixture rerun repaired RET-001, RET-006, RET-008, and RET-009.
RET-005 and RET-007 remained incomplete because they omitted the explicit
above-90% target. Two small routing/checklist refinements made the target
change-class-specific and required exact-placement answers to close with
verification.

Final targeted RET-005 and RET-007 rerun: pass.

Final all-fixture regression with three new isolated agents: **9/9 pass**.
Normalized accepted answers are in
[Phase 8 Final Answers](phase8-final-answers.md); the isolated-agent message
record preserves the full raw responses.

## Final Scores

| Fixture | Result |
| --- | --- |
| RET-001 new generator | Pass |
| RET-002 execution phases | Pass |
| RET-003 transform ownership | Pass |
| RET-004 aggregate inclusion | Pass |
| RET-005 handwritten page | Pass |
| RET-006 event/script | Pass |
| RET-007 public export | Pass |
| RET-008 known violation | Pass |
| RET-009 package tests | Pass |

## Deferred Separate Work

- Correct stale root contributor package descriptions.
- Repair missing manifest/export paths.
- Allow the other developer to repair SQL helpers and package test coverage.
- Remove or revise temporary exception wording when those repairs land.

These are maintenance triggers, not blockers for the accepted contributor KB.

## Validation

The Agent Workspace deterministic validator passes. All promoted files remain
below line caps, and REF-018 has an inbound task-informative Context Link.

## Freeze

Frozen on 2026-07-12. Reopen only with explicit user permission. Future source,
policy, package layout, transform order, coverage, exception, or contributor
routing changes use the Stackpress KB maintenance workflow and affected retrieval
fixtures.
