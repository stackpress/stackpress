# Phase 6 Artifact Retrieval Validation

## Purpose

Test whether the proposed context taxonomy can support the six required artifact
families without loading raw research ledgers or organizing context by output.

## Test Method

For each representative request:

1. route from the proposed context index;
2. identify the minimum Context Files required;
3. draft an artifact structure using only promoted claim candidates;
4. check technical coverage, boundaries, audience adaptation, and unsupported
   claims;
5. record gaps and taxonomy changes.

## VAL-001: Documentation Page

Request: "Explain how Stackpress generation becomes live runtime behavior."

Load:

- `modeling-and-generation.md`
- `architecture-and-composition.md`
- `compatibility-and-maintenance.md`

Resulting outline:

1. Idea and metadata ownership
2. `idea` transform discovery
3. sequential package-owned transforms
4. generated client contents
5. client loading during bootstrap
6. model/tool/route registration
7. regeneration and compatibility boundaries

Verdict: Pass. No package-reference context file is required.

## VAL-002: Article

Request: "Why Stackpress uses events as the center of application composition."

Load:

- `identity-and-principles.md`
- `architecture-and-composition.md`
- `runtime-and-operations.md`
- `interfaces-and-experience.md`

Resulting angle:

- events are a shared internal capability protocol;
- lifecycle events install packages while operational events perform work;
- CLI, pages, API, MCP, and desktop adapt shared capabilities;
- surface-specific authorization prevents the event story from becoming an
  automatic-security claim.

Verdict: Pass. The identity file supplies rationale without becoming marketing.

## VAL-003: Architecture Diagram

Request: "Diagram Idea through database, rendered UI, API, MCP, and desktop."

Load:

- `architecture-and-composition.md`
- `modeling-and-generation.md`
- `runtime-and-operations.md`
- `interfaces-and-experience.md`
- `ecosystem-and-portability.md`

Diagram nodes available:

Idea -> package transforms -> generated client -> lifecycle bootstrap -> event
capabilities -> Inquire/data, Reactus/UI, API, MCP, CLI, desktop adapters.

Verdict: Pass. Ownership and adapter boundaries are explicit enough to prevent a
single undifferentiated "Stackpress" box.

## VAL-004: Teaching Outline

Request: "Teach a developer to add a model-driven feature safely."

Load:

- `identity-and-principles.md`
- `modeling-and-generation.md`
- `runtime-and-operations.md`
- `extension-and-contribution.md`

Lesson sequence:

1. identify domain declarations and metadata roles
2. generate and inspect output
3. decide whether remaining behavior is config, runtime, generation, or page work
4. reconcile local data safely
5. verify producer, generated artifact, consumer, and surface

Verdict: Pass. Contributor routing is actionable without embedding one tutorial
inside context.

## VAL-005: Marketing Message Set

Request: "Write homepage messages explaining Stackpress's differentiators."

Load:

- `identity-and-principles.md`
- `architecture-and-composition.md`
- `ecosystem-and-portability.md`
- `compatibility-and-maintenance.md`

Safe message territories:

- inspectable generation that returns as runtime capability;
- server-side-first capabilities shared across controlled interfaces;
- focused open-source parts composed through packages and adapters;
- extensibility without hiding SQL, server, React, or native host boundaries.

Blocked decisions:

- final category beyond/currently CMS;
- lead promise and branded terminology;
- blanket portability or automatic-interface claims.

Verdict: Conditional pass. The taxonomy supports truthful messages and correctly
surfaces founder decisions rather than inventing final positioning.

## VAL-006: Contributor Onboarding Note

Request: "Help a volunteer find where to implement a change and how to verify it."

Load:

- `extension-and-contribution.md`
- `architecture-and-composition.md`
- `compatibility-and-maintenance.md`
- one task-specific domain file

Resulting note:

- route by semantic owner and runtime consumer;
- select lifecycle phase and generated/runtime pair;
- inspect current versions and adapters;
- run contract-scaled proof and affected integration path;
- never use generated output as the durable implementation owner.

Verdict: Pass. Maintainer names and formal review gates remain explicitly absent.

## Coverage Matrix

| Context file | Docs | Article | Diagram | Teaching | Marketing | Contributor |
| --- | --- | --- | --- | --- | --- | --- |
| identity and principles |  | X |  | X | X |  |
| architecture and composition | X | X | X |  | X | X |
| modeling and generation | X |  | X | X |  | task-specific |
| runtime and operations |  | X | X | X |  | task-specific |
| interfaces and experience |  | X | X |  |  | task-specific |
| ecosystem and portability |  |  | X |  | X | task-specific |
| extension and contribution |  |  |  | X |  | X |
| compatibility and maintenance | X |  |  |  | X | X |

## Result

Taxonomy verdict: Pass for technical retrieval; conditional pass for final brand
messaging pending founder decisions.

GAP-003 disposition: the proposed taxonomy supports all six artifact families.
Repeat the tests after promotion using only `.agents/context/`; that second pass
is required before Freeze.

No additional context category is justified. Adding documentation, diagrams,
marketing, or teaching files would duplicate truth by output type.

