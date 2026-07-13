# Phase 8 Document Parity Results

## Method

The KB snapshot was frozen before benchmark inspection. The all-page structured
generation artifact and eight prose drafts were produced from Context Files and
their linked Reference Files only. Current `docs/` pages were then inspected for
topic structure, named exports/signatures, examples, and boundaries.

Result codes:

- **Pass**: the KB can produce equivalent or more current content;
- **Superset**: pass, with accepted source-derived detail beyond the benchmark;
- **Drift**: pass against current source, but the benchmark is incomplete/stale;
- **Conflict**: a source inconsistency is explicitly preserved rather than
  silently resolved.

An initial generated session example misused `Session.create()` despite the
correct signature in REF-013. The draft was corrected without changing the KB.
This was a generation-review defect, not a knowledge or routing gap.

## Aggregate And Support

| Benchmark | Topics | Contract | Example | Boundary | Result |
| --- | --- | --- | --- | --- | --- |
| `docs/README.md` | Pass | Pass | Pass | Pass | Superset: router covers additional focused surfaces |
| `docs/stackpress.md` | Pass | Pass | Pass | Pass | Superset: ownership and portability are explicit |
| `docs/lib.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/types.md` | Pass | Pass | Pass | Pass | Superset: generated/type collision limits included |
| `docs/plugin.md` | Pass | Pass | Pass | Pass | Superset: exact lifecycle order and exclusions included |
| `docs/cli-reference.md` | Pass | Pass | Pass | Pass | Drift: benchmark omits several current commands |
| `docs/config-reference.md` | Pass | Pass | Pass | Pass | Drift/Conflict: KB adds CSRF, MCP, desktop and preserves `terminal.idea`/`cli.idea` mismatch |
| `docs/unocss.md` | Pass | Pass | Pass | Pass | Superset: complete rule families and scan limits |

## Idea And Schema

| Benchmark | Topics | Contract | Example | Boundary | Result |
| --- | --- | --- | --- | --- | --- |
| `docs/idea-reference.md` | Pass | Pass | Pass | Pass | Superset: declaration grammar, composition, transforms, and inert metadata included |
| `docs/schema.md` | Pass | Pass | Pass | Pass | Superset: revision and generated interfaces included |
| `docs/schema/README.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/schema/Attribute.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/schema/Column.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/schema/Fieldset.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/schema/Model.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/schema/Schema.md` | Pass | Pass | Pass | Pass | Pass |

## Runtime And Server

| Benchmark | Topics | Contract | Example | Boundary | Result |
| --- | --- | --- | --- | --- | --- |
| `docs/runtime/README.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/runtime/Request.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/runtime/Response.md` | Pass | Pass | Pass | Pass | Superset: conversion, dispatch, sent/redirect behavior included |
| `docs/runtime/Router.md` | Pass | Pass | Pass | Pass | Superset: action facets, priority, stop, and mount included |
| `docs/runtime/Server.md` | Pass | Pass | Pass | Pass | Superset: bootstrap phase boundary included |
| `docs/server.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/server/README.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/server/Terminal.md` | Pass | Pass | Pass | Pass | Conflict: Idea key ambiguity is preserved with `-i` guidance |
| `docs/http.md` | Pass | Pass | Pass | Pass | Superset: normalization, dispatch, proxy/body/cookie risks included |
| `docs/whatwg.md` | Pass | Pass | Pass | Pass | Superset: body-limit and Node-gateway boundaries included |

## SQL And Adapters

| Benchmark | Topics | Contract | Example | Boundary | Result |
| --- | --- | --- | --- | --- | --- |
| `docs/sql.md` | Pass | Pass | Pass | Pass | Superset: generated stores/actions and helper ownership included |
| `docs/sql/README.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/sql/Engine.md` | Pass | Pass | Pass | Pass | Superset: hooks, transactions, diff limits included |
| `docs/sql/builders.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/sql/dialects.md` | Pass | Pass | Pass | Pass | Superset: behavioral parity warning included |
| `docs/sql/connections.md` | Pass | Pass | Pass | Pass | Superset: resource affinity and lazy connection included |
| `docs/mysql.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/pgsql.md` | Pass | Pass | Pass | Pass | Superset: placeholder validation, client affinity, `RETURNING` included |
| `docs/pglite.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/sqlite.md` | Pass | Pass | Pass | Pass | Drift: KB distinguishes current better-sqlite3 adapter from historical naming |

## Views, Sessions, And Language

| Benchmark | Topics | Contract | Example | Boundary | Result |
| --- | --- | --- | --- | --- | --- |
| `docs/view.md` | Pass | Pass | Pass | Pass | Superset: SSR/build lifecycle and snapshot security included |
| `docs/view/README.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/view/hooks.md` | Pass | Pass | Pass | Pass | Superset: wrapper-not-live-server boundary included |
| `docs/view/setViewProps.md` | Pass | Pass | Pass | Pass | Superset: exact copied defaults and exposure boundary included |
| `docs/view-client.md` | Pass | Pass | Pass | Pass | Drift: KB distinguishes aggregate admin additions from underlying client |
| `docs/session.md` | Pass | Pass | Pass | Pass | Superset: permission semantics and auth action inventory included |
| `docs/session/README.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/session/Session.md` | Pass | Pass | Pass | Pass | Superset: token source, Guest fallback, wildcard behavior included |
| `docs/language.md` | Pass | Pass | Pass | Pass | Superset: plugin request flow and browser owner included |
| `docs/language/README.md` | Pass | Pass | Pass | Pass | Pass |
| `docs/language/Language.md` | Pass | Pass | Pass | Pass | Superset: URL rewrite/persistence and phrase-key limits included |

## Gate Outcome

All 47 benchmark documents have a KB-only structured generation record and an
authoritative routed detail owner. Eight cross-domain prose drafts demonstrate
coherent generation at document level. Benchmark inspection found no missing KB
topic or orphaned routing owner. Recorded drift is intentionally resolved in
favor of current source evidence, and the Idea configuration-key conflict
remains explicit.

Document parity passes. Remaining work is to make this detailed-layer test part
of maintenance, update spec status, rerun deterministic validation, and Freeze.
