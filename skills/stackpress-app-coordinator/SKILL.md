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

This skill must preserve the real goal of the project. Some Stackpress work is
mainly about delivering end-user behavior. Some Stackpress work is mainly about
demonstrating architecture, plugin boundaries, or generation patterns. The
coordinator should keep that distinction explicit because it changes what
"correct" sequencing and verification look like.

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

## Local Context Rule

Do not infer app purpose from names alone.

- verify what an app, template, or plugin is really for by inspecting local
  config, schema, plugins, and existing routes
- treat folder names, package names, or template names as hints, not as proof
- if local context contradicts the name, follow the local context

## Architecture Goal Rule

If the project is intended to teach or demonstrate Stackpress architecture,
keep that goal explicit through the whole workflow.

Examples:

- a sample whose main point is plugin separation
- a sample whose main point is schema-driven generation
- a sample whose main point is infrastructure versus feature ownership

Do not let architecture-teaching goals collapse into a generic app build just
because the feature flow is familiar.

## Local Database Rule

Prefer the app's normal local database target when it uses a file-backed
database in `.build`.

- if the project already uses a file-based local database such as SQLite or
  PGlite through its normal Yarn workflow, use that existing target by default
- do not create an ad hoc second file-backed local database unless there is a
  concrete reason
- alternate scratch databases are more acceptable for server-based database
  setups, where isolation may be operationally cleaner
- if you intentionally diverge from the app's default database target, say why

## Sample Data Rule

Prefer config-driven sample data when the app already supports it and the seed
records are static.

- use config population for simple sample rows that do not need custom runtime
  logic
- do not invent or preserve plugin `populate.ts` scripts when config-driven
  population is the cleaner default for the app
- only route sample data into custom populate code when the data setup needs
  logic that config alone cannot express

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
- whether the project is mainly a product app, a teaching sample, or an
  architecture sample

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

If the app uses config-driven population as part of its normal local workflow,
keep that in the same expected path instead of introducing a second seeding
mechanism by convenience.

## 5. Implementation Routing

After generation, decide what remaining work belongs in each lane.

### Route to handwritten plugin work when:

- behavior is runtime-only
- the feature is primarily events, routes, services, or integrations
- the feature does not naturally belong in generated client output

Use:

- `stackpress-plugin-scaffold`

### Route to handwritten page-view work when:

- the main work is a custom page surface
- the plugin already exists or can be scaffolded quickly
- the task depends on `pages/*.ts`, `server.view.get(...)`, or `views/*.tsx`
- the page needs custom layout, `Head`, or Stackpress view-layer props

Use:

- `stackpress-plugin-scaffold` for plugin shape first when needed
- `stackpress-plugin-views` for the handwritten page implementation

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

## Execution Hygiene

Close temporary local runtime processes that you started for the workflow.

- if you started a local Stackpress dev server for verification, stop it before
  claiming the work is done unless the user asked to leave it running
- treat temporary server cleanup as part of phase completion, not as an
  optional courtesy

## State Tracking

Keep a compact mental checklist of:

- what the user asked for
- what assumptions were made
- what phase the workflow is in
- what files or outputs now exist
- what remains unresolved

When a phase completes, summarize the new state before moving to the next one.

## Required Phase Summary

Before implementation begins for any new phase, restate:

1. the current phase
2. the artifact to produce
3. why this phase is next
4. which Stackpress skill should own the work

Do not skip this summary when the workflow changes shape after user feedback.

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

Treat examples as illustrative patterns, not literal project names, required
domains, or prescribed plugin folders.

## When to Stop and Ask

Stop coordinating and ask for clarification when:

- discovery still leaves critical product ambiguity
- scaffold inputs are missing
- the correct generation entrypoint is unclear
- routing is ambiguous between schema, runtime, and generation
- verification shows the current phase is not actually complete

Do not force the next phase just to preserve momentum.

## Correction Reset Rule

When the user corrects the architecture or intent:

1. restate the corrected model
2. discard the stale assumption explicitly
3. re-evaluate the current phase against the corrected model
4. do not keep layering work on top of the stale framing

Architecture corrections are resets, not minor edits.

## Failure Recovery

If a phase fails:

1. identify whether the failure is in scaffold, schema, generation, runtime, or
   verification
2. fix the current phase before advancing
3. re-run only the minimum downstream steps affected by that fix

Do not continue piling phases on top of a broken foundation.

## Common Mistakes

- acting like the coordinator is also the implementer
- inferring app purpose from a template or folder name without checking local
  context
- running generation before the schema is meaningful
- solving schema gaps with runtime code
- sending generator work into runtime hooks
- scattering plugin work before checking whether a schema change should happen
- failing to route unresolved architecture questions through
  `stackpress-plugin-router`
- skipping verification because the structure "looks right"
- losing track of what phase the app is currently in
