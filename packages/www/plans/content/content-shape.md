# Stackpress Content Shape Plan

This document assigns a better documentation shape to each course draft in
`packages/www/plans/content/`. The goal is to stop using the same generic
sections everywhere and instead match each page to the kind of lesson a junior
developer needs.

The current drafts often repeat `Start Here`, `Quick Start`, and `What Just
Happened`. Those headings should only be used when they fit the page. Most
Stackpress pages need more specific section titles that name the actual task,
concept, or decision.

## Source Review

These recommendations are based on Stackpress source/spec context and the
following external documentation patterns:

- [Next.js Getting Started](https://nextjs.org/docs/app/getting-started) uses
  short orientation pages and focused topic pages with concrete subtopics.
- [Next.js Guides](https://nextjs.org/docs/app/guides) separates guide topics
  by task, such as authentication, debugging, deployment, forms, and testing.
- [Laravel Learn](https://laravel.com/learn) presents learning as a course path
  and keeps early lessons practical and progressive.
- [Laravel Getting Started](https://laravel.com/learn/getting-started-with-laravel)
  frames a first project around installation, environment setup, and visible
  progress.
- [NestJS Documentation](https://docs.nestjs.com/) and
  [NestJS First Steps](https://docs.nestjs.com/first-steps) use precise concept
  headings, code-led examples, and framework vocabulary instead of a single
  repeated lesson skeleton.

## Global Rules

- Pick the page shape from the reader's job: learn a concept, build something,
  choose an option, inspect generated output, or debug a problem.
- Keep the early runtime path unopinionated about folder structure. It should
  teach Stackpress as a runtime and plugin system that can start with very
  little structure, closely following the Ingest guide style where possible.
- Start recommending a specific project structure in the `400` level and
  later. By that point, the reader has already seen routes, views, data,
  generation, and deployment, so folder guidance has a reason to exist.
- Use headings that describe the actual Stackpress surface: `Create the App`,
  `Read the Generated Store`, `Choose a Database Dialect`, `Protect the Form`,
  and similar.
- Keep each page narrow. A course page should teach the local topic, not become
  the full reference page.
- Put code before theory when the page is hands-on. Put the mental model before
  code when the page is conceptual.
- End with verification whenever the reader changed files, ran a command, or
  inspected generated output.
- End with a small next-step section when the page naturally feeds another
  course.

## Shape Catalog

Use these shapes as reusable templates. Rename individual headings to fit the
specific lesson, but preserve the intent of the section.

### Concept Brief

Use for mental models, framework boundaries, and vocabulary.

- `What This Means`: define the idea in plain language.
- `Why It Matters`: explain the practical reason the reader should care.
- `How It Fits`: connect the idea to Stackpress packages, templates, or files.
- `Small Example`: show a tiny code or file example.
- `Next Step`: point to the next concrete lesson.

### Hands-On Build

Use when the reader creates or edits files and should see working output.

- `Goal`: describe the visible result.
- `Before You Start`: list prerequisites, expected folder, and assumptions.
- `Create or Change Files`: walk through the edits.
- `Run It`: give the command or local workflow.
- `Check It`: tell the reader what success looks like.
- `Keep In Mind`: explain the one or two concepts behind the build.

### Workflow Guide

Use for commands, repeated processes, and operational sequences.

- `When To Use This`: define the scenario.
- `Workflow`: show the ordered process.
- `Command Map`: explain commands and important flags.
- `Verify`: show expected output, files, or behavior.
- `Common Failures`: explain likely mistakes and fixes.
- `Next Step`: connect to the next workflow.

### Decision Guide

Use when the reader must choose between options.

- `The Decision`: state what is being chosen.
- `Recommended Default`: give the junior-friendly path first.
- `Options`: compare the valid choices.
- `Tradeoffs`: explain cost, complexity, and when to switch.
- `Example Choice`: show one realistic project choice.
- `Next Step`: link to implementation.

### API Usage Guide

Use for request, response, hooks, components, helpers, and framework APIs.

- `Use Case`: describe when this API is used.
- `Minimal Example`: show the smallest useful example.
- `How It Works`: explain the moving parts.
- `Common Patterns`: show 2-3 practical variations.
- `Mistakes To Avoid`: call out junior-level pitfalls.
- `Reference Pointers`: name the related package, helper, or source file.

### Modeling Guide

Use for `schema.idea`, models, fields, relations, generated outputs, and schema
authoring.

- `Modeling Goal`: describe the domain rule being modeled.
- `Idea Example`: show the idea syntax.
- `Generated Effect`: explain the generated schema, SQL, view, or client code.
- `Authoring Rules`: define constraints and naming expectations.
- `Inspect Output`: show where to confirm generation worked.
- `Next Step`: connect to related modeling topics.

### Data Operation Guide

Use for select, insert, update, delete, raw SQL, and transactions.

- `Operation Goal`: state the database operation in product terms.
- `Inputs`: identify params, form values, session data, or body data.
- `Query or Action`: show the Stackpress query/action code.
- `Return or Redirect`: explain the response path.
- `Verify Data`: show how to confirm the data changed or loaded.
- `Common Mistakes`: explain validation, missing filters, and unsafe writes.

### Security Flow Guide

Use for authentication, sessions, CSRF, profile/account pages, email, and OAuth.

- `Flow Goal`: define the user or security flow.
- `Config Surface`: show the configuration that enables it.
- `Request Flow`: explain the route, handler, session, and response path.
- `User Feedback`: describe redirects, flash messages, or form states.
- `Security Checks`: explain what must be protected.
- `Verify`: show expected behavior and failure behavior.

### Inspection Guide

Use for generated files, debugging, client source, admin output, and artifact
review.

- `What You Are Looking For`: state the evidence the reader needs.
- `Where To Look`: list files, directories, or commands.
- `Inspect Step By Step`: walk through the check.
- `Expected Evidence`: describe correct output.
- `Fix The Source`: explain what source file should change when output is wrong.
- `Next Step`: connect to the next inspection or build task.

### Planning Guide

Use for future-facing, deployment, or partially implemented areas.

- `Current Status`: explain what exists today.
- `Intended Workflow`: describe the target workflow.
- `What Exists Today`: identify usable files, packages, or commands.
- `What To Verify`: list checks before relying on it.
- `Open Questions`: name uncertain or future work.
- `Next Step`: direct the reader to stable material.

### Skill Workflow

Use for AI skill and agent workflow pages.

- `Skill Purpose`: explain the job of the skill.
- `Use It When`: list the task signals.
- `Inputs`: describe files, prompts, or project context needed.
- `What It Produces`: describe generated files, decisions, or handoffs.
- `Handoff`: explain the next skill or human review point.
- `Verification`: show how to confirm the skill did the job.

## Source Legend

Use these source buckets to determine technical content. Local package links are repo-relative where possible; sibling library paths are absolute because they live outside this workspace.

 - `stackpress-schema` = [stackpress-schema](packages/stackpress-schema/)
 - `stackpress-server` = [stackpress-server](packages/stackpress-server/)
 - `stackpress-sql` = [stackpress-sql](packages/stackpress-sql/)
 - `stackpress-view` = [stackpress-view](packages/stackpress-view/)
 - `stackpress-csrf` = [stackpress-csrf](packages/stackpress-csrf/)
 - `stackpress-session` = [stackpress-session](packages/stackpress-session/)
 - `stackpress-email` = [stackpress-email](packages/stackpress-email/)
 - `stackpress-language` = [stackpress-language](packages/stackpress-language/)
 - `stackpress-api` = [stackpress-api](packages/stackpress-api/)
 - `stackpress-admin` = [stackpress-admin](packages/stackpress-admin/)
 - `stackpress-ai` = [stackpress-ai](packages/stackpress-ai/)
 - `stackpress-studio` = [stackpress-studio](packages/stackpress-studio/)
 - `specs` = [specs](specs/)
 - `templates` = [templates](templates/)
 - `skills` = [skills](skills/)
 - `lib` = `/Users/cblanquera/server/projects/stackpress/lib/specs`
 - `idea` = `/Users/cblanquera/server/projects/stackpress/idea/specs`
 - `ingest` = `/Users/cblanquera/server/projects/stackpress/ingest/specs`
 - `inquire` = `/Users/cblanquera/server/projects/stackpress/inquire/specs`
 - `reactus` = `/Users/cblanquera/server/projects/stackpress/reactus/specs`
 - `frui` = `/Users/cblanquera/server/projects/stackpress/frui/src`
 - `r22n` = `/Users/cblanquera/server/projects/stackpress/r22n/src`

## Course Shape Map

### 000 Orientation

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `000-orientation.md` | Concept Brief | `What This Course Path Is` -> `How Progress Works` -> `How To Read Ahead` -> `Where Reference Fits` -> `Next Step` | Keep this as site/course orientation, not Stackpress technical explanation. |
| `001-what-stackpress-is.md` | Concept Brief | `The Short Version` -> `The Four Projects Under Stackpress` -> `What Stackpress Adds On Top` -> `How The Pieces Work Together` -> `What To Remember First` | Explain Ingest, Inquire, Reactus, Idea, and Stackpress built-ins without becoming a full framework reference. |
| `002-getting-started.md` | Hands-On Build | `Goal` -> `Create the App` -> `Open the Project` -> `Run the First Command` -> `Understand What You Created` -> `Read The Logs` -> `Check the Files` -> `What You Now Have` | Replaces the old scaffold/dev-server split and keeps first success plus log-reading in one page. |

### 100 Develop

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `100-develop.md` | Concept Brief | `Why Development Comes First` -> `What This Level Covers` -> `What Stays Unopinionated` -> `How To Use This Level` -> `Next Step` | Restored as the runtime overview; defer prescribed folder structure to `500 Project Structure`. |
| `110-plugins.md` | Concept Brief | `What Plugins Do` -> `Why Stackpress Uses Them` -> `Framework Plugins And App Plugins` -> `Small Example` -> `Next Step` | Parent page should introduce plugin boundaries before `111` and `112` teach composition and local ownership. |
| `111-composition.md` | Concept Brief | `What Composition Means` -> `Packages And Plugins` -> `How Configuration Wires Them` -> `Small Example` -> `Next Step` | This is a mental model page. |
| `112-local-plugins.md` | Hands-On Build | `Goal` -> `Create A Local Plugin` -> `Register It` -> `Add A Route Or Event` -> `Run And Check` -> `What The Plugin Owns` | Teach plugin ownership through a tiny working plugin. |
| `120-pages.md` | Concept Brief | `What A Page Handler Does` -> `Route To Handler To Response` -> `Request And Response Inputs` -> `Small Example` -> `Next Step` | Parent page should preview pages without duplicating the request and response API pages. |
| `121-request.md` | API Usage Guide | `Use Case` -> `Minimal Handler` -> `Read Params And Body` -> `Read Session Or Headers` -> `Mistakes To Avoid` -> `Reference Pointers` | Keep examples request-focused and verify against current Ingest request specs. |
| `122-response.md` | API Usage Guide | `Use Case` -> `Return HTML Or JSON` -> `Redirect` -> `Set Status And Headers` -> `Mistakes To Avoid` -> `Reference Pointers` | Pair response examples with request handlers and verify against current Ingest response specs. |
| `123-data-surfaces.md` | Concept Brief | `What Data Surfaces Are` -> `Request Data` -> `Config Data` -> `Generated Data` -> `How To Choose` -> `Next Step` | Use Ingest and Lib specs to explain the actual data surfaces; avoid generic bucket language. |
| `124-session.md` | API Usage Guide | `Use Case` -> `Read From req.session` -> `Write To res.session` -> `How The Store Works` -> `Mistakes To Avoid` -> `Reference Pointers` | Focus on the request/response session interfaces; auth access rules belong in `621 Session Rules`. |
| `125-nest.md` | API Usage Guide | `Use Case` -> `Read Values` -> `Read Paths` -> `Write Values` -> `Inspect And Iterate` -> `Parse Input Shapes` -> `Mistakes To Avoid` -> `Reference Pointers` | Teach the `Nest` helper from `@stackpress/lib` as the shared nested data interface. |
| `130-events.md` | Concept Brief | `Why Events Exist` -> `The Route-To-Event Split` -> `Events Are Reusable` -> `Register Event Listeners` -> `Emit Or Resolve` -> `Mistakes To Avoid` -> `Next Step` | Teach events as reusable business-rule boundaries that receive `{ req, res, ctx }`; terminal execution belongs in `131`. |
| `131-terminal-events.md` | Workflow Guide | `When To Emit Events` -> `Event Workflow` -> `Command Map` -> `Verbose Output` -> `Common Failures` -> `Next Step` | Teach terminal event use as another medium for the same reusable event behavior. |
| `140-views.md` | Concept Brief | `What Views Render` -> `How Page Data Reaches React` -> `Layouts Props And Client Helpers` -> `Small Example` -> `Next Step` | Parent page should introduce the React view path before the first-page walkthrough. |
| `141-first-react-page.md` | Hands-On Build | `Goal` -> `Create The View` -> `Add The Route` -> `Render Data` -> `Check In Browser` -> `What The Page Owns` | Use `specs/guides/start/02-first-react-page.md` plus `stackpress-view`; Ingest view docs are template-engine agnostic. |
| `142-server-props.md` | API Usage Guide | `Use Case` -> `Minimal Server Props` -> `Load Data` -> `Pass Data To The View` -> `Mistakes To Avoid` -> `Reference Pointers` | Tie server props directly to page rendering. |
| `143-layouts.md` | Concept Brief | `What Layouts Do` -> `Where Layouts Live` -> `Wrap A Page` -> `Shared UI Boundaries` -> `Next Step` | Explain composition and reuse, then show a small example. |
| `144-language.md` | API Usage Guide | `Use Case` -> `Minimal Translation` -> `Load Language Config` -> `Switch Or Read Locale` -> `Mistakes To Avoid` -> `Reference Pointers` | Keep language as app behavior, not general i18n theory. |
| `145-theme.md` | API Usage Guide | `Use Case` -> `Minimal Theme Setup` -> `Apply Theme Values` -> `Override Safely` -> `Mistakes To Avoid` -> `Reference Pointers` | Show theme as configuration plus view usage. |
| `146-notifier.md` | API Usage Guide | `Use Case` -> `Show A Message` -> `Trigger From Handler` -> `Render In View` -> `Mistakes To Avoid` -> `Reference Pointers` | Pair notifier with form or action feedback. |
| `150-hooks.md` | API Usage Guide | `Why Hooks Exist` -> `Request And Response Hooks` -> `User-Defined Startup Hooks` -> `Build An Error Hook` -> `Render The Error View` -> `Mistakes To Avoid` -> `Next Step` | Cover `request`, `response`, and user-defined `config`/`listen`/`route` hooks, then use the blog error hook as the practical example. |
| `160-debugging-and-inspection.md` | Inspection Guide | `What You Are Looking For` -> `Where To Look` -> `Inspect Logs And Output` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | This page should teach a repeatable debugging loop. |

### 200 Data

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `200-data.md` | Concept Brief | `What Data Means In Stackpress` -> `Connections Querying And Stores` -> `How Data Moves Through A Page` -> `Course Path` -> `Next Step` | Overview `210` through `233`; keep this conceptual and leave Idea/source-model changes to the new `300 Idea` level. |
| `210-connections.md` | Decision Guide | `The Decision` -> `Recommended Default` -> `Connection Options` -> `Tradeoffs` -> `Example Choice` -> `Next Step` | Parent page should explain choosing a database connection before dialect-specific lessons. |
| `211-dialects.md` | Decision Guide | `The Decision` -> `Recommended Default` -> `Dialect Options` -> `Tradeoffs` -> `Example Choice` -> `Next Step` | Start with SQLite/PGlite as the easiest path unless source context says otherwise. |
| `212-sqlite-pglite.md` | Hands-On Build | `Goal` -> `Configure The Local Database` -> `Run The App` -> `Generate Or Push Schema` -> `Check Data` -> `Keep In Mind` | Practical local database setup. |
| `213-postgresql.md` | Decision Guide | `The Decision` -> `When PostgreSQL Fits` -> `Connection Config` -> `Migration Or Push Flow` -> `Tradeoffs` -> `Verify` | Production-oriented, but still concrete. |
| `214-mysql.md` | Decision Guide | `The Decision` -> `When MySQL Fits` -> `Connection Config` -> `Migration Or Push Flow` -> `Tradeoffs` -> `Verify` | Mirror PostgreSQL shape for consistency. |
| `220-engine.md` | Concept Brief | `What The Query Engine Does` -> `Stores Actions And Builders` -> `How Generated Code Uses It` -> `Small Example` -> `Next Step` | Parent page should introduce Inquire/SQL mechanics without becoming query reference. |
| `221-select.md` | Data Operation Guide | `Operation Goal` -> `Inputs` -> `Build The Select` -> `Return Results` -> `Verify Data` -> `Common Mistakes` | Teach filtering and output shape. |
| `222-insert.md` | Data Operation Guide | `Operation Goal` -> `Inputs` -> `Build The Insert` -> `Return Or Redirect` -> `Verify Data` -> `Common Mistakes` | Include validation and generated IDs if relevant. |
| `223-update.md` | Data Operation Guide | `Operation Goal` -> `Inputs` -> `Find The Row` -> `Apply Changes` -> `Verify Data` -> `Common Mistakes` | Emphasize filters and ownership checks. |
| `224-delete.md` | Data Operation Guide | `Operation Goal` -> `Inputs` -> `Find The Row` -> `Delete Or Soft Delete` -> `Verify Data` -> `Common Mistakes` | Emphasize destructive action safeguards. |
| `230-querying.md` | Concept Brief | `What Querying Solves` -> `Generated Stores Versus Handwritten Queries` -> `Read Write Raw And Transaction Paths` -> `Small Example` -> `Next Step` | Parent page should help readers choose the next operation page. |
| `231-raw-sql.md` | Data Operation Guide | `Operation Goal` -> `When Raw SQL Is Appropriate` -> `Write The Query` -> `Bind Inputs` -> `Verify Data` -> `Common Mistakes` | Focus on safe input binding. |
| `232-transactions.md` | Data Operation Guide | `Operation Goal` -> `When A Transaction Is Needed` -> `Wrap The Operations` -> `Handle Failure` -> `Verify Data` -> `Common Mistakes` | Explain all-or-nothing behavior with a realistic example. |
| `233-json-fields.md` | Data Operation Guide | `Operation Goal` -> `Store Flexible Data` -> `Query A Nested Value` -> `Use JSON Helper Filters` -> `Inspect Dialect Behavior` -> `Common Mistakes` -> `Next Step` | Keep this page query-focused because Idea files are introduced later. Teach JSONB-style path filters such as `article.data:seo.title` without requiring generated model context. |

### 300 Idea

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `300-idea.md` | Concept Brief | `What Idea Files Do` -> `Source To Generated Output` -> `Models Fields Relations And Plugins` -> `Course Path` -> `Next Step` | Overview `310` through `342`; introduce Idea before build/deploy because generation and schema changes depend on it. |
| `310-idea-files.md` | Concept Brief | `What Lives In An Idea File` -> `Syntax Use And Plugins` -> `How Imports Merge` -> `Small Example` -> `Next Step` | Parent page for idea authoring basics before individual syntax topics. |
| `311-syntax.md` | Modeling Guide | `Modeling Goal` -> `Idea Example` -> `Syntax Rules` -> `Generated Effect` -> `Inspect Output` -> `Next Step` | Treat syntax as authoring, not reference. |
| `312-use.md` | Modeling Guide | `Modeling Goal` -> `Use Another Model` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Show why `use` exists through generation. |
| `313-plugins.md` | Modeling Guide | `Modeling Goal` -> `Plugin Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Explain idea plugins by output changes. |
| `320-modeling.md` | Concept Brief | `What Modeling Means` -> `Models Fields Types And Relations` -> `From Product Rule To Schema` -> `Small Example` -> `Next Step` | Parent page should connect product thinking to child modeling pages. |
| `321-models.md` | Modeling Guide | `Modeling Goal` -> `Model Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Core model authoring page. |
| `322-fields.md` | Modeling Guide | `Modeling Goal` -> `Field Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Include field naming and type behavior. |
| `323-enums.md` | Modeling Guide | `Modeling Goal` -> `Enum Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Show where enum values are enforced. |
| `324-types.md` | Modeling Guide | `Modeling Goal` -> `Type Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Distinguish idea types from TypeScript output. |
| `325-props.md` | Modeling Guide | `Modeling Goal` -> `Prop Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Explain props as generated view/API metadata if source confirms. |
| `326-attributes.md` | Modeling Guide | `Modeling Goal` -> `Attribute Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Use examples from specs/source. |
| `327-relations.md` | Modeling Guide | `Modeling Goal` -> `Relation Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Idea relations were based on Prisma relations. Follow Prisma's stronger teaching pattern while explaining Stackpress syntax. |
| `330-generation.md` | Inspection Guide | `What Generation Produces` -> `Where Output Lives` -> `Inspect Step By Step` -> `Expected Evidence` -> `Next Step` | Parent page should establish source-to-output discipline before specific output inspections. |
| `331-schema-output.md` | Inspection Guide | `What You Are Looking For` -> `Where Schema Output Lives` -> `Inspect Classes` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Focus on generated schema classes. |
| `332-sql-output.md` | Inspection Guide | `What You Are Looking For` -> `Where SQL Output Lives` -> `Inspect Stores And Actions` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Focus on generated SQL artifacts. |
| `333-view-output.md` | Inspection Guide | `What You Are Looking For` -> `Where View Output Lives` -> `Inspect Components` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Focus on generated views/components. |
| `334-client-output.md` | Inspection Guide | `What You Are Looking For` -> `Where Client Output Lives` -> `Inspect Client Types` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | After generation, show how to import and use the generated client plugin. |
| `340-idea-plugin-authoring.md` | Concept Brief | `What Generator Plugins Do` -> `Generation Versus Runtime` -> `Transform Entrypoints` -> `Small Example` -> `Next Step` | Parent page for advanced idea plugin authoring before ts-morph and custom generator workflows. |
| `341-ts-morph-plugins.md` | Workflow Guide | `When To Use Ts Morph` -> `Generator Workflow` -> `Transform Source` -> `Inspect Output` -> `Common Failures` -> `Next Step` | Follow `/Users/cblanquera/server/projects/stackpress/idea/specs/examples/ts-morph-plugin-guide.md` and include `skills/stackpress-plugin-idea-generator/references/ts-morph-common-methods.md`. |
| `342-custom-generators.md` | Workflow Guide | `When To Write A Generator` -> `Generator Workflow` -> `Register It` -> `Inspect Output` -> `Common Failures` -> `Next Step` | Use `skills/stackpress-plugin-idea-generator/references` for how to author one. |

### 400 Build And Deploy

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `400-build-and-deploy.md` | Concept Brief | `What Build And Deploy Means` -> `Generate Then Build` -> `Artifacts And Adapters` -> `Deployment Path` -> `Next Step` | Overview `410` through `460`; keep platform-specific caveats in child pages. |
| `410-generate-and-build.md` | Workflow Guide | `When To Generate And Build` -> `Workflow` -> `Command Map` -> `Verify Output` -> `Common Failures` -> `Next Step` | Parent workflow for generation/build before artifact inspection pages. |
| `411-generated-artifacts.md` | Inspection Guide | `What You Are Looking For` -> `Where Artifacts Live` -> `Read Generated Files` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Good place to explain generated output ownership. |
| `412-client-source.md` | Inspection Guide | `What You Are Looking For` -> `Where Client Source Lives` -> `Inspect Generated Types` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Keep troubleshooting focused on generated client code. |
| `420-local-production.md` | Workflow Guide | `When To Use Local Production` -> `Build` -> `Run Production Locally` -> `Verify Routes And Assets` -> `Common Failures` -> `Next Step` | Concrete build/run/check page. |
| `430-schema-changes.md` | Workflow Guide | `When Schema Changes` -> `Edit The Source` -> `Generate Or Push` -> `Inspect The Diff` -> `Common Failures` -> `Next Step` | Moved from the data section because Idea files must be introduced first. |
| `440-vercel.md` | Planning Guide | `Current Status` -> `Intended Vercel Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Use `/Users/cblanquera/server/projects/stackpress/ingest/examples/with-vercel`. |
| `450-netlify.md` | Planning Guide | `Current Status` -> `Intended Netlify Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Use `/Users/cblanquera/server/projects/stackpress/ingest/examples/with-netlify`. |
| `460-lambda-serverless.md` | Planning Guide | `Current Status` -> `Intended Serverless Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Use `/Users/cblanquera/server/projects/stackpress/ingest/examples/with-lambda`; avoid over-promising beyond that example. |

### 500 Project Structure

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `500-project-structure.md` | Concept Brief | `Why Structure Starts Here` -> `Source And Generated Boundaries` -> `Config Plugins And Public Assets` -> `Recommended Shape` -> `Next Step` | First level that may recommend concrete project organization. |
| `510-project-anatomy.md` | Concept Brief | `What The Project Contains` -> `Source Files` -> `Generated Files` -> `Runtime Files` -> `Next Step` | Parent anatomy page before source-of-truth and generated-output details. |
| `511-source-of-truth.md` | Decision Guide | `The Decision` -> `Recommended Default` -> `Source Files` -> `Generated Files` -> `Tradeoffs` -> `Next Step` | Make ownership rules explicit. |
| `512-generated-output.md` | Inspection Guide | `What You Are Looking For` -> `Where Output Lives` -> `Inspect Output` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Pair with source-of-truth page. |
| `520-config.md` | Decision Guide | `The Decision` -> `Recommended Default` -> `Config Surfaces` -> `Tradeoffs` -> `Example Split` -> `Next Step` | Home for plugin config; explain config after readers know runtime and project shape. |
| `521-config-splitting.md` | Decision Guide | `The Decision` -> `Recommended Default` -> `Config Files` -> `Tradeoffs` -> `Example Split` -> `Next Step` | Teach config organization by project size after moving plugin config into `520 Config`. Use `specs/api/config-reference.md` for complete config behavior. |
| `530-plugin-layout.md` | Workflow Guide | `When To Create A Plugin` -> `Folder Layout` -> `Register Entrypoints` -> `Verify Loading` -> `Common Failures` -> `Next Step` | Use concrete folders from templates. |
| `540-public-assets.md` | Hands-On Build | `Goal` -> `Add An Asset` -> `Reference It In A View` -> `Run And Check` -> `Asset Rules` -> `Next Step` | Small visual success page. |

### 600 Built Ins

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `600-built-ins.md` | Concept Brief | `What Built Ins Provide` -> `Config Plus Runtime Flow` -> `Auth Session CSRF Email Language Components And OAuth` -> `Course Path` -> `Next Step` | Overview `610` through `680`; child pages carry package-specific source details. |
| `610-authentication.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Auth Routes And Events` -> `Session Result` -> `Security Checks` -> `Next Step` | Parent auth page before sign-in, sign-up, and OTP/2FA details. |
| `611-sign-in.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Sign In Request Flow` -> `User Feedback` -> `Security Checks` -> `Verify` | Use `packages/stackpress-session/src/auth`; cover `/auth/signin`, `/auth/signup`, and `/auth/signout` at the parent auth level, and teach route priority overrides. |
| `612-sign-up.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Sign Up Request Flow` -> `User Feedback` -> `Security Checks` -> `Verify` | Include account creation and duplicate handling. |
| `613-otp-2fa.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `OTP Request Flow` -> `User Feedback` -> `Security Checks` -> `Verify` | Keep 2FA sequence explicit. |
| `620-roles-and-permissions.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Role Storage And Access Rules` -> `Allowed And Blocked Paths` -> `Security Checks` -> `Next Step` | Parent role/access page; detailed rule evaluation belongs in `621`. |
| `621-session-rules.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Rule Evaluation` -> `Allowed And Blocked Paths` -> `Security Checks` -> `Verify` | Teach config setup: routes are whitelisted by default, profile roles live in `packages/stackpress-session/schema.idea`, auth can set default signup roles, and `session.access` is separated by role. |
| `630-sessions-and-account.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Session And Account Routes` -> `User Feedback` -> `Security Checks` -> `Next Step` | Parent account page before profile, account pages, and flash messages. |
| `631-profile.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Profile Request Flow` -> `User Feedback` -> `Security Checks` -> `Verify` | Use `packages/stackpress-session/src/profile`; cover account/security pages at the parent account level and teach route priority overrides. |
| `632-account-pages.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Account Page Flow` -> `User Feedback` -> `Security Checks` -> `Verify` | Explain built-in pages as route/view pairs. |
| `633-flash-messages.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Set A Flash Message` -> `Render Feedback` -> `Security Checks` -> `Verify` | Security shape still fits because messages depend on request/session flow. |
| `640-csrf.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Protected Request Flow` -> `Failure Behavior` -> `Security Checks` -> `Verify` | Use `packages/stackpress-session/src/auth/pages/signin.ts` as the real CSRF usage example. |
| `650-email.md` | Workflow Guide | `When To Send Email` -> `Configure Sender` -> `Emit Or Call Send` -> `Verify Delivery` -> `Common Failures` -> `Next Step` | Email is operational more than conceptual. |
| `660-i18n.md` | Concept Brief | `What Internationalization Changes` -> `Config And View Translation` -> `Locale Selection` -> `Small Example` -> `Next Step` | Parent language page before config and hook API details. |
| `661-language-config.md` | API Usage Guide | `Use Case` -> `Minimal Config` -> `Load Translations` -> `Common Patterns` -> `Mistakes To Avoid` -> `Reference Pointers` | Add coverage for `packages/stackpress-session/src/session/Session.ts`. |
| `662-uselanguage.md` | API Usage Guide | `Use Case` -> `Minimal Hook Example` -> `How The Hook Works` -> `Common Patterns` -> `Mistakes To Avoid` -> `Reference Pointers` | Focus on `_()` over `t()`. |
| `670-components.md` | Concept Brief | `What Components Provide` -> `Base Form And View Components` -> `Generated And Handwritten Usage` -> `Small Example` -> `Next Step` | Parent component page before FRUI component families. |
| `671-frui-base-components.md` | API Usage Guide | `Use Case` -> `Minimal Component` -> `Props And State` -> `Common Patterns` -> `Mistakes To Avoid` -> `Reference Pointers` | Use `packages/stackpress-view/src/client` and session package views for component examples. |
| `672-frui-form-components.md` | API Usage Guide | `Use Case` -> `Minimal Form` -> `Validation And Submission` -> `Common Patterns` -> `Mistakes To Avoid` -> `Reference Pointers` | Should include form state and submit flow. |
| `673-frui-view-components.md` | API Usage Guide | `Use Case` -> `Minimal View Component` -> `Data And Props` -> `Common Patterns` -> `Mistakes To Avoid` -> `Reference Pointers` | Focus on generated/view composition usage. |
| `680-api-oauth.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `OAuth Request Flow` -> `Token Or Session Result` -> `Security Checks` -> `Verify` | OAuth needs security-first framing. |

### 700 Studio

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `700-studio.md` | Planning Guide | `Current Status` -> `Intended Studio Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Parent page must be explicit that Studio is future-facing and source-limited. |
| `710-schema-explorer.md` | Planning Guide | `Current Status` -> `Intended Explorer Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Studio is not built out yet; make best guesses from `packages/stackpress-studio/plans`. |
| `720-fields.md` | Planning Guide | `Current Status` -> `Intended Field Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Parent page should bridge idea field authoring to future Studio editing. |
| `721-field-validation.md` | Modeling Guide | `Modeling Goal` -> `Validation Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | If Studio UI is future-facing, add a status note. |
| `730-relations.md` | Modeling Guide | `Modeling Goal` -> `Relation Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Tie to idea relations and Studio visualization. |
| `740-generated-admin.md` | Inspection Guide | `What You Are Looking For` -> `Where Admin Output Lives` -> `Inspect Routes Views And Client` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Parent page for admin generation before the specific output pages. |
| `741-admin-pages.md` | Inspection Guide | `What You Are Looking For` -> `Where Admin Pages Live` -> `Inspect Routes` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Admin output should be inspected from generated/source files. |
| `742-admin-views.md` | Inspection Guide | `What You Are Looking For` -> `Where Admin Views Live` -> `Inspect Components` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Keep view customization boundaries clear. |
| `743-admin-client.md` | Inspection Guide | `What You Are Looking For` -> `Where Admin Client Output Lives` -> `Inspect Client Code` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Pair with generated client output without repeating it. |
| `750-import-export.md` | Workflow Guide | `When To Import Or Export` -> `Workflow` -> `Command Or UI Map` -> `Verify` -> `Common Failures` -> `Next Step` | If Studio UI is future-facing, mark current implementation status. |

### 800 AI

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `800-ai.md` | Concept Brief | `What AI Adds` -> `MCP Artifacts Hooks And Skills` -> `Implemented Versus Planned Surfaces` -> `Course Path` -> `Next Step` | Overview `810` through `847`; keep package AI and repository skills as separate source domains. |
| `810-mcp.md` | Concept Brief | `What MCP Connects` -> `Server Tools And Transport` -> `Config Shape` -> `Small Example` -> `Next Step` | Parent MCP page before stdio transport workflow. |
| `811-stdio-transport.md` | Workflow Guide | `When To Use Stdio` -> `Transport Workflow` -> `Command Map` -> `Verify Connection` -> `Common Failures` -> `Next Step` | Scan `packages/stackpress-ai/src`; use `templates/blog/config/common.ts` for MCP config examples. |
| `820-artifacts.md` | Inspection Guide | `What You Are Looking For` -> `Where Artifacts Live` -> `Inspect Artifact Output` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Artifact review and ownership page. |
| `830-hooks.md` | Planning Guide | `Current Status` -> `Intended Hook Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Parent hooks page should stay source-limited until AI hook APIs are implemented. |
| `831-ai-events.md` | Planning Guide | `Current Status` -> `Intended Event Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Treat the hooks group as placeholder material until implementation is confirmed. |
| `832-transform-hooks.md` | Planning Guide | `Current Status` -> `Intended Transform Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Treat the hooks group as placeholder material until implementation is confirmed. |
| `840-skills.md` | Concept Brief | `What Stackpress Skills Are` -> `How Skills Guide Agents` -> `Skill Families` -> `Small Example` -> `Next Step` | Parent skills page should use repository `skills/`, not `packages/stackpress-ai`. |
| `841-skill-workflow.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Use repository `skills/`, not `packages/stackpress-ai`, for `840` through `847`. |
| `842-app-discovery-skill.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Discovery should produce an app brief. |
| `843-app-coordinator-skill.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Coordinator should explain sequencing and delegation. |
| `844-scaffold-skill.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Tie to scaffold assets and checks. |
| `845-idea-authoring-skill.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Tie to `schema.idea` correctness. |
| `846-plugin-skills.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Explain router/pages/events/views skill boundaries. |
| `847-verification-skill.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Make verification evidence explicit. |

## Editing Checklist

For each file:

- Replace generic headings with the assigned section plan.
- Keep a short opening paragraph that states the page's purpose.
- Use source-backed examples from `Source Legend`.
- Remove repeated explanation already covered by earlier courses.
- Add verification only when the reader can actually check something.
- Keep final sections specific: avoid vague endings like `What Just Happened`
  unless the page truly needs a recap.
