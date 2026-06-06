# AGENTS

Contributor notes for working in the Stackpress monorepo.

## Environment

Use the following toolchain for local development:

 - Node.js 22
 - Yarn

Install dependencies from the repository root:

```bash
yarn install
```

## Repository Layout

This repository is a Yarn workspace monorepo with two main workspace groups
and a small root-level CLI payload. Active workspace packages have their own
`package.json`; some package directories may contain only planning notes until
they are ready to become workspaces.

 - `packages/*` for the Stackpress framework packages
 - `templates/*` for example application templates
 - `bin/` for dependency-free root CLI scripts used by GitHub `npx`
 - `skills/` for portable Stackpress agent skills and embedded scaffold assets

The root `package.json` coordinates workspace-level build commands and exposes
the packable `stackpress` bin for commands such as
`npx github:stackpress/stackpress create`. Keep root CLI files dependency-free
because they run from npm/GitHub package cache before workspace dependencies are
installed.

Stackpress combines functionality from several sibling libraries maintained in
related repositories and published on NPM:

 - `@stackpress/lib` for primitives
 - `@stackpress/idea` for code generation
 - `@stackpress/ingest` for the server framework and plugin system
 - `@stackpress/inquire` for SQL query building
 - `reactus` for templating

Stackpress packages use Ingest's plugin system internally to preserve
separation of responsibility across framework features.

## Package Roles

Core packages:

 - `packages/stackpress-server` for terminal and server entrypoints
 - `packages/stackpress-schema` for idea shape/spec processing and converting idea files into column and schema classes
 - `packages/stackpress-sql` for SQL-related terminal events and generation of store and action classes from idea files
 - `packages/stackpress-view` for React/Frui view components, Reactus-backed view routing, and generated reusable components from idea files

Utility packages:

 - `packages/stackpress-csrf` for CSRF checks
 - `packages/stackpress-email` for generic email-send events
 - `packages/stackpress-language` for i18n translation methods
 - `packages/stackpress-ai` for Stackpress MCP server support, including tool registry assembly, transport entrypoints, and AI-facing Stackpress integration

Endpoint plugins:

 - `packages/stackpress-session` for auth, signup/signin/signout, and common user routes/views
 - `packages/stackpress-api` for OAuth and REST endpoints driven by configuration
 - `packages/stackpress-admin` for admin routes, views, and functionality generated from idea files

Entry package:

 - `packages/stackpress` aggregates Stackpress library imports and plugin entrypoints into one package

Application packages:

 - `packages/www` is the private Stackpress documentation and marketing website app, with route/view plugins for home, concepts, guides, API docs, and Stackpress-specific content

Planning-only package directories:

 - `packages/stackpress-desktop` currently contains plans for a future Electron-based desktop target package and is not an active workspace yet
 - `packages/stackpress-studio` currently contains plans for a future browser-based Stackpress schema/idea authoring GUI and is not an active workspace yet

Related libraries published on NPM that are often relevant when tracing functionality:

 - `frui` for general-purpose React components
 - `r22n` for React i18n

Notable third-party dependencies used across the repo include Vite, UnoCSS,
NodeMailer, Prettier, and ts-morph.

## Common Commands

Run commands from the repository root unless a task explicitly targets a single
workspace.

```bash
yarn install
yarn build
```

Common template workflow, especially for `templates/blog`:

```bash
yarn blog generate
yarn blog generate:client
yarn blog push
yarn blog populate
```

Common inspection and troubleshooting commands:

```bash
yarn dev
yarn purge
yarn emit [event-name] -v --b config/dev [other parameters]
yarn query
```

To work on a specific package or template, use the root shortcuts defined in
`package.json`:

```bash
yarn admin
yarn api
yarn server
yarn stackpress
yarn blog
yarn store
yarn website
```

Root CLI commands used through GitHub `npx`:

```bash
npx github:stackpress/stackpress create
npx github:stackpress/stackpress skills --target codex
npx github:stackpress/stackpress skills --target claude
npx github:stackpress/stackpress skills --target opencode
```

The root `bin/stackpress.mjs` script is intentionally dependency-free so it can
run from npm/GitHub package cache without installing the monorepo workspaces.
When changing this CLI, verify with:

```bash
yarn test:skills
npm pack --dry-run --cache /private/tmp/stackpress-npm-cache
```

## Templates

`templates/blog` is the primary end-to-end example and should be the default
reference when documenting or verifying Stackpress behavior.

Within templates, these directories are especially important:

 - `config` shows configuration-over-code patterns
 - `plugins` shows plugin system implementations
 - `public` holds static web assets
 - `.build` is generated build state such as database files, migrations, and idea revisions
 - `client_source` is generated TypeScript output from idea files used for troubleshooting

Generated directories such as `.build` and `client_source` are disposable and
can be deleted safely because they can be rebuilt.

## Skills

The repository `skills/` folder contains the Stackpress skill source files used
for documentation and skill maintenance work.

When editing skills:

 - treat each `skills/<skill-name>/SKILL.md` file as the primary source for that skill
 - preserve the distinction between skill instructions, `agents/` support files, `references/`, and `assets/`
 - prefer tightening guidance and examples over broad rewrites unless the skill scope is intentionally changing
 - keep examples illustrative rather than literal so they are not mistaken for required domains, plugin names, or file layouts
 - ignore an `archives/` folder entirely if it exists; do not use it as active context and do not mix archived material into current skill edits unless explicitly requested

For `skills/stackpress-app-scaffold/assets/template/`, keep `gitignore` as the
single scaffold source for the generated `.gitignore`. Do not add a second
`.gitignore` source file there; npm/GitHub package runners can omit nested
`.gitignore` files from packed installs.

## Working Agreement

Keep changes scoped to the workspace you are touching and avoid unrelated
edits. If a change affects shared build behavior, verify it from the repository
root with Yarn so the workspace wiring remains intact.
