---
name: stackpress-router
description: Use when a task is about Stackpress and an agent needs to choose which Stackpress skill should handle it, including app discovery, app build coordination, scaffolding, idea authoring, plugin routing, plugin implementation, multi-plugin workflow coordination, or verification.
---

# Stackpress Router

Route Stackpress-related requests to the narrowest useful Stackpress skill.

This skill is a dispatcher. It should not absorb the domain instructions from
the specialist skills. Use it to decide which skill to load next, then follow
that skill's workflow.

## Primary Rule

```text
SELECT THE NARROWEST STACKPRESS SKILL THAT FITS THE TASK.
```

When local code can answer the routing question, inspect the smallest relevant
context before deciding. Prefer current project files over generic assumptions.

## Use This Skill For

- Stackpress requests where the right specialist skill is unclear
- broad app-build requests that may require discovery, scaffold, schema,
  generation, plugin work, and verification
- feature requests that may belong in `schema.idea`, plugin runtime code,
  route/view code, or generation transforms
- multi-plugin requests where concurrent workflow coordination may be needed
- Stackpress skill-set questions such as "which Stackpress skill should I use?"
- alias requests through `stackpress-ai`

## Do Not Use This Skill For

- non-Stackpress tasks
- directly writing schema, plugins, views, handlers, transforms, or tests when
  a narrower Stackpress skill already fits
- replacing phase verification with informal confidence
- routing from memory when nearby project files can settle ownership

## Routing Table

Choose one primary skill unless the task clearly spans phases.

- `stackpress-app-discovery`: vague product ideas, requirements clarification,
  entities, flows, auth, admin, and custom behavior before implementation
- `stackpress-app-coordinator`: full app builds from a product request, phased
  work, handoffs, and phase gates across multiple Stackpress skills
- `stackpress-app-scaffold`: creating a baseline Stackpress app in an empty
  folder before schema or plugin work
- `stackpress-idea-authoring`: writing, extending, reviewing, or debugging
  `schema.idea`, built-in models, relations, assertions, and generated UI
  metadata
- `stackpress-plugin-router`: deciding whether a feature belongs in schema,
  runtime plugin code, route/view code, or generation transforms
- `stackpress-plugin-scaffold`: creating or extending `plugins/*` structure,
  `plugin.ts` lifecycle wiring, browser-safe exports, transforms, or plugin
  registration
- `stackpress-plugin-pages-events`: implementing or revising `plugins/*/pages`
  and `plugins/*/events` handlers, request/session access, redirects,
  response shaping, `ctx.resolve`, and `ctx.emit`
- `stackpress-plugin-views`: implementing handwritten `plugins/*/views/*.tsx`
  and route/view pairing
- `stackpress-plugin-idea-generator`: building generation plugins through the
  `idea` lifecycle and `transform/` entrypoint
- `stackpress-workflow-router`: coordinating, sequencing, or comparing
  multiple local plugins that share schema, generated output, routes, events,
  config, seed data, or verification gates
- `stackpress-app-verification`: checking phase evidence, generated output,
  plugin wiring, reachable runtime behavior, and readiness before advancing

## Fast Selection

Use these signals for common requests:

- "build an app", "make a Stackpress app", or a full product request:
  `stackpress-app-discovery` if requirements are vague, otherwise
  `stackpress-app-coordinator`
- "create project", "new app", "empty folder", or "baseline scaffold":
  `stackpress-app-scaffold`
- "`schema.idea`", models, relations, fields, validators, assertions, labels,
  admin UI metadata, or generated forms/lists: `stackpress-idea-authoring`
- "where should this feature go?": `stackpress-plugin-router`
- "new plugin", "wire plugin", "plugin.ts", lifecycle hooks, transform folder,
  or plugin registration: `stackpress-plugin-scaffold`
- page handlers, event handlers, redirects, guards, sessions, request payloads,
  or `ctx.emit`: `stackpress-plugin-pages-events`
- TSX views, layouts, `server.view.get(...)`, `setViewProps`, `Head`, or
  handwritten page UI: `stackpress-plugin-views`
- generated client files, transforms, `stackpress generate`, schema inspection
  during generation, or generated exports: `stackpress-plugin-idea-generator`
- several plugins, parallel lanes, shared generated output, shared routes,
  shared config, or plugin ownership boundaries: `stackpress-workflow-router`
- "verify", "is this phase done?", generated output checks, runtime smoke
  checks, or phase gates: `stackpress-app-verification`

## Local Context Check

Before routing implementation work, inspect only what helps classify ownership:

- `package.json` for workspace scripts and plugin registration
- `schema.idea` for source schema contracts
- `config/*.ts` for database, app, generated client, plugin, and runtime config
- `plugins/*` for existing plugin roles, route bindings, handlers, views,
  transforms, browser-safe exports, and shared helpers
- generated output locations only to diagnose stale or missing generation
- relevant tests when they define contracts or verification gates

Skip this check for pure documentation questions or explicit "use this skill"
requests unless local facts are needed to answer correctly.

## Handoff Format

When routing is not obvious to the user, state the handoff compactly:

```text
Stackpress skill: <skill-name>
Why: <task signal or local evidence>
Source of truth: <files checked or "request only">
Next step: <what the selected skill should do>
```

If two skills are plausible and local context cannot settle it, present at most
two options, recommend one, and explain what would change the choice.

## Alias

`stackpress-ai` is an alias for this router. When `stackpress-ai` triggers,
follow `stackpress-router` exactly and route to the same specialist skills.
