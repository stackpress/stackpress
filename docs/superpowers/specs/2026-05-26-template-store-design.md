# Template Store Design

## Summary

This spec defines the first complete design for `templates/store` as a StackPress sample application.

The goal is to make `templates/store` a commerce-oriented example in the same spirit as `templates/blog`: a developer should be able to inspect the schema, generated admin behavior, custom plugin pages, and seeded content to understand how a real StackPress app is assembled.

The sample is intentionally instructional rather than production-grade. It should demonstrate a coherent storefront flow from catalog browsing through demo checkout and order placement, while keeping the domain model lean enough to stay approachable.

## Goals

- Provide a full sample storefront flow for StackPress.
- Demonstrate how `schema.idea` drives generated data and admin behavior.
- Demonstrate how custom plugin pages shape the public-facing storefront.
- Demonstrate lightweight runtime logic for guest carts, checkout, and order creation.
- Mirror the educational role that `templates/blog` already plays in the monorepo.
- Let a developer generate, populate, run, and explore the sample locally with minimal setup.

## Non-Goals

- Real payment integration.
- Production-grade tax, shipping, discount, or promotion systems.
- Product variants such as size or color.
- Inventory tracking or stock reservation logic.
- Marketplace or multi-vendor behavior.
- Advanced fulfillment, fraud, notification, or ERP-style workflows.

## Current State

`templates/store` already exists as a workspace, but it is still a thin baseline compared with `templates/blog`.

Observed differences:

- `templates/store/schema.idea` currently only imports `stackpress/stackpress.idea`.
- `templates/store` has app and store plugin folders, but not a complete commerce-oriented data model.
- `templates/blog` is the stronger end-to-end reference today because it contains a richer `schema.idea`, custom public pages, and a more complete generated-flow example.

This design turns `templates/store` into a parallel reference sample focused on commerce instead of editorial content.

## Recommended Approach

Build `templates/store` as a full sample storefront with generated admin and a thin custom public layer.

This approach keeps the example realistic without expanding it into a production commerce platform. The schema should cover products, carts, checkout, orders, and basic profile-linked customer data. The public app should provide a branded storefront experience with authored pages. Admin behavior should stay generated wherever StackPress already provides a strong default.

This is the recommended approach because it best matches the role of `templates/blog`: it shows the intended StackPress split between generated structure and authored experience without introducing unnecessary commerce complexity.

## Alternatives Considered

### Option 1: Full sample storefront with generated admin and thin custom public pages

This is the selected approach.

Benefits:

- Closest equivalent to the role `templates/blog` already serves.
- Demonstrates StackPress end-to-end using realistic but manageable commerce flows.
- Keeps most complexity in data modeling and page composition rather than niche commerce concerns.

Tradeoffs:

- Requires more schema and route work than a minimal catalog sample.
- Needs a small amount of runtime logic for cart and checkout orchestration.

### Option 2: Heavier commerce sample

This version would include taxes, discounts, shipping rules, richer order states, and broader post-order workflows.

Benefits:

- Shows more commerce breadth.

Tradeoffs:

- Distracts from StackPress fundamentals.
- Makes the example harder to learn from and maintain.
- Increases the number of domain decisions that are unrelated to the framework itself.

This option is rejected for the first sample.

### Option 3: Minimal catalog and cart sample without real orders

This version would stop before a persisted checkout or order lifecycle.

Benefits:

- Smaller surface area.

Tradeoffs:

- Feels incomplete next to `templates/blog`.
- Fails to demonstrate a full business workflow.
- Misses the value of showing how guest flow, account creation, and generated admin fit together.

This option is also rejected.

## App Summary

`templates/store` should become the canonical commerce sample for StackPress.

The sample should let a user:

- browse a custom storefront homepage
- view product detail pages
- add products to a cart
- update cart quantities
- proceed through demo checkout
- optionally create an account during checkout
- place a demo order
- review order history later when signed in

The sample should let an admin:

- manage products through generated admin tooling
- inspect orders through generated admin tooling
- review customer profile data that supports the commerce example

## Audience

The primary audience is developers learning how to build a StackPress application from a working sample.

Secondary audiences include:

- maintainers validating framework behavior against a realistic template
- developers comparing StackPress patterns across content and commerce use cases

Because the audience is instructional, clarity and coverage matter more than production-grade feature depth.

## Core Entities

The first sample should model a small, understandable commerce system with these primary entities:

- `Product`
  Purpose: a simple purchasable catalog item with public merchandising fields.
- `Cart`
  Purpose: an active shopping cart associated with either a guest session or a signed-in profile.
- `CartItem`
  Purpose: a line item inside a cart that stores product reference, quantity, and a unit price snapshot.
- `Order`
  Purpose: a placed checkout record containing customer identity snapshot, totals, demo payment state, and fulfillment state.
- `OrderItem`
  Purpose: a line item inside a placed order with product snapshot, quantity, and pricing snapshot.
- `Profile` extension fields
  Purpose: customer information needed for account-linked order history and checkout prefill.

The first sample should keep products intentionally simple:

- no variants
- no inventory counts
- no bundled pricing rules

## Main User Flows

The sample should support these public flows:

1. browse the storefront homepage
2. open a product detail page
3. add a product to cart with quantity
4. review and update cart contents
5. start checkout as a guest
6. enter contact and shipping details
7. optionally create an account during checkout
8. complete a demo payment step
9. place the order
10. view order confirmation
11. later sign in to review past orders if an account exists

The first sample should optimize for a complete, understandable path rather than covering every possible edge case.

## Auth And Roles

The auth model should support guest browsing and guest cart usage by default.

Checkout should not require sign-in before the user starts the flow. During checkout, the user may optionally create an account. If they do, the placed order should be associated with that account profile so the order appears in later account history.

Roles should remain simple:

- guest shopper
- signed-in customer
- admin

No staff approval, wholesale role, or multi-role commerce workflow is needed for the sample.

## Admin Responsibilities

The generated admin surface should support the minimum management tasks needed to demonstrate StackPress:

- create, edit, activate, and deactivate products
- search and review orders
- inspect customer-related profile information
- inspect order lifecycle status values used by the sample

The admin area should remain mostly generated. The sample should avoid building custom admin workflows unless the framework requires a small targeted extension.

## StackPress Lanes

The design should make the framework boundaries explicit.

### `schema.idea`

`schema.idea` should carry most of the sample definition:

- product, cart, cart item, order, and order item models
- customer-oriented profile fields needed by checkout and account history
- labels, display templates, searchability, filters, relations, and admin-friendly field metadata
- status enums for order lifecycle and demo payment state

### Custom Public Pages

Custom plugin pages should provide the authored storefront experience:

- homepage
- product detail page
- cart page
- checkout page
- order confirmation page
- account order history page if the default generated account surface is insufficient

This mirrors how `templates/blog` authors public editorial pages on top of generated structures.

### Runtime Logic

Custom runtime behavior should remain narrow and purpose-driven:

- resolve a guest or signed-in cart
- add or update cart items
- convert a cart into an order and order items
- optionally create an account during checkout
- flag and record demo payment completion
- populate the sample with seeded products

The sample should not introduce broad custom commerce engines or unnecessary abstractions.

## Public Experience

The public-facing app should feel intentionally authored rather than like unstyled scaffolding.

Minimum public surfaces:

- a custom storefront homepage
- product detail pages
- cart page
- checkout form flow
- order confirmation page

The visual layer does not need to be heavily branded, but it should clearly show how StackPress supports custom public experiences on top of generated data and admin behavior.

## Seed Data And Local Workflow

The sample should include enough seeded content to be useful immediately after setup.

Populate behavior should provide:

- multiple sample products
- merchandising-ready content for homepage and detail pages
- enough variety to make cart and checkout testing meaningful

The local workflow should remain straightforward for developers:

- generate
- migrate or push
- populate
- run the app
- click through a demo purchase flow

## Success Criteria

The sample is successful when all of the following are true:

- `templates/store` is understandable as a first-class StackPress sample alongside `templates/blog`.
- A developer can run the store locally and complete an end-to-end demo purchase flow.
- The template clearly demonstrates the division between generated schema/admin behavior and custom public/plugin code.
- Seeded content makes the sample useful immediately after setup.
- The sample stays intentionally simple enough to teach StackPress rather than advanced commerce implementation details.

## Risks And Guardrails

Primary risk:

- the sample grows into a pseudo-production commerce app and stops being a clear educational reference

Guardrails:

- keep payment demo-only
- keep products simple
- keep admin mostly generated
- avoid adding discounts, taxes, shipping engines, or variant logic in the first sample
- favor clarity of framework usage over breadth of commerce features

## Implementation Signals

This design implies three main follow-up workstreams:

1. extend `templates/store/schema.idea` into a complete commerce sample model
2. add or refine plugin pages and runtime actions for storefront, cart, checkout, and confirmation flows
3. verify the template’s local developer workflow, seeded content, and end-to-end demo usability

Those workstreams should be broken down into a formal implementation plan after this spec is reviewed.
