# Architecture

This page explains how Stackpress combines its lower-level building blocks into one application-facing framework.

## Start Here

You do not need to use the sibling projects directly to build an app with Stackpress. You do need to know what responsibilities they contribute so you can debug the right layer when something goes wrong.

## Quick Start

At a high level:

 - idea files provide structured schema input
 - Stackpress schema processing turns that input into framework-friendly schema objects
 - Stackpress SQL generation turns schema into store and action helpers
 - Stackpress view generation connects the schema to reusable client and view pieces
 - the server and plugin system run the final app

## What Just Happened

Stackpress acts as the consolidation layer:

 - `lib` contributes foundational primitives and runtime helpers
 - `idea` contributes the schema language and transformation pipeline
 - `ingest` contributes the server and plugin lifecycle model
 - `inquire` contributes SQL builders and dialect-aware behavior
 - `reactus` contributes the rendering engine used by the view layer

Stackpress packages then turn those lower-level capabilities into a coherent app workflow.

## Core Concepts

The most important architectural boundary is between:

 - source input
 - generated output
 - runtime behavior

That boundary is why Stackpress can keep app code relatively small while still generating a large amount of useful structure.

## Common Tasks

Use this mental split when debugging:

 - wrong schema shape: start with idea files and schema processing
 - wrong database code: inspect SQL generation and push workflow
 - wrong view behavior: inspect view/client generation and runtime config
 - wrong runtime behavior: inspect plugin registration, routes, and events

## Next Steps

Read [Schema And Generation](./schema-and-generation.md) for the end-to-end transformation path and [Plugin System](./plugin-system.md) for the runtime composition model.
