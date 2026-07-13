# Phase 6 Retrieval Plan

## Cold-Context Requirement

Run each fixture in a fresh agent session that has repository access but none of
this research conversation. The agent may follow `.agents/context/index.md` and
linked references. Do not preload this spec unless testing fallback research
routing rather than the promoted KB.

Record the prompt and answer verbatim before scoring.

## Score Dimensions

Score each 0 or 1:

- selects the semantic owner;
- gives exact durable source locations;
- identifies execution phase;
- identifies companion producer/consumer or page/view contract;
- distinguishes aggregate/default from optional behavior;
- selects proportional verification including package coverage target;
- avoids known defects/exceptions as examples;
- states uncertainty rather than inventing a rule.

Passing requires all applicable dimensions. A plausible generic answer fails.

## Fixtures

### RET-001: New Generator

Prompt: Add generated audit helpers for every model and make them available when
the application starts. Where does each part go, how is it registered, and what
must be verified?

Expected: owning runtime package, `src/transform/`, `idea` registration, generated
exports, runtime consumer, intentional order, generation/import/runtime tests.

### RET-002: Build-Time Versus Runtime

Prompt: Explain what runs when I build a Stackpress package, generate an app
client, bootstrap an app, build React views, and handle a request.

Expected: distinct phase model rather than a binary answer.

### RET-003: Transform Folder

Prompt: Can I put a Stackpress generator in a root helper or application plugin
instead of the owning package's transform folder? What contract would be lost?

Expected: source ownership, discovery, shared project/order, exports, runtime
consumer, repeat stability, purge/non-universal cleanup boundary.

### RET-004: Aggregate Inclusion

Prompt: I added a Stackpress mobile integration package. Should it be added to
`packages/stackpress` and its aggregate plugin?

Expected: explicit mobile stays optional; distinguish plugin composition,
dependency, public facade, build, and installation.

### RET-005: Handwritten Page

Prompt: Add a custom account-security page with form submission. Give exact code
locations and lifecycle wiring.

Expected: semantic package/domain, pages, views, route listener, events/services,
exports and SSR/hydration/interaction/accessibility verification.

### RET-006: Event And Script

Prompt: Add a reusable maintenance operation callable from the CLI and another
plugin. Should the logic live in the event handler?

Expected: reusable script/mechanism plus Ingest event adapter, listen registration,
exports if public, status/error tests.

### RET-007: Public Export

Prompt: Another package needs a new class from stackpress-schema. Is exporting it
from `src/index.ts` enough?

Expected: intentional root/deep surface, ESM/CJS, exports/typesVersions,
declarations, consumer import, aggregate only if deliberately forwarded.

### RET-008: Legacy Pattern

Prompt: I found a convenient implementation pattern in
`stackpress-sql/src/helpers.ts`. Should I copy it into another package?

Expected: no; it is an explicit current violation pending repair and cannot be
canonical guidance.

### RET-009: Tests

Prompt: Root `yarn test` passes after I change stackpress-api. Is the contribution
verified?

Expected: no; run owning package tests/coverage above 90% plus access-surface and
integration evidence.

## Result Ledger

Baseline recorded in [Phase 6 Baseline Results](phase6-baseline-results.md), with
verbatim answers preserved in the three linked answer files. Result: 3/9 pass.

For each failure classify: missing fact, router failure, ambiguous wording,
insufficient exact path, exception leakage, overgeneralization, or unsupported
policy. Repair the smallest owning guide layer, then rerun the failed fixture in
another fresh session.
