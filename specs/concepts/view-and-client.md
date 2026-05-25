# View And Client

This page explains how Stackpress connects server rendering, reusable view pieces, and inspectable client output.

## Start Here

Stackpress does not treat the view layer as a separate frontend app by default. It treats rendering and client generation as part of the same schema-driven framework workflow.

## Quick Start

The view layer combines:

 - server rendering through Stackpress view exports
 - generated reusable view-facing artifacts
 - client inspection through `client_source`

## What Just Happened

The view layer builds on top of a React-based rendering engine, but Stackpress exposes it through `stackpress/view` and `stackpress/view/client` so app developers can work from one consolidated package surface.

This layer includes:

 - document and client templates
 - rendering helpers
 - providers and hooks
 - layout components
 - notifier helpers
 - generated reusable pieces informed by the schema

## Core Concepts

There are two related but different concerns here:

 - runtime rendering
 - generated client-facing output

Runtime rendering is what serves pages. Generated client output is what helps you inspect and troubleshoot what Stackpress produced from the schema and config.

## Common Tasks

Use view config when:

 - changing document or page templates
 - changing client-route behavior
 - changing development or build rendering behavior

Use `client_source` when:

 - checking what was generated
 - tracing a schema-driven UI change
 - validating reusable output before debugging runtime rendering

## Next Steps

Read [Using The Client](../guides/using-the-client.md) for the hands-on workflow and [View API](../api/view.md) for the public rendering surface.
