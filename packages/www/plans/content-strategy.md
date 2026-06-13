# Stackpress Website Content Strategy

This plan describes the course-style documentation strategy for the Stackpress
static site in `packages/www`.

The website should introduce Stackpress as a practical full-stack framework
first, then progressively reveal deeper capabilities. Stackpress combines
Ingest, Inquire, Reactus, and Idea, but the public docs should teach the
Stackpress-facing workflow instead of sending new readers across separate
project docs.

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

The static site should store reader progress in local storage. `spLevel`
controls the visible guide band, while `spHistory` and the optional `spExp`
cache track experience. A guide page awards `10` experience only after the
reader spends at least `2` minutes on the page and reaches the bottom region.
Experience does not unlock guide bands; opening a guide URL above the current
band upgrades `spLevel` directly.

Visible navigation should follow the reader's current level:

- Level 1 shows `000` orientation and the runtime path through `150`.
- Level 2 shows the early runtime path and `200`.
- Level 3 shows the early runtime path, `200`, and `300`.
- Level 4 shows the early runtime path through `400`.
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

This page assumes you understand 002 Getting Started and 200 Data. You can continue, or
start from the recommended course path.
```

## Visual Progression

The design can mature with the reader's level, but the site should remain
recognizable across all levels.

- `000` through `150`: sparse, text-first, sharp edges, early-web feeling.
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

- `120 Pages` is a complete topic.
- `121 Request` and `122 Response` are derivative topics under pages.
- `140 Views` is a complete topic.
- `141 First React Page` and `142 Server Props` are derivative topics under
  views.

Recommended URL shape:

```text
/docs/002-getting-started
/docs/120-pages
/docs/121-request
/reference/http
```

## Course Map

The following courses are found in `specs/guides`.

- **000 Orientation** - Start the Stackpress course path by learning how the site is organized and why the lessons are numbered. The course is meant to feel like a guided book, so each page gives you enough context to continue without turning the first visit into a reference hunt.
- **001 What Stackpress Is** - Understand Stackpress as a full-stack framework built from four smaller open source projects. This page matters because Stackpress can look like many things at once: a server framework, a query layer, a template system, a code generator, and a set of built-in app features.
- **002 Getting Started** - Create the smallest useful Stackpress app, add one route, and verify that the development server can return a response. This lesson is the first hands-on proof that Stackpress can load your code and answer a browser request.
- **100 Develop** - Learn the Stackpress runtime path after the first app already answers a request. This section gives routes, plugins, pages, events, views, and debugging a course home without forcing a full project structure too early.
- **110 Plugins** - Small apps can put everything in one file, but that stops working once routes, events, stores, and integrations all need a place to live. Plugins give Stackpress a way to load app behavior in focused units instead of forcing every concern into one startup file.
- **111 Composition** - Composition is how Stackpress lets local app behavior sit beside framework behavior without turning one file into the whole application. The app can load your plugins and the aggregate `stackpress` plugin, and each plugin registers the behavior it owns.
- **112 Local Plugins** - A local plugin is app-owned code that tells Stackpress what behavior to attach. It is the first runtime primitive that feels specific to your project, because the plugin can register the routes, events, and services your app needs.
- **120 Pages** - A page route is where an incoming request becomes an outgoing answer. It is the place a browser visit turns into handler code, response data, and sometimes a rendered view.
- **121 Request** - Read request input in a route so your app can respond to path, query, body, header, method, URL, and session data. The request object is the route's input envelope, so this lesson teaches how to open the right part of that envelope at the right time.
- **122 Response** - Shape route output with response results, errors, redirects, status, cookies, session data, and rendering behavior. If the request is the route's input envelope, the response is the answer the route sends back.
- **123 Data Surfaces** - Routes become easier to debug when each value has the right home. Stackpress and Ingest use several related data surfaces, and they can look similar at first because many of them are callable nested stores. The important lesson is not that they share a shape; it is that each one answers a different question.
- **124 Session** - Use request sessions to read state that arrived with the request, and response sessions to write state that should exist on the next request. This lesson is about the `req.session` and `res.session` interface, not the higher-level auth and permission system.
- **125 Nest** - Learn the nested data helper behind `req.data`, `req.query`, `req.post`, and `res.data`. Stackpress uses `Nest` so request and response data can be read with simple keys, nested paths, query strings, form payloads, and callable stores.
- **130 Events** - Use events to give backend behavior a reusable name. Routes are good at preparing a request and formatting a response, while events are good at representing business rules that can be called from routes, the CLI, plugins, or other runtime entry points.
- **131 Terminal Events** - Terminal events let you run named Stackpress behavior without clicking through a browser page. That matters when you want to inspect a generated action, debug a data result, or confirm that an event exists before you connect it to a route or view.
- **140 Views** - Plain responses prove the server works, but apps eventually need pages a user can read and interact with. Stackpress views connect server-prepared data to React-rendered output so a route can become a real browser page.
- **141 First React Page** - The first React page turns a plain server answer into visible app UI. The important idea is the handoff: a page handler prepares data, and a React view renders that data in the browser.
- **142 Server Props** - Server props are the handoff from route code to React code. The route prepares data, response state, session state, request details, and styles; the view reads those values through props and provider-backed hooks.
- **143 Layouts** - Layouts are both page shells and provider boundaries. They decide what the page looks like, but they also create the context that lets child components read server data, language, theme, and notifications.
- **144 Language** - Language support keeps user-facing text from being hard-coded into every view. Stackpress separates the server-side locale choice from the React hook that translates labels inside the page.
- **145 Theme** - Theme state lets the UI change presentation without spreading visual decisions through every component. In Stackpress views, theme lives inside the layout provider stack and is read with `useTheme()`.
- **146 Notifier** - Notifications are short UI messages that tell the user what just happened. Stackpress views get notifier support from the standard layout provider, so most pages can trigger feedback without building a notification system by hand.
- **150 Hooks** - Use hooks to run code at important moments in the Stackpress request lifecycle. This lesson focuses on the runtime hooks most visible to app developers: `request` and `response`, then shows how user-defined `config`, `listen`, and `route` hooks wire startup behavior in a local plugin.
- **160 Debugging And Inspection** - Debugging gets easier when you stop treating the app as one large mystery. Stackpress has source files, generated output, runtime behavior, and local data; the first debugging skill is knowing which layer to inspect.
- **200 Data** - Data turns a Stackpress app from a page that can answer into a product that can remember. Once the route and view loop is familiar, database work becomes the next practical question: where do records live, how does app code read them, and how do you verify that the right rows changed?
- **210 Connections** - A connection is the adapter between app code and a real database driver. It knows which SQL dialect is active, how to format values for the driver, how to run SQL, and how to return plain rows to application code.
- **211 Dialects** - A SQL dialect is the version of SQL that a database understands. The same app idea can target PostgreSQL, MySQL, or SQLite, but the exact SQL text, type mapping, identifier quoting, JSON behavior, and placeholder format can differ.
- **212 SQLite / PGlite** - Local database setup should feel disposable while you are learning. You need a database that can hold real rows, but you should also be able to reset it when the schema or seed data gets messy.
- **213 PostgreSQL** - PostgreSQL is the next database step when local file-backed development is no longer enough. The app still uses the same Stackpress data surface, but the connection now points to a PostgreSQL server.
- **214 MySQL** - MySQL is another production database path for Stackpress apps. The app can keep the same route, event, and generated action structure, while the connection helper points to a MySQL server through the MySQL2 driver.
- **220 Engine** - The engine is the main surface for schema changes, query builders, raw SQL, and transactions. Once a connection exists, the engine is where app code starts describing database work.
- **221 Select** - Selecting data is the read side of an app. The route or event asks for records, the data layer filters and orders them, and the view renders the rows that came back.
- **222 Insert** - Insert operations create new records. This is the first data operation where a page changes the database instead of only reading from it.
- **223 Update** - Update operations change rows that already exist. They are more sensitive than inserts because the code must identify the correct row before applying new values.
- **224 Delete** - Delete-style operations remove data from the normal app flow. In Stackpress generated admin pages, the safer default is often a remove flow that marks a record inactive instead of immediately deleting the row.
- **230 Querying** - The basic operation pages teach the safest default path. Querying gets its own parent page because real features eventually need raw SQL, template SQL, transactions, or JSON field filters.
- **231 Raw SQL** - Raw SQL is the escape hatch for queries that generated events or builders do not express cleanly. It gives you direct control over the statement, but it also makes input safety and dialect behavior your responsibility.
- **232 Transactions** - Transactions group database work that must succeed or fail together. They protect the app from halfway-finished changes, which are often harder to debug than a clean failure.
- **233 JSON Fields** - JSON fields store flexible data inside one column. They are useful when the app needs to keep small nested values, but those values do not need their own table or first-class column yet.
- **300 Idea** - Learn how Stackpress uses idea files as source input for generated app pieces. Idea files let a project describe models and metadata once, then let Stackpress produce schema, SQL, admin, view, and client output from that source.
- **310 Idea Files** - Learn how `.idea` files act as structured app modeling input. This group introduces the readable file shape, file composition through `use`, and plugin-facing declarations that decide which generators can participate.
- **311 Syntax** - Read the small part of `.idea` syntax needed for normal Stackpress schema authoring. The goal is not parser theory; it is recognizing declarations, values, attributes, and blocks well enough to understand the rest of the Idea lessons.
- **312 Use** - Use `use` to compose one idea file from another. This matters because Stackpress schemas often start from shared package definitions, and larger projects can split shared enums, props, types, or models into smaller files.
- **313 Plugins** - Understand where plugin declarations belong in `.idea` files and where Stackpress runtime plugins belong in TypeScript. The word plugin appears in both places, but the timing and responsibility are different.
- **320 Modeling** - Turn product language into Stackpress idea declarations. Modeling is where a feature stops being only a sentence and becomes entities, fields, fixed values, metadata, and relationships that generation can inspect.
- **321 Models** - Model one application entity with a name, display metadata, identity, and fields. A model is where product language becomes a source contract that Stackpress can generate from.
- **322 Fields** - Add typed fields to describe the data each model stores. Fields matter because a model name alone does not tell Stackpress what values exist, how those values should be edited, or how generated surfaces should display them.
- **323 Enums** - Use enums when a field should accept one value from a known set. Enums matter because they turn open-ended strings into named states that the schema, generated UI, and future developers can recognize.
- **324 Types** - Use types when the same structured value shape should appear in more than one place. A type is not a full model with its own store and admin pages; it is a reusable fieldset that can be generated into schema, TypeScript, and view helper output.
- **325 Props** - Props let an Idea file name a reusable metadata object and pass it into an attribute. They are useful when several fields need the same component settings, but each field should still show its label, validation, and generated surfaces.
- **326 Attributes** - Use attributes to tell Stackpress what a model or field means beyond its raw type. Attributes matter because generated admin, forms, filters, lists, and detail views need more information than `String`, `Boolean`, or `Datetime` can provide by themselves.
- **327 Relations** - Relate models by separating the stored key from the object connection. Relations matter because most apps are not just isolated rows; articles have authors, comments belong to articles, and join models connect records that need to be shown together.
- **330 Generation** - Inspect how idea input becomes Stackpress output. This group connects `schema.idea` declarations to generated schema classes, SQL stores and actions, admin/view pieces, and client-facing TypeScript.
- **331 Schema Output** - Trace `schema.idea` into generated schema classes before debugging higher-level behavior. Schema output matters because it is the first generated proof that Stackpress understood a model, its fields, its defaults, and its validation rules.
- **332 SQL Output** - Inspect generated stores and actions before writing custom SQL for common model behavior. SQL output matters because Stackpress turns schema meaning into table creation, selectors, relations, and event-style data operations.
- **333 View Output** - Inspect generated view-facing files when a generated form, list cell, detail field, or admin page looks wrong. View output matters because schema metadata such as `@field.*`, `@list.*`, and `@view.*` becomes concrete React components after generation.
- **334 Client Output** - Use generated client-facing TypeScript as an inspection map, not as a place to patch source by hand. Client output matters because Stackpress packages generated models, events, admin routes, tools, scripts, and exports into a readable folder that other runtime code can load.
- **340 Idea Plugin Authoring** - Learn when a requirement belongs in a custom idea generator instead of ordinary schema, route, or view code. Generator authoring is where a Stackpress plugin joins `stackpress generate`, reads the idea schema, and emits files into the generated client package.
- **341 ts-morph Plugins** - Generate or modify TypeScript safely inside a Stackpress idea generator. `ts-morph` lets a generator work with TypeScript source files as code structure instead of assembling large files through fragile strings.
- **342 Custom Generators** - Build a small generator that reads schema input and writes output through the normal idea transform pipeline. The goal is not to create a full plugin in one page; it is to understand the moving parts that make generator output predictable.
- **400 Build And Deploy** - Move from local development into generated output, production builds, and deployment targets. This level teaches how Stackpress exposes the shape of an app so build tools, hosting adapters, and deployment checks can reason about routes, views, events, assets, and runtime entrypoints.
- **410 Generate And Build** - Learn how Stackpress and Ingest expose application structure to build tools. This lesson focuses on server routes, lazy imports, entry files, views, and event listeners because those are the surfaces a bundler or deployment script needs to understand before it can produce useful output.
- **411 Generated Artifacts** - Generated artifacts are files and runtime state that Stackpress creates from source input. They matter because they are useful to inspect, but they are not usually the place where you fix product behavior.
- **412 Client Source** - `client-source` is readable generated TypeScript. It gives you a clear way to inspect what Stackpress generated without treating that output as hand-authored application code.
- **420 Local Production** - Local production checks help you catch problems that development mode can hide. The goal is to build the app with production-oriented config, serve it locally, and inspect routes, assets, and data before choosing a deployment target.
- **430 Schema Changes** - Schema changes are how the data model evolves after the app already has generated code and local data. The safe habit is to change the source, rerun generation, push the database change, and inspect the result.
- **440 Vercel** - Prepare a Stackpress or Ingest app for Vercel by matching the app's runtime shape to Vercel's function entrypoint. This lesson uses the Ingest Vercel example as the source, so it teaches the concrete adapter pattern instead of a generic deployment checklist.
- **450 Netlify** - Prepare a Stackpress or Ingest app for Netlify by matching the app's runtime shape to Netlify Functions. This lesson uses the Ingest Netlify example, so the focus stays on the real files that define the build command, redirect, function folder, and handler adapter.
- **460 Lambda / Serverless** - Package a Stackpress or Ingest handler for a serverless target by understanding the adapter boundary. This lesson uses the Lambda example as a source, but it also calls out where that example is incomplete so students do not mistake a static response for a full app bridge.
- **500 Project Structure** - Study the project layout after you have already built routes, views, data access, and generated output. Stackpress structure is easier to respect when each folder answers a problem you have already seen.
- **510 Project Anatomy** - Learn the main files and folders that make up the baseline Stackpress scaffold. This lesson uses the repository `stackpress-app-scaffold` skill as the source, because that skill defines the portable app shape new projects start from.
- **511 Source Of Truth** - A Stackpress project has two kinds of files: the files that describe what the app should be, and the files Stackpress creates from those descriptions. The first group is the source of truth. The second group is evidence you can inspect when you want to understand what generation produced.
- **512 Generated Output** - Generated output is how Stackpress shows its work. After the app reads schema, config, plugins, and generation rules, it writes files you can inspect to prove what it understood. Those files are valuable, but they are still the result of the source files you maintain.
- **520 Config** - Learn how configuration acts as the app bootstrap and orchestration surface. Stackpress config is where plugins, runtime behavior, build behavior, generated client output, database behavior, view behavior, and environment choices become visible before the app starts.
- **521 Config Splitting** - Config splitting is the moment when one launch plan becomes several focused launch plans. A small Stackpress app can start with one config file because there are not many choices to coordinate. As the app grows, development, production build, generated client inspection, and shared app settings begin to pull config in different directions.
- **530 Plugin Layout** - Plugin layout is how a Stackpress app keeps local behavior from becoming one large file. Routes, page handlers, views, database wiring, and integrations all need a home. A good plugin folder gives each responsibility a place where a junior developer can look first.
- **540 Public Assets** - Public assets are files the browser should be able to request directly. They are not route handlers, generated stores, or config objects. They are the images, favicons, stylesheets, and browser-ready files that support the pages your plugins render.
- **600 Built-ins** - Learn the framework capabilities that Stackpress can provide after the core app workflow is familiar. Built-ins cover authentication, sessions, account behavior, CSRF, email, language, components, and API/OAuth surfaces.
- **610 Authentication** - Learn authentication from the app developer perspective: which routes exist, which events run, and how successful sign-in becomes session state. The goal is to understand the built-in auth surface before customizing identity behavior.
- **611 Sign In** - Sign-in is the point where an anonymous browser request becomes a session that can reach private app behavior. The page looks like a form, but the flow is really a chain of checks: choose an auth type, protect the POST with CSRF, verify the credential, create a session cookie, and redirect the user.
- **612 Sign Up** - Sign-up is where Stackpress creates the identity that sign-in will later use. It is not just a form that saves a password. The flow creates a profile, adds one or more auth records for that profile, applies default roles, protects the POST with CSRF, and redirects the user back into the auth flow.
- **613 OTP / 2FA** - OTP and 2FA both ask the user for a short code, but they solve different problems in the Stackpress auth flow. Email OTP proves the user can receive a one-time challenge for an email auth record. App-based 2FA proves the user has an authenticator secret attached to their profile.
- **620 Roles And Permissions** - Learn how roles and session access rules shape what a signed-in user can reach. This lesson connects profile role data, signup defaults, session tokens, and route permission lists so authorization becomes visible app behavior instead of scattered conditionals.
- **621 Session Rules** - Session rules decide which roles can reach which routes or events. They are the gate between "this user is signed in" and "this user is allowed to do this specific thing." A session can prove who someone is, but access rules decide what that identity can touch.
- **630 Sessions And Account** - Learn how session state, profile data, account pages, and security pages work together around the current user. This group connects authentication results to the everyday account surfaces a signed-in user sees.
- **631 Profile** - Profile is the user-facing identity record in Stackpress Session. It is where the app stores the name, image, type, roles, tags, references, and active state that describe the person or entity behind a session. Auth records answer "how does this profile sign in?" while the profile answers "who is this?"
- **632 Account Pages** - Account pages are the built-in screens where a signed-in profile can inspect and manage its own data. They sit on top of session state, profile records, auth records, CSRF-protected forms, and built-in views. The pages are not admin pages; they are current-user pages.
- **633 Flash Messages** - Flash messages are one-time feedback messages that survive a redirect. They are useful when the server finishes a POST action, redirects the browser to a new page, and still needs the next page to say what happened.
- **640 CSRF** - Protect state-changing form flows with CSRF tokens. CSRF protection gives the app a way to prove that a submitted form came from a page the app rendered, instead of from another site trying to act as the current user.
- **650 Email** - Email lets a Stackpress app send information outside the request that triggered it. A browser response can show a page, but an email can carry an OTP, magic link, receipt, account notice, or other transactional message to the user after the request is complete.
- **660 i18n** - i18n is how a Stackpress app keeps user-facing text from being locked to one language. The framework path is practical: config defines the available languages, the language plugin remembers the active locale, the view helpers pass language data into page props, and React views call `useLanguage()` to render translated text.
- **661 Language Config** - Language config tells Stackpress which locales exist, which locale should be used first, and which translation map belongs to each locale. Without that config, a view hook has nothing predictable to read.
- **662 useLanguage** - `useLanguage()` is the view-side hook that turns configured translations into rendered text. Stackpress view exports it from `stackpress-view/client`, and some handwritten views import it directly from `r22n`. In both cases, the common pattern is to call `_()` with the phrase you want to render.
- **670 Components** - Components are the pieces a Stackpress page uses after the route has already decided what to show. Some pieces come from Stackpress view helpers, some come from Frui, and some are generated from `schema.idea` metadata. This group teaches how to tell those pieces apart before you try to change them.
- **671 frui Base Components** - Base components are the reusable UI pieces that keep Stackpress pages from rebuilding the same controls in every view. They are the layout shells, buttons, menus, notifications, and small interaction helpers that support a page before the page starts dealing with a specific form field or formatted data value.
- **672 frui Form Components** - Forms are where a model stops being an abstract shape and starts asking a user for input. Stackpress can generate form components from idea metadata, which means the field definition becomes the source of labels, input type, default value handling, relation search behavior, and validation messages.
- **673 frui View Components** - View components answer the question a form does not answer: once the value has been saved, how should the user see it? A raw date, image URL, relation ID, or HTML string may be technically correct, but it often needs formatting before it is useful on a list or detail page.
- **680 API / OAuth** - API and OAuth flows let another client use part of your Stackpress app without going through a normal page. That makes the route contract more important: the app has to know who is calling, which scopes they have, which event should run, and what response should be sent back.
- **700 Studio** - Understand Studio as a planned browser workbench for authoring Stackpress idea files. The current repository contains Studio plans and wireframes, not a finished package, so this level teaches the intended direction while keeping the source-first rule visible.
- **710 Schema Explorer** - Inspect models, fieldsets, enums, source files, imports, and diagnostics in a planned Studio workbench. This page is future-facing, so it focuses on how the explorer should help a developer read source-backed schema structure instead of promising a finished UI.
- **720 Fields** - Learn how planned Studio field editing should connect product rules to idea source and generated behavior. Fields carry much of a model's meaning, so a visual editor has to make field metadata easier to inspect without hiding the source that owns it.
- **721 Field Validation** - Understand how planned Studio validation editing should expose source-backed assertion attributes. Validation is where a field explains which values are acceptable before generated actions, forms, or runtime code trust the data.
- **730 Relations** - Understand how a planned Studio relation editor should visualize model relationships while preserving idea-file source mapping. Relations connect models, so the UI has to make the local field, foreign field, and optional relation name easy to inspect.
- **740 Generated Admin** - Generated admin output is the place where Stackpress turns schema metadata into usable management screens. Studio is planned as a workbench for inspecting and editing idea source, while generated admin is already a concrete output surface you can inspect in generated client output.
- **741 Admin Pages** - Admin pages are generated route handlers for common model workflows. They load config for the view layer, call model events such as search or create, and decide whether to return data, render a view, or redirect to another admin page.
- **742 Admin Views** - Admin views are generated React screens for the admin workflows. They read server props, use the shared admin layout, import generated field and format components, and render the visible search, create, update, detail, remove, and restore pages.
- **743 Admin Client** - Admin client code is the browser-safe support layer used by generated admin views. It exports the admin layout, query-string helpers, CSV import helpers, and types that generated React screens can import without pulling in server-only code.
- **750 Import / Export** - Understand import and export as planned Studio-adjacent workflows for moving source files or structured data across boundaries. The current Studio plans discuss source files, import graphs, source save behavior, and safe patches, but they do not define a finished production data import/export feature.
- **800 AI** - Learn how AI fits on top of Stackpress after the normal app workflow is familiar. AI can connect to a project, expose tools, generate artifacts, and guide app-building phases, but every AI result still needs source-backed verification.
- **810 MCP** - Learn how Stackpress exposes app behavior as MCP tools that an agent can call. MCP matters because it gives an AI assistant a structured way to ask the app for work instead of relying only on prose, shell commands, or guessed file edits.
- **811 stdio Transport** - Learn the local stdio transport path used by Stackpress AI. Stdio is useful for local agent tools because the agent process can start Stackpress and communicate through standard input and output instead of opening a browser route first.
- **820 Artifacts** - Treat AI-generated artifacts as drafts, generated output, or verification evidence depending on how they were produced. The important question is not whether an artifact looks polished; it is whether the current Stackpress project proves where that output belongs.
- **830 Hooks** - Learn how to think about AI-related extension points without pretending every planned hook is already documented. Hooks are powerful because they run at a specific moment in the workflow, so the first job is to know which moments are confirmed by source and which still need owner clarification.
- **831 AI Events** - Inspect the runtime events that Stackpress AI uses to start MCP transports. These events are not a generic AI automation API; they are confirmed entrypoints that connect configured MCP tools through stdio, HTTP, or SSE.
- **832 Transform Hooks** - Inspect the generation-time transform path that Stackpress AI uses to emit tool output. Transform hooks matter because some AI-facing behavior should be generated from schema before runtime starts, not reconstructed during a request.
- **840 Skills** - Learn Stackpress skills as portable agent workflows for building apps in phases. A skill gives an agent a smaller job, a source boundary, and a handoff expectation, which is safer than asking one broad prompt to discover, scaffold, model, implement, and verify an app all at once.
- **841 Skill Workflow** - Map a product request to the next Stackpress skill in the recommended workflow. The goal is to keep AI-assisted app work sequenced, so a developer can tell what phase the project is in and what evidence is needed before moving forward.
- **842 App Discovery Skill** - Use `stackpress-app-discovery` to turn a vague product request into a buildable app brief. This skill matters because a Stackpress app cannot be modeled, scaffolded, or routed safely until the main product nouns, users, flows, and open questions are visible.
- **843 App Coordinator Skill** - Use `stackpress-app-coordinator` to sequence a Stackpress app build after discovery. The coordinator matters because even a clear app brief can fail if scaffold, schema, generation, plugin work, and verification happen in the wrong order.
- **844 Scaffold Skill** - Use `stackpress-app-scaffold` to create the baseline app files before product-specific schema, generation, or plugin work begins. Scaffolding matters because later phases need a predictable project shape to build on.
- **845 Idea Authoring Skill** - Use `stackpress-idea-authoring` to turn a product brief into a Stackpress `schema.idea` contract. This skill matters because Stackpress uses idea files as more than database shape; they also influence generated schema, SQL, admin, and view behavior.
- **846 Plugin Skills** - Use Stackpress plugin skills to decide where handwritten or generated feature work belongs. This matters because a feature can be schema work, runtime plugin work, page/view work, or generation work, and the wrong lane creates fragile code.
- **847 Verification Skill** - Use `stackpress-app-verification` as the phase gate before moving on. Verification matters because a Stackpress phase is complete only when current files, command output, generated artifacts, plugin wiring, or runtime behavior prove it.
