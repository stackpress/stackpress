# TOP-004: Lifecycle Events And Package Ownership

## Finding

The conventional phases `config`, `listen`, `route`, and `idea` are installation
boundaries. They let separately published packages contribute behavior when its
dependencies and consumers become meaningful.

## Phase Contracts

| Phase | Intended responsibility | Examples |
| --- | --- | --- |
| Plugin call | declare phase listeners; register dependency-free state | aggregate order, desktop registry |
| `config` | register services and derive mode/environment policy | generated client loader, language, view mode |
| `listen` | register operational events and generated listeners | CLI scripts, model CRUD, email, MCP transports |
| `route` | register request-facing routes after capabilities exist | admin, API, dev view routes |
| `idea` | append package-owned transforms before generation | schema, SQL, view, admin, AI |

`idea` participates in generation rather than normal server readiness, but it
uses the same event mechanism and loaded plugin set.

## Aggregate Ordering

The aggregate plugin currently registers server, schema, language, CSRF, SQL,
view, session, API, and admin in explicit order. This order affects listener
queue order and shared schema transform order. AI and desktop are optional and
are not currently included by the aggregate plugin.

Ordering dependencies visible in source include:

- schema registers the generated-client loader before later consumers use it;
- schema establishes generated files that SQL later replaces or expands;
- view, admin, and AI patch the generated package after base schema/SQL output;
- SQL attaches generated model listeners during `listen`;
- admin attaches generated routes during `route`;
- access surfaces expect operational events to exist before handling calls.

## Ownership Test

A package should own a lifecycle contribution when it owns both the knowledge
needed to install it and the runtime contract that consumes it. This yields:

- services in `config` when they depend on final configuration;
- events in `listen` when they implement reusable operations;
- routes in `route` when they adapt ready capabilities;
- transforms in `idea` when the package consumes generated output.

## Phase Invariants

1. Plugin registration completes before phases resolve.
2. `config` precedes generated-client consumption.
3. `listen` precedes routes that invoke registered capabilities.
4. `route` is last in normal terminal/application bootstrap.
5. Transform discovery completes before `transformer.transform()`.
6. Optional packages must not assume aggregate registration unless explicitly
   loaded by application configuration.

## Contribution Guidance

- Add behavior to the narrowest owning package.
- Avoid registering request routes in `listen` or services in `route`.
- Treat listener priority and aggregate order as compatibility-sensitive.
- When adding a generated feature, pair an `idea` contribution with its runtime
  consumption phase.
- Test a plugin both alone and in the aggregate order when shared state is used.

## Canonical Explanation

Stackpress packages remain separate because the server lifecycle gives each one
a defined moment to install services, operations, routes, or generation logic.
The aggregate coordinates order without absorbing package responsibilities.

## Evidence Anchors

- `packages/stackpress/src/plugin.ts`
- `packages/stackpress-server/src/Terminal.ts`
- all active `packages/stackpress-*/src/plugin.ts`
- `packages/stackpress-schema/src/scripts/generate.ts`

## Resolution

Evidence strength: strong. Adopt lifecycle phases as package ownership boundaries.
Document exact ordering as current contract, not yet as permanent public API.

