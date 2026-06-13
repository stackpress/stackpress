# `stackpress/sqlite`

`stackpress/sqlite` is the SQLite-specific SQL subpath. It combines the shared SQL builders and helpers with SQLite connection helpers exposed through the Stackpress public surface.

## Import

```ts
import { Sqlite, BetterSqlite3Connection, connect } from 'stackpress/sqlite';
```

## When To Use It

Use this path when you need SQLite-specific connection or dialect behavior instead of only the shared `stackpress/sql` surface.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `Sqlite` | class | SQLite dialect class |
| `BetterSqlite3Connection` | class | SQLite connection wrapper |
| `connect` | function | Create a SQLite-backed connection |
| shared SQL builders and helpers | classes/functions | Same builder surface as `stackpress/sql` |

## Detailed Exports

### `Sqlite`

- Kind: class
- Use it when you need the SQLite dialect class directly.

```ts
import { Sqlite } from 'stackpress/sqlite';
```

### `BetterSqlite3Connection`

- Kind: class
- Use it when working with the SQLite connector layer exposed through Stackpress.

```ts
import { BetterSqlite3Connection } from 'stackpress/sqlite';
```

### `connect`

- Kind: function
- Use it to create a SQLite-backed Stackpress SQL connection.
- **Returns** a SQLite-compatible connection object.

```ts
import { connect } from 'stackpress/sqlite';
```

## Related

 - [Connection Adapters](./sql/connections.md)
 - [SQL](./sql.md)
