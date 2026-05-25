# Plugin System

This page explains how Stackpress uses an ingest-style plugin system to keep framework responsibilities and app responsibilities separated.

## Start Here

Stackpress does not load everything through one monolithic runtime file. It uses a plugin model so each concern can register behavior in a focused way.

## Quick Start

The aggregate `stackpress/plugin` export loads the coordinated Stackpress plugin set. Your app then adds local plugins around that aggregate through the template configuration.

## What Just Happened

The aggregate plugin wires together the main Stackpress package responsibilities, including:

 - server behavior
 - schema behavior
 - language support
 - CSRF protection
 - SQL generation and helpers
 - view behavior
 - session behavior
 - API behavior
 - admin behavior

That is why the app can import one Stackpress plugin while still keeping responsibilities separate internally.

## Core Concepts

The important idea is separation of responsibility:

 - Stackpress framework plugins own framework behavior
 - local app plugins own app-specific behavior

That boundary helps you customize behavior without rewriting the whole framework contract.

## Common Tasks

Reach for a local plugin when you need:

 - app-specific route or event behavior
 - app-specific integration logic
 - a focused place to extend the framework

Reach for Stackpress config when the behavior is still framework-wide.

## Next Steps

Use [Plugin Export](../api/plugin.md) for the public aggregate plugin reference and [Plugins And Customization](../guides/plugins-and-customization.md) for the app-facing workflow.
