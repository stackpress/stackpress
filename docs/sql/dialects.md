# Dialect Classes

Dialect classes describe how builder state becomes SQL for a database family.
Stackpress exports `Mysql`, `Pgsql`, and `Sqlite` from `stackpress/sql`.

## Import

```ts
import { Mysql, Pgsql, Sqlite } from 'stackpress/sql';
```

## When To Use Them

Most app code should choose a connection adapter instead of choosing a dialect
directly. Use dialect imports when generating SQL, inspecting query output, or
writing lower-level tests.

```ts
const request = engine.select('*')
  .from('article')
  .where('id = ?', [ id ])
  .query(Pgsql);
```

This example creates a PostgreSQL-shaped query request. PostgreSQL-style
dialects rewrite placeholders and identifiers differently than MySQL or
SQLite.

## Dialect Inventory

| Class | Database Family | Notes |
| --- | --- | --- |
| `Mysql` | MySQL / MySQL2 | Uses MySQL identifier and placeholder rules. |
| `Pgsql` | PostgreSQL / PGlite | Uses PostgreSQL-style placeholders and JSON behavior. |
| `Sqlite` | SQLite / better-sqlite3 | Uses SQLite type and alter-table behavior. |

## Related

 - [Connections](./connections.md)
 - [SQL Module](../sql.md)
