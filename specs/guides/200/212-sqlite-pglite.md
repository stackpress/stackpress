# 212 SQLite / PGlite

Local database setup should feel disposable while you are learning. You need a
database that can hold real rows, but you should also be able to reset it when
the schema or seed data gets messy.

**Previously:** `Dialects` explained why database families have different SQL
rules. Here, the focus narrows to the lightweight local path used by a
scaffolded app.

## 212.1. Goal

The goal is to configure a local PGlite database, register it with the app, run
schema/data commands, and verify that the database contains rows. This gives
later select, insert, update, and delete lessons a real place to work.

PGlite is useful for the course path because it behaves like a PostgreSQL-style
local database without requiring a separate database server. SQLite is also a
lightweight local database option, but the scaffolded app uses PGlite as the
confirmed local source.

## 212.2. Configure The Local Database

Start with the connection helper from a scaffolded app:

```ts
import fs from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { connect as pglite } from 'stackpress/pglite';

const url = process.env.DATABASE_URL || './.build/database';

export default async function connect() {
  return pglite(async () => {
    const file = path.resolve(process.cwd(), url);
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    return new PGlite(file);
  });
}
```

This helper chooses a database location from `DATABASE_URL` and falls back to
`./.build/database`. It also creates the parent folder before constructing the
native `PGlite` resource, which keeps the first local run from failing because
the generated-state folder does not exist yet.

Next, register that connection in the store plugin:

```ts
import type { Server } from 'stackpress/server';
import connect from './connect.js';

export default function plugin(server: Server) {
  server.on('config', async _ => {
    const connection = await connect();
    connection.before = async request => {
      console.log('Executing query:', request);
    };
    server.register('database', connection);
  });
}
```

The `config` event is the app setup moment where the store plugin prepares the
database surface. The `before` hook logs query requests, and
`server.register('database', connection)` makes the connected engine available
to later route, event, and generated store code.

## 212.3. Run The App

A scaffolded app exposes database commands through package scripts. Use those
scripts when you are working inside the app because they already include the
development bootstrap module and environment loading.

```json
{
  "scripts": {
    "push": "dotenv -e .env -- stackpress push --b config/develop -v",
    "populate": "dotenv -e .env -- stackpress populate --b config/develop -v",
    "query": "dotenv -e .env -- stackpress query --b config/develop -v",
    "purge": "dotenv -e .env -- stackpress purge --b config/develop -v"
  }
}
```

These scripts are thin wrappers around Stackpress CLI commands. The important
detail is the `--b config/develop` bootstrap, because it tells the command to
load the same development config and plugins that the local app uses.

## 212.4. Generate Or Push Schema

Run `push` after generation-facing schema or config changes need to reach the
local database. `push` creates or updates database structure from the current
schema and database config.

```bash
yarn push
```

This command uses the package script and loads the local PGlite connection
through the store plugin. If the database path is still the default, the local
state lands under `./.build/database`.

Then insert configured starter data:

```bash
yarn populate
```

`populate` runs the configured populate flow after the schema exists. Use it
when the next lesson needs real records to select, render, update, or delete.

## 212.5. Check Data

After pushing and populating, inspect the database instead of assuming the data
exists. A later route can only render rows that the configured local database
actually contains.

```bash
yarn query
```

This runs the query command against the development config. For a
more specific check, pass a SQL statement through the underlying Stackpress
command, such as `stackpress query "SELECT * FROM article" --b config/develop
-v`.

If the local database is in a confusing state, reset it deliberately:

```bash
yarn purge
yarn push
yarn populate
```

This sequence clears local data, recreates or updates schema structure, and
loads starter records again. Use it when a clean local dataset is the goal, not
when you only need to inspect the current rows.

## 212.6. Keep In Mind

Treat `.build` as generated local working state. It is useful because the app
can rebuild it, but it is not the source file you edit to define a model,
route, or plugin.

Keep PGlite and SQLite separate in your mental model. They are both lightweight
local options, but PGlite follows the PostgreSQL-style dialect path while
SQLite has its own dialect and type mapping behavior.

**Learning checkpoint:** Before moving on, make sure you can point to the
connection helper, explain why it creates `./.build/database` by default, and
run the push, populate, query, and reset commands through the package scripts.

**Next course:** Continue with `PostgreSQL`. That course explains what changes
when local file-backed development is no longer the database target.
