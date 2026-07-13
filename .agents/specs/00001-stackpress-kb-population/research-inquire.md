# Research Ledger: `@stackpress/inquire`

## Scope And Status

Research unit: complete sibling repository `../inquire`, core and adapter package
version `0.10.6`. Core source, dialects, builders, adapters, tests, examples, and
Stackpress intersections were inspected. No runtime proof was required.

## Native Purpose

Source fact: Inquire is a lightweight typed SQL builder, not an ORM. It defines
schemas, builds visible SQL, and executes through driver-specific connection
wrappers without owning records, relationships, repositories, or migration history.

Interpretation: Inquire standardizes SQL intent and portability while protecting
the application's right to own its domain and operational workflow.

## Native Vocabulary

| Term | Behavioral meaning |
| --- | --- |
| `Engine` | Builder factory and execution facade over one connection/dialect. |
| Builder | Mutable query/schema intent that can be inspected or awaited. |
| Dialect | Translation from builder state to SQL and values. |
| Connection | Native driver adapter for queries and transactions. |
| `Create` / `Alter` | Desired schema and incremental schema-change intent. |
| `diff` | Derives an `Alter` plan from current and target `Create` builders. |
| Query object | Visible `{ query, values }` execution boundary. |
| JSON selector | Shared logical path translated into dialect-specific JSON SQL. |
| `before` | Last-mile query instrumentation or mutation hook. |

## Behavioral Conclusions

### Builders Hold Intent Before SQL Exists

Create, alter, select, insert, update, and delete builders collect structured
state. `.build()` exposes that state, `.query()` asks the dialect for SQL, and
awaiting an engine-bound builder executes it. Evidence:
`../inquire/packages/inquire/src/builder/*.ts`; `src/Engine.ts`;
builder and dialect tests.

Interpretation: Query construction remains inspectable and testable before it
crosses the driver boundary.

### Dialects Own Differences, Connections Own Drivers

The Engine is dialect-neutral. MySQL, PostgreSQL, and SQLite dialects own
quoting, types, placeholders, JSON extraction, returning, and schema syntax;
separate packages adapt mysql2, pg, sqlite3, and PGlite connections. Evidence:
`../inquire/packages/inquire/src/dialect/*.ts`; adapter packages under
`../inquire/packages/inquire-*`; `specs/explanation/mental-model.md`.

Interpretation: Portability is split cleanly between SQL-language variation and
native-driver behavior instead of hiding both behind one opaque adapter.

### Schema Diff Is A Primitive, Not A Migration System

`Engine.diff(from, to)` compares two create-builder shapes and returns an alter
builder. Inquire can rename, drop, and truncate, but it does not store migration
history or decide deployment sequencing. Evidence:
`../inquire/packages/inquire/src/Engine.ts:83-189`;
`specs/guides/schema-changes.md`.

Interpretation: The library supplies the calculation needed by a migration
workflow while deliberately leaving lifecycle and policy to its host.

### Raw SQL Is A First-Class Escape Hatch

`query()` accepts SQL or a query object, `sql` creates placeholders from template
interpolations, and transactions expose the connection wrapper directly.
Evidence: `src/Engine.ts:209-263`; `specs/guides/raw-sql-and-transactions.md`.

Interpretation: The abstraction is designed to remain close to SQL, not to make
handwritten SQL a failure mode.

### JSON Paths Form A Portable Logical Notation

Shared selector syntax is parsed by dialect-specific JSON traits into extraction,
comparison, and containment SQL. Evidence: `src/dialect/Json.ts` and JSON classes
inside `Mysql.ts`, `Pgsql.ts`, and `Sqlite.ts`; dialect tests.

Interpretation: Inquire normalizes the developer's intent where SQL dialects
diverge sharply, while still emitting inspectable native SQL.

## Repeated Patterns And Invariants

- `P-INQ-01`: Intent, translation, and execution are separate layers: builder,
  dialect, connection. Confidence: direct design fact.
- `P-INQ-02`: Every execution path retains query text and parameter values as an
  observable boundary. Confidence: source fact.
- `P-INQ-03`: Builders are fluent but not domain models; type generics describe
  results, not persisted entities. Confidence: source/documentation fact.
- `P-INQ-04`: Schema operations and data queries use the same engine/dialect
  architecture. Confidence: source fact.
- `P-INQ-05`: Driver packages are isolated from the core so optional native
  dependencies do not contaminate other consumers. Confidence: interpretation.
- `P-INQ-06`: Hooks and raw SQL preserve instrumentation and escape routes rather
  than forcing all behavior into builders. Confidence: source fact.

## Deliberate Tradeoffs And Exclusions

- No model instances, identity map, relation loading, unit of work, repositories,
  or domain architecture.
- No migration history, deployment orchestration, or rollback policy.
- Fluent builders are mutable and execution-capable when engine-bound.
- Dialect parity is practical rather than pretending every database supports the
  same schema operations.
- Typed results are caller-declared TypeScript contracts, not runtime validation.
- Transactions expose connections, not nested engines, keeping the driver
  boundary visible.

## Unique Or Surprising Concepts

- Awaitable builders bridge inspectable intent and execution.
- `Create` builders double as comparable schema descriptions for diffing.
- JSON selector notation acts as a portable mini-language inside visible SQL.
- SQL portability is achieved without an ORM or hidden record layer.
- Core and driver adapters are separately publishable compatibility boundaries.

## Stackpress Intersections

- Stackpress SQL generates store/action classes that translate model operations
  into Inquire builders and status-shaped event responses.
- Stackpress owns migration files, revisions, push/populate/install/upgrade
  events, safety checks, and application lifecycle around Inquire primitives.
- Database adapter selection is configuration-driven while generated model
  actions remain mostly dialect-neutral.
- Stackpress therefore adds domain generation and operational orchestration that
  Inquire explicitly excludes.

## Potential Deeper Topics

- `INQ-T01`: Builder intent, dialect translation, and driver execution.
- `INQ-T02`: Visible SQL as an abstraction constraint.
- `INQ-T03`: Schema diff as a primitive beneath host-owned migrations.
- `INQ-T04`: Stackpress SQL as lifecycle and generated-domain layer over Inquire.
- `INQ-T05`: Portable JSON intent without ORM semantics.
- `INQ-T06`: Awaitable builders and execution ergonomics.
- `INQ-T07`: Adapter packaging as optional-dependency isolation.

## Open Questions

- Which Inquire diff limitations drive Stackpress migration safeguards?
- How does Stackpress preserve dialect-specific operations in generated actions?
- Are generated stores intentionally replaceable by handwritten repositories?
- Which raw SQL and transaction escape hatches surface through Stackpress?
- Where does runtime input validation occur before Inquire receives values?

