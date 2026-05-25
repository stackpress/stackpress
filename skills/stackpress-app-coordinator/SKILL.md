---
name: stackpress-app-coordinator
description: Use when an agent needs to build a Stackpress app from a product request by coordinating scaffold, schema, generation, plugin, and verification phases across specialized Stackpress skills.
---

# Stackpress App Coordinator

Coordinate Stackpress app creation as a phased workflow.

This skill is the manager. It owns sequencing, questions, handoffs, and phase
gates. It should not absorb implementation work that already belongs to a more
specific Stackpress skill.

## Overview

Sequence first, implementation second.

The coordinator keeps the build moving in the right order, stops weak handoffs,
and routes work to narrower Stackpress skills instead of improvising across
layers.

## Use This Skill For

- turning a plain-English app request into a staged Stackpress build workflow
- deciding when to scaffold, author schema, generate, write plugins, and verify
- keeping multi-step Stackpress work from happening out of order
- routing implementation to the correct Stackpress specialist skill

## Do Not Use This Skill For

- directly authoring `schema.idea`
- directly scaffolding plugin files when `stackpress-plugin-scaffold` applies
- directly implementing generator transforms when
  `stackpress-plugin-idea-generator` applies
- replacing lower-level skills with a giant one-skill workflow

## Primary Rule

Delegate downward whenever a narrower Stackpress skill already fits the next
step.

The coordinator decides what happens next. Specialist skills decide how that
step is performed.

## The Gate Rule

```text
DO NOT ADVANCE THE WORKFLOW ON GUESSWORK
```

If the current phase is incomplete, ambiguous, or unverified, stop and resolve
that phase before moving on.

## Workflow Phases

Run the app build through these phases in order:

1. discovery
2. scaffold
3. schema
4. generate
5. implementation routing
6. verification
7. optional polish

Do not skip forward unless the current phase is actually complete.

Treat polish as optional. The workflow can finish after verification when the
app is already presentable enough for the user's goal.

## Phase Responsibilities

### 1. Discovery

Collect only the information needed to make the first safe implementation
decisions.

At minimum, clarify:

- app concept and audience
- core entities
- main user flows
- auth requirements
- admin requirements
- custom pages or special runtime behavior

Prefer one question at a time when the request is still vague.

### 2. Scaffold

When the target is a new app in an empty folder, hand off to:

- `stackpress-app-scaffold`

Only do this once the coordinator has enough values for:

- app name
- package name
- brand name
- port

Do not let scaffold invent domain behavior.

### 3. Schema

When the baseline app exists and the domain model is clear enough, hand off to:

- `stackpress-idea-authoring`

The goal of this phase is a concrete `schema.idea` that matches the app's
product requirements closely enough for generation to be meaningful.

Do not move to generation with a hand-wavy schema.

### 4. Generate

Run the normal Stackpress generation step after schema changes that are meant
to drive generated output.

Use project-appropriate commands and config files. If the correct generation
entrypoint is unclear, stop and resolve that uncertainty before running it.

After generation, inspect what changed before jumping into plugin work.

## 5. Implementation Routing

After generation, decide what remaining work belongs in each lane.

### Route to handwritten plugin work when:

- behavior is runtime-only
- the feature is primarily events, routes, services, or integrations
- the feature does not naturally belong in generated client output

Use:

- `stackpress-plugin-scaffold`

### Route to generator plugin work when:

- the feature should be emitted from schema metadata
- repeated model-driven output would be wasteful to handwrite
- runtime depends on generated registries, helpers, pages, or exports

Use:

- `stackpress-plugin-scaffold` for plugin shape first
- `stackpress-plugin-idea-generator` for the transform implementation

### Route back to schema when:

- a requested feature is really a missing model, field, relation, or metadata
- generated admin or view output is wrong because the schema contract is weak

Do not patch runtime code to compensate for a missing schema decision if the
problem belongs in `schema.idea`.

## 6. Verification

Do not call the workflow complete just because files exist.

At the end of each major phase, confirm the minimum evidence:

- scaffold phase: expected files exist
- schema phase: `schema.idea` is coherent and intentional
- generate phase: generated output was produced where expected
- plugin phase: the relevant files are wired into `package.json.plugins`,
  plugin hooks, or generated exports as required
- runtime phase: the relevant route, event, or page behavior is reachable

Prefer the smallest verification that proves the phase is real.

## 7. Optional Polish

Only enter polish after the app works end-to-end and only when the user wants a
refinement pass.

Polish can include:

- replacing placeholder copy
- tightening labels and branding
- improving starter page content
- removing obviously scaffold-like rough edges

Do not hide broken core behavior behind polish work.

If there is no dedicated polish skill available, keep this as a manual late
pass rather than forcing the coordinator to invent a new required phase.

## State Tracking

Keep a compact mental checklist of:

- what the user asked for
- what assumptions were made
- what phase the workflow is in
- what files or outputs now exist
- what remains unresolved

When a phase completes, summarize the new state before moving to the next one.

## Handoff Rules

Before invoking another Stackpress skill, make the handoff explicit:

- what the current phase is
- what artifact should be produced
- what constraints matter

Good handoffs are artifact-based, not vague.

Examples:

- "Create the baseline Stackpress app files in this empty folder."
- "Draft `schema.idea` for products, categories, profiles, carts, and orders."
- "Scaffold a runtime plugin for custom checkout routes."
- "Implement a generation plugin that emits per-model storefront helpers."

## When to Stop and Ask

Stop coordinating and ask for clarification when:

- discovery still leaves critical product ambiguity
- scaffold inputs are missing
- the correct generation entrypoint is unclear
- routing is ambiguous between schema, runtime, and generation
- verification shows the current phase is not actually complete

Do not force the next phase just to preserve momentum.

## Failure Recovery

If a phase fails:

1. identify whether the failure is in scaffold, schema, generation, runtime, or
   verification
2. fix the current phase before advancing
3. re-run only the minimum downstream steps affected by that fix

Do not continue piling phases on top of a broken foundation.

## Common Mistakes

- acting like the coordinator is also the implementer
- running generation before the schema is meaningful
- solving schema gaps with runtime code
- sending generator work into runtime hooks
- scattering plugin work before checking whether a schema change should happen
- skipping verification because the structure "looks right"
- losing track of what phase the app is currently in
