# Debugging And Inspection

This guide collects the most useful commands and inspection habits for a Stackpress app during local development.

## Start Here

Use this page when the app, generated output, or local database does not look the way you expect.

## Quick Start

The main inspection commands are:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress emit article-search --b config -v
stackpress query --b config -v
stackpress purge --b config -v
```

## What Just Happened

Each command answers a different debugging question:

 - `generate` asks whether the source inputs produced the expected generated output
 - `generate:client` asks whether the client-facing output is correct
 - `emit` asks whether an event or terminal entrypoint behaves correctly
 - `query` asks what is actually in the database
 - `purge` resets local data when you need a clean dataset

## Core Concepts

When debugging Stackpress, separate the problem by layer:

 - source-of-truth problem: `schema.idea`, config, or local plugins
 - generation problem: `.build` or `client-source`
 - runtime problem: route, event, or plugin behavior
 - data problem: local database contents

## Common Tasks

If a schema change did not show up:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress push --b config -v
```

If an event or route behaves strangely:

```bash
stackpress emit <event-name> --b config -v
```

If you need to inspect raw data:

```bash
stackpress query --b config -v
```

If the local dataset is in a bad state:

```bash
stackpress purge --b config -v
stackpress push --b config -v
stackpress populate --b config -v
```

## Next Steps

Use [CLI Reference](../api/cli-reference.md) for the exact command surface and [Generated Artifacts](../concepts/generated-artifacts.md) for the generated-output mental model.
