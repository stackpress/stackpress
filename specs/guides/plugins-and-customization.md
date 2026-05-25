# Plugins And Customization

This guide explains where app-specific behavior belongs in a Stackpress project and how local plugins fit around the aggregate `stackpress` plugin.

## Start Here

Use this page when the generated defaults are not enough and you need to add app-specific behavior.

## Quick Start

In a typical Stackpress app, the plugin list lives in `package.json` and includes:

 - local plugins from `./plugins/*`
 - the aggregate `stackpress` plugin

That means the app uses Stackpress as the main framework layer, then adds local behavior around it.

## What Just Happened

Stackpress itself loads a coordinated plugin set for server, schema, language, CSRF, SQL, view, session, API, and admin behavior. Your app plugins sit alongside that aggregate and let you extend the app without collapsing every responsibility into one file.

## Core Concepts

A good local plugin usually does one of these jobs:

 - add routes or events
 - connect app-specific business logic
 - wire app-specific integrations
 - override or extend behavior in a focused place

The goal is separation of responsibility, not “one plugin per feature” at all costs.

## Common Tasks

Customize here first:

 - `plugins/app` for app-facing routing or integration behavior
 - `plugins/store` for store or data-adjacent app behavior

Customize Stackpress config when the behavior is still framework-level rather than app-specific.

## Next Steps

Read [Plugin System](../concepts/plugin-system.md) for the mental model behind this structure. Use [Plugin Export](../api/plugin.md) when you need the public `stackpress/plugin` reference.
