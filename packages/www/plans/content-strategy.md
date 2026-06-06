# Stackpress Website Content Strategy

This plan describes the course-style documentation strategy for the Stackpress
static site in `packages/www`.

The website should introduce Stackpress as a practical app framework first, then
progressively reveal deeper capabilities. Stackpress combines lower-level
projects such as `lib`, `idea`, `ingest`, `inquire`, and `reactus`, but the
public docs should teach the Stackpress-facing workflow instead of sending new
readers across separate project docs.

## Goals

- Make the first pass feel small, focused, and buildable.
- Use course numbers as a clear progression model.
- Keep advanced surfaces discoverable without overwhelming new readers.
- Keep exact API, CLI, config, attribute, component, and type details in
  reference pages.
- Let every page remain URL-addressable, even if it is not visible in the
  reader's current course navigation.
- Use reader progress to reveal higher-level navigation and a more mature site
  design.

## Reader Model

The site should store local progress in a cookie or local storage. A page should
count as completed only after the reader stays for the estimated reading time
and reaches the lower part of the page while the tab is visible.

Visible navigation should follow the reader's current level:

- Level 1 shows `100` course pages.
- Level 2 shows `100` and `200`.
- Level 3 shows `100`, `200`, and `300`.
- Level 4 shows `100` through `400`.
- Levels 5 through 8 continue the same pattern.

Every level should always show:

- the current course navigation
- search
- full reference
- progress/status

If a reader opens a higher-level URL before completing the expected context,
show a small warning instead of blocking the page.

Example:

```text
You are reading ahead.

This page assumes you understand 100 Develop and 200 Data. You can continue, or
start from the recommended course path.
```

## Visual Progression

The design can mature with the reader's level, but the site should remain
recognizable across all levels.

- `100`: sparse, text-first, sharp edges, early-web feeling.
- `200`: more color, softer corners, clearer navigation.
- `300`: full modern documentation design.
- `400`: structured, workbench-like documentation for project organization.
- `500` to `800`: richer themes, diagrams, layouts, and specialized surfaces.

Keep these stable across all levels:

- logo placement
- search behavior
- content width
- typography family
- reference access
- URL structure

## Course Versus Reference Rule

A topic belongs in the course when the reader can consume it directly in app
code or project workflow.

A topic belongs in reference when it is primarily lookup material:

- exact exports and import paths
- full config fields
- CLI flag lists
- full method/property lists
- exhaustive attributes and validators
- component prop tables
- database dialect class details
- internal parser/compiler APIs
- generated file inventories

Course pages may link to reference pages, but should not duplicate exhaustive
reference material.

## URL And Numbering Rules

Use tens for a complete topic change and ones for derivative topics.

Examples:

- `130 Pages` is a complete topic.
- `131 Request` and `132 Response` are derivative topics under pages.
- `150 Views` is a complete topic.
- `151 First React Page` and `152 Server Props` are derivative topics under
  views.

Recommended URL shape:

```text
/docs/100-develop
/docs/130-pages
/docs/131-request
/reference/http
```

## Course Map

The sections below list the recommended course pages. Each item includes a
content determination and a course work summary.

### 000 Orientation

#### 000 Start Here

Summary: Explain what Stackpress is, how the course system works, how progress
unlocks navigation, and where to find the full reference.

Course work: Read the site model, choose the recommended path, and understand
that advanced URLs are still accessible.

#### 001 What Stackpress Is

Summary: Present Stackpress as a schema-first app framework that combines
runtime, generation, data, and views into one workflow.

Course work: Understand the source input, generated output, and runtime behavior
split without learning the sibling projects separately.

#### 002 Full Reference

Summary: Explain when to use reference pages and how course pages differ from
lookup pages.

Course work: Practice jumping from a course page to a related reference page.

### 100 Develop

#### 100 Develop

Summary: Introduce the runtime development loop: routes, plugins, pages, events,
views, and debugging.

Course work: Build a minimal Stackpress app and understand where handwritten app
code lives.

#### 110 Scaffold

Summary: Show the smallest useful project scaffold and the first route.

Course work: Create or inspect the baseline app files and verify a route returns
a response.

#### 113 Dev Server

Summary: Teach how local development starts, serves routes, and connects the
view engine.

Course work: Start the app locally and verify a route/view in the browser.

#### 120 Plugins

Summary: Explain local plugins as the boundary for app-specific behavior.

Course work: Add a local plugin and register route or event behavior.

#### 121 Composition

Summary: Explain how Stackpress framework plugins and local app plugins compose.

Course work: Understand what the aggregate Stackpress plugin provides and where
custom code should attach.

#### 122 Local Plugins

Summary: Show how to organize app plugins around routes, events, stores, or
integrations.

Course work: Split one app concern into a local plugin file.

#### 123 Plugin Config

Summary: Explain how plugin behavior reads app configuration.

Course work: Add a small plugin option and read it from a plugin handler.

#### 130 Pages

Summary: Teach page routes as request handlers that prepare response and view
data.

Course work: Add a page handler and render a page from it.

#### 131 Request

Summary: Teach request data the user actually consumes: path, query, body,
method, headers, cookies, and session access.

Course work: Read request input in a route and branch behavior from it.

#### 132 Response

Summary: Teach response outcomes: results, errors, redirects, status, cookies,
session data, and rendering.

Course work: Return data, redirect, and surface a validation error.

#### 133 Data Surfaces

Summary: Explain the difference between request data, response results,
response view data, and app/plugin data.

Course work: Put values in the correct data surface and read them from a view.

#### 134 Session

Summary: Teach session access where it matters inside route/view workflows.

Course work: Read the current session in a route and view.

#### 135 Nest

Summary: Explain Nest-style composition only after normal routes are understood.

Course work: Recognize when Nest-style controllers are useful and how they map
back to normal route handling.

#### 140 Events

Summary: Teach events as the extension layer for work that should not live
inside one route.

Course work: Emit and handle an app event.

#### 141 Terminal Events

Summary: Explain terminal events as command-line entry points into the same
event model.

Course work: Trigger a simple event from the terminal and inspect output.

#### 150 Views

Summary: Teach Stackpress views as React-rendered pages with server-provided
props and provider-backed hooks.

Course work: Create a page view and connect it to a route.

#### 151 First React Page

Summary: Show the minimal `Page`, optional `Head`, and `Body` component pattern.

Course work: Render a page and add a title/head element.

#### 152 Server Props

Summary: Explain `data`, `session`, `request`, `response`, and `styles`.

Course work: Pass route data into a view and read it with the right hook.

#### 153 Layouts

Summary: Explain page shells, provider boundaries, and when to use the standard
layouts.

Course work: Choose a layout and keep provider-dependent hooks below it.

#### 154 Language

Summary: Explain language config, translated strings, and `useLanguage()`.

Course work: Add one translation and use it in a view.

#### 155 Theme

Summary: Explain how theme values flow through layouts and components.

Course work: Apply a small theme change without hard-coding every component.

#### 156 Notifier

Summary: Explain user-facing notifications from response errors, flash data, and
client flows.

Course work: Show a success or error notification after a route action.

#### 160 Debugging And Inspection

Summary: Teach where to inspect routes, generated output, database state, and
view data.

Course work: Diagnose one broken route or generation mismatch using the expected
inspection paths.

### 200 Data

#### 200 Data

Summary: Introduce Stackpress data access as a practical workflow built on SQL
connections, engines, builders, and generated stores.

Course work: Connect to local data and query records from a route.

#### 210 Connections

Summary: Explain how app code connects to SQLite, PGlite, PostgreSQL, or MySQL.

Course work: Configure one local database connection.

#### 211 Dialects

Summary: Explain why dialects exist and when a reader needs to care.

Course work: Choose the right dialect for local development or deployment.

#### 212 SQLite / PGlite

Summary: Teach the recommended local database path.

Course work: Run local schema push and populate against a lightweight database.

#### 213 PostgreSQL

Summary: Explain when and how to switch from local data to PostgreSQL.

Course work: Configure PostgreSQL connection settings.

#### 214 MySQL

Summary: Explain MySQL setup differences and constraints.

Course work: Configure MySQL connection settings.

#### 220 Engine

Summary: Teach the engine as the starting point for building and running SQL.

Course work: Create or use an engine and run one query.

#### 221 Select

Summary: Teach selecting rows for page rendering.

Course work: Query records and render results.

#### 222 Insert

Summary: Teach creating records.

Course work: Insert a row from a route action.

#### 223 Update

Summary: Teach updating records safely.

Course work: Update a row by ID or unique field.

#### 224 Delete

Summary: Teach deleting records and confirming destructive actions.

Course work: Delete a row from an action route.

#### 230 Querying

Summary: Teach common data access patterns in route and event code.

Course work: Query, map, and return typed records.

#### 231 Raw SQL

Summary: Explain when to drop below builders.

Course work: Run a raw SQL query for a case the builder does not cover.

#### 232 Transactions

Summary: Teach grouping multiple data changes safely.

Course work: Wrap two dependent changes in a transaction.

#### 233 JSON Fields

Summary: Explain storing and filtering JSON values.

Course work: Store metadata and filter by one nested value.

#### 234 Schema Changes

Summary: Teach safe database evolution through generation and push.

Course work: Add a field, regenerate, push, and verify data remains readable.

### 300 Build And Deploy

#### 300 Build And Deploy

Summary: Introduce the path from local generated output to production runtime.

Course work: Build the app and identify the runtime target.

#### 310 Generate And Build

Summary: Teach `generate`, `generate:client`, `push`, `populate`, `build`, and
`serve` as workflow commands.

Course work: Run the correct command after schema, config, plugin, or view
changes.

#### 311 Generated Artifacts

Summary: Explain what is disposable, inspectable, and source-of-truth.

Course work: Regenerate output safely after a change.

#### 312 Client Source

Summary: Explain `client_source` as generated TypeScript for inspection, not
hand editing.

Course work: Inspect generated schema/store/view output and trace it back to
source.

#### 320 Local Production

Summary: Explain serving built output locally before deployment.

Course work: Build and run a production-like local server.

#### 330 Vercel

Summary: Teach the recommended Vercel deployment shape.

Course work: Configure and deploy a simple Stackpress app to Vercel.

#### 340 Netlify

Summary: Teach the recommended Netlify deployment shape.

Course work: Configure and deploy a simple Stackpress app to Netlify.

#### 350 Lambda / Serverless

Summary: Explain serverless constraints and request/response adaptation.

Course work: Package a Stackpress handler for a serverless target.

### 400 Project Structure

#### 400 Project Structure

Summary: Introduce the recommended Stackpress folder structure after the reader
has already built routes, views, data access, and deployment shape. This keeps
the start unopinionated while giving the structure real motivation later.

Course work: Understand why Stackpress separates source input, handwritten
runtime code, generated output, static assets, and operational config.

#### 410 Project Anatomy

Summary: Explain `schema.idea`, `config`, `plugins`, `public`, `.build`, and
`client_source` as source or generated areas.

Course work: Identify which folders to edit and which generated folders are safe
to rebuild.

#### 411 Source Of Truth

Summary: Explain which files define app intent: schema, config, handwritten
plugins, views, and public assets.

Course work: Decide where a product change should be made before touching
generated files.

#### 412 Generated Output

Summary: Explain `.build`, generated package output, and `client_source` as
inspectable and disposable artifacts.

Course work: Trace generated output back to its source input and regenerate it
safely.

#### 420 Config

Summary: Teach config as the app bootstrap and orchestration surface, after the
reader understands the runtime and build loop.

Course work: Register plugins, configure runtime/build behavior, and know when
to open the config reference.

#### 421 Config Splitting

Summary: Explain why larger apps split config into common, develop, build, and
client files.

Course work: Decide whether one config file is enough or whether separate
environment/build configs are clearer.

#### 430 Plugin Layout

Summary: Explain the recommended organization for local app plugins, store
plugins, page handlers, event handlers, and views.

Course work: Place a new route, event, or view in the recommended folder.

#### 440 Public Assets

Summary: Explain where static images, styles, scripts, icons, and public files
belong.

Course work: Add a public asset and reference it from a view.

### 500 Idea

#### 500 Idea

Summary: Reveal the schema/generation layer after readers understand runtime,
data, and build loops.

Course work: Read a `schema.idea` file as the source of truth.

#### 510 Idea Files

Summary: Teach `.idea` files as structured app modeling input.

Course work: Create or modify a small `schema.idea`.

#### 511 Syntax

Summary: Explain the readable subset needed for normal app authoring.

Course work: Read declarations, blocks, literals, comments, and attributes.

#### 512 Use

Summary: Teach schema composition with `use`.

Course work: Split shared schema declarations into another file.

#### 513 Plugins

Summary: Explain plugin declarations inside `.idea` files as output selection.

Course work: Add a plugin block and configure an output path.

#### 520 Modeling

Summary: Teach app modeling as entities, fields, reusable structures, and
metadata.

Course work: Model one feature from product language into schema declarations.

#### 521 Models

Summary: Teach models as application entities.

Course work: Add a model with an ID and a few fields.

#### 522 Fields

Summary: Teach fields as typed data plus metadata.

Course work: Add fields with required, default, and validation behavior.

#### 523 Enums

Summary: Teach fixed value sets.

Course work: Add an enum field to a model.

#### 524 Types

Summary: Teach reusable structured values.

Course work: Extract repeated structure into a type.

#### 525 Props

Summary: Teach reusable metadata.

Course work: Define a prop and reuse it across fields.

#### 526 Attributes

Summary: Explain attributes as metadata interpreted by Stackpress generators.

Course work: Use a few common attributes and know where to find the exhaustive
attribute reference.

#### 527 Relations

Summary: Teach relations from the app modeling perspective, not as database
internals first.

Course work: Relate two models and inspect generated query/view behavior.

#### 530 Generation

Summary: Explain how idea input becomes schema, SQL, view, admin, and client
artifacts.

Course work: Run generation and inspect the resulting outputs.

#### 531 Schema Output

Summary: Explain generated schema classes and column meaning.

Course work: Trace a model field into generated schema output.

#### 532 SQL Output

Summary: Explain generated stores and actions.

Course work: Use a generated store or action in route/event code.

#### 533 View Output

Summary: Explain generated reusable view-facing pieces.

Course work: Inspect generated view output and connect it to schema metadata.

#### 534 Client Output

Summary: Explain generated client-facing TypeScript.

Course work: Use client output for inspection and troubleshooting.

#### 540 Idea Plugin Authoring

Summary: Teach when to write a custom generator plugin.

Course work: Decide whether a requirement belongs in an idea generator.

#### 541 ts-morph Plugins

Summary: Teach a practical approach to generating TypeScript safely.

Course work: Generate or modify a small TypeScript file from schema input.

#### 542 Custom Generators

Summary: Teach end-to-end custom generator structure.

Course work: Build a small generator that writes one output file.

### 600 Built-ins

#### 600 Built-ins

Summary: Introduce the built-in framework capabilities that are available after
the reader understands app structure and generation.

Course work: Decide which built-ins belong in a project.

#### 610 Authentication

Summary: Teach auth flows from the app developer perspective.

Course work: Configure and inspect a sign-in flow.

#### 611 Sign In

Summary: Explain username, email, phone, or configured sign-in paths.

Course work: Enable or customize one sign-in path.

#### 612 Sign Up

Summary: Explain account/profile creation.

Course work: Enable or customize sign-up behavior.

#### 613 OTP / 2FA

Summary: Explain one-time-password and second-factor flows.

Course work: Trace the OTP/2FA route and event sequence.

#### 620 Roles And Permissions

Summary: Teach roles as profile/session state used by route and event rules.

Course work: Add a role and protect behavior with it.

#### 621 Session Rules

Summary: Explain access rules at a practical level.

Course work: Define or inspect a rule that protects a route.

#### 630 Sessions And Account

Summary: Explain session state, profile data, and account pages.

Course work: Read the active profile and session in route/view code.

#### 631 Profile

Summary: Explain the built-in profile model and role storage.

Course work: Inspect or extend profile-facing behavior.

#### 632 Account Pages

Summary: Explain generated or built-in account screens.

Course work: Link to and customize account pages.

#### 633 Flash Messages

Summary: Explain session-backed user feedback after redirects.

Course work: Set a flash message and show it through notifier behavior.

#### 640 CSRF

Summary: Explain CSRF protection in form/action flows.

Course work: Add a protected form action.

#### 650 Email

Summary: Explain email events and common auth/account use cases.

Course work: Send a basic transactional email through the email event.

#### 660 i18n

Summary: Explain translations across config, server props, layouts, and views.

Course work: Add a locale and translate a view string.

#### 661 Language Config

Summary: Explain where languages and translations are declared.

Course work: Configure a default language and one alternate locale.

#### 662 useLanguage

Summary: Teach the normal view hook for translating strings.

Course work: Translate content inside `Body` or child components.

#### 670 Components

Summary: Introduce the component families available through the view/client
surface.

Course work: Choose the right component family for display, forms, or layout.

#### 671 frui Base Components

Summary: Explain base UI pieces such as buttons, cards, dialogs, dropdowns,
tabs, tables, and notifications.

Course work: Use a base component in a view.

#### 672 frui Form Components

Summary: Explain form input families and when generated admin/views use them.

Course work: Use or inspect a form component tied to schema metadata.

#### 673 frui View Components

Summary: Explain display components for formatted data.

Course work: Render typed data with an appropriate display component.

#### 680 API / OAuth

Summary: Explain built-in API and OAuth surfaces.

Course work: Configure or inspect one API/OAuth flow.

### 700 Studio

The current repository has admin generation and view/client surfaces, but Studio
is still a planned product area. Keep the `600` level as future-facing until
the product shape is stable.

#### 700 Studio

Summary: Introduce visual or assisted schema/app management.

Course work: Understand what Studio adds beyond code-first workflow.

#### 710 Schema Explorer

Summary: Explain schema navigation and inspection.

Course work: Inspect models, fields, and generated artifacts visually.

#### 720 Fields

Summary: Explain field editing and metadata.

Course work: Modify a field and review generated effects.

#### 721 Field Validation

Summary: Explain validation from authoring to generated behavior.

Course work: Add a validator and verify the generated form/action behavior.

#### 730 Relations

Summary: Explain relationship editing and inspection.

Course work: Create or inspect a relation.

#### 740 Generated Admin

Summary: Explain admin pages as generated Stackpress output.

Course work: Generate admin output and inspect the resulting pages/views.

#### 741 Admin Pages

Summary: Explain generated admin page routes.

Course work: Find and customize an admin page route.

#### 742 Admin Views

Summary: Explain generated admin view structure.

Course work: Inspect generated admin view output and trace it to schema.

#### 743 Admin Client

Summary: Explain generated admin client code.

Course work: Inspect client output for admin behavior.

#### 750 Import / Export

Summary: Explain moving structured app data in and out.

Course work: Run or inspect an import/export flow.

### 800 AI

#### 800 AI

Summary: Introduce AI as an advanced layer for generating, inspecting, and
automating Stackpress work.

Course work: Understand where AI fits after the reader knows runtime, schema,
generation, and built-ins.

#### 810 MCP

Summary: Explain how Stackpress AI exposes tools through MCP-style transports.

Course work: Run or inspect one MCP transport.

#### 811 stdio Transport

Summary: Explain local agent integration through stdio.

Course work: Run or inspect the stdio script.

#### 820 Artifacts

Summary: Explain AI-generated artifacts as outputs that should be inspected,
verified, and treated like generated work.

Course work: Generate or inspect one artifact and decide what should become
source.

#### 830 Hooks

Summary: Explain AI events and transform hooks as extension points.

Course work: Trace an AI-related event or transform hook.

#### 831 AI Events

Summary: Explain runtime AI event handling.

Course work: Register or inspect an AI event.

#### 832 Transform Hooks

Summary: Explain generation-time AI extension hooks.

Course work: Inspect a transform hook that writes generated output.

#### 840 Skills

Summary: Explain Stackpress skills as portable agent workflows for discovery,
scaffolding, schema authoring, plugin routing, generation, and verification.

Course work: Choose the right skill for a phase of Stackpress app development.

#### 841 Skill Workflow

Summary: Teach the recommended skill order:
`stackpress-app-discovery`, `stackpress-app-coordinator`,
`stackpress-app-scaffold`, `stackpress-idea-authoring`, generation,
`stackpress-plugin-router`, plugin implementation skills, and
`stackpress-app-verification`.

Course work: Map a product request to the next skill in the workflow.

#### 842 App Discovery Skill

Summary: Explain how `stackpress-app-discovery` turns a vague request into a
buildable app brief.

Course work: Use the skill to clarify audience, entities, flows, auth, admin,
and data needs.

#### 843 App Coordinator Skill

Summary: Explain how `stackpress-app-coordinator` manages the end-to-end
Stackpress build flow.

Course work: Use the coordinator to sequence scaffold, schema, generation,
plugins, and verification.

#### 844 Scaffold Skill

Summary: Explain how `stackpress-app-scaffold` creates the baseline app files.

Course work: Use or inspect the scaffold asset and understand what it creates.

#### 845 Idea Authoring Skill

Summary: Explain how `stackpress-idea-authoring` drafts and refines
`schema.idea`.

Course work: Use the skill to model a domain and validate Stackpress idea
patterns.

#### 846 Plugin Skills

Summary: Explain `stackpress-plugin-router`, `stackpress-plugin-scaffold`,
`stackpress-plugin-pages-events`, `stackpress-plugin-views`, and
`stackpress-plugin-idea-generator`.

Course work: Decide whether a feature belongs in schema, runtime plugin code,
page/view code, or generator code.

#### 847 Verification Skill

Summary: Explain `stackpress-app-verification` as the phase gate before moving
on.

Course work: Verify scaffold files, schema readiness, generated output, plugin
wiring, and runtime behavior.

## Reference Map

These pages should exist outside the progressive course nav and remain globally
available.

- Package root reference
- Config reference
- CLI reference
- Idea syntax and attributes reference
- Plugin API reference
- Server API reference
- HTTP Request and Response reference
- View API reference
- View Client API reference
- Schema API reference
- SQL API reference
- Session API reference
- Language/r22n reference
- Frui component reference
- Type reference
- UnoCSS reference
- WHATWG reference
- Database dialect references
- AI transport/reference pages
- Skills folder/reference index

## Implementation Notes For `packages/www`

- Keep the existing `guides`, `concepts`, and `api` pages available while the
  course system is developed.
- Add course manifests separately instead of overloading the current guide
  manifest.
- Keep reference manifests flat and searchable.
- Course pages should have summaries, prerequisites, checkpoint criteria, and
  reference links.
- Reference pages should have import paths, exact options, signatures, and
  lookup tables.
- Track progress by course number, not by URL alone, so moved pages can preserve
  reader level with aliases.
- Treat `700 Studio` as planned/future until product behavior is implemented.
- Add `840 Skills` under `800 AI` because skills are agent workflows layered on
  top of the Stackpress development process.

## Editorial Template For Course Pages

Each course page should follow this order:

```text
# 130 Pages

Start here
Quick start
What just happened
Core concepts
Common tasks
Checkpoint
Related reference
Next course
```

The checkpoint should be concrete. A reader should only gain progress when they
can do or recognize the thing the page teaches.

## Editorial Template For Reference Pages

Each reference page should follow this order:

```text
# Request Reference

Import
When to use it
Common examples
API surface
Types
Related course pages
```

Reference pages should optimize for lookup, not persuasion or onboarding.
