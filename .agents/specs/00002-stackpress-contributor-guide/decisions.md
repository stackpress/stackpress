# Decisions And Gaps

## Accepted Planning Decisions

See [Setup Decisions](setup-decisions.md) for DEC-001 through DEC-005.

### DEC-006: Maintainer contribution policies

Decision:

- Desktop is an active optional package.
- Later implementation may correct stale root `AGENTS.md` package descriptions.
- Missing manifest/export paths are defects for later repair, not patterns.
- Outside schema pruning, developers may purge generated clients when desired;
  cleanup is not universally enforced per generator.
- Current transform ordering is intentional and must be preserved.
- The aggregate includes commonly used, cross-environment capabilities that can
  apply across web, mobile, and desktop; explicit web, mobile, desktop, and AI
  cases stay optional and excluded.
- Every package should eventually have tests passing above 90% coverage; another
  developer is currently adding package coverage.
- The guide must separate current accepted practice from requirements for new
  contributions.
- `packages/stackpress-sql/src/helpers.ts` currently violates the intended
  practices and must not be used as canonical evidence while another developer
  repairs it.

Status: Accepted from user answers on 2026-07-12.

## Open Gaps

### GAP-001: What is the canonical package anatomy?

Question: Which source folders, entrypoints, exports, tests, and build outputs
form the canonical anatomy of each package class, and which variations are
intentional?

Assumption to verify: Package classes share a core plugin/entrypoint pattern but
need separate anatomy maps for generators, access surfaces, utilities, and the
aggregate package.

Status: Resolved for first synthesis by Phase 2 plus DEC-006 exceptions.

### GAP-002: How is exact code placement decided?

Question: What semantic and lifecycle rules choose between schema, transform,
event, script, page, view, config, adapter, helper, or package entrypoint code?

Assumption to verify: Placement follows semantic ownership and runtime
consumption, but the current KB may be too abstract to produce exact paths.

Status: Resolved for synthesis; separate current and new-work rules.

### GAP-003: What are the execution-time boundaries?

Question: What exactly runs during compilation, generation, package build,
bootstrap, lifecycle setup, request handling, and ordinary runtime operation?

Assumption to verify: "Build-time versus runtime" is too coarse; the guide needs
a more precise phase model and observable examples.

Status: Resolved; use the seven-phase model from Phase 3.

### GAP-004: What is the generator contract?

Question: How are generators discovered, registered, ordered, invoked, and
paired with generated artifacts and runtime consumers?

Assumption to verify: The `idea` lifecycle appends package-owned transform paths,
but exact signatures, shared-project behavior, ordering, and output ownership
must be established from every generator-bearing package.

Status: Resolved; preserve intentional order, do not impose universal cleanup,
and apply the accepted test target.

### GAP-005: What rules govern `src/transform/`?

Question: Which folder names, entrypoints, helper boundaries, idempotency rules,
cleanup responsibilities, import constraints, and test expectations are required
for source transforms?

Assumption to verify: Some rules are transformer contracts while others are
Stackpress repository conventions.

Status: Resolved by DEC-006 and Phase 3 evidence.

### GAP-006: What is `packages/stackpress` responsible for?

Question: Which packages, plugins, exports, dependencies, defaults, and ordering
contracts belong in the aggregate package, and what changes require updating it?

Assumption to verify: It is the default composition and public aggregation
surface, not the implementation home for cross-package features.

Status: Resolved by current composition evidence and DEC-006 inclusion policy.

### GAP-007: Which packages are default, optional, private, or planning-only?

Question: What current evidence determines whether a package participates in the
workspace, default aggregate, optional configuration, publishing, or planning
only?

Assumption to verify: Directory presence or a package manifest alone is not
sufficient classification evidence.

Status: Resolved; desktop is active optional and stale root guidance may be
corrected later.

### GAP-008: What implementation conventions are contributor requirements?

Question: Which naming, typing, import, dependency, error/status, request/response,
event, config, browser/server, and public-export patterns should contributors
preserve?

Assumption to verify: The guide should identify stable conventions separately
from style preferences and incidental repetition.

Status: Resolved for synthesis with current/new-work separation and the explicit
SQL helpers exception.

### GAP-009: What verification is convincing for each change class?

Question: Which unit, generation, build, import, pack, template, browser, runtime,
and compatibility checks are required or proportional for each contribution?

Assumption to verify: Existing verification guidance is directionally correct
but needs exact commands, fixtures, and package-specific evidence.

Status: Resolved as a target: tests above 90% coverage for every package, plus
contract-specific evidence.

### GAP-010: What companion surfaces must stay synchronized?

Question: When must a code change also update exports, manifests, aggregate
composition, templates, config, skills, scaffolds, docs, or KB records?

Assumption to verify: Companion updates should be derived from the changed
contract and consumers, not imposed as a universal checklist.

Status: Resolved by contract chains and DEC-006 aggregate policy.

### GAP-011: Which source inconsistencies should not become guidance?

Question: Where do packages diverge because of deliberate specialization,
unfinished migration, legacy structure, or accidental inconsistency?

Assumption to verify: Maintainer clarification will be required for ambiguous
divergences with no decisive tests or public contract.

Status: Resolved for synthesis: classify recorded manifest drift and SQL helpers
as defects/exceptions, not guidance.

### GAP-012: What guide shape supports reliable agent answers?

Question: Which context routing, detailed references, placement tables, recipes,
examples, and negative rules let fresh agents answer contribution questions
correctly without loading the entire repository?

Assumption to verify: Compact context plus source-anchored detailed references
will work, but retrieval tests must determine the final structure.

Status: Resolved. Accepted promotion plus final cold regression passed 9/9.

## Clarification Queue

See [Maintainer Clarifications](phase4-clarifications.md). Preserve user answers
exactly here as decisions before final synthesis.
