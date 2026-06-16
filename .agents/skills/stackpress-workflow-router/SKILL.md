---
name: stackpress-workflow-router
description: Use when a Stackpress task explicitly involves developing, coordinating, comparing, or sequencing multiple local plugins at the same time, especially when parallel plugin lanes may share schema, generated client output, routes, events, config, seed data, or verification gates.
---

# Stackpress Workflow Router

Choose the right workflow for concurrent Stackpress plugin development.

This skill is a workflow selector and guardrail. It should not absorb the work
owned by the existing Stackpress specialist skills.

## Primary Rule

```text
CHECK LOCAL CONTRACTS FIRST. THEN SELECT A MULTI-PLUGIN WORKFLOW.
```

Do not solve a Stackpress task from memory when local source files can answer
the question. Inspect the relevant project context before selecting a workflow.

## Use This Skill For

- tasks that explicitly mention developing multiple Stackpress plugins together
- tasks that ask how to split, sequence, parallelize, or coordinate plugin work
- tasks where multiple plugins may share schema, generated client output,
  routes, events, config, seed data, or verification
- choosing between possible multi-plugin Stackpress workflows after local
  context has been checked
- presenting workflow options to the user when more than one workflow fits
- reducing context drift during long or parallel Stackpress plugin work

## Do Not Use This Skill For

- single-plugin changes unless they affect another plugin contract
- ordinary app discovery, scaffolding, schema authoring, route/view work, or
  verification when no concurrent plugin coordination is involved
- directly writing `schema.idea`
- directly scaffolding apps or plugins
- directly implementing page handlers, views, events, or generator transforms
- replacing the specialist Stackpress skills with one large workflow skill

## Activation Gate

Only continue with this skill when the user's task description or local context
indicates multi-plugin work.

Good activation signals:

- "build these plugins in parallel"
- "develop multiple plugins at the same time"
- "split this app into plugins"
- "coordinate plugin lanes"
- "which plugin should own which part"
- "several plugins need to share generated types/events/routes/config"

If the task is really single-lane work, route directly to the narrower
specialist skill instead of presenting workflow options.

## Preflight Context Check

Before deciding on possible workflows, inspect the smallest useful local
context for shared contracts and collision points:

- `package.json` for scripts and local plugin registration
- `schema.idea` for source domain contracts
- `config/*.ts` for runtime, generated client folder/package, database,
  access, and population behavior
- generated client folder settings and existing generated output, when present
- existing `plugins/*` roles, lifecycle hooks, route bindings, event handlers,
  views, transforms, browser-safe exports, and shared helpers
- plugin-local tests under `plugins/*/tests` that already assert plugin
  boundaries or generated artifacts
- relevant tests and generated-output locations when verification depends on
  them

Treat folder names as hints, not proof. Local code wins over generic workflow
rules.

Summarize the preflight before selecting a workflow:

```text
Plugin lanes found: <plugins or intended plugins>
Shared contracts: <schema/generated/routes/events/config/data>
Collision risks: <files or contracts multiple lanes may touch>
Generation state: <known/stale/unknown/not involved>
Verification hooks: <tests/commands/routes/events available>
```

## Workflow Selection

Use the selector in `references/workflow-selection.md` when the task is not
obvious after the preflight.

Load `references/workflow-catalog.md` only when you need the details of a
candidate workflow.

If one workflow clearly fits, select it and proceed through the appropriate
specialist skills.

If two or more workflows plausibly fit, stop and present 2-3 options with:

1. when it fits
2. tradeoffs
3. recommended choice
4. what evidence or user choice would settle it

Do not ask the user to choose when the local context already makes the answer
clear.

## Specialist Skill Routing

Delegate downward whenever a narrower Stackpress skill fits the next step.

- `stackpress-app-discovery`: clarify vague app ideas into buildable briefs
- `stackpress-app-coordinator`: coordinate a selected app build workflow
- `stackpress-app-scaffold`: create a new baseline app in an empty folder
- `stackpress-idea-authoring`: draft, refine, or debug `schema.idea`
- `stackpress-plugin-router`: classify feature work into schema, runtime,
  route/view, or generation lanes
- `stackpress-plugin-scaffold`: create or extend local plugin shape and wiring
- `stackpress-plugin-pages-events`: implement or revise `pages/` and `events/`
  handlers
- `stackpress-plugin-views`: implement handwritten plugin `views/*.tsx`
- `stackpress-plugin-idea-generator`: implement `idea` and `transform/`
  generation plugins
- `stackpress-app-verification`: verify phase evidence before advancing

If a skill is not installed in the current environment, say so and use the
nearest local project pattern without pretending the skill was available.

## Drift Controls

Use `references/drift-control.md` for long, parallel, ambiguous, or
architecture-significant work.

Always apply these default controls:

- keep the current workflow name explicit
- keep the current phase explicit
- record the source-of-truth files for the phase
- verify phase evidence before moving forward
- reclassify when local code contradicts the planned workflow
- do not edit generated output as the source of truth
- do not parallelize plugin work until shared contracts are explicit

## Plugin Composition Examples

For apps where separate local plugins own independent domains, user journeys,
or infrastructure lanes while sharing schema, generated types, routes, events,
or config, load:

- `references/plugin-composition-example.md`

Use examples as composition patterns, not as required domains, plugin names, or
folder layouts. Stackpress can be used for many kinds of web apps; never infer
a domain, app category, or workflow shape unless the user request or local
project context supports it.

## Workflow Output

When selecting or proposing a workflow, use this compact format:

```text
Workflow: <name>
Why: <reason from local context>
Phase: <current phase>
Source of truth: <files or contracts>
Next skill: <specialist skill>
Verification gate: <evidence required before advancing>
```

If presenting options, use:

```text
Option A: <workflow>
Fits when: <condition>
Tradeoff: <cost or risk>

Option B: <workflow>
Fits when: <condition>
Tradeoff: <cost or risk>

Recommendation: <choice and reason>
```

Keep the answer short unless the user asks for a full workflow design.
