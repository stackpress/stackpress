---
name: stackpress-plugin-router
description: Use when an agent needs to decide whether a Stackpress feature belongs in `schema.idea`, handwritten plugin runtime code, route and view code, or a generation plugin transform.
---

# Stackpress Plugin Router

Route Stackpress feature work to the correct implementation lane before writing
code.

This skill is a classifier and handoff skill. It should decide where a feature
belongs, explain why, and invoke the narrower Stackpress skill that should own
the implementation.

## Overview

Choose the correct layer before writing code.

Most bad Stackpress implementations come from solving a schema problem in
runtime code, a runtime problem in generation, or a route/view problem without
the right underlying contract.

## Use This Skill For

- deciding whether a requested feature is schema work or plugin work
- deciding whether plugin work belongs in runtime hooks or generation
- deciding whether page and route work is just route wiring or model-driven
  generation
- preventing the agent from solving the same problem in the wrong layer

## Do Not Use This Skill For

- directly writing `schema.idea`
- directly scaffolding plugins unless routing is already settled
- directly implementing `transform/index.ts`
- acting as a generic project planner beyond the feature-routing decision

## Primary Rule

Route the feature to the highest-leverage correct layer.

That usually means:

- schema first when the missing behavior is really missing domain structure
- generation when output should be derived from schema repeatedly
- runtime when the behavior is request-time or event-time logic
- route/view work when the main need is page exposure or page presentation

Do not choose a lower layer just because it feels faster to patch.

## Routing Gate

```text
DO NOT IMPLEMENT UNTIL THE FEATURE HAS A CLEAR LANE
```

If the lane is still ambiguous, keep classifying. Wrong-lane fixes create
fragile code and rework.

## Output Format

For each routing decision, produce:

1. the chosen lane
2. why that lane is correct
3. what artifact should be created or changed
4. what Stackpress skill should handle it next

If the request spans multiple lanes, split it explicitly instead of forcing one
lane to do everything.

## Routing Order

Evaluate the feature in this order:

1. schema question
2. generation question
3. runtime question
4. route/view question

This order matters because many runtime patches are really schema or generation
problems in disguise.

## 1. Route Back to Schema When

The request changes the app's domain contract.

Common signals:

- a new entity or model is needed
- a field is missing
- a relation is missing or wrong
- validations or assertions belong to the data contract
- generated admin output is weak because labels, icons, or display metadata are
  missing
- search, sort, required, unique, default, active, or timestamp behavior should
  come from model semantics

Use next:

- `stackpress-idea-authoring`

Examples:

- "Products need sizes and stock counts."
- "Orders should belong to profiles and shipping addresses."
- "The admin list should show a better label for this model."

Do not solve these with ad hoc runtime fields or one-off page code.

## 2. Route to Generation Plugin Work When

The feature should be emitted from schema metadata or repeated per model.

Common signals:

- the same pattern should be created for many models
- generated client helpers, registries, or pages should be derived from models
- package exports need to include generated surfaces
- runtime behavior depends on generated artifacts instead of one handwritten
  file
- the feature belongs in `stackpress generate` rather than request-time logic

Use next:

- `stackpress-plugin-scaffold` if the plugin shell does not exist yet
- `stackpress-plugin-idea-generator` for the transform implementation

Examples:

- "Generate helper files for every publishable model."
- "Emit a registry of searchable catalog models from schema metadata."
- "Create generated page modules for a repeated model-driven pattern."

Do not route here for one-off routes or simple runtime listeners.

## 3. Route to Runtime Plugin Work When

The feature is request-time, event-time, or service wiring logic that does not
belong in schema-driven generation.

Common signals:

- register or resolve an event at runtime
- connect a service during `config`
- add listeners during `listen`
- integrate with email, payments, webhooks, or third-party APIs
- perform business logic on demand
- handle auth/session/runtime decisions that are not just model metadata

Use next:

- `stackpress-plugin-scaffold`

Examples:

- "Send an email when an order is placed."
- "Register a payment gateway client from config."
- "Add a webhook listener for inventory updates."

Do not move repeated model-driven code here just because runtime feels familiar.

## 4. Route to Route/View Work When

The main need is exposing or presenting behavior through pages.

Common signals:

- add a route
- bind a route to a page handler
- add a React view under `views/`
- create a page with custom layout or content
- pair `server.import.get(...)` with `server.view.get(...)`

Use next:

- `stackpress-plugin-scaffold` if the plugin shell or route wiring does not
  exist yet
- `stackpress-plugin-views` for the handwritten page and route/view pairing
  work

Examples:

- "Add a branded home page."
- "Create a custom checkout page."
- "Expose a profile dashboard route."

## Mixed Cases

Many real features span more than one lane.

Split them instead of forcing a single implementation style.

Examples:

- "Add product reviews."
  - schema lane: review model, relations, validations
  - route/view lane: product review pages
  - runtime lane: moderation or notification events

- "Build a product catalog."
  - schema lane: product, category, inventory metadata
  - generation lane: repeated generated helpers if the pattern is model-driven
  - route/view lane: catalog pages and detail pages

- "Add checkout."
  - schema lane: carts, orders, addresses
  - runtime lane: payment and order events
  - route/view lane: checkout UI

## Anti-Rationalization Checks

Before choosing runtime code, ask:

- is this really missing data structure?
- should this repeat per model?
- would generation remove duplication?

Before choosing generation, ask:

- is the output really derived from schema?
- does this need many emitted files or registries?
- is this more than a one-off route or listener?

Before choosing route/view work, ask:

- is this just a page surface for a deeper schema or runtime gap?

## When to Stop and Re-Route

Stop and re-evaluate the lane when:

- the requested behavior changes the domain contract mid-implementation
- the same pattern is starting to repeat across many models
- route/view work is exposing a missing schema decision
- runtime code is compensating for missing generated artifacts

Do not keep adding code in the wrong lane once the mismatch is visible.

## Handoff Patterns

Good handoffs:

- "This belongs in `schema.idea` because sizes, stock, and brand are model
  fields. Use `stackpress-idea-authoring` to extend the product model."
- "This belongs in runtime plugin code because order confirmation email is a
  `listen` or event-driven concern. Use `stackpress-plugin-scaffold`."
- "This belongs in a generation plugin because the same helper should be
  emitted for every searchable model. Use `stackpress-plugin-scaffold` for the
  plugin shell, then `stackpress-plugin-idea-generator`."
- "This belongs in handwritten page-view work because the route already points
  at a custom page under `views/`. Use `stackpress-plugin-views`."

Bad handoffs:

- "Probably a plugin."
- "Maybe generated."
- "Let's just add a route and see."

## Common Mistakes

- solving missing models with runtime hacks
- generating one-off behavior that should stay handwritten
- putting generation logic into `listen` or `route`
- treating page work as only frontend work when route registration is also
  required
- forcing a multi-lane feature into one plugin hook
- choosing the fastest patch instead of the correct layer
