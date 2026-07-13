# Phase 3 Contract Traces

## Execution Phase Model

The source supports seven distinct phases; reducing them to "build-time versus
runtime" hides contributor decisions.

1. **Source authoring:** contributors edit `src/`, manifests, configs, Idea,
   templates, or tests.
2. **Package compilation:** package `tsc` builds source independently into CJS
   and ESM trees and writes module-type markers.
3. **Application bootstrap:** Ingest reads application/package plugin lists and
   calls plugin functions once; Stackpress's aggregate plugin composes defaults.
4. **Lifecycle initialization:** application bootstraps resolve `config`, then
   `listen`, then `route`.
5. **Idea generation:** the `generate` event creates a transformer and shared
   ts-morph project, resolves `idea`, runs transforms sequentially, then saves TS
   or emits JS/declarations.
6. **Operational runtime:** named events execute services, data work, commands,
   integrations, and application behavior.
7. **Request/render runtime:** route/import/view handlers adapt HTTP requests and
   Reactus rendering over registered capabilities.

Package compilation produces distributable framework code. Idea generation
produces application-specific executable client state. A Reactus `build` command
is another application build operation and must not be conflated with either.

## Trace A: Plugin Discovery And Bootstrap

1. An application manifest or explicit loader option supplies plugin paths.
2. Ingest `PluginLoader` resolves package/directory/file forms and reads the
   `plugins` key, including nested plugin lists.
3. Each plugin function receives the shared server and declares listeners or
   registers dependency-free state.
4. Application config explicitly resolves `config`, `listen`, and `route`.
5. Named capabilities become reachable only after their owning phase runs.

Contributor consequence: place registration at the earliest phase where its
dependencies are valid; source presence or plugin installation alone does not
prove runtime reachability.

## Trace B: Generator Discovery And Execution

1. `stackpress generate` becomes the server's `generate` event.
2. Schema's event validates client config and calls its generation script.
3. The script resolves the Idea input and creates one transformer and ts-morph
   project/directory at the configured client build path.
4. `server.resolve('idea', { transformer })` lets enabled generator packages
   mutate the cached schema's `plugin` object.
5. Each generator package resolves its own CJS/ESM-safe `dirname` and appends the
   absolute `transform` module path.
6. Idea Transformer iterates `schema.plugin` insertion order, resolves each
   module, imports its default callback, and awaits it with shared schema,
   transformer, project, directory, terminal, config, and cwd.
7. Transforms create/replace/extend files and generated package export maps.
8. The project is formatted/saved as TS or emitted as JS plus declarations.

Contributor consequence: adding a folder is insufficient. A generator requires
the `idea` registration, default transform callback, correct shared-file
cooperation, generated export changes, and consumer verification.

## Trace C: Generated Producer To Runtime Consumer

Schema generates the base client config, model/fieldset registries, types,
columns, schemas, tests, root index, and package metadata. SQL replaces/extends
model output with stores, actions, events, scripts, and generated listeners.
View adds components; admin adds model routes/pages/views; AI adds tool modules
and a root tools registry.

During later application bootstrap:

- schema's `config` phase registers the configurable client-module loader;
- SQL's `listen` phase loads generated models and calls their generated
  listeners;
- admin's `route` phase loads generated models and calls generated admin route
  registrars;
- AI's `listen` phase loads generated tools and calls their listener registrar.

Contributor consequence: generator and runtime consumer are one contract even
when they live in separate source files or packages. Generated source is
disposable; its importability and runtime registration are required behavior.

## Trace D: Handwritten Page And View

1. A package/domain plugin declares route bindings during `route`.
2. `ctx.import.<method>` lazily imports a page handler.
3. The page uses the Ingest action contract to validate, call events, populate
   response data/results, redirect, or set status/error.
4. `ctx.view.<method>` binds the same route to a TSX entry at a public/importable
   module path.
5. The view reads server props/hooks and renders React presentation.

Contributor consequence: request behavior belongs in pages, presentation in
views, and pairing in the owning plugin. Generated admin emits the same logical
trio rather than centralizing it in the aggregate package.

## Trace E: Aggregate Package

The aggregate `stackpress` workspace has two independent responsibilities:

- **default plugin composition:** call server, schema, language, CSRF, SQL, view,
  session, API, and admin plugins in explicit order;
- **public facade:** forward selected foundation and package values/types through
  root/subpath exports, plus shared CSS, Idea, tsconfig, and UnoCSS assets.

AI and desktop remain separately installed optional plugins. Email is a direct
aggregate dependency but is invoked through session. Therefore aggregate plugin
membership, direct dependency membership, and public re-export membership are
separate decisions.

Contributor consequence: update the aggregate only when a change intentionally
alters default composition, facade exposure, shared aggregate assets/config, or
their ordering/dependency contract. Do not put feature implementation there.
The exact policy for new packages still requires maintainer acceptance.

## Current Verification Evidence

- Schema tests cover object behavior and stale generated schema-file pruning.
- AI transform tests generate isolated tool registries and assert root/module
  exports consumed at runtime.
- Server tests cover plugin/terminal/serve behavior.
- SQL tests cover helpers and upgrade behavior but not the complete transform.
- Desktop has extensive target/plugin/security/build/package tests.
- Admin, API, CSRF, email, language, session, view, and aggregate currently have
  test commands but no package test files in the tree.
- Root `yarn test` runs only server, schema, and SQL.

This evidence supports the contract traces but does not establish a universal
maintainer-required test threshold for future contributions.

## Unresolved Contract Boundaries

- Only schema currently proves/practices explicit stale-file pruning; other
  generator removal behavior is not uniformly established.
- Transform ordering follows plugin-map insertion order and aggregate plugin
  order, but no accepted public stability policy defines what contributors may
  rely on.
- Manifest/export drift prevents describing every declared subpath or file as an
  intended contract.
- Current test distribution cannot by itself define the desired contribution
  gate.
