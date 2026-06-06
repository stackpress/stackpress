# 400 Project Structure

Use this course to introduce the recommended Stackpress folder structure after
the reader has already built a working app. This is where the docs can become
opinionated because the reader now has enough context to understand why the
structure exists.

## 400 Project Structure

Stackpress separates app intent, runtime behavior, generated output, and static
assets. That separation keeps source files small and generated files
replaceable.

**Checkpoint**

The reader can explain why generated files should not be edited directly.

## 410 Project Anatomy

A normal Stackpress project should make these areas obvious:

- `schema.idea`
- `config`
- `plugins`
- `public`
- `.build`
- `client_source`

**Course work**

- identify each folder
- label it as source or generated
- know what can be rebuilt

## 411 Source Of Truth

The source of truth is the set of files a developer edits intentionally:

- `schema.idea` for app models and metadata
- `config` for orchestration
- `plugins` for handwritten behavior
- view files for page presentation
- `public` for static assets

**Checkpoint**

The reader can decide where a product change should be made before touching
generated output.

## 412 Generated Output

Generated output is inspectable and disposable:

- `.build` stores working build state, revisions, migrations, and local data
- `client_source` exposes readable generated TypeScript
- package build output is rebuildable

**Course work**

- inspect generated output
- trace it back to source input
- rerun the right generation command

## 420 Config

Config is the app bootstrap and orchestration surface. It decides plugin wiring,
runtime settings, generation targets, build behavior, and client output.

Teach the role of config here. Put the exact config shape in reference.

## 421 Config Splitting

Small apps can start with one config file. Larger apps may split config into:

- common settings
- development runtime
- build runtime
- client generation

**Checkpoint**

The reader can decide whether one config file is enough.

## 430 Plugin Layout

Recommended plugin organization should reflect app responsibilities:

- app routes
- page handlers
- event handlers
- store behavior
- integrations
- custom generation

**Course work**

- place a new route, event, or view in the correct plugin area
- keep unrelated behavior out of the same file

## 440 Public Assets

Static files belong in `public`. This includes images, icons, stylesheets,
client scripts, and public metadata files.

**Course work**

- add a public asset
- reference it from `Head` or a view component

## Related Reference

- Config reference
- CLI reference
- Generated artifacts reference

