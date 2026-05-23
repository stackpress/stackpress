# Schema And Generation

This page explains how Stackpress turns idea-file input into schema classes, SQL-facing helpers, client output, and generated view-facing artifacts.

## Start Here

Use this page when you understand that Stackpress is schema-first but want to know what actually gets produced from that schema.

## Quick Start

The generation chain is:

 1. parse and load `schema.idea`
 2. convert schema declarations into Stackpress schema structures
 3. run generation plugins
 4. write generated output for server, SQL, client, and view-facing consumption

## What Just Happened

Stackpress schema processing does more than preserve the raw idea syntax. It interprets supported types, attributes, assertions, and component families so later packages can consume the schema consistently.

From there:

 - schema output becomes typed model and column structures
 - SQL generation produces store and action-oriented output
 - view generation produces reusable view and client-facing pieces
 - client generation makes the results inspectable

## Core Concepts

The key distinction is between:

 - schema meaning
 - generated implementation artifacts

The schema meaning comes from idea declarations plus Stackpress-supported built-ins. The implementation artifacts come from generators that consume that schema and write concrete output.

## Common Tasks

If generation looks wrong:

 - check the idea declaration first
 - check the supported attribute or assertion behavior
 - rerun `generate` and `generate:client`
 - inspect `client_source` or other generated output before editing app logic

## Next Steps

Read [Generated Artifacts](./generated-artifacts.md) for output locations and [Schema API](../api/schema.md) for the public schema-facing classes and helpers.
