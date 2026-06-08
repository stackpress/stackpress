# 210 Connections

A connection is the adapter between app code and a real database driver. It
knows which SQL dialect is active, how to format values for the driver, how to
run SQL, and how to return plain rows to application code.

**Previously:** `Data` introduced the local database anchor used by a
scaffolded app. Here, the focus shifts to how that database becomes an engine
the app can register and use.

## 210.1. Why Connections Matter

A query cannot be useful until the app knows which database it should talk to.
The connection wrapper describes that target and exposes the dialect rules the
engine needs.

In Inquire, all connection wrappers implement the same core shape. They expose
`dialect`, run `query(request)`, format values through `format(request)`,
return the native driver with `resource()`, and run grouped work with
`transaction(callback)`.

## 210.2. A Concrete Local Connection

A scaffolded app uses PGlite as the local database path. First, it chooses a
database URL before creating the native driver. That gives the lesson a real
file path to inspect instead of treating "database connection" as an abstract
setting:

```ts
const url = process.env.DATABASE_URL || './.build/database';
```

This line gives local development a default database folder while still letting
the environment override it. That makes the app usable without extra setup,
but configurable when a caller wants a different database location.

Then `connect()` maps the native PGlite resource into an Inquire engine:

```ts
import { PGlite } from '@electric-sql/pglite';
import { connect as pglite } from 'stackpress/pglite';

export default async function connect() {
  return pglite(async () => {
    return new PGlite(file);
  });
}
```

The native `PGlite` object is the database driver. `pglite(...)` wraps that
driver so the rest of the app can work through the shared engine and connection
interfaces.

## 210.3. Register The Engine

The store plugin registers the connected engine during the `config` lifecycle:

```ts
server.on('config', async _ => {
  const connection = await connect();
  connection.before = async request => {
    console.log('Executing query:', request);
  };
  server.register('database', connection);
});
```

The `config` listener creates the connection before routes need it.
`connection.before` logs the query request before execution, and
`server.register('database', connection)` gives later app code a named engine
to resolve.

## 210.4. Connection Choices

The Inquire connection docs list wrappers for MySQL2, PostgreSQL, PGlite, and
better-sqlite3. Each wrapper adapts a native driver to the shared connection
interface, but each one exposes a different dialect and driver behavior.

For the course path, start with the confirmed PGlite scaffold because it keeps
local setup small. Compare other dialects later when the app has a production
or team requirement that justifies the extra setup.

## 210.5. Mistakes To Avoid

Connection mistakes usually make query code look broken even when the query is
fine. Check the database target before rewriting operation code.

### 210.5.1. Hide The Database Path

```ts
const resource = new PGlite('./some/path');
```

This works, but it makes local data harder to inspect when every environment
chooses a different path by hand. Prefer a config or environment value with a
clear default such as `DATABASE_URL || './.build/database'`.

### 210.5.2. Skip Registration

```ts
const connection = await connect();
```

Creating an engine is not enough if the rest of the app expects to resolve it
by name. Register the engine with the server so later routes, events, or store
code can find the same database surface.

### 210.5.3. Debug Queries Before The Connection

```ts
await engine.query('SELECT 1');
```

If this fails during startup, confirm the database file, driver package, and
connection registration first. A missing folder or wrong URL can look like a
query problem even though the SQL was never the issue.

**Next course:** Continue with `Dialects`. That page explains how supported
dialects change SQL placeholders, type mapping, and connection behavior.
