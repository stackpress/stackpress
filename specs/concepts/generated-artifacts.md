# Generated Artifacts

This page explains which parts of a Stackpress app are generated, where they live, and which ones are safe to delete and rebuild.

## Start Here

Generated output is central to Stackpress. That makes it important to know which files are disposable and which files are the real source of truth.

## Quick Start

The most important generated areas in a Stackpress app are:

 - package build output
 - `.build`
 - `client-source`
 - generated package targets referenced by config

## What Just Happened

Stackpress generates several layers of output because it separates authoring from runtime implementation:

 - package builds produce consumable CJS and ESM output
 - `.build` stores revisions, migrations, and related working files
 - `client-source` stores readable generated client TypeScript
 - database creation and population produce local runtime state

## Core Concepts

Generated artifacts are useful because they are:

 - inspectable
 - reproducible
 - disposable

That means a bad generated state is usually fixed by changing source input and rerunning commands, not by editing the generated output directly.

## Common Tasks

Safe regeneration usually means:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress push --b config -v
```

Use `purge` when you need to reset local data, not when you only need to refresh generated code.

## Next Steps

Use [Generate And Build](../guides/generate-and-build.md) for the command flow and [CLI Reference](../api/cli-reference.md) for command lookup.
