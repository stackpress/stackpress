# Using The Client

This guide explains how Stackpress generates client-facing TypeScript for inspection and how that output relates back to idea files and config.

## Start Here

Use this page when you want to inspect generated schema, store, action, or reusable view-facing artifacts without editing generated files directly.

## Quick Start

Run a main generation pass and a client-focused generation pass:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
```

Then inspect:

```text
client-source
```

## What Just Happened

An app can use `config/client.ts` to redirect generated client output into `client-source` instead of the normal generated package target. That makes the output readable and easy to debug.

## Core Concepts

`client-source` is not a hand-authored app folder. It is a readable view into what Stackpress generated from:

 - `schema.idea`
 - client-related config
 - generation plugins running through Stackpress

That means you should treat it as inspection output, not as a source-of-truth codebase.

## Common Tasks

Use the client output to answer questions like:

 - what schema shape did Stackpress infer?
 - what store and action helpers were generated?
 - what reusable client or frui-oriented pieces were produced?
 - did a schema attribute change affect the generated output?

If the output looks wrong:

 1. change the source file, usually `schema.idea` or `config/client.ts`
 2. rerun `stackpress generate --b config -v`
 3. rerun `stackpress generate --b config/client -v`
 4. inspect `client-source` again

Do not edit `client-source` directly.

## Next Steps

Use [Debugging And Inspection](./debugging-and-inspection.md) when tracing a generation problem. For the conceptual view of how generation works, read [View And Client](../concepts/view-and-client.md). For exact client config fields, use [Config Reference](../api/config-reference.md).
