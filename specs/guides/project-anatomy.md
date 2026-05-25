# Project Anatomy

This guide maps the main folders in a normal Stackpress app. It explains which files are source of truth and which files are generated.

## Start Here

After the quick start, your app should have a small but intentional folder layout. You do not need to understand every package to work safely. You only need to know which folders you edit and which folders Stackpress can rebuild for you.

## Quick Start

Focus on these paths first:

 - `schema.idea`
 - `config`
 - `plugins`
 - `public`
 - `.build`
 - `client_source`

## What Just Happened

These folders fall into two groups:

 - source-of-truth folders you edit on purpose
 - generated folders Stackpress can rebuild

That distinction matters because the generated folders are safe to delete when you need a clean regeneration pass.

## Core Concepts

### `config`

This is where the app chooses its runtime, generation, and client output behavior. In a small app you may start with one `config.ts`. In a larger app you may split that into files such as `common.ts`, `develop.ts`, `build.ts`, and `client.ts`.

### `plugins`

This is where the app adds local behavior around the aggregate `stackpress` plugin. A common starting point is one app plugin for routes and views and one store plugin for database registration or store-related behavior.

### `public`

This holds static assets served by the app.

### `.build`

This is generated working output. It stores revisions, migrations, and other build-related files. It is disposable.

### `client_source`

This is readable generated TypeScript from `generate:client`. It is also disposable and mainly exists for inspection and troubleshooting.

## Common Tasks

Edit these first when making changes:

 - data or field behavior: `schema.idea`
 - runtime settings: `config/*.ts`
 - app-specific behavior: `plugins/*`
 - static assets: `public/*`

Inspect these when debugging:

 - `.build/*`
 - `client_source/*`

## Next Steps

Read [Generate And Build](./generate-and-build.md) for the command-to-output mapping. Once you are comfortable with the generic shape, you can evolve the same folder model into a larger production app.
