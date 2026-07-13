# Phase 6 Cold-Context Baseline

## Method

Date: 2026-07-12.

Three isolated read-only agents received three fixtures each. They were told to
start from current `.agents/context/index.md`, follow only relevant accepted KB
links, avoid this spec, and inspect source only when routed there. Raw answers are
preserved in [A](phase6-baseline-answers-a.md),
[B](phase6-baseline-answers-b.md), and
[C](phase6-baseline-answers-c.md).

Passing requires every applicable rubric dimension; plausible generic guidance
does not pass.

## Results

| Fixture | Result | Material signal |
| --- | --- | --- |
| RET-001 new generator | Fail | Strong producer/consumer trace, but imposed rename/removal cleanup beyond accepted policy and omitted >90% package coverage. |
| RET-002 execution phases | Pass | Correctly separated package compile, generation, bootstrap/lifecycle, Reactus build, and request/render runtime. |
| RET-003 transform ownership | Pass | Correct package-owned contract and valid app-owned exception; no root-helper discovery assumption. |
| RET-004 aggregate inclusion | Pass | Correctly kept explicit mobile optional and separated plugin composition from facade export. |
| RET-005 handwritten page | Fail | Useful page/view wiring, but assumed app-local ownership without first classifying framework/domain versus app behavior and omitted package coverage. |
| RET-006 event and script | Fail | Correct separation idea but invented `src/actions/maintenance.ts` instead of the repository's established `src/scripts/` lane. |
| RET-007 public export | Fail | Correct export/import mechanics but omitted the accepted package test/coverage target. |
| RET-008 legacy pattern | Fail | Treated SQL helpers as potentially reusable/public guidance despite the explicit maintainer-declared violation. |
| RET-009 tests | Fail | Correctly noticed root test scope and package/API evidence, but omitted the above-90% package coverage target. |

Baseline: **3 of 9 passed**.

## Failure Classifications

### Missing accepted policy

- RET-001, RET-007, RET-009: current KB does not expose the above-90% package
  coverage target.
- RET-001: current context overstates rename/removal cleanup as a universal
  generator expectation instead of distinguishing schema pruning from optional
  generated-client purge.
- RET-008: current KB does not identify SQL helpers as a noncanonical temporary
  violation.

### Insufficient exact placement

- RET-006: existing routing says "runtime plugin/event" but does not retrieve the
  event-adapter plus `src/scripts/` mechanism pattern, allowing invention of an
  unsupported `src/actions/` lane.

### Ownership ambiguity

- RET-005: existing routing did not force classification of framework package,
  nested domain package, or app-local customization before giving exact paths.

## Required Repairs Before Rerun

1. Add the seven-phase contributor model and exact placement routing.
2. Add event/script and page/view pair rules with source locations.
3. Add generator registration, intentional order, generated/runtime pairing,
   repeatability, and non-universal cleanup/purge boundary.
4. Add aggregate inclusion criteria and optional-target exclusion.
5. Add the per-package passing-test and above-90% coverage target while stating
   current enforcement gaps.
6. Add known exception/defect guidance, including SQL helpers and manifest drift.
7. Require semantic-owner classification before exact app or package paths.

These repairs affect accepted contributor context and detailed references. They
must be proposed for promotion before editing the KB.
