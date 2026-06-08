# `stackpress/pgsql`

`stackpress/pgsql` is the PostgreSQL-specific SQL subpath. It combines the shared SQL builders and helpers with PostgreSQL connection helpers exposed through the Stackpress public surface.

## Import

```ts
import { Pgsql, PGConnection, connect } from 'stackpress/pgsql';
```

## When To Use It

Use this path when you need PostgreSQL-specific connection or dialect behavior instead of only the shared `stackpress/sql` surface.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `Pgsql` | class | PostgreSQL dialect class |
| `PGConnection` | class | PostgreSQL connection wrapper |
| `connect` | function | Create a PostgreSQL-backed connection |
| shared SQL builders and helpers | classes/functions | Same builder surface as `stackpress/sql` |

## Detailed Exports

### `Pgsql`

- Kind: class
- Use it when you need the PostgreSQL dialect class directly.

```ts
import { Pgsql } from 'stackpress/pgsql';
```

### `PGConnection`

- Kind: class
- Use it when working with the PostgreSQL connector layer exposed through Stackpress.

```ts
import { PGConnection } from 'stackpress/pgsql';
```

### `connect`

- Kind: function
- Use it to create a PostgreSQL-backed Stackpress SQL connection.
- **Returns** a PostgreSQL-compatible connection object.

```ts
import { connect } from 'stackpress/pgsql';
```

## Related

 - [Connection Adapters](./sql/connections.md)
 - [SQL](./sql.md)
