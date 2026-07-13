# Proof Plan

## Policy

Prefer current source, tests, manifests, generated artifacts, and existing
behavior. Add implementation Proofs only when those sources cannot resolve a
material Gap. Do not create prototype folders during spec setup.

## Conditional Technical Proofs

### PROOF-001: Transform Discovery And Ordering

Status: Not required; source trace and retrieval regression resolved the Gap.

Gap: GAP-004 and GAP-005.

Use only if source and existing tests do not conclusively establish transform
path discovery, ordering, shared-project behavior, or repeated invocation.

Expected signal: A minimal controlled generator records discovery and execution
order and produces stable output across clean and repeated generation.

Failure signal: Ordering or discovery differs from the source-derived model, or
repeat generation duplicates or loses output.

### PROOF-002: Generated/Runtime Contract

Status: Not required; generated/runtime source chain and retrieval passed.

Gap: GAP-003, GAP-004, and GAP-010.

Use only if the boundary between generated exports and runtime loading cannot be
settled through existing package/template tests.

Expected signal: A generated artifact compiles, imports through its declared
surface, and is registered or consumed in the expected lifecycle phase.

Failure signal: Source generation succeeds but the artifact is not importable,
registered, or reachable at runtime.

### PROOF-003: Aggregate Package Inclusion

Status: Not required; source plus maintainer policy and retrieval passed.

Gap: GAP-006 and GAP-007.

Use only if manifests, exports, composition source, and consumers do not settle
the effect of inclusion versus optional package configuration.

Expected signal: The controlled package is available only through the composition
path predicted by the research model, without accidental default activation.

Failure signal: Package availability, ordering, or activation contradicts the
derived aggregate-package rule.

## Required Retrieval Tests

These are guide-quality tests, not implementation prototypes.

### RET-001: Exact Placement

A fresh agent must place representative schema, transform, event, page/view,
adapter, config, export, and aggregate changes in exact source locations and
explain the ownership rule.

### RET-002: Phase Explanation

A fresh agent must distinguish compilation, generation, build, bootstrap,
lifecycle registration, request handling, and runtime invocation using concrete
Stackpress examples.

### RET-003: Generator Change

A fresh agent must explain how to add or revise a generator, identify its runtime
consumer and companion exports, and choose clean/repeat/remove verification.

### RET-004: Aggregate Decision

A fresh agent must correctly decide when `packages/stackpress` changes, when an
optional package stays separate, and why feature implementation should not be
centralized in the aggregate.

### RET-005: Change Impact

A fresh agent must identify proportional tests plus required template, skill,
scaffold, docs, or KB synchronization for a representative cross-package change.

## Acceptance Rule

Retrieval tests pass only when answers are source-backed, operationally specific,
and correctly bounded. Plausible but generic explanations, path guesses, or
claims inherited only from current context are failures that must feed back into
research or guide structure.
