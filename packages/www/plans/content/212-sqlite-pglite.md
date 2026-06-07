# 212 SQLite / PGlite

Configure a lightweight local database, run schema push, and populate starter data. That context prepares the reader for the more specific form that follows.

**Previously:** The previous lesson, `211 Dialects`, gave you the setup this page builds on. Here, the focus shifts to `SQLite / PGlite` so you can place the next Stackpress surface in the course path.

## 212.1. Goal

Local data should be easy to start and easy to throw away while you are learning. PGlite gives the course a PostgreSQL-like local path without asking you to manage a separate database server first.

## 212.2. Configure The Local Database

Create a connection helper:

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

Register it in a store plugin:

```ts
import type { Server } from 'stackpress/server';
import connect from './connect.js';

export default function plugin(server: Server) {
  server.on('config', async () => {
    server.register('database', await connect());
  });
}
```

Run:

```bash
stackpress push --b config -v
stackpress populate --b config -v
```

Use this as the concrete version of the explanation above. The part to copy is the structure; the part to change is the value that matches your app.

## 212.3. Run The App

The connection helper created a local PGlite database file. The store plugin registered that connection before database commands run. `push` applies schema structure, and `populate` inserts configured starter data.

## 212.4. Generate Or Push Schema

This section explains what local database work creates and where it lands. PGlite and SQLite are the local database choices, while `.build` is where generated working state often appears.

### 212.4.1. PGlite

PGlite is useful for local development because it keeps the database near the project and does not require a separate server. Keep the idea tied to the concrete project surface in this section.

### 212.4.2. SQLite

SQLite is another lightweight local option. Use it when your app or environment specifically wants SQLite behavior.

### 212.4.3. `.build`

Templates often put local database files and migrations under `.build`. Treat that folder as generated working state.

## 212.5. Check Data

This part of the SQLite / PGlite workflow is easier to follow when the smaller pieces are compared together. The subsections cover Reset Local Data, Change The Database File, Inspect Local Data, so the reader can see how each piece changes the local decision.

### 212.5.1. Reset Local Data

```bash
stackpress purge --b config -v
stackpress push --b config -v
stackpress populate --b config -v
```

This example gives the idea something concrete to inspect. Look for the file, helper, or value that changed; that is the part you would adjust first in your own app.

### 212.5.2. Change The Database File

Set `DATABASE_URL` when you need a different local database file for a test or sample. The nearby example or check shows the project detail affected by this idea.

### 212.5.3. Inspect Local Data

```bash
stackpress query --b config -v
```

In this example, the useful part is the value being passed, returned, or configured. That is usually the first thing a developer changes when adapting the pattern.

## 212.6. Keep In Mind

For SQLite / PGlite, focus first on the problem it solves, then use the syntax as the concrete way Stackpress represents that problem. Compare the concrete details to see the app-level effect.

Read `221 Select` to query records for page rendering. For connection exports, use [PGlite Reference](/reference/pglite) and [SQLite Reference](/reference/sqlite). Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `213 PostgreSQL`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
