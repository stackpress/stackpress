# 500 Idea

Use this course to reveal Stackpress as schema-first after the reader already
understands runtime, data, build, and project structure. This avoids making the
first impression feel too abstract.

## 500 Idea

Idea files describe application structure. Stackpress turns those declarations
into schema classes, SQL-facing helpers, view-facing artifacts, admin output,
and client output.

**Checkpoint**

The reader can read a `schema.idea` file as app source.

## 510 Idea Files

An idea file is structured input. It can declare models, fields, enums, types,
props, plugins, and imports through `use`.

**Course work**

- create or inspect a small `schema.idea`
- identify models and supporting declarations

## 511 Syntax

Teach the readable authoring subset:

- declarations
- blocks
- literals
- comments
- attributes

Leave the complete syntax specification to reference.

## 512 Use

`use` composes schema files. It lets larger projects split common declarations
or import framework-provided schema.

**Course work**

- split shared definitions into another file
- import them into the app schema

## 513 Plugins

Plugin declarations inside `.idea` files choose generation outputs and pass
config to generator plugins.

**Course work**

- add a plugin block
- configure an output path
- run generation

## 520 Modeling

Modeling means turning product language into schema declarations.

Start from entities and relationships. Add fields, fixed values, reusable
structures, and metadata only when they serve the app behavior.

## 521 Models

Models are application entities.

**Course work**

- add one model
- include an ID
- add fields that support a real workflow

## 522 Fields

Fields describe typed data and metadata.

**Course work**

- add required fields
- add defaults
- add validation-related metadata

## 523 Enums

Enums represent fixed value sets.

**Course work**

- add an enum
- use it as a model field

## 524 Types

Types represent reusable structured values.

**Course work**

- extract repeated structure into a type
- reuse it from more than one model or field

## 525 Props

Props represent reusable metadata.

**Course work**

- define one prop
- apply it to multiple fields

## 526 Attributes

Attributes attach meaning that Stackpress generators can interpret.

Teach common examples in the course. Keep the exhaustive attribute list in
reference.

## 527 Relations

Relations connect models. Teach them from the app modeling perspective before
going into database implementation details.

**Course work**

- relate two models
- inspect generated query or view behavior

## 530 Generation

Generation turns idea input into concrete artifacts:

- schema output
- SQL output
- view output
- admin output
- client output

**Checkpoint**

The reader can run generation and inspect what changed.

## 531 Schema Output

Schema output makes model and column meaning available to Stackpress packages.

**Course work**

- trace one model field into generated schema output

## 532 SQL Output

SQL output creates store and action-oriented helpers.

**Course work**

- use a generated store or action in route/event code

## 533 View Output

View output creates reusable view-facing pieces informed by schema metadata.

**Course work**

- inspect generated view output
- connect it to schema attributes

## 534 Client Output

Client output exposes readable generated TypeScript.

**Course work**

- inspect `client_source`
- use it for troubleshooting instead of hand edits

## 540 Idea Plugin Authoring

Custom generator plugins are for requirements that should be produced from
schema, not handwritten in every app.

**Course work**

- decide whether a requirement belongs in runtime code or generation

## 541 ts-morph Plugins

Use `ts-morph` when generator output needs to create or modify TypeScript
safely.

**Course work**

- generate or modify a small TypeScript file from schema input

## 542 Custom Generators

A custom generator receives schema and config, then writes output.

**Checkpoint**

The reader can build a small generator that writes one file.

## Related Reference

- Idea reference
- Schema reference
- SQL reference
- View reference
- CLI reference

