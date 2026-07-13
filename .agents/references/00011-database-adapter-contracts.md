# Database Adapter Contracts

Use this reference for MySQL, PostgreSQL, PGlite, and SQLite connection adapters,
their Stackpress entrypoints, native resources, formatting, and transactions.

## Shared Contract

Each adapter package exports `Results`, `Resource`, `Connector`, a connection
class, named `connect`, and default `connect`. Stackpress exposes equivalent
facades:

| Stackpress import | Adapter | Dialect |
| --- | --- | --- |
| `stackpress-sql/mysql` | `@stackpress/inquire-mysql2` | `Mysql` |
| `stackpress-sql/pgsql` | `@stackpress/inquire-pg` | `Pgsql` |
| `stackpress-sql/pglite` | `@stackpress/inquire-pglite` | `Pgsql` |
| `stackpress-sql/sqlite` | `@stackpress/inquire-sqlite3` | `Sqlite` |

Each facade also re-exports Inquire builders/dialects/types and Stackpress store,
action, and helper contracts. Connector input is a live native resource or an
async zero-argument factory. The factory resolves lazily once and is cached.

```ts
import connect from 'stackpress-sql/sqlite';
import Database from 'better-sqlite3';

const database = connect(new Database('./app.db'));
database.before = async request => console.log(request.query);
const rows = await database.select('*').from('profile');
```

`connect(resource)` wraps the adapter connection in `Engine<Resource>`. The
engine-level `before` hook can short-circuit with rows; connection-level `before`
observes/manipulates the final formatted request before native execution.

All adapters expose `format`, `query`, `raw`, `resource`, and `transaction`.
`query` normalizes row results; `raw` preserves native result shape. Date values
become ISO strings and arrays/objects become JSON strings before execution.

## MySQL / mysql2

```ts
new Mysql2Connection(resource: mysql2.Connection | async factory)
connect(resource): Engine<mysql2.Connection>
```

- uses `Mysql` dialect and mysql2 promise `execute(query, values)`;
- keeps `?` placeholders; escaped `??` is preserved as a literal question mark;
- `query()` returns row arrays and otherwise `[]`;
- captures `ResultSetHeader.insertId` as `connection.lastId`;
- `raw()` returns mysql2's tuple result;
- transaction calls native `beginTransaction`, `commit`, and `rollback`.

A pool itself is not the declared `Resource`; provide an acquired connection or
factory with transaction affinity.

## PostgreSQL / pg

```ts
new PGConnection(resource: pg.Client|pg.PoolClient|async factory)
connect(resource): Engine<pg.Client|pg.PoolClient>
```

- uses `Pgsql` dialect and native `resource.query(query, values)`;
- converts each `?` placeholder to `$1`, `$2`, and so on;
- protects `??` from parameter conversion and restores it as literal `?`;
- throws when placeholder count and value count differ;
- `query()` returns `result.rows`; `raw()` returns the full pg result;
- `lastId` is always undefined; use `RETURNING` when IDs/results are needed;
- transaction issues `BEGIN`, `COMMIT`, and `ROLLBACK` on the same cached client.

When using a pool, the connector must resolve one checked-out `PoolClient` for
the transaction lifetime; independent pool queries do not provide that boundary.

## PGlite

```ts
new PGLiteConnection(resource: PGlite|async factory)
connect(resource): Engine<PGlite>
```

PGlite shares PostgreSQL dialect and placeholder validation. `query()` returns
`result.rows`; `raw()` returns PGlite result metadata. Requests without values
use `resource.exec(query)[0]`; valued requests use `resource.query`. Transactions
issue SQL `BEGIN`/`COMMIT`/`ROLLBACK` through the cached resource.

PGlite is an embedded/WASM PostgreSQL implementation, not a network pg client.
Its persistence, extension, concurrency, filesystem, and deployment properties
must be evaluated separately despite shared SQL dialect generation.

## SQLite / better-sqlite3

```ts
new BetterSqlite3Connection(resource: Database|async factory)
connect(resource): Engine<Database>
```

- uses `Sqlite` dialect and synchronous prepared statements behind async methods;
- retains `?` placeholders and escapes `??` as a literal question mark;
- additionally maps booleans to `0`/`1`;
- SELECT and INSERT-with-RETURNING use `stmt.all(...values)`;
- other statements use `stmt.run(...values)`;
- `query()` returns rows or `[]` and records `lastInsertRowid` as `lastId`;
- transaction issues `BEGIN TRANSACTION`, `COMMIT`, and `ROLLBACK`.

The package name says sqlite3 for historical/distribution purposes, but the
declared native resource is `better-sqlite3.Database`.

## Connection Interface

The common Inquire `Connection<R>` contract expected by `Engine` is:

```ts
readonly dialect: Dialect
readonly lastId?: string|number
before: (request: QueryObject) => Promise<void>
format(request): QueryObject
query<T>(request): Promise<T[]>
raw<T>(request): Promise<unknown>
resource(): Promise<R>
transaction<T>(callback): Promise<T>
```

`format()` mutates/reuses the request values array in current adapters. Do not
assume a query object remains byte-for-byte unchanged after execution.

## Choosing An Adapter

Choose from deployment and operational constraints, not only dialect syntax:

- MySQL network deployment and mysql2 transaction/client lifecycle;
- PostgreSQL network/service deployment and checked-out client ownership;
- PGlite embedded/WASM deployment and its persistence/concurrency envelope;
- SQLite local-file deployment and synchronous native addon requirements.

An adapter export proves implementation. Claim “tested,” “demonstrated,” or
“supported” only with corresponding current integration evidence. Cross-dialect
generated SQL should be asserted independently.

## Safety And Portability Boundaries

- Transaction correctness depends on retaining one native resource.
- Adapter hooks can alter final queries and are security-sensitive.
- Raw results and errors are native and non-portable.
- JSON/date/boolean serialization differs by adapter.
- DDL, returning, JSON, truncate, and alter behavior remain dialect-specific.
- Connector factories must handle connection close/release outside this wrapper;
  adapters do not expose a shared shutdown lifecycle.

## Source Anchors And Authority

Checkout anchors: Inquire adapter packages
`inquire-{mysql2,pg,pglite,sqlite3}/src/{index,Connection,helpers,types}.ts`, core
connection types/dialects, Stackpress SQL adapter facades, and maintained Inquire
examples. Source behavior is authority; examples demonstrate paths but do not
establish a support matrix. Existing adapter docs are parity benchmarks.
