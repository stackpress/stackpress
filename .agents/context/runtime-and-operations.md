# Stackpress Runtime And Operations

## Bootstrap

An application creates an Ingest server, sets typed config, bootstraps package
plugins, then resolves:

1. `config` to register services and environment mechanisms;
2. `listen` to register operational and generated events;
3. `route` to register request-facing routes.

The Stackpress terminal uses the same bootstrap. A normal runtime command becomes
an event with terminal request data, so CLI operations participate in the same
server capability system as pages, APIs, MCP, tests, and plugins.

## Configuration As Operational Policy

Configuration is executable TypeScript composition. Shared modules,
environment variables, imports, and object spreads select:

- server mode, paths, host, and port;
- generated client identity, output, revisions, and formatting;
- database adapter, schema policy, migrations, and population plan;
- rendering mode, Reactus paths/templates/assets, and shared props;
- session/auth access, cookies, CSRF, API endpoints, and MCP tools;
- brand, language, admin menu, email, and optional package behavior.

Packages read their owned sections and implement the mechanism during lifecycle
phases. Later JavaScript spreads/properties determine precedence.

TypeScript types guide authors, and individual packages apply defaults or local
normalization. There is no framework-wide guarantee of runtime schema validation,
unknown-key detection, config provenance, secret classification, or environment
drift detection.

## Event Classes

- bootstrap: `config`, `listen`, `route`;
- generation contribution: `idea`;
- framework operations: generate, build, push, migrate, serve, and related events;
- generated model operations: create, detail, search, update, remove, and others;
- domain/application operations: auth, email, webhooks, and local workflows;
- surface/transport operations: MCP and desktop commands;
- contribution registries: package-specific extension events;
- error handling: the shared error pipeline.

Event names are flexible and compatibility-sensitive. No universal event catalog,
visibility registry, authorization policy, transaction policy, or deprecation
registry is currently guaranteed.

## Data States

| State | Meaning |
| --- | --- |
| Idea source | intended domain declaration |
| generated schema config | normalized current model |
| revision JSON | timestamped generated-schema history |
| migration SQL | reviewable history-derived SQL artifact |
| database schema/data | actual live storage state |
| population config | ordered seed event plan |

Revision history is not a database applied-migration ledger.

## Command Semantics

| Command | Behavior |
| --- | --- |
| `generate` | creates client output and records a changed schema revision |
| `install` | drops generated tables, recreates them, and initializes history when absent |
| `push` | installs without enough history; otherwise upgrades the newest adjacent pair |
| `upgrade` | executes an adjacent schema diff in a database transaction |
| `migrate` | writes raw SQL across revision history without warning or updating a database |
| `populate` | resolves configured seed events sequentially |
| `purge` | truncates generated stores in a transaction |
| `uninstall` | drops generated stores |

`install`, `purge`, and `uninstall` are destructive. `push` assumes the target
database corresponds to expected history; revisions alone do not prove this.

## Rename Safety

Stackpress SQL's `Migrations` class plans adjacent revisions, applies clear
one-to-one same-semantics field rename intent through Inquire's
`Alter.renameField()` builder, and returns raw queries with warning metadata.
Inquire owns the dialect-specific rename SQL and reconciliation of the original
remove/add pair. Live upgrade refuses ambiguous or destructive plans unless
`--force` is provided. Migration generation does not enforce that warning
policy: it writes the raw SQL, including generic drop/add SQL for ambiguity, for
review without updating a database. Clear rename plans remain preserved with or
without `--force`.

## Transaction Boundaries

Install, upgrade, and purge query sequences use database transactions. Population
resolves events sequentially without one transaction around the full plan.
Generated migration files provide no execution or rollback contract by
themselves.

## Operational Rules

- Generate before commands that require the client.
- Review schema revisions and migration SQL for production changes.
- Treat destructive commands and `--force` as explicit data-loss decisions.
- Design population events with intentional rerun behavior.
- Load secrets from environment-specific sources rather than template defaults.
- Verify each bootstrap because type compatibility does not prove complete
  operational policy.

## Detailed References

Load [Server And Transport Contracts](../references/00005-server-and-transport-contracts.md)
for terminal command execution, loader defaults, plugin bootstrap, adapter
factories, request normalization, response dispatch, and transport caveats.

Load [Stackpress Configuration Catalog](../references/00008-configuration-catalog.md)
when documenting config areas, package ownership, defaults, environment layering,
operational effects, secrets, or optional package sections.

Load [CLI And Plugin Contracts](../references/00009-cli-and-plugin-contracts.md)
for root bootstrap commands, runtime event commands, shared flags, prerequisites,
destructive boundaries, and command status behavior.

Load [SQL API Contracts](../references/00010-sql-api-contracts.md) for Inquire
engine/builders/dialects, generated stores/actions, selector paths, helpers,
schema diff behavior, and SQL operational boundaries.

Load [Database Adapter Contracts](../references/00011-database-adapter-contracts.md)
when configuring a database engine, diagnosing native query/transaction behavior,
or documenting adapter-specific deployment constraints.

Load [Session And Language Contracts](../references/00013-session-language-contracts.md)
when configuring session access, tracing request authorization, documenting
token/cookie behavior, or explaining locale-prefixed request rewriting.

Load [Operational Examples](../references/00015-operational-examples.md) when a
guide needs an executable workflow joining config, bootstrap, generation,
database operations, pages, external surfaces, and verification.
