# Template Store Design

## Summary

This spec redefines `templates/store` around its actual purpose.

`templates/store` is not a monolithic commerce template just because the folder
is named `store`. In this sample, `store` refers to storage and persistence
infrastructure. The template should still expose a working end-to-end flow
using example commerce-like features such as `product`, `cart`, `checkout`,
and `order`, but the main lesson is architectural: separate responsibilities
into distinct plugins and let StackPress weave them together through plugin
registration, events, and route priorities.

This task is also an experiment. The sample should help evaluate whether the
installed StackPress and ChrisAI skill families guide this kind of work
correctly or push it in the wrong direction.

## Goals

- Keep `plugins/store` infrastructure-only.
- Keep `plugins/app` focused on shared app infrastructure.
- Model `product`, `cart`, `checkout`, and `order` as separate plugins in
  separate folders.
- Expose a working end-to-end flow across those plugins with a minimal,
  understandable UX.
- Demonstrate separation of responsibility and decoupling through normal
  StackPress composition points.
- Use the work as a test case for `stackpress-app-coordinator`,
  `chrisai-usage`, and their downstream skill families.

## Non-Goals

- Turning `plugins/store` into the owner of commerce behavior.
- Building one large plugin that owns the whole user flow.
- Treating `plugins/app` as a catch-all for unrelated feature logic.
- Production-grade commerce features such as inventory engines, shipping
  systems, discount logic, tax logic, or payment gateways.
- Evaluating only isolated single skills without considering the family they
  route into.

## Current State

`templates/store` already exists, but its current shape is much thinner than
the intended sample.

Observed local reality:

- `plugins/store/plugin.ts` registers the database connection and populate
  event.
- `plugins/store/connect.ts` is the PGlite-backed connection wiring.
- `plugins/store/populate.ts` creates baseline admin and application data.
- `plugins/app/plugin.ts` currently owns a minimal home route and basic app
  error behavior.
- `schema.idea` currently imports the baseline StackPress idea and does not yet
  define the feature-oriented model set needed for the sample flow.

That means the existing template already supports the interpretation that
`store` is infrastructure, not the place to dump domain logic.

## Recommended Approach

Build `templates/store` as a plugin-composition sample.

The template should still present a small working product-to-order flow, but
the architectural lesson comes first:

- `store` owns persistence infrastructure
- `app` owns shared app infrastructure
- `product`, `cart`, `checkout`, and `order` own the domain flow in separate
  plugins

This is the recommended approach because it tests the real StackPress value
proposition more directly than a single-plugin example would. It also creates a
better experiment for the installed skill families because the work depends on
correct routing, clean boundaries, and verification across multiple layers.

## Alternatives Considered

### Option 1: Domain-per-plugin sample with thin shared infrastructure

This is the selected approach.

Benefits:

- Best demonstration of separation of responsibility.
- Makes plugin boundaries visible to developers reading the template.
- Forces the sample to use StackPress weaving instead of hidden coupling.
- Produces a better test for coordinator and routing skills.

Tradeoffs:

- Requires more deliberate wiring than a single-plugin sample.
- Increases the need for clear ownership decisions between schema, runtime, and
  views.

### Option 2: Monolithic sample plugin with supporting infra plugins

This would keep `store` and `app` narrow, but place `product`, `cart`,
`checkout`, and `order` into one broad commerce plugin.

Benefits:

- Simpler to implement quickly.

Tradeoffs:

- Weak demonstration of decoupling.
- Does not test event and route composition meaningfully.
- Makes it harder to evaluate whether the StackPress skill family preserves
  correct boundaries.

This option is rejected.

### Option 3: Architecture-only sample with no meaningful end-to-end flow

This would focus on plugin boundaries while keeping the user experience mostly
stubbed.

Benefits:

- Smallest implementation surface.

Tradeoffs:

- Fails the requirement for a working end-to-end user flow.
- Makes it harder for developers to understand why the plugin split matters.
- Weakens the value of the sample as a realistic reference.

This option is also rejected.

## Plugin Responsibilities

The template should use separate plugin folders with explicit ownership.

### `plugins/store`

Purpose:

- database registration
- connection wiring
- persistence-oriented populate hooks
- storage-related shared setup

Boundary:

`store` should not absorb `product`, `cart`, `checkout`, or `order` logic just
because the template directory is named `store`.

### `plugins/app`

Purpose:

- app-wide error handling
- shared layouts
- common components used across multiple plugins
- utility helpers that do not belong to one feature
- neutral glue when a responsibility is app-wide rather than feature-specific

Boundary:

`app` should not become the default home for feature ownership. If logic
clearly belongs to `product`, `cart`, `checkout`, or `order`, it should live
there.

### `plugins/product`

Purpose:

- product model ownership
- product-oriented routes and handlers
- product listing or detail views
- product-related populate data

Boundary:

`product` should not own checkout or placed-order logic.

### `plugins/cart`

Purpose:

- cart lifecycle
- cart actions and updates
- guest or session cart resolution
- cart page behavior

Boundary:

`cart` should not own checkout orchestration or final order persistence.

### `plugins/checkout`

Purpose:

- checkout flow
- validation
- optional account creation during checkout
- transition from cart state into order creation

Boundary:

`checkout` coordinates the handoff, but it should not become the long-term
owner of order behavior after placement.

### `plugins/order`

Purpose:

- placed-order records
- order confirmation behavior
- order account views
- order-oriented admin views or extensions when needed

Boundary:

`order` should not backfill product browsing or cart lifecycle behavior.

## End-To-End Flow

The sample should expose a minimal but complete flow across decoupled plugins:

1. the home page introduces the sample and links into product browsing
2. the `product` plugin provides listing and detail behavior
3. the `cart` plugin accepts add-to-cart and cart-update actions
4. the `cart` plugin hands the user into the `checkout` flow
5. the `checkout` plugin validates input and optionally creates an account
6. the `checkout` plugin hands off order creation
7. the `order` plugin owns the placed-order state and confirmation readback

The UX can stay intentionally minimal. The important point is that the flow is
real, understandable, and composed from multiple plugins with narrow
responsibilities.

## Composition Rules

This template should explicitly demonstrate StackPress weaving rather than
hidden coupling.

Preferred composition signals:

- plugin registration order
- event-driven extension points
- route ownership per plugin
- route or event priorities where they clarify feature weaving
- shared app-level helpers only where the concern is truly cross-cutting

Avoid:

- large cross-plugin imports that expose internals unnecessarily
- central orchestration code that effectively recreates a monolith
- pushing schema gaps into runtime code when the issue belongs in `schema.idea`

## Schema And Runtime Lanes

The template should still use the normal StackPress split of responsibilities.

### `schema.idea`

`schema.idea` should define the model layer needed for the sample flow.

At minimum, it should support:

- product data
- cart-related data
- checkout-related customer fields if needed
- order and order-item style records
- relations and metadata needed for generated admin usefulness

The schema should be strong enough that generated output is meaningful and the
runtime plugins do not need to compensate for weak modeling decisions.

### Runtime And View Work

Handwritten plugin code should own:

- route handlers
- event wiring
- custom public pages
- flow coordination across plugins
- shared app surfaces that do not belong to one feature plugin

This sample should make it easy to see which parts are generated and which
parts are authored.

## Success Criteria

The architecture sample is successful when all of the following are true:

- `plugins/store` remains infrastructure-only.
- `plugins/app` remains shared app infrastructure.
- `product`, `cart`, `checkout`, and `order` exist as separate plugin folders.
- The sample exposes a working end-to-end flow across those plugins.
- The code demonstrates separation of responsibility clearly enough that a
  developer can explain why each plugin exists.
- The UX is minimal but understandable.
- The template shows StackPress weaving through plugins, events, routes, or
  priorities rather than through tight coupling.

## Experiment Criteria

This task is also a skill-evaluation experiment.

### StackPress Skill Family

Evaluate:

- whether `stackpress-app-coordinator` chooses the right phases and avoids
  pushing the work into the wrong app shape
- whether downstream StackPress skills preserve the plugin boundaries instead
  of collapsing them
- whether the family distinguishes correctly between schema work, plugin
  runtime work, view work, and verification
- where the StackPress skill family is helpful, incomplete, or misleading

### ChrisAI Skill Family

Evaluate:

- whether `chrisai-usage` routes follow-on work to the correct documentation,
  coding, or QA specialist
- whether the selected downstream ChrisAI skills add clarity and structure
  instead of noise
- whether the family is useful for documenting, reviewing, and verifying this
  kind of architecture-first sample
- where the ChrisAI skill family is helpful, incomplete, or misleading

### Evidence To Capture

The follow-up work should explicitly note:

- where a router selected the right next skill
- where a router selected the wrong next skill
- where the router was fine but the downstream specialist was weak
- what improvements would make these skill families safer or more useful for
  similar StackPress work

## Risks And Guardrails

Primary risks:

- the sample drifts back into a monolithic plugin design
- `store` becomes a misleading owner of feature code
- `app` becomes a dumping ground
- the skill experiment gets lost and the work is treated as only an app build

Guardrails:

- keep plugin ownership explicit
- keep `store` infra-only
- keep `app` shared-infra-only unless a concern is genuinely cross-cutting
- prefer feature plugins over convenience grouping
- keep the public flow minimal
- record skill-family outcomes as part of the task, not as an afterthought

## Implementation Signals

This design implies these follow-up workstreams:

1. strengthen `schema.idea` so generated admin and data structures support the
   sample flow
2. create or refine separate `product`, `cart`, `checkout`, and `order`
   plugins
3. keep `store` and `app` narrowly scoped to infrastructure concerns
4. wire the plugins into one working end-to-end flow
5. verify both the sample behavior and the skill-family experiment outcomes

These workstreams should be broken down into the implementation plan after this
updated spec is reviewed.
