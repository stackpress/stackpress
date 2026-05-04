# AGENTS.md

This file explains the structure of the Stackpress monorepo for contributors and coding agents.

## What this repository is

Stackpress is a workspace-based monorepo for an open source web application framework. The framework is server-first, event-driven, plugin-oriented, and supports code generation for both runtime JavaScript and client-facing TypeScript.

At a high level, Stackpress combines three important external concepts:

- `@stackpress/ingest`: the server/serverless runtime and plugin container
- `@stackpress/inquire`: the strongly typed SQL builder and dialect layer
- `@stackpress/idea`: the schema/code-generation model used to describe application structure

Those packages are dependencies, not workspaces in this repo. This repository builds Stackpress on top of them.

## Top-level layout

- `packages/`: framework packages and plugins that make up Stackpress itself
- `templates/`: example applications that show how the framework is wired together
- `README.md`: high-level project landing page, currently brief
- `package.json`: Yarn workspaces root and convenience scripts for each workspace

## Mental model

Think about the repo in layers:

1. `@stackpress/ingest` provides the runtime/container model.
2. `stackpress-server`, `stackpress-schema`, and `stackpress-sql` provide core framework behavior on top of that runtime.
3. `stackpress-view`, `stackpress-session`, `stackpress-api`, and `stackpress-admin` add app-facing features.
4. `stackpress` is the umbrella package that re-exports and bootstraps the common stack.
5. `templates/*` show how an actual app consumes the stack.

If you need the simplest entry point into the architecture, start with:

- `packages/stackpress/src/plugin.ts`
- `packages/stackpress/src/index.ts`
- `templates/blog/config/*.ts`

## Workspace structure

### `packages/stackpress`

This is the umbrella package. It re-exports types and modules from the lower-level workspaces and loads the standard plugin stack.

Important files:

- `src/plugin.ts`: composes the default Stackpress plugin chain
- `src/index.ts`: exports the public type surface
- `src/server`, `src/sql`, `src/schema`, `src/view`, `src/session`: grouped re-export entry points

When someone installs `stackpress`, this is the package they are usually consuming.

### Core packages

- `packages/stackpress-server`: CLI/runtime integration, develop/serve/emit flows, HTTP and WHATWG server adapters
- `packages/stackpress-schema`: schema model, transforms, revision tracking, and generation helpers
- `packages/stackpress-sql`: SQL integration built on `@stackpress/inquire`, plus install/migrate/push/populate/query flows

These are the packages to inspect when working on the framework’s execution model, schema transforms, or database lifecycle.

### Feature packages

- `packages/stackpress-view`: view/client integration and rendering support
- `packages/stackpress-session`: auth/session routing, permissions, and session-aware views
- `packages/stackpress-api`: OAuth, webhooks, and API endpoints
- `packages/stackpress-admin`: admin UI and admin-related transforms/helpers
- `packages/stackpress-language`: translation/localization support
- `packages/stackpress-email`: email integration
- `packages/stackpress-csrf`: CSRF protection
- `packages/stackpress-mcp`: MCP server integration built on Stackpress

These are pluggable additions to the core. Most expose a `plugin` entry and follow the same package layout.

## Common package layout

Most packages follow the same structure:

- `src/`: TypeScript source
- `cjs/`: CommonJS build output
- `esm/`: ESM build output
- `README.md`: package-level placeholder documentation
- `package.json`: exports, scripts, and dependencies

Some packages also contain:

- `tests/`: currently present in a few packages only
- `src/events/`: event handlers wired into the runtime
- `src/scripts/`: CLI script handlers
- `src/transform/`: code/schema transformation logic

In general, edit `src/` and treat `cjs/` and `esm/` as generated build artifacts.

## Templates

`templates/` contains example applications under different scenarios. At the moment, only `templates/blog` appears to be built out enough to treat as the main working example.

Current templates:

- `templates/blog`: the most complete example and the best place to learn the system
- `templates/store`: scaffold/example, less complete
- `templates/website`: scaffold/example, less complete

### Why `templates/blog` matters

The blog template demonstrates how Stackpress is intended to be used end to end:

- `schema.idea` defines the application model
- `config/common.ts` defines shared config for database, API, auth, client generation, and runtime behavior
- `config/develop.ts`, `config/build.ts`, `config/client.ts` define environment-specific bootstraps
- `plugins/` holds app-specific plugins
- `public/` holds static assets
- `client-source/` is where generated TypeScript client code can be written

If you are trying to understand "how Stackpress becomes an app", this template is the canonical example in the repo.

## Code generation

The repo supports two main generation paths in the template apps:

- `generate`: generates JavaScript client/runtime output into `node_modules`
- `generate:client`: generates TypeScript client code into a source folder

In `templates/blog` specifically:

- `yarn generate` runs `stackpress generate --b config/develop -v`
- `yarn generate:client` runs `stackpress generate --b config/client -v`

Expected outputs:

- JavaScript generation target: `templates/blog/node_modules/blog-client`
- TypeScript generation target: `templates/blog/client-source`

The client generation settings are visible in:

- `templates/blog/config/common.ts`
- `templates/blog/config/client.ts`

When debugging generation, inspect the config before assuming the generated output is wrong.

## Build and workspace commands

The root `package.json` is mainly an orchestrator:

- `yarn build`: builds the main workspace groups
- `yarn <name>`: jumps into a workspace, for example `yarn blog` or `yarn sql`

Examples:

- `yarn blog dev`
- `yarn blog generate`
- `yarn blog generate:client`
- `yarn sql build`
- `yarn stackpress build`

## How to navigate changes

Use this rule of thumb:

- Runtime/bootstrap problems: start in `packages/stackpress-server` and `packages/stackpress`
- Schema/model generation problems: start in `packages/stackpress-schema`
- SQL or migration problems: start in `packages/stackpress-sql`
- Rendering/client integration problems: start in `packages/stackpress-view`
- Auth/session/admin/API behavior: start in the corresponding feature package
- "How should this framework be used?": start in `templates/blog`

## Current project state

This repository is still incomplete in a few important areas:

- tests are uneven across packages
- examples outside `templates/blog` are not fully built out
- some plugins under `packages/` still need to be finished
- documentation is thinner than the implementation

Contributors should expect to read source code and template config directly instead of relying on polished docs everywhere.

## Suggested reading order for new contributors

1. `README.md`
2. `packages/stackpress/src/plugin.ts`
3. `packages/stackpress/src/index.ts`
4. `templates/blog/package.json`
5. `templates/blog/config/common.ts`
6. `templates/blog/config/client.ts`
7. `templates/blog/schema.idea`

That sequence gives the fastest path from monorepo overview to real application usage.
