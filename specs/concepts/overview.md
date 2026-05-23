# Overview

This page explains what Stackpress is optimizing for and how to think about it before diving into commands or individual exports.

## Start Here

Stackpress is a schema-first application framework. You describe your application through idea files, config, and plugins, and Stackpress turns that input into a running server, generated database-facing code, generated client-facing code, and a view layer that can be inspected and extended.

## Quick Start

The important mental model is:

 1. author the source of truth
 2. run generation
 3. push schema changes into the database
 4. run and inspect the app

## What Just Happened

Stackpress is not one brand-new runtime invented from scratch. It is an app-facing composition layer built on top of several lower-level libraries:

 - primitives and runtime helpers
 - idea-file parsing and transformation
 - server and plugin lifecycle
 - SQL building and execution
 - React-based server rendering and client support

Those pieces matter, but most app developers should first understand how Stackpress combines them, not how to use each library separately.

## Core Concepts

Stackpress treats these as first-class:

 - `schema.idea` as the main authoring surface
 - `config/*.ts` as orchestration and runtime setup
 - plugins as the boundary for app-specific behavior
 - generated output as disposable, inspectable artifacts

## Common Tasks

Most daily work falls into one of four loops:

 - edit schema
 - rerun generation
 - inspect generated output
 - debug routes, events, and database state

## Next Steps

Read [Architecture](./architecture.md) for how the underlying pieces fit together, then [Idea Files](./idea-files.md) for the main authoring surface.
