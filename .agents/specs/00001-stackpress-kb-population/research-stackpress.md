# Research Ledger: Stackpress

## Scope And Status

Research unit: this monorepo, including root distribution, active packages,
aggregate composition, templates, generated output, tests, skills, `www`, the
active desktop target, and planning-only studio material. Ecosystem ledgers were
completed first.
This is research evidence, not promoted context truth.

Load [Detailed Evidence](research-stackpress-evidence.md) when verifying package
ownership, lifecycle hooks, commands, generation, runtime loading, surfaces, or
template operations. Skip it for high-level synthesis.

## Native Purpose

Source fact: Stackpress calls itself a server-side-first, event-driven,
unopinionated, pluggable content management framework with client generation.

Evidence-backed interpretation: Stackpress is an operational composition layer
that turns one intentionally rich model and configuration into coordinated
server behavior, data operations, rendered pages, admin workflows, APIs, MCP
tools, auth/session behavior, and reusable generated code.

This is broader than “CMS” in implementation scope, but stronger public product
language remains a founder/positioning decision.

## Native Vocabulary

| Term | Behavioral meaning |
| --- | --- |
| Bootstrap | Load config and plugins, then resolve setup phases. |
| Lifecycle phase | Conventional Ingest event: primarily `config`, `listen`, `route`, `idea`. |
| Operational event | Named command/domain capability resolved through the server. |
| Generated client | Buildable/loadable package containing schema, models, actions, components, routes, and tools. |
| Package transform | Generator owned by the package that consumes its output. |
| Model listener | Generated registration of CRUD/domain events for one model. |
| Access surface | Route, admin page, API endpoint, MCP tool, desktop flow, or custom view over events. |
| Bootstrap config | Typed environment-specific modules controlling framework assembly. |
| Revisions/migrations | Generated and operational records used to reconcile schema with a database. |

## End-To-End Operating Model

1. An application composes reusable package schemas and local domain declarations
   in `.idea`, then selects plugins and operational policy in typed config.
2. The Stackpress terminal loads the bootstrap, bootstraps Ingest plugins, and
   resolves `config`, `listen`, and `route` in order.
3. A command is emitted as an event with parsed terminal data; the same server
   can resolve domain events from pages, APIs, MCP tools, tests, or other events.
4. `generate` creates an Idea transformer and ts-morph project, emits `idea` so
   packages append their transforms, then runs those transforms sequentially.
5. Generated output becomes a package loaded through the registered `client`
   service. During `listen` and `route`, generated models attach domain events,
   admin routes, and other registries to the live server.
6. SQL events use generated stores/actions over Inquire and database adapters;
   view routes render Reactus entries using Frui and r22n-backed client code.
7. Admin, API, MCP, auth/session, and custom plugins call the same named domain
   events rather than implementing separate business-data paths.

## Stackpress-Level Patterns

### P-SP-01: Lifecycle Events Are Package Ownership Boundaries

Packages register only where their responsibility becomes meaningful: config
creates services, listen creates operational events, route creates access, and
idea attaches generators. The aggregate package controls default registration
order without merging package internals.

Classification: Stackpress coordination over Ingest events.

### P-SP-02: Generators Are Owned By Runtime Consumers

Schema, SQL, view, admin, and AI packages each append their own transform. The
package that knows the runtime contract also emits the code required by that
contract.

Classification: Stackpress-specific application of Idea plugin delegation.

### P-SP-03: Generated Code Is A Runtime Plugin Package

Generation does not merely create passive types. The client package exports
model/action/store/component/tool registries and registration functions that the
runtime loads during later lifecycle phases.

Classification: Stackpress-unique higher-level workflow.

### P-SP-04: Events Are The Capability Bus

CLI commands, generated CRUD, page handlers, API endpoints, webhooks, auth,
email, database operations, and MCP tools resolve named events. HTTP and AI
surfaces translate external contracts into event data and status responses.

Classification: Extended Ingest event model; Stackpress-specific operational use.

### P-SP-05: Configuration Selects Policy, Code Owns Mechanism

Config chooses database adapters, seeds/population, access rules, routes,
webhooks, menus, branding, languages, view/build paths, MCP exposure, and client
output. Packages and local plugins implement mechanisms and custom behavior.

Classification: Stackpress coordination pattern.

### P-SP-06: One Model Carries Cross-Surface Metadata

Idea models include persistence, validation, relation, form, filter, list, view,
description, example, and operational metadata. Different package transforms
interpret their own namespaces without centralizing all semantics in the parser.

Classification: Stackpress convention over Idea's open metadata channel.

### P-SP-07: Server-Side First Means Server Capability First

Domain actions are server events first. Views, APIs, admin pages, MCP, CLI, and
desktop aspirations are adapters to those capabilities. React hydration enhances
rendered pages but does not define the application runtime.

Classification: Stackpress product/architecture interpretation, strongly sourced.

### P-SP-08: Operational Commands Are Events, Not A Separate CLI API

The runtime terminal forwards its command to the same server event system used
inside applications. Root distribution adds dependency-free create/skill install
and delegates runtime commands only when the monorepo runtime exists.

Classification: Stackpress-specific distribution and operations pattern.

### P-SP-09: Package Boundaries Follow Change Responsibility

Server, schema, SQL, view, auth/session, API, admin, language, CSRF, email, and AI
remain separately publishable plugins. Contributor routing follows the package
that owns the lifecycle, transform, and runtime contract being changed.

Classification: Stackpress modularity pattern.

### P-SP-10: Skills Are Part Of The Product Distribution

The root package ships dependency-free CLI code and Stackpress agent skills.
Skills encode discovery, schema authoring, scaffolding, plugin boundaries,
generation, views/events, and verification as supported developer workflows.

Classification: Stackpress-unique distribution/adoption pattern.

## Deliberate Tradeoffs And Exclusions

- Generation introduces a required reconciliation step; stale client output can
  disagree with `.idea` or runtime packages.
- Shared mutable schema/plugin registries make package registration order relevant.
- Event names are flexible but require governance because they connect many surfaces.
- Configuration is powerful but not “no code”; custom plugins and handlers remain
  normal application units.
- Generated output is disposable as source but contractual as the runtime package.
- Server-side-first does not prohibit browser interactivity or SPA-style views;
  it assigns capability authority to the server.
- Desktop is now an active workspace with runtime, build, package, plugin, and
  test code, but updater events remain reserved placeholders. Studio remains a
  planning target and must not be described as a current production capability.

## Unique Or Surprising Concepts

- Framework packages discover generators by emitting an event into the loaded
  Idea schema before transformation.
- Generated code returns as a plugin-like runtime registry during boot.
- API and MCP exposure are configuration mappings over existing events.
- Database lifecycle and model CRUD share the same command/event vocabulary.
- Agent skills are deliberately shipped by the root executable beside scaffolding.
- Package schemas are reusable domain fragments distributed like code packages.

## Potential Deeper Topics

- `SP-T01`: The complete model-to-runtime-to-surface loop.
- `SP-T02`: Lifecycle events as modular package ownership.
- `SP-T03`: Generated client as executable runtime contract.
- `SP-T04`: Event capability bus across CLI, pages, API, MCP, and data.
- `SP-T05`: Configuration as operational policy composition.
- `SP-T06`: Open metadata namespaces and package-owned semantics.
- `SP-T07`: Server-side-first as capability authority, not rendering limitation.
- `SP-T08`: Database reconciliation lifecycle above Inquire.
- `SP-T09`: Contributor routing by lifecycle and transform ownership.
- `SP-T10`: Agent skills and bootstrap CLI as product distribution.

## Open Questions

- Which event names and metadata namespaces are stable public contracts?
- Which package-order dependencies are intentional and which are incidental?
- What guarantees compatibility between generated client and runtime versions?
- How should schema/config/generated/runtime drift be detected and explained?
- Which Stackpress-level phrases should become public founder-approved language?
- What is the intended boundary between CMS positioning and broader app framework use?
