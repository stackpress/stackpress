---
name: stackpress-plugin-pages-events
description: Use when an agent needs to implement or revise Stackpress handler modules under `plugins/*/pages` or `plugins/*/events`, especially when working with action signatures, request/session access, `ctx.resolve`, `ctx.emit`, response shaping, redirects, guards, or handler reuse between route flow and event flow.
---

# Stackpress Plugin Pages Events

Implement Stackpress page and event handlers using the normal handler contract
instead of improvising request-time logic.

## Overview

Treat `pages/` and `events/` handlers as the same family of server actions with
different entry paths.

- `pages/` handlers are typically reached through routes
- `events/` handlers are typically reached through emits, resolves, listeners,
  or other server-side orchestration

The handler contract should stay consistent so page flow can delegate to events
cleanly and events can stay reusable outside page flow.

## Use This Skill For

- creating or editing `plugins/*/pages/*.ts`
- creating or editing `plugins/*/events/*.ts`
- normalizing action signatures
- shaping `req`, `res`, and `ctx` usage
- deciding when a page handler should call an event handler
- deciding when an event handler should remain reusable outside routes
- fixing redirects, status handling, or missing guards
- tightening `ctx.resolve(...)` and `ctx.emit(...)` usage

## Do Not Use This Skill For

- deciding whether the feature belongs in schema, runtime, generation, or
  route/view work in the first place
- scaffolding the plugin folder from scratch
- implementing TSX page views
- designing generated admin metadata in `schema.idea`

Use `stackpress-plugin-router` for lane selection,
`stackpress-plugin-scaffold` for plugin shape, and
`stackpress-plugin-views` for handwritten TSX page views.

## Core Workflow

1. Confirm whether the target is a `pages/` handler, an `events/` handler, or
   a reusable flow split across both.
2. Confirm the handler is using the normal Stackpress action contract.
3. Check request, session, and response usage against local repo patterns.
4. Keep domain work in events when reuse is valuable.
5. Keep page handlers thin when they mainly shape route-time behavior.
6. Add guards, status handling, and redirects intentionally.
7. Verify the handler through the smallest convincing compile and runtime
   checks.

## Handler Contract

The normal handler pattern is:

```ts
import { action } from 'stackpress/server';

export default action(async function Example({ req, res, ctx }) {
  // handler logic
});
```

Prefer `stackpress` imports over `@stackpress` imports when the project
supports both.

If a local package already has a stronger canonical import pattern, preserve it
consistently instead of mixing action wrappers casually.

Treat examples in this skill as illustrative handler patterns, not literal
import paths that override stronger local conventions.

## Shared Responsibilities

Both page and event handlers should handle these concerns intentionally:

- action signature shape
- `req.data(...)` or related request access
- session access
- `ctx.resolve(...)` and `ctx.emit(...)`
- `res.results(...)`
- `res.data.set(...)`
- response codes
- redirects
- early returns and missing-data guards

## Page Handler Guidance

Page handlers usually own:

- route-time parameter extraction
- route-specific redirects
- HTML-page response shaping
- `setViewProps(req, res, ctx)` when a view will render

Page handlers should stay thin when the main business logic is reusable.

## Event Handler Guidance

Event handlers usually own:

- reusable business logic
- model operations
- listener-driven side effects
- orchestration that may be reached from routes, other events, or listeners

Prefer events when the same logic should be reusable outside a single route.

## Reuse Boundary

Move logic into an event when:

- more than one route needs it
- listeners or other events may need it
- the operation is domain behavior, not page behavior

Keep logic in a page handler when:

- it only shapes route-time behavior
- it mainly prepares view or redirect flow
- reuse would add indirection without benefit

## Request And Session Rules

Do not guess request or session shapes.

- inspect local repo patterns first
- prefer existing request access helpers over ad hoc property assumptions
- prefer existing session access helpers over object-shape guesses

If the local request or session contract is unusual, follow the local pattern
instead of generic web-framework instincts.

## `ctx.resolve(...)` And `ctx.emit(...)`

Use `ctx.resolve(...)` when the handler needs a result payload back.

Use `ctx.emit(...)` when the handler is driving side effects or another action
without needing a typed return payload.

Do not hide missing guards behind non-null assertions if the resolved result can
legitimately be absent.

## Response Shaping

Use `res.results(...)` for the primary handler payload.

Use `res.data.set(...)` for view-facing props or auxiliary response data.

Do not mix those roles casually.

Guard before calling `res.results(...)` when the upstream result may be empty or
undefined.

## Redirect And Status Rules

When redirecting:

- make the redirect target explicit
- return immediately after redirect

When setting status:

- use a real guard condition
- fail early on missing or invalid upstream results

## Verification

Prefer the smallest convincing checks:

- direct TypeScript compile when handler code changed
- route reachability for `pages/`
- event resolution or minimal runtime proof for `events/`
- confirmation that guards and redirects behave as intended

## Common Mistakes

- using the wrong action import or wrapper for the local Stackpress contract
- assuming session fields that are not actually present
- leaving reusable domain logic trapped inside one page handler
- moving route-specific behavior into events where reuse is not needed
- calling `res.results(...)` with possibly undefined data
- using `ctx.resolve(...)` without checking whether a result actually exists
