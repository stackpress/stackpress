# SQL API Contracts

Use this reference for Inquire query mechanics and Stackpress's generated SQL
store/action layer. Connector-specific setup belongs in Database Adapter Contracts.

## Ownership And Intent

`@stackpress/inquire` owns visible, parameterized SQL builders, dialects,
connections, transactions, and schema diff mechanics. `stackpress-sql` converts
normalized Stackpress models into generated stores/actions/events and coordinates
revision-driven database operations.

The boundary is intentional: Inquire remains domain-agnostic and inspectable;
Stackpress adds model semantics without hiding the emitted SQL or native
connection behind an ORM identity map.

## Exports

`stackpress-sql` re-exports Inquire `Alter`, `Create`, `Delete`, `Insert`,
`Select`, `Update`, `Mysql`, `Pgsql`, `Sqlite`, `Engine`, exception, helper
functions, and query/connection types. It adds SQL scalar helpers, selector/alias
helpers, `ActionsInterface`, `StoreInterface`, events, scripts, config/client
types, and `StackpressSqlException`.

## Engine

```ts
new Engine<R>(connection: Connection<R>)
```

Public `connection` preserves the adapter. `dialect` proxies its dialect.
`before` is an async query hook that may log/mutate the `QueryObject` or return
results to skip native execution.

```ts
engine.alter(table)        // Alter
engine.create(table)       // Create
engine.delete(table)       // Delete
engine.insert(table)       // Insert
engine.select(columns?)    // Select
engine.update(table)       // Update
engine.diff(from, to)      // Alter
engine.drop(table)         // Promise rows
engine.rename(from, to)    // Promise rows
engine.truncate(table, cascade?)
engine.query(queryObject)
engine.query(sql, values?)
engine.sql`SELECT ... ${value}`
engine.transaction(callback)
```

`sql` joins template segments with placeholders and replaces backticks with the
dialect quote. Values remain separate. `query` accepts a query object or SQL plus
values. `transaction` delegates to the connection's transaction contract.

`diff()` compares two built `Create` definitions for the same logical table and
plans field, primary, unique, index, and foreign-key additions/removals/changes.
It does not compare table names or infer semantic renames. Callers with rename
intent can reconcile a matching remove/add pair through
`engine.diff(from, to).renameField(fromField, toField)`.

## Builder Contract

Builders retain structured state, expose `build()`, render with `query(dialect?)`,
and are awaitable through `then()` when attached to an engine. Calling `query`
without a supplied/engine dialect throws; awaiting without an engine throws.

| Builder | Construction and chain methods |
| --- | --- |
| `Create` | `(table, engine?)`; `addField`, `addForeignKey`, `addKey`, `addPrimaryKey`, `addUniqueKey` |
| `Alter` | same add methods plus `changeField`, `renameField`, `removeField`, `removeForeignKey`, `removeKey`, `removePrimaryKey`, `removeUniqueKey` |
| `Insert` | `(table, engine?)`; `values(record|records)`, `returning(columns='*')` |
| `Select` | `(columns?, engine?)`; `select`, `from`, `join`, `where`, `whereJson`, `whereJsonContains`, `order`, `limit`, `offset` |
| `Update` | `(table, engine?)`; `set`, `where`, `whereJson`, `whereJsonContains` |
| `Delete` | `(table, engine?)`; `where`, `whereJson`, `whereJsonContains` |

Create/Alter dialect output may be multiple statements and await inside a
transaction, returning the last result. Other builders execute one query.
Update/Delete/Select default JSON selector notation to `:` and nested separator
to `.`; both are mutable for integration-specific syntax.

```ts
const rows = await engine
  .select(['id', 'profile.name'])
  .from('article')
  .where('status = ?', ['PUBLISHED'])
  .order({ created: 'DESC' })
  .limit(20);
```

Raw clauses are caller-authored SQL; values should stay in the values arrays.

## Field And Relationship Shape

Create/Alter fields carry dialect-consumed properties including type, length,
nullable, default, auto-increment, attribute, comment, and unsigned. Foreign
keys identify local field, foreign table/field, and update/delete rules. Named
keys and uniques map a name to one or more fields; primary is an ordered list.

Stackpress derives these from schema lenses such as IDs, uniqueness, indexes,
relations, number bounds, required/multiple state, defaults, and storage flags.
The generated definition is reviewable through `store.create().build()` and
`store.create().query(engine.dialect)`.

## Dialects

`Mysql`, `Pgsql`, and `Sqlite` implement the same dialect contract for alter,
create, delete, drop, insert, JSON extraction/containment, rename, select,
truncate, and update. Each exposes `name`, quote character `q`, and overloaded
`json(column, path|string[], separator?)`.

Dialect parity is behavioral, not textual. DDL capabilities, auto-increment,
returning syntax, JSON operators, placeholder formatting, alter strategy,
truncate/cascade, and transaction behavior differ. Assert generated SQL and run
adapter integration tests for every claimed target.

## Generated Store Interface

Every generated model store extends its generated schema and exposes:

```ts
relations: Record<string, StoreRelation>
table: string
alter(to?: Create): Alter
create(): Create
delete(filters?): Delete
insert(input): Insert
select(query?): Select
update(filters, input): Update
selectors(expressions): StoreSelector[]
joins(query): StoreJoin[]
paths(expression, paths?): StorePath[]
scalarize(values): Record<string, ValueScalar>
unscalarize(values): Partial<Model>
where(builder, filters?): WhereBuilder
```

Selector expressions traverse relations with dots and JSON beneath a column
with `:`. Generated aliases join normalized path segments with `__` so nested
rows can be reconstructed. `scalarize` serializes model values then maps names
to SQL columns; `unscalarize` reverses storage and naming transformations.

Filters are `q`, `eq`, `ne`, `ge`, `le`, `has`, `like`, and `hasnt`. Select adds
`columns`, `sort`, `skip`, and `take`; search adds `total`. Only generated
searchable/sortable/filterable paths should be externally exposed without
additional validation.

## Generated Actions Interface

Actions own executable model workflows over one store:

```ts
batch(inputs, mode?: 'create'|'update'|'upsert')
count(filters & { columns? })
create(input)
delete(filters)       // hard delete
find(query)           // one extended row or null
findAll(query)        // extended rows
install()
purge(cascade?)
remove(filters)       // soft delete through active field
restore(filters)
uninstall()
upgrade(to)
update(filters, input)
upsert(input)
```

Generated model packages also provide events (`batch`, `create`, `detail`,
`get`, `purge`, `remove`, `restore`, `search`, `update`, `upsert`), a listener,
admin router, and install/purge/uninstall/upgrade scripts. Event handlers apply
request/response conventions around actions; the actions remain directly usable.

## Stackpress SQL Helpers

`toSqlString`, `toSqlBoolean`, `toSqlDate`, `toSqlInteger`, and `toSqlFloat`
preserve `undefined`/`null` in non-strict mode and return type defaults in strict
mode. Invalid dates become epoch; invalid numbers become zero. Object strings
are JSON encoded.

`getAlias`, `storePathToAlias`, and `storeSelectorToSqlSelector` normalize model
paths to snake-case SQL selectors and stable nested aliases. The `Migrations`
class composes schema revision history with an Inquire engine. It compares
adjacent models' built SQL signatures, applies unambiguous one-to-one,
same-semantics plans to `engine.diff(from, to)` through
`renameField(fromField, toField)`, and returns queries with ambiguity and
destructive-warning metadata. Inquire owns the resulting dialect SQL and builder
reconciliation; Stackpress does not emit raw rename statements or rewrite
create-table builders. The former `scripts/helpers` planning surface has been
removed; migration behavior is owned by this class.

## Operational Boundaries

- Install, upgrade, and purge use transactions around their generated sequences.
- Migration writes raw artifacts without applying warning/refusal policy.
- Revisions record generated schema snapshots, not live applied state.
- Population emits configured events sequentially without one outer transaction.
- `--force` on ambiguous/destructive upgrade accepts the planned raw queries;
  clear rename plans remain preserved.
- Native adapter result/error/transaction semantics remain relevant.

## Source Anchors And Authority

Checkout anchors: Inquire `Engine.ts`, builders, dialects, helpers, types;
Stackpress SQL interfaces, `Migrations`, helpers, types, transforms, generated
actions/stores, events, scripts, and plugin. Generated template output is
runtime evidence. Source and generated contracts are authority; existing docs
are benchmarks.
