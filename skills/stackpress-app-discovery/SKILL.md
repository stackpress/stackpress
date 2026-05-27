---
name: stackpress-app-discovery
description: Use when an agent needs to turn a plain-English product request into a concrete Stackpress app brief with audience, entities, flows, auth, admin, and custom behavior requirements before scaffold or schema work.
---

# Stackpress App Discovery

Turn a vague app idea into a concrete Stackpress app brief before scaffolding,
schema authoring, or plugin implementation.

This skill is for product clarification, not implementation. Its output should
be specific enough for the coordinator to start scaffold, schema, and routing
work without guessing.

## Overview

Clarify only what is needed to make the first safe Stackpress build decisions.

Discovery succeeds when the app brief is concrete enough to hand off cleanly to
scaffold, schema, and routing work.

## Use This Skill For

- interpreting requests like "make me a clothing store site for big people"
- clarifying what the app must do before creating files
- identifying the minimum product requirements needed for Stackpress modeling
- distinguishing core requirements from optional polish ideas

## Do Not Use This Skill For

- directly writing `schema.idea`
- choosing exact plugin hooks or generator transforms
- scaffolding project files
- polishing copy, branding, or visual design in depth

## Primary Rule

Ask only the questions needed to unlock the next real build step.

The goal is not a perfect product spec. The goal is a concrete, buildable app
brief with enough structure for:

- `stackpress-app-scaffold`
- `stackpress-idea-authoring`
- `stackpress-plugin-router`

## Discovery Gate

```text
NO SCAFFOLD OR SCHEMA WORK UNTIL THE APP BRIEF IS BUILDABLE
```

If critical product assumptions are still vague, keep discovering. Do not
paper over missing requirements with implementation guesses.

## Discovery Targets

By the end of discovery, capture these areas:

- app concept
- target audience
- core entities
- main user flows
- auth model
- admin needs
- custom runtime behavior
- custom pages or app surfaces
- initial scaffold values
- project shape classification

## Question Strategy

Prefer one question at a time when the app request is still loose.

Start broad, then narrow:

1. what kind of app is this
2. who uses it
3. what objects or records matter
4. what users need to do
5. what admins need to manage
6. what behavior goes beyond standard CRUD or generated output

Do not flood the user with a giant questionnaire unless they explicitly ask for
one.

## Required Discovery Areas

### 0. Project Shape

Classify what kind of Stackpress deliverable this is.

Examples:

- product-oriented app
- teaching sample
- architecture-composition sample
- production-oriented baseline

This affects how the later phases should prioritize schema clarity, plugin
boundaries, and runtime polish.

### 1. App Concept

Clarify the basic product shape.

Examples:

- store
- marketplace
- booking system
- membership portal
- content site with commerce

Make sure the concept is specific enough to imply likely models and routes.

Do not assume the folder or template name is the concept. Verify the concept
from the actual request and local project context.
Treat examples as illustrative patterns, not literal domains the app must fit.

### 2. Target Audience

Identify who the app is for.

This matters because it influences:

- copy and branding direction
- catalog structure
- auth expectations
- required filters or profile fields
- edge cases in product or content presentation

Examples:

- big-and-tall clothing customers
- internal staff only
- wholesale buyers
- general public with optional accounts

Treat examples as illustrative audience patterns, not a fixed Stackpress app
taxonomy.

### 3. Core Entities

Identify the nouns that probably become models.

Examples:

- products
- categories
- variants
- carts
- orders
- profiles
- addresses
- reviews

Do not write the schema here. Just identify the likely domain objects and their
purpose.
Treat examples as illustrative entity patterns, not literal required models.

### 4. Main User Flows

Identify the most important user actions.

Examples:

- browse catalog
- search and filter
- sign up and sign in
- add to cart
- checkout
- review past orders
- manage profile

If a flow is central to the app, it should be named explicitly here.
Treat examples as illustrative flow patterns, not a prescribed product map.

### 5. Auth Model

Clarify whether the app needs:

- guest browsing
- optional accounts
- required accounts
- role separation such as admin vs customer
- special signup or approval rules

This is needed early because Stackpress baseline behavior already includes auth
and session concepts that may need shaping later.

### 6. Admin Needs

Clarify what staff or admins must manage.

Examples:

- products and inventory
- orders
- customer accounts
- reviews or moderation
- content blocks
- promotions

This strongly affects which models need richer metadata in `schema.idea`.
Treat examples as illustrative admin-surface patterns, not required admin
modules.

### 6.5. Shared Infrastructure Versus Feature Concerns

Clarify what belongs to:

- shared app infrastructure
- storage or infra plugins
- feature ownership

This gives the router and scaffold skills a cleaner starting point later.

### 7. Custom Runtime Behavior

Identify behavior that likely needs runtime plugin work.

Examples:

- payment gateway integration
- email notifications
- webhook handling
- moderation workflows
- external inventory sync
- custom approval logic

These are routing signals for `stackpress-plugin-router`, not implementation
tasks yet.
Treat examples as illustrative runtime patterns, not default assumptions for
every Stackpress app.

### 8. Custom Pages or App Surfaces

Identify any important pages beyond generated defaults.

Examples:

- branded homepage
- listing or detail pages
- dashboard pages
- checkout or booking flow pages
- account dashboard
- informational utility pages

This helps the coordinator distinguish schema-only work from route/view work.
Treat examples as illustrative page-surface patterns, not a literal route
checklist.

### 9. Scaffold Values

Before discovery ends, collect or derive:

- app name
- package name
- brand name
- port

These are the required inputs for `stackpress-app-scaffold`.

## Good Discovery Output

The final discovery brief should be short, concrete, and structured around:

1. app summary
2. audience
3. core entities
4. main flows
5. auth and roles
6. admin responsibilities
7. custom behavior signals
8. custom page signals
9. scaffold values
10. project shape classification

This brief should read like a handoff artifact, not a brainstorming transcript.

## Escalation Rules

If the request is still too vague after initial clarification:

- ask the next highest-value question
- avoid moving into scaffold or schema work

If the request is very detailed already:

- summarize it into the discovery brief
- identify any remaining critical unknowns only

If the request spans too many independent products:

- decompose it into one primary app first
- keep discovery focused on the first build target

## When to Stop and Ask

Stop discovery closure and ask another question when:

- the likely core entities are still unclear
- the main user flows are still missing
- auth expectations are still ambiguous
- admin needs are still implicit
- the app name, package name, brand name, or port are still unresolved

Do not declare discovery complete if the next skill would still need to guess.

## Anti-Rationalization Checks

Before ending discovery, ask:

- do I know what the app fundamentally is?
- do I know who the main users are?
- do I know the likely models?
- do I know the critical flows?
- do I know whether auth is guest, optional, or required?
- do I know what custom behavior may require plugins?
- do I have the four scaffold values?

If not, discovery is not done.

## Handoff Rules

When handing off from discovery:

- send scaffold values to `stackpress-app-scaffold`
- send entity and flow requirements to `stackpress-idea-authoring`
- send custom behavior signals to `stackpress-plugin-router`

Make the handoff explicit.

Good examples:

- "Create the baseline app using app name X, package Y, brand Z, port 3000."
- "Draft `schema.idea` for products, categories, variants, carts, orders, and
  customer profiles."
- "Route payment, email, and custom checkout requirements to the correct plugin
  lane."

## Common Mistakes

- jumping into schema too early
- treating vague nouns as enough product definition
- skipping admin requirements
- forgetting auth assumptions
- collecting visual polish ideas before core flows are clear
- ending discovery without scaffold values
