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

## Course Shape Map

### 000 Orientation

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `001-what-stackpress-is.md` | Concept Brief | `What Stackpress Is` -> `The Pieces` -> `How A Request Moves` -> `What Gets Generated` -> `Where To Go Next` | This should orient without becoming a full framework reference. |

### 100 Develop

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `110-scaffold.md` | Hands-On Build | `Goal` -> `Create the App` -> `Open the Project` -> `Run the First Command` -> `Check the Files` -> `What You Now Have` | Keep this as the first-success page, but replace generic headings with scaffold-specific ones. |
| `113-dev-server.md` | Workflow Guide | `When To Run The Dev Server` -> `Start The Server` -> `Read The Logs` -> `Stop And Restart` -> `Common Startup Problems` -> `Next Step` | Focus on operating the local app, not explaining the whole runtime. |
| `121-composition.md` | Concept Brief | `What Composition Means` -> `Packages And Plugins` -> `How Configuration Wires Them` -> `Small Example` -> `Next Step` | This is a mental model page. |
| `122-local-plugins.md` | Hands-On Build | `Goal` -> `Create A Local Plugin` -> `Register It` -> `Add A Route Or Event` -> `Run And Check` -> `What The Plugin Owns` | Teach plugin ownership through a tiny working plugin. |
| `123-plugin-config.md` | API Usage Guide | `Use Case` -> `Minimal Config` -> `How Config Reaches The Plugin` -> `Common Patterns` -> `Mistakes To Avoid` -> `Reference Pointers` | Show config shape and lookup behavior. |
| `131-request.md` | API Usage Guide | `Use Case` -> `Minimal Handler` -> `Read Params And Body` -> `Read Session Or Headers` -> `Mistakes To Avoid` -> `Reference Pointers` | Keep examples request-focused. |
| `132-response.md` | API Usage Guide | `Use Case` -> `Return HTML Or JSON` -> `Redirect` -> `Set Status And Headers` -> `Mistakes To Avoid` -> `Reference Pointers` | Pair response examples with request handlers. |
| `133-data-surfaces.md` | Concept Brief | `What Data Surfaces Are` -> `Request Data` -> `Config Data` -> `Generated Data` -> `How To Choose` -> `Next Step` | This page should reduce confusion between data sources. |
| `134-session.md` | Security Flow Guide | `Flow Goal` -> `Session Config` -> `Read And Write Session Data` -> `User Feedback` -> `Security Checks` -> `Verify` | Treat sessions as a security and request-flow topic. |
| `135-nest.md` | Decision Guide | `The Decision` -> `Recommended Default` -> `When To Nest Plugins` -> `Tradeoffs` -> `Example Layout` -> `Next Step` | Explain nesting only when it solves ownership or routing. |
| `141-terminal-events.md` | Workflow Guide | `When To Emit Events` -> `Event Workflow` -> `Command Map` -> `Verbose Output` -> `Common Failures` -> `Next Step` | Teach terminal event use with observable output. |
| `151-first-react-page.md` | Hands-On Build | `Goal` -> `Create The View` -> `Add The Route` -> `Render Data` -> `Check In Browser` -> `What The Page Owns` | Code-led first page lesson. |
| `152-server-props.md` | API Usage Guide | `Use Case` -> `Minimal Server Props` -> `Load Data` -> `Pass Data To The View` -> `Mistakes To Avoid` -> `Reference Pointers` | Tie server props directly to page rendering. |
| `153-layouts.md` | Concept Brief | `What Layouts Do` -> `Where Layouts Live` -> `Wrap A Page` -> `Shared UI Boundaries` -> `Next Step` | Explain composition and reuse, then show a small example. |
| `154-language.md` | API Usage Guide | `Use Case` -> `Minimal Translation` -> `Load Language Config` -> `Switch Or Read Locale` -> `Mistakes To Avoid` -> `Reference Pointers` | Keep language as app behavior, not general i18n theory. |
| `155-theme.md` | API Usage Guide | `Use Case` -> `Minimal Theme Setup` -> `Apply Theme Values` -> `Override Safely` -> `Mistakes To Avoid` -> `Reference Pointers` | Show theme as configuration plus view usage. |
| `156-notifier.md` | API Usage Guide | `Use Case` -> `Show A Message` -> `Trigger From Handler` -> `Render In View` -> `Mistakes To Avoid` -> `Reference Pointers` | Pair notifier with form or action feedback. |
| `160-debugging-and-inspection.md` | Inspection Guide | `What You Are Looking For` -> `Where To Look` -> `Inspect Logs And Output` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | This page should teach a repeatable debugging loop. |

### 200 Data

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `211-dialects.md` | Decision Guide | `The Decision` -> `Recommended Default` -> `Dialect Options` -> `Tradeoffs` -> `Example Choice` -> `Next Step` | Start with SQLite/PGlite as the easiest path unless source context says otherwise. |
| `212-sqlite-pglite.md` | Hands-On Build | `Goal` -> `Configure The Local Database` -> `Run The App` -> `Generate Or Push Schema` -> `Check Data` -> `Keep In Mind` | Practical local database setup. |
| `213-postgresql.md` | Decision Guide | `The Decision` -> `When PostgreSQL Fits` -> `Connection Config` -> `Migration Or Push Flow` -> `Tradeoffs` -> `Verify` | Production-oriented, but still concrete. |
| `214-mysql.md` | Decision Guide | `The Decision` -> `When MySQL Fits` -> `Connection Config` -> `Migration Or Push Flow` -> `Tradeoffs` -> `Verify` | Mirror PostgreSQL shape for consistency. |
| `221-select.md` | Data Operation Guide | `Operation Goal` -> `Inputs` -> `Build The Select` -> `Return Results` -> `Verify Data` -> `Common Mistakes` | Teach filtering and output shape. |
| `222-insert.md` | Data Operation Guide | `Operation Goal` -> `Inputs` -> `Build The Insert` -> `Return Or Redirect` -> `Verify Data` -> `Common Mistakes` | Include validation and generated IDs if relevant. |
| `223-update.md` | Data Operation Guide | `Operation Goal` -> `Inputs` -> `Find The Row` -> `Apply Changes` -> `Verify Data` -> `Common Mistakes` | Emphasize filters and ownership checks. |
| `224-delete.md` | Data Operation Guide | `Operation Goal` -> `Inputs` -> `Find The Row` -> `Delete Or Soft Delete` -> `Verify Data` -> `Common Mistakes` | Emphasize destructive action safeguards. |
| `231-raw-sql.md` | Data Operation Guide | `Operation Goal` -> `When Raw SQL Is Appropriate` -> `Write The Query` -> `Bind Inputs` -> `Verify Data` -> `Common Mistakes` | Focus on safe input binding. |
| `232-transactions.md` | Data Operation Guide | `Operation Goal` -> `When A Transaction Is Needed` -> `Wrap The Operations` -> `Handle Failure` -> `Verify Data` -> `Common Mistakes` | Explain all-or-nothing behavior with a realistic example. |
| `233-json-fields.md` | Modeling Guide | `Modeling Goal` -> `Idea Example` -> `Generated Effect` -> `Query JSON Data` -> `Inspect Output` -> `Next Step` | Model first, then data access. |
| `234-schema-changes.md` | Workflow Guide | `When Schema Changes` -> `Edit The Source` -> `Generate Or Push` -> `Inspect The Diff` -> `Common Failures` -> `Next Step` | Teach source-to-output discipline. |

### 300 Build And Deploy

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `311-generated-artifacts.md` | Inspection Guide | `What You Are Looking For` -> `Where Artifacts Live` -> `Read Generated Files` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Good place to explain generated output ownership. |
| `312-client-source.md` | Inspection Guide | `What You Are Looking For` -> `Where Client Source Lives` -> `Inspect Generated Types` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Keep troubleshooting focused on generated client code. |
| `320-local-production.md` | Workflow Guide | `When To Use Local Production` -> `Build` -> `Run Production Locally` -> `Verify Routes And Assets` -> `Common Failures` -> `Next Step` | Concrete build/run/check page. |
| `330-vercel.md` | Planning Guide | `Current Status` -> `Intended Vercel Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Use this shape unless Vercel support is fully implemented. |
| `340-netlify.md` | Planning Guide | `Current Status` -> `Intended Netlify Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Parallel deployment target shape. |
| `350-lambda-serverless.md` | Planning Guide | `Current Status` -> `Intended Serverless Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Avoid over-promising runtime support. |

### 400 Project Structure

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `411-source-of-truth.md` | Decision Guide | `The Decision` -> `Recommended Default` -> `Source Files` -> `Generated Files` -> `Tradeoffs` -> `Next Step` | Make ownership rules explicit. |
| `412-generated-output.md` | Inspection Guide | `What You Are Looking For` -> `Where Output Lives` -> `Inspect Output` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Pair with source-of-truth page. |
| `421-config-splitting.md` | Decision Guide | `The Decision` -> `Recommended Default` -> `Config Files` -> `Tradeoffs` -> `Example Split` -> `Next Step` | Teach config organization by project size. |
| `430-plugin-layout.md` | Workflow Guide | `When To Create A Plugin` -> `Folder Layout` -> `Register Entrypoints` -> `Verify Loading` -> `Common Failures` -> `Next Step` | Use concrete folders from templates. |
| `440-public-assets.md` | Hands-On Build | `Goal` -> `Add An Asset` -> `Reference It In A View` -> `Run And Check` -> `Asset Rules` -> `Next Step` | Small visual success page. |

### 500 Idea

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `511-syntax.md` | Modeling Guide | `Modeling Goal` -> `Idea Example` -> `Syntax Rules` -> `Generated Effect` -> `Inspect Output` -> `Next Step` | Treat syntax as authoring, not reference. |
| `512-use.md` | Modeling Guide | `Modeling Goal` -> `Use Another Model` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Show why `use` exists through generation. |
| `513-plugins.md` | Modeling Guide | `Modeling Goal` -> `Plugin Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Explain idea plugins by output changes. |
| `521-models.md` | Modeling Guide | `Modeling Goal` -> `Model Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Core model authoring page. |
| `522-fields.md` | Modeling Guide | `Modeling Goal` -> `Field Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Include field naming and type behavior. |
| `523-enums.md` | Modeling Guide | `Modeling Goal` -> `Enum Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Show where enum values are enforced. |
| `524-types.md` | Modeling Guide | `Modeling Goal` -> `Type Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Distinguish idea types from TypeScript output. |
| `525-props.md` | Modeling Guide | `Modeling Goal` -> `Prop Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Explain props as generated view/API metadata if source confirms. |
| `526-attributes.md` | Modeling Guide | `Modeling Goal` -> `Attribute Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Use examples from specs/source. |
| `527-relations.md` | Modeling Guide | `Modeling Goal` -> `Relation Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Keep relation cardinality explicit. |
| `531-schema-output.md` | Inspection Guide | `What You Are Looking For` -> `Where Schema Output Lives` -> `Inspect Classes` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Focus on generated schema classes. |
| `532-sql-output.md` | Inspection Guide | `What You Are Looking For` -> `Where SQL Output Lives` -> `Inspect Stores And Actions` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Focus on generated SQL artifacts. |
| `533-view-output.md` | Inspection Guide | `What You Are Looking For` -> `Where View Output Lives` -> `Inspect Components` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Focus on generated views/components. |
| `534-client-output.md` | Inspection Guide | `What You Are Looking For` -> `Where Client Output Lives` -> `Inspect Client Types` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Pair with `312-client-source.md` without duplicating it. |
| `541-ts-morph-plugins.md` | Workflow Guide | `When To Use Ts Morph` -> `Generator Workflow` -> `Transform Source` -> `Inspect Output` -> `Common Failures` -> `Next Step` | Advanced but still step-oriented. |
| `542-custom-generators.md` | Workflow Guide | `When To Write A Generator` -> `Generator Workflow` -> `Register It` -> `Inspect Output` -> `Common Failures` -> `Next Step` | Keep the example small and source-backed. |

### 600 Built Ins

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `611-sign-in.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Sign In Request Flow` -> `User Feedback` -> `Security Checks` -> `Verify` | Route and session behavior should lead. |
| `612-sign-up.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Sign Up Request Flow` -> `User Feedback` -> `Security Checks` -> `Verify` | Include account creation and duplicate handling. |
| `613-otp-2fa.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `OTP Request Flow` -> `User Feedback` -> `Security Checks` -> `Verify` | Keep 2FA sequence explicit. |
| `621-session-rules.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Rule Evaluation` -> `Allowed And Blocked Paths` -> `Security Checks` -> `Verify` | Show access control decisions. |
| `631-profile.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Profile Request Flow` -> `User Feedback` -> `Security Checks` -> `Verify` | Profile changes must be tied to current user. |
| `632-account-pages.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Account Page Flow` -> `User Feedback` -> `Security Checks` -> `Verify` | Explain built-in pages as route/view pairs. |
| `633-flash-messages.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Set A Flash Message` -> `Render Feedback` -> `Security Checks` -> `Verify` | Security shape still fits because messages depend on request/session flow. |
| `640-csrf.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `Protected Request Flow` -> `Failure Behavior` -> `Security Checks` -> `Verify` | Must show both success and rejection. |
| `650-email.md` | Workflow Guide | `When To Send Email` -> `Configure Sender` -> `Emit Or Call Send` -> `Verify Delivery` -> `Common Failures` -> `Next Step` | Email is operational more than conceptual. |
| `661-language-config.md` | API Usage Guide | `Use Case` -> `Minimal Config` -> `Load Translations` -> `Common Patterns` -> `Mistakes To Avoid` -> `Reference Pointers` | Configuration-first i18n page. |
| `662-uselanguage.md` | API Usage Guide | `Use Case` -> `Minimal Hook Example` -> `How The Hook Works` -> `Common Patterns` -> `Mistakes To Avoid` -> `Reference Pointers` | Hook usage page. |
| `671-frui-base-components.md` | API Usage Guide | `Use Case` -> `Minimal Component` -> `Props And State` -> `Common Patterns` -> `Mistakes To Avoid` -> `Reference Pointers` | Treat as component usage, not catalog reference. |
| `672-frui-form-components.md` | API Usage Guide | `Use Case` -> `Minimal Form` -> `Validation And Submission` -> `Common Patterns` -> `Mistakes To Avoid` -> `Reference Pointers` | Should include form state and submit flow. |
| `673-frui-view-components.md` | API Usage Guide | `Use Case` -> `Minimal View Component` -> `Data And Props` -> `Common Patterns` -> `Mistakes To Avoid` -> `Reference Pointers` | Focus on generated/view composition usage. |
| `680-api-oauth.md` | Security Flow Guide | `Flow Goal` -> `Config Surface` -> `OAuth Request Flow` -> `Token Or Session Result` -> `Security Checks` -> `Verify` | OAuth needs security-first framing. |

### 700 Studio

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `710-schema-explorer.md` | Planning Guide | `Current Status` -> `Intended Explorer Workflow` -> `What Exists Today` -> `What To Verify` -> `Open Questions` -> `Next Step` | Use planning shape if Studio is not implemented. |
| `721-field-validation.md` | Modeling Guide | `Modeling Goal` -> `Validation Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | If Studio UI is future-facing, add a status note. |
| `730-relations.md` | Modeling Guide | `Modeling Goal` -> `Relation Example` -> `Generated Effect` -> `Authoring Rules` -> `Inspect Output` -> `Next Step` | Tie to idea relations and Studio visualization. |
| `741-admin-pages.md` | Inspection Guide | `What You Are Looking For` -> `Where Admin Pages Live` -> `Inspect Routes` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Admin output should be inspected from generated/source files. |
| `742-admin-views.md` | Inspection Guide | `What You Are Looking For` -> `Where Admin Views Live` -> `Inspect Components` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Keep view customization boundaries clear. |
| `743-admin-client.md` | Inspection Guide | `What You Are Looking For` -> `Where Admin Client Output Lives` -> `Inspect Client Code` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Pair with generated client output without repeating it. |
| `750-import-export.md` | Workflow Guide | `When To Import Or Export` -> `Workflow` -> `Command Or UI Map` -> `Verify` -> `Common Failures` -> `Next Step` | If Studio UI is future-facing, mark current implementation status. |

### 800 AI

| File | Shape | Section Plan | Notes |
| --- | --- | --- | --- |
| `811-stdio-transport.md` | Workflow Guide | `When To Use Stdio` -> `Transport Workflow` -> `Command Map` -> `Verify Connection` -> `Common Failures` -> `Next Step` | MCP transport page should be operational. |
| `820-artifacts.md` | Inspection Guide | `What You Are Looking For` -> `Where Artifacts Live` -> `Inspect Artifact Output` -> `Expected Evidence` -> `Fix The Source` -> `Next Step` | Artifact review and ownership page. |
| `831-ai-events.md` | Workflow Guide | `When To Use AI Events` -> `Event Workflow` -> `Command Or Tool Map` -> `Verify` -> `Common Failures` -> `Next Step` | Keep event flow observable. |
| `832-transform-hooks.md` | Workflow Guide | `When To Use Transform Hooks` -> `Hook Workflow` -> `Register The Hook` -> `Inspect Output` -> `Common Failures` -> `Next Step` | Generator-adjacent workflow page. |
| `841-skill-workflow.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Establish the general AI skill pattern. |
| `842-app-discovery-skill.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Discovery should produce an app brief. |
| `843-app-coordinator-skill.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Coordinator should explain sequencing and delegation. |
| `844-scaffold-skill.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Tie to scaffold assets and checks. |
| `845-idea-authoring-skill.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Tie to `schema.idea` correctness. |
| `846-plugin-skills.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Explain router/pages/events/views skill boundaries. |
| `847-verification-skill.md` | Skill Workflow | `Skill Purpose` -> `Use It When` -> `Inputs` -> `What It Produces` -> `Handoff` -> `Verification` | Make verification evidence explicit. |

## Rewrite Order

Use this order for the next content pass:

1. Fix `100 Develop` first because it teaches the base workflow and should set
   the reader's expectations.
2. Fix `500 Idea` next because it explains the authoring source of truth for
   generated Stackpress apps.
3. Fix `200 Data` and `600 Built Ins` after that because those pages need
   practical examples and security checks.
4. Fix `300`, `400`, `700`, and `800` last because they depend on the mental
   models and examples established earlier.

## Editing Checklist

For each file:

- Replace generic headings with the assigned section plan.
- Keep a short opening paragraph that states the page's purpose.
- Use source-backed examples from `packages/`, `templates/`, and `specs/`.
- Remove repeated explanation already covered by earlier courses.
- Add verification only when the reader can actually check something.
- Keep final sections specific: avoid vague endings like `What Just Happened`
  unless the page truly needs a recap.
