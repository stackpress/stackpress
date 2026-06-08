# Connection Adapters

Connection adapters wrap native database drivers so Stackpress and Inquire can
use a shared engine-style database surface.

## Imports

```ts
import { connect as mysql } from 'stackpress/mysql';
import { connect as pgsql } from 'stackpress/pgsql';
import { connect as pglite } from 'stackpress/pglite';
import { connect as sqlite } from 'stackpress/sqlite';
```

## Adapter Inventory

| Subpath | Connection Class | Native Resource |
| --- | --- | --- |
| `stackpress/mysql` | `Mysql2Connection` | `mysql2/promise` connection or pool resource. |
| `stackpress/pgsql` | `PGConnection` | `pg` client or pool resource. |
| `stackpress/pglite` | `PGLiteConnection` | `@electric-sql/pglite` resource. |
| `stackpress/sqlite` | `BetterSqlite3Connection` | `better-sqlite3` database resource. |

## PGlite Example

```ts
import { PGlite } from '@electric-sql/pglite';
import { connect } from 'stackpress/pglite';

export default async function connectDatabase() {
  return connect(async () => {
    return new PGlite('./.build/database');
  });
}
```

This example creates a local PGlite resource and wraps it as a Stackpress SQL
connection. Register the returned engine as the `database` plugin during app
config.

## PostgreSQL Example

```ts
import { Client } from 'pg';
import { connect } from 'stackpress/pgsql';

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const engine = connect(client);
```

This example wraps a connected PostgreSQL client. Keep credentials in
environment variables or deployment secrets.

## Returns

Each `connect(...)` helper returns a connection/engine surface that can be
registered as the Stackpress `database` plugin.

## Related

 - [Engine](./Engine.md)
 - [MySQL](../mysql.md)
 - [PostgreSQL](../pgsql.md)
 - [PGlite](../pglite.md)
 - [SQLite](../sqlite.md)
