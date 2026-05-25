# Idea Files

This page explains why `schema.idea` is the main source of truth in a Stackpress app and what role it plays in the wider Stackpress workflow.

## Start Here

In Stackpress, `schema.idea` is the highest-leverage file in the project. It defines the shape of the application data model and feeds several later stages of generation.

## Quick Start

When you edit `schema.idea`, the usual follow-up is:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress push --b config -v
```

## What Just Happened

The idea file is not only a database hint. Stackpress uses it to drive:

 - schema classes
 - column and field metadata
 - SQL-facing store and action generation
 - admin-oriented generation
 - reusable client or frui-oriented output

That is why Stackpress treats idea files as the core authoring surface.

## Core Concepts

An idea file in Stackpress usually contains:

 - models
 - enums
 - types
 - column types
 - attributes and assertions
 - relations

Stackpress then gives those declarations framework-specific meaning through its schema config and generators.

## Common Tasks

Use the idea file to change:

 - a model field
 - validation or assertion rules
 - relation metadata
 - field/view/list/filter behavior

Use config when you need to change how generation runs rather than what the schema means.

## Next Steps

Read [Schema And Generation](./schema-and-generation.md) to see how the idea file becomes runtime artifacts. Use [Idea Reference](../api/idea-reference.md) for the dense lookup layer of supported built-ins.
