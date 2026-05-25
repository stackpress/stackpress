# Generate And Build

This guide explains what Stackpress writes during a normal app workflow and which command to rerun after each kind of change.

## Start Here

Use this page when you changed a schema, config, or plugin file and want to know which command rebuilds the right output.

## Quick Start

The main commands are:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress push --b config -v
stackpress populate --b config -v
```

## What Just Happened

### `stackpress generate --b config -v`

Runs the main app generation pass through the chosen bootstrap module.

### `stackpress generate --b config/client -v`

Runs the client-oriented generation pass and can write readable TypeScript into a folder such as `client-source`.

### `stackpress push --b config -v`

Creates or updates the local database structure from the generated schema state.

### `stackpress populate --b config -v`

Inserts starter content into the local database.

## Core Concepts

The source of truth stays in:

 - `schema.idea`
 - `config/*.ts`
 - `plugins/*`

The commands above produce artifacts in:

 - package build output
 - generated app output
 - `.build`
 - `client_source`
 - the local PGlite database

## Common Tasks

If you changed a field, model, or relation:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress push --b config -v
```

If you changed only client-facing generation or want to inspect generated client code:

```bash
stackpress generate --b config/client -v
```

If you want a fresh local dataset:

```bash
stackpress purge --b config -v
stackpress push --b config -v
stackpress populate --b config -v
```

## Next Steps

Read [Using The Client](./using-the-client.md) for the generated client workflow. For the underlying model behind schema-driven generation, read [Schema And Generation](../concepts/schema-and-generation.md).
