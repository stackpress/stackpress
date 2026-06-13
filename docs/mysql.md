# `stackpress/mysql`

`stackpress/mysql` is the MySQL-specific SQL subpath. It combines the shared SQL builders and helpers with MySQL connection helpers exposed through the Stackpress public surface.

## Import

```ts
import { Mysql, Mysql2Connection, connect } from 'stackpress/mysql';
```

## When To Use It

Use this path when you need MySQL-specific connection or dialect behavior instead of only the shared `stackpress/sql` surface.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `Mysql` | class | MySQL dialect class |
| `Mysql2Connection` | class | MySQL connection wrapper |
| `connect` | function | Create a MySQL-backed connection |
| shared SQL builders and helpers | classes/functions | Same builder surface as `stackpress/sql` |

## Detailed Exports

### `Mysql`

- Kind: class
- Use it when you need the MySQL dialect class directly.

```ts
import { Mysql } from 'stackpress/mysql';
```

### `Mysql2Connection`

- Kind: class
- Use it when working with the MySQL connector layer exposed through Stackpress.

```ts
import { Mysql2Connection } from 'stackpress/mysql';
```

### `connect`

- Kind: function
- Use it to create a MySQL-backed Stackpress SQL connection.
- **Returns** a MySQL-compatible connection object.

```ts
import { connect } from 'stackpress/mysql';
```

## Related

 - [Connection Adapters](./sql/connections.md)
 - [SQL](./sql.md)
