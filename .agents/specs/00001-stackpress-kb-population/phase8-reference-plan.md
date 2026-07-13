# Phase 8 Reference Architecture

## Purpose

Add a detailed knowledge layer behind the eight canonical Context Files. Context
continues to own accepted mental models and routing. Flat numbered Reference
Files preserve the catalogs, signatures, examples, and provenance needed for
document-level production.

## Reference Files

| File | Contents | Inbound context owners |
| --- | --- | --- |
| `00004-runtime-api-contracts.md` | Request, Response, Router, Server, Route | architecture, interfaces |
| `00005-server-and-transport-contracts.md` | terminal, server factories, loaders, handlers, HTTP/WHATWG helpers | architecture, runtime, ecosystem |
| `00006-schema-api-contracts.md` | Schema, Model, Fieldset, Column, Attribute, dictionaries, helpers | modeling |
| `00007-idea-language-catalog.md` | types, schema/column attributes, assertions, field/view components, aliases | modeling |
| `00008-configuration-catalog.md` | top-level areas, nested keys, defaults, effects, examples | runtime, interfaces |
| `00009-cli-and-plugin-contracts.md` | commands, flags, event mapping, aggregate and package lifecycle | runtime, contribution |
| `00010-sql-api-contracts.md` | Engine, builders, dialects, conversion/store helpers, interfaces | runtime, ecosystem |
| `00011-database-adapter-contracts.md` | MySQL, PostgreSQL, PGlite, SQLite connectors and connect helpers | ecosystem, runtime |
| `00012-view-api-contracts.md` | templates, SSR adapter, providers, layouts, hooks, notifications, setViewProps | interfaces, modeling |
| `00013-session-language-contracts.md` | session/auth matching and language/translation APIs | interfaces |
| `00014-exports-types-generated-contracts.md` | aggregate exports, type families, UnoCSS, generated package shape | ecosystem, compatibility |
| `00015-operational-examples.md` | generation, bootstrap, data, custom page, API/MCP, adapter recipes | contribution and relevant domains |
| `00016-idea-component-catalog.md` | field/view component registries, aliases, derived filter/list/span families | modeling |
| `00017-interface-exposure-examples.md` | handwritten page/view, API, MCP, and cross-surface recipes | interfaces, contribution |

## Required Record Shape

Each API or configuration record should include, when applicable:

1. canonical name and owner;
2. purpose and when to use;
3. import path and export mode;
4. signature or data shape;
5. properties, methods, defaults, and return behavior;
6. lifecycle or generated consumer;
7. error, security, destructive, or portability boundaries;
8. concise example;
9. source and test anchors;
10. version/authority label.

## Authority Labels

- `checkout`: exact behavior from this monorepo and installed dependencies;
- `design-intent`: complete sibling repository behavior not yet consumed here;
- `generated`: behavior observed in current generated output;
- `demonstrated`: behavior shown by a maintained example;
- `public-framing`: accepted wording rather than technical implementation;
- `deferred`: known absence or future governance, not current capability.

## Context Link Rules

- Every Reference File must have at least one task-informative inbound Context
  Link.
- Context should summarize essential truth before linking details.
- A link must say when to load the reference, not merely "see reference."
- The context router should continue routing to Context Files, not directly to
  all references.
- Long source inventories remain spec-local; references contain only useful
  provenance for maintaining accepted contracts.

## Population Order

1. Runtime/server/schema contracts: REF-004 through REF-006.
2. Idea/config/CLI catalogs: REF-007 through REF-009.
3. SQL/database/view/session contracts: REF-010 through REF-013.
4. Aggregate types/generated shape and recipes: REF-014 through REF-015.
5. Add inbound Context Links after each reference is populated.
6. Validate no zombie references and all Agent File line caps.

## Document-Parity Test

For each benchmark document:

1. isolate `.agents/context/` and linked references as the only knowledge input;
2. generate an equivalent document draft or full structured content record;
3. compare afterward with `docs/` for topic, API, signature, example, boundary,
   and related-link coverage;
4. classify missing knowledge as reference gap, context-routing gap, stale docs,
   or source conflict;
5. repair the KB from source evidence and rerun.

The test fails when generation requires reading source or `docs/` to recover a
contract that should already be in the KB.
