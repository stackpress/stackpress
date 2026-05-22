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

This repository is a Yarn workspace monorepo with two main workspace groups:

 - `packages/*` for the Stackpress framework packages
 - `templates/*` for example application templates

The root `package.json` coordinates workspace-level build commands.

## Common Commands

Run commands from the repository root unless a task explicitly targets a single
workspace.

```bash
yarn install
yarn build
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

## Working Agreement

Keep changes scoped to the workspace you are touching and avoid unrelated
edits. If a change affects shared build behavior, verify it from the repository
root with Yarn so the workspace wiring remains intact.
