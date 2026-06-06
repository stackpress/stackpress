# 000 Orientation

Use this course to explain Stackpress without exposing the progressive
documentation mechanics too directly. The reader should leave this section
knowing what Stackpress is, where to begin, and how to find reference material
when they need exact details.

## 000 Start Here

Stackpress is an application framework for building server-rendered,
schema-aware apps with plugins, generated code, data access, and React views.

Start by building one route, rendering one page, and understanding where app
code belongs. The deeper layers become useful after that first loop works.

**Quick start**

1. Build or inspect the smallest route.
2. Render a simple page.
3. Add one plugin-owned behavior.
4. Use the reference only when you need exact APIs.

**Checkpoint**

You can explain the difference between the learning path and the reference
area.

## 001 What Stackpress Is

Stackpress combines several responsibilities into one app-facing workflow:

- runtime routes, plugins, and events
- database access and generated stores
- schema-first modeling through `schema.idea`
- React-rendered views
- generated client and admin-facing output

You do not need to learn `ingest`, `inquire`, `idea`, `reactus`, or `lib` as
separate products before building with Stackpress. Those libraries explain the
implementation layers. The website should explain the Stackpress workflow.

**Core idea**

Stackpress separates three things:

- source input: schema, config, and handwritten plugins
- generated output: rebuildable code and working files
- runtime behavior: routes, events, views, data, and sessions

**Checkpoint**

You can describe Stackpress as a framework that turns app intent into runtime
behavior and generated artifacts.

## 002 Full Reference

The reference area is always available. Use it when you already know what you
are looking for.

Reference pages should contain:

- exact imports
- config fields
- CLI flags
- method signatures
- component props
- attribute lists
- dialect details
- generated output inventories

Course pages should not duplicate those lookup details. They should explain
what to do, why it matters, and where to go next.

**Checkpoint**

You know when to stay in the course and when to jump to reference.

## Related Reference

- Package root reference
- Config reference
- CLI reference
- API reference index

