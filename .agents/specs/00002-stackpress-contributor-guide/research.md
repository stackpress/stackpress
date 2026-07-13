# Research Plan

## Method

Research is read-only until findings and clarifications support an accepted
promotion proposal. For every claimed contributor rule, record:

- source locations and package class;
- callers and semantic owner;
- lifecycle or execution phase;
- generated producer and runtime consumer where applicable;
- public/internal export boundary;
- tests or observed behavior;
- counterexamples and package variations;
- classification as required contract, strong convention, package-specific
  pattern, inconsistency, proposal, or unresolved intent;
- affected Gap IDs.

Do not infer a rule from one package when comparable packages exist.

## Research Lanes

### R-001: Workspace And Package Classification

Status: Complete first pass on 2026-07-12. See
[Phase 1 Package Inventory](phase1-package-inventory.md).

Inspect root workspaces, scripts, manifests, package entrypoints, publish flags,
and aggregate membership. Classify active, default, optional, private,
application, and planning-only packages using explicit evidence.

Answers: GAP-001, GAP-006, GAP-007.

Findings: Yarn currently resolves 13 package workspaces. Workspace membership,
default root-build participation, default aggregate-plugin composition, optional
template use, and directory presence are distinct classifications. Current
source contradicts the root contributor note that calls desktop planning-only;
the intended documentation status remains unresolved.

### R-002: Package Anatomy Inventory

Status: Complete first pass on 2026-07-12. See
[Phase 2 Pattern Matrix](phase2-pattern-matrix.md).

Inventory recurring `src/` folders, entrypoints, plugins, schemas, events,
scripts, pages, views, transforms, helpers, types, tests, and export surfaces.
Group packages by comparable anatomy before deriving rules.

Answers: GAP-001, GAP-002, GAP-008, GAP-011.

### R-003: Lifecycle And Execution-Time Model

Status: Complete first pass on 2026-07-12. See
[Phase 3 Contract Traces](phase3-contract-traces.md).

Trace commands and plugin phases to distinguish source compilation, Idea
generation, package build, application bootstrap, lifecycle registration,
request handling, background operations, and runtime invocation.

Answers: GAP-002, GAP-003, GAP-009.

### R-004: Generator And Transform System

Status: Complete first pass on 2026-07-12. Generator registration, transformer
iteration, shared project mutation, generated package patching, runtime loading,
and current cleanup evidence are traced. Maintainer policy remains open.

Compare every source-package transform implementation and trace discovery,
registration, ordering, shared project mutation, emitted files, exports,
idempotency, rename/removal behavior, runtime loading, and tests.

Answers: GAP-003, GAP-004, GAP-005, GAP-009, GAP-010, GAP-011.

### R-005: Aggregate Package Contract

Status: Complete first pass on 2026-07-12. Current composition, facade exports,
dependency shape, optional exclusions, CLI distinction, and manifest drift are
recorded. Future inclusion policy requires maintainer clarification.

Trace `packages/stackpress` dependencies, exports, plugin composition, order,
default exclusions, root package relationship, templates, and consumer imports.
Derive positive and negative criteria for updating the aggregate.

Answers: GAP-006, GAP-007, GAP-010.

### R-006: Runtime Contribution Patterns

Status: Complete first pass on 2026-07-12 for plugin, event/script, page/view,
service registration, optional-target, and local app-plugin patterns.

Compare event, script, route, page, view, service, config, adapter, error/status,
request/response, and server/browser patterns. Trace representative capabilities
from registration through external access.

Answers: GAP-002, GAP-003, GAP-008, GAP-009, GAP-010, GAP-011.

### R-007: Public Surface And Dependency Rules

Status: Complete first pass on 2026-07-12. Dual build, package exports,
`typesVersions`, plugin discovery metadata, aggregate facade, and observed drift
are recorded. Prescriptive public-surface policy remains open.

Research package exports, internal paths, browser-safe entrypoints, dependency
direction, shared types, declarations, bundling, packability, and consumer import
patterns.

Answers: GAP-001, GAP-006, GAP-008, GAP-009, GAP-010.

### R-008: Testing And Change-Impact Matrix

Status: Complete inventory and partial contract mapping. Existing tests prove
selected package behavior, but the intended minimum contribution policy and
missing package coverage require maintainer input.

Map package scripts, tests, fixtures, template workflows, generation checks,
browser evidence, build output, pack/import checks, and compatibility checks to
specific change classes.

Answers: GAP-009, GAP-010.

### R-009: Contributor Guide Synthesis

Status: Complete first draft after Phase 4 decisions. See the Phase 5 contributor
model, placement guide, and verification guide.

Create candidate package anatomy maps, an exact-placement matrix, phase model,
generator recipe, aggregate-package decision guide, implementation considerations,
negative rules, and verification checklists. Attach concise source anchors.

Answers: GAP-001 through GAP-012.

### R-010: Clarification And Retrieval Validation

Status: Clarification complete and retrieval fixtures ready. Execution requires
genuinely fresh agent sessions so this research context cannot leak answers.

Baseline result: complete on 2026-07-12 with three isolated agents and no spec
preload. RET-002, RET-003, and RET-004 passed; the other six require guide/KB
repairs. See [Phase 6 Baseline Results](phase6-baseline-results.md).

Ask focused maintainer questions for unresolved intent, then test realistic
contribution prompts in fresh sessions. Record incorrect answers, missing loads,
overgeneralizations, and guide repairs before proposing KB promotion.

Answers: GAP-011, GAP-012 and any source-created Gaps.

## Representative Contract Traces

At minimum, research one complete example of each:

- schema or normalized model semantic change;
- new or changed per-model generator;
- generated artifact consumed during runtime lifecycle;
- runtime event or operational capability;
- page handler and React view;
- API, MCP, session, or other access-surface adaptation;
- package public export;
- new framework package or plugin composition change;
- config-driven application behavior;
- cross-package change requiring template-level verification.

## Research Expansion Gate

Report newly discovered research lanes before expanding beyond this plan. Record
raw evidence and detailed findings in additional Spec Files only when needed;
link them from `index.md` and keep each file below Agent Workspace limits.
