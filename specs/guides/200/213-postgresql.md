# 213 PostgreSQL

PostgreSQL is the next database step when local file-backed development is no
longer enough. The app still uses the same Stackpress data surface, but the
connection now points to a PostgreSQL server.

**Previously:** `SQLite / PGlite` showed the confirmed local PGlite path. Here,
the focus shifts to what changes when the database target becomes PostgreSQL.

## 213.1. The Decision

Choose PostgreSQL when the deployment, team environment, or production data
plan already expects PostgreSQL. The Stackpress routes, generated actions, and
view code should not need to change just because the database driver changes.

The important change is the connection helper. PGlite creates a local resource
from a file path, while PostgreSQL uses a native `pg` client connected to a
server.

## 213.2. When PostgreSQL Fits

Use the PostgreSQL public path when you need PostgreSQL-specific connection or
dialect behavior:

```ts
import { Pgsql, PGConnection, connect } from 'stackpress/pgsql';
```

The public path exposes the PostgreSQL dialect, connection wrapper, and shared
SQL builder surface. Most app code should use the connected engine through the
registered `database` plugin rather than importing the dialect directly.

The lower-level connection shape uses a native `pg` client:

```ts
import { Client } from 'pg';
import { connect } from 'stackpress/pgsql';

const client = new Client({
  database: 'app',
  user: 'postgres'
});

await client.connect();

const connection = connect(client);
```

The native `Client` talks to PostgreSQL. `connect(client)` wraps that resource
so the rest of the app can use the same engine-style database surface taught
in earlier lessons.

## 213.3. Connection Config

In a Stackpress app, register the connected database during the `config`
lifecycle, the same way the PGlite scaffold registers its local connection:

```ts
server.on('config', async _ => {
  const connection = await connectPostgres();
  server.register('database', connection);
});
```

This example intentionally uses a named helper instead of pretending the
PostgreSQL connection has a confirmed scaffold file in this repo. The helper
should create and connect the native `pg` client, then return the wrapped
Stackpress/PostgreSQL connection.

Keep host, user, password, database, and URL values outside committed source
when they contain secrets:

```ts
const client = new Client({
  connectionString: process.env.DATABASE_URL
});
```

This keeps the lesson focused on the boundary that changes. The app resolves
`database` the same way, but the helper decides which PostgreSQL server the app
talks to.

## 213.4. Migration Or Push Flow

After PostgreSQL is registered, the familiar database commands still apply:

```bash
stackpress push --b config -v
stackpress populate --b config -v
stackpress query "SELECT * FROM article" --b config -v
```

`push` applies generated schema state to the configured database. `populate`
runs starter data if the config provides it, and `query` verifies the database
that the PostgreSQL connection actually reaches.

PostgreSQL uses the `Pgsql` dialect behavior. That means wrappers rewrite `?`
placeholders to `$1`, `$2`, and so on, use double quotes for identifiers, map
generic JSON to `JSONB`, and use PostgreSQL-style auto-increment behavior.

## 213.5. Tradeoffs

PostgreSQL is closer to a production database workflow than local PGlite, but
it also adds server setup, credentials, network access, and environment
management. Those extra moving parts are worth it when the app needs a shared
database or production parity.

The main tradeoff for junior developers is debugging scope. If a query fails
after switching to PostgreSQL, check the connection first, then the generated
event or action, then the data.

```bash
stackpress query "SELECT 1" --b config -v
```

This small query verifies that Stackpress can reach the configured PostgreSQL
database. If this fails, changing route or view code is the wrong first move.

## 213.6. Verify

A good PostgreSQL setup is proven by the same app-facing checks as the local
database path. The app should register `database`, generated actions should be
able to run, and a terminal query should reach the expected PostgreSQL server.

This repo does not currently include a confirmed end-to-end PostgreSQL
Stackpress scaffold. Treat this lesson as the source-backed connection shape,
not as a production deployment checklist.

**Learning checkpoint:** Before moving on, make sure you can explain the
difference between the native `pg` client and the wrapped Stackpress
PostgreSQL connection.

**Next course:** Continue with `MySQL`. That course compares the same
connection decision against the MySQL dialect and driver path.
