<!--
Sync Impact Report
Version change: 1.0.0 -> 2.0.0
Modified principles:
- I. Specification Is the Source of Truth -> I. Runtime-Verified Architecture
- II. Plans Must Explain Architecture and Tradeoffs -> II. Consistent, Maintainable Implementation
- III. User Stories Must Be Independently Deliverable -> III. Behavior-First Verification
- IV. Verification Is Required Before Completion -> IV. User Experience Consistency
- V. Templates and Agent Context Must Stay Aligned -> V. Performance and Simplicity Budgets
Added sections:
- Development Standards
Removed sections:
- Spec Kit Workspace Constraints
- Development Workflow and Quality Gates
Templates requiring updates:
- updated: .specify/templates/plan-template.md
- updated: .specify/templates/spec-template.md
- updated: .specify/templates/tasks-template.md
- checked: .specify/templates/checklist-template.md
- checked: .specify/templates/constitution-template.md
- not present: .specify/templates/commands/
Runtime guidance requiring updates:
- checked: AGENTS.md
- checked: .specify/extensions/agent-context/README.md
- checked: .specify/extensions/agent-context/commands/speckit.agent-context.update.md
Follow-up TODOs:
- None
-->

# Stackpress Desktop Constitution

## Core Principles

### I. Runtime-Verified Architecture

Architecture MUST be validated against real execution behavior before it is
accepted. Boundaries between components, adapters, workflows, generated
artifacts, and public interfaces MUST be explicit, predictable, and easy to
trace. New abstractions are allowed only when they reduce real duplication,
isolate a real boundary, or clarify the public surface. Historical layers,
parallel systems, and hidden control flow MUST be removed or justified in the
plan.

Rationale: Project-wide design decisions must survive actual use. Runtime
evidence prevents abstractions from being accepted only because they look clean
in isolation.

### II. Consistent, Maintainable Implementation

All implementation MUST preserve stronger local conventions before introducing
new patterns. Code, configuration, documentation, and generated artifacts MUST
use clear names, explicit boundaries, readable structure, and documented
non-obvious decisions. Finished work MUST NOT contain debug artifacts,
commented-out code, unexplained unsafe shortcuts, hardcoded secrets, or broad
dependencies added without justification. Public behavior and public interfaces
MUST be understandable without requiring knowledge of internal implementation
details.

Rationale: Maintainability depends on local consistency and clear ownership.
The project must remain easy to review, change, and hand off as it grows.

### III. Behavior-First Verification

Executable behavior, data contracts, integrations, generated output,
security-sensitive paths, and user-visible workflows MUST have verification
evidence before completion. Verification MUST assert observable behavior rather
than implementation details, and it MUST be deterministic, repeatable, and
independent of execution order. When automated tests are not appropriate, the
plan MUST define equivalent validation evidence. Documentation-only or
template-only changes MUST include structural validation for placeholders,
links, examples, and cross-file consistency.

Rationale: Completion means evidence-backed completion. The form of evidence
may vary by change type, but unverified work is not complete.

### IV. User Experience Consistency

User-facing behavior MUST be consistent, accessible, and validated from the
user's point of view. Interfaces MUST use clear hierarchy, predictable
navigation, meaningful labels, resilient error states, and consistent
interaction patterns. Content MUST be concise, task-oriented, and aligned with
the user's current goal. Changes that affect layout, navigation, assets,
workflows, or responsiveness MUST be verified in the rendered experience or
equivalent target environment.

Rationale: UX consistency is a correctness requirement, not polish. Users must
be able to understand state, recover from errors, and complete core workflows
without relying on implementation knowledge.

### V. Performance and Simplicity Budgets

Every plan MUST define measurable performance goals or explicitly mark them not
applicable. Implementations MUST prefer the simplest design that satisfies the
stated requirements. Added complexity, dependencies, background work, storage
cost, network cost, rendering cost, or operational overhead MUST be justified
with a rejected simpler alternative. Performance-sensitive paths MUST be
measured or validated against the goals before completion.

Rationale: Simplicity and performance are governance constraints. Costly design
choices must be visible before they become permanent maintenance burden.

## Development Standards

Specifications MUST define user value, prioritized independently testable
scenarios, edge cases, assumptions, functional requirements, and measurable
success criteria.

Plans MUST replace template placeholders with concrete project paths, selected
approach, validation strategy, performance goals, risks, and rejected
alternatives.

Tasks MUST be grouped by independently demonstrable user story. Each story MUST
include the implementation and verification work needed to prove that story
is complete without relying on unrelated lower-priority stories.

Documentation MUST preserve technical truth, define assumptions, and separate
onboarding, explanation, tasks, and reference. New-developer material MUST
optimize for first success before deep internals.

## Governance

This constitution supersedes informal preferences, generated defaults, and
local convenience when they conflict. Every spec, plan, task list,
implementation, and review MUST include a Constitution Check.

Amendments require:

1. A written proposal naming the affected principles.
2. Rationale explaining why existing governance is insufficient.
3. Migration impact for specs, templates, agent context, code, tests, and docs.
4. Version bump using semantic governance versioning.
5. Review approval before the constitution file is changed.

Versioning rules:

- MAJOR: removes or redefines a principle in a backward-incompatible way.
- MINOR: adds a principle or materially expands governance.
- PATCH: clarifies wording without changing obligations.

Exceptions MUST be explicit in the relevant spec or plan, include the simpler
alternative that was rejected, name the reviewer who accepted the exception,
and include follow-up criteria for removal.

**Version**: 2.0.0 | **Ratified**: 2026-06-15 | **Last Amended**: 2026-06-15
