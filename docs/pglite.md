# `stackpress/pglite`

`stackpress/pglite` is the local PGlite-focused SQL subpath. It combines the shared SQL builders and helpers with a lightweight PostgreSQL-style local connection layer suitable for app development and local database workflows.

## Import

```ts
import { PGLiteConnection, connect } from 'stackpress/pglite';
```

## When To Use It

Use this path when you want a file-backed local PostgreSQL-style database during development or when you are wiring the local `push`, `populate`, `query`, or `purge` workflow.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `PGLiteConnection` | class | PGlite connection wrapper |
| `connect` | function | Create a PGlite-backed connection |
| shared SQL builders and helpers | classes/functions | Same builder surface as `stackpress/sql` |

## Detailed Exports

### `PGLiteConnection`

- Kind: class
- Use it when you need the local PGlite connection wrapper directly.

```ts
import { PGLiteConnection } from 'stackpress/pglite';
```

### `connect`

- Kind: function
- Use it to create a PGlite-backed Stackpress SQL connection.
- **Returns** a connection object compatible with the Stackpress database registration flow.

```ts
import { connect } from 'stackpress/pglite';
```

## Related

 - [Connection Adapters](./sql/connections.md)
 - [SQL](./sql.md)
 - [CLI Reference](./cli-reference.md)
