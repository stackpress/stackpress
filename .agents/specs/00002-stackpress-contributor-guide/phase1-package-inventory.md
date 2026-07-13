# Phase 1 Package Inventory

## Purpose

Record the current workspace and source shapes before interpreting repetition as
contributor rules. This is checkout evidence, not the final package anatomy or
code-placement guide.

Accessed: 2026-07-12.

## Sources Checked

- root `package.json` workspaces, scripts, and package shortcuts;
- `yarn workspaces info --json`;
- every `packages/*/package.json`;
- every present `packages/*/src/` top-level entry;
- package `src/plugin.ts` entrypoints;
- `packages/stackpress/src/plugin.ts`, `src/index.ts`, and manifest;
- package test-directory presence;
- root `AGENTS.md` package-role statements.

## Classification Model

The source requires separate answers to four questions:

1. **Workspace:** does Yarn resolve a package manifest under `packages/*`?
2. **Default build:** does root `yarn build` invoke its package build?
3. **Default aggregate:** does `packages/stackpress/src/plugin.ts` register its
   plugin in the default framework composition?
4. **Optional consumer:** does a template or explicit command use it outside the
   default aggregate/build path?

Directory presence, a manifest, an aggregate dependency, and plugin activation
are not interchangeable evidence.

## Current Package Participation

| Package | Yarn workspace | Root default build | Aggregate plugin | Current distinguishing evidence |
| --- | --- | --- | --- | --- |
| `stackpress-server` | Yes | Yes | Yes | CLI/server entrypoints; events and scripts. |
| `stackpress-schema` | Yes | Yes | Yes | Schema object model, client loader, generator. |
| `stackpress-sql` | Yes | Yes | Yes | Data lifecycle, adapters, events/scripts, generator. |
| `stackpress-csrf` | Yes | Yes | Yes | Small config-phase service plugin. |
| `stackpress-language` | Yes | Yes | Yes | Config/listen translation service. |
| `stackpress-email` | Yes | Yes | Indirect | Loaded by session; direct aggregate dependency but no aggregate plugin call. |
| `stackpress-ai` | Yes | Yes | No | Optional MCP surface; blog template dependency; generator. |
| `stackpress-view` | Yes | Yes | Yes | Reactus config/events/client code and generator. |
| `stackpress-session` | Yes | Yes | Yes | Nested auth/profile/session package structure. |
| `stackpress-admin` | Yes | Yes | Yes | Generated admin client and route registration. |
| `stackpress-api` | Yes | Yes | Yes | API pages/views and listen/route behavior. |
| `stackpress` | Yes | Yes | It is the aggregate | Public facade, aggregate plugin, package CLI, assets and tsconfig exports. |
| `stackpress-desktop` | Yes | No; separate `build:desktop` | No | Source, tests, plugin, build scripts, Electron runtime; blog dependency. |

`packages/stackpress-studio` has no package manifest and is not a Yarn workspace.
No `packages/www` directory exists in the current tree.

## Root Build And Test Boundaries

The default root build explicitly groups 12 workspaces:

- core: server, schema, SQL;
- utilities: CSRF, language, email, AI;
- view stack: view, session, admin;
- main: API and aggregate Stackpress.

Desktop is intentionally reachable through `build:desktop` but omitted from the
default build chain. Root `yarn test` is narrower still: it runs server, schema,
and SQL package tests. Package test scripts exist beyond that root test surface.

This proves that "active workspace," "built by default," and "tested by the root
default" must remain separate contributor concepts.

## Aggregate Package Evidence

`packages/stackpress` is currently all of the following:

- a publishable Yarn workspace named `stackpress`;
- a package-level `stackpress` binary distinct from the dependency-free root
  bootstrap CLI payload;
- a public facade with root and subpath exports for foundation and Stackpress
  package surfaces;
- an aggregate plugin that calls server, schema, language, CSRF, SQL, view,
  session, API, and admin plugins in explicit order;
- a package carrying shared styles, tsconfig files, an Idea file, and public
  type/value forwarding code.

Its manifest directly depends on admin, API, and email; the remaining default
packages arrive through transitive workspace dependencies. Direct dependency
shape alone therefore does not enumerate the aggregate plugin composition.

AI and desktop are current optional packages and are not registered by the
aggregate plugin. Email is the inverse special case: it is directly depended on
by the aggregate but initialized from the session plugin.

## Source-Shape Inventory

All 13 workspaces currently expose `src/index.ts`, `src/plugin.ts`, and
`src/types.ts`, except that this statement still needs entrypoint-content review
before becoming a rule. All publish CJS and ESM build trees and declare a CJS
plugin path for plugin discovery.

Observed recurring source shapes:

- `events/` and `scripts/`: AI, desktop, schema, server, SQL, and view, with
  package-specific exceptions such as email's single `events.ts`;
- `transform/`: admin, AI, schema, SQL, and view;
- pages/views: API plus nested session auth/session structures;
- `client/`: admin and view;
- `config/`: schema and view, with desktop using a root `config.ts`;
- `Exception.ts` and `helpers.ts`: several but not all packages;
- adapter or interface folders/files: SQL, schema, server, desktop, and view;
- package-local `schema.idea`: API, session, and aggregate package manifests
  publish Idea files, subject to exact-path verification in Phase 2.

These are inventory observations only. Phase 2 must determine whether each
shape is required, conventional, package-specific, legacy, or inconsistent.

## Current Conflicts And Cautions

- Root `AGENTS.md` describes desktop as planning-only, but current source makes
  it a Yarn workspace with implementation, tests, build scripts, plugin exports,
  and a blog-template consumer. Maintainer intent is required before changing
  contributor guidance.
- Root `AGENTS.md` describes `packages/www` as an application package, but that
  directory is absent from the current tree. The website application currently
  appears under `templates/website`.
- Package directory or manifest presence must not be used alone to infer default
  framework inclusion.
- CJS/ESM trees are build outputs and useful contract evidence, but `src/`
  remains the implementation inventory for contributor placement research.

## Phase 2 Handoff

Group packages into comparable anatomy classes, then inspect the content and
exports of their entrypoints and recurring folders. Build a pattern matrix that
labels each observation as required contract, strong convention,
package-specific specialization, unresolved divergence, or stale documentation.
