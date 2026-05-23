# 05. First Database And Populate

This tutorial makes the article model persistent by adding a store plugin, database config, and populate flow.

## 1. Overview

In this step you will:

 - move the existing app files into `plugins/app`
 - create the store plugin
 - add database config with article-only population
 - add `stackpress-sql` and the store plugin to the plugin list last
 - add SQL-related scripts to `package.json` last
 - run the database command sequence including populate

The visible goal is real article data stored in the local database.

## 2. Setting Up / Coding

Install the local database dependency:

```bash
npm i @electric-sql/pglite
```

Command guide:

 - `npm i @electric-sql/pglite` installs the local database engine used by the store connection
 - you do not need to install any other Stackpress package here because `stackpress` is already installed

Create folders:

```bash
mkdir -p plugins/app/pages plugins/app/views plugins/store
```

Command guide:

 - `mkdir -p plugins/app/pages plugins/app/views plugins/store` creates the app and store plugin folders you need for this step
 - `-p` lets you create the nested folders in one command

Move the existing app files into `plugins/app`:

 - move `plugin.ts` to `plugins/app/plugin.ts`
 - move `pages/home.ts` to `plugins/app/pages/home.ts`
 - move `pages/error.ts` to `plugins/app/pages/error.ts`
 - move `views/home.tsx` to `plugins/app/views/home.tsx`
 - move `views/error.tsx` to `plugins/app/views/error.tsx`

After the move, update the route paths inside the app plugin so they still point to `./pages/*` and `@/plugins/app/views/*`.

Create `plugins/store/connect.ts`:

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

Create `plugins/store/plugin.ts`:

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

Expand `config.ts` with minimal database population:

```ts
import path from 'node:path';
import { server as http } from 'stackpress/http';

export const config = {
  client: {
    //whether to compiler client in `js` or `ts`
    lang: 'ts',
    //used by `stackpress/client` to `import()`
    //the generated client code to memory
    module: 'client-source',
    //name of the client package used in package.json
    package: 'client-source',
    //where to store the generated client code
    build: path.join(process.cwd(), 'client-source')
  },
  database: {
    migrations: path.join(process.cwd(), '.build/migrations'),
    schema: {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    },
    populate: [
      {
        event: 'article-create',
        data: {
          id: 'hello-world',
          title: 'Hello World',
          slug: 'hello-world',
          active: true
        }
      }
    ]
  },
  server: {
    mode: 'development'
  }
};

export default async function bootstrap() {
  const server = http();
  server.config.set(config);
  await server.bootstrap();
  await server.resolve('config');
  await server.resolve('listen');
  await server.resolve('route');
  return server;
}
```

Now update `package.json` last:

```json
{
  "plugins": [
    "./plugins/app/plugin",
    "./plugins/store/plugin",
    "stackpress-server",
    "stackpress-view",
    "stackpress-schema",
    "stackpress-sql"
  ],
  "scripts": {
    "develop": "stackpress develop --b config -v",
    "generate": "stackpress generate --b config -v",
    "push": "stackpress push --b config -v",
    "populate": "stackpress populate --b config -v",
    "query": "stackpress query --b config -v"
  }
}
```

Command guide:

 - adding `./plugins/app/plugin` replaces the old root-level plugin path after the move
 - adding `./plugins/store/plugin` turns on your local store layer
 - adding `stackpress-sql` turns on SQL generation and SQL-backed events
 - `push` creates or updates the local database structure
 - `populate` inserts the sample article record
 - `query` is a utility for direct SQL such as `npm run query "SELECT * from article"`

## 3. Viewing Results

Run:

```bash
npm run generate
npm run push
npm run populate
npm run query "SELECT * from article"
```

Command guide:

 - `npm run generate` refreshes the generated schema and SQL-facing output
 - `npm run push` creates the `Article` table
 - `npm run populate` inserts the article from `config.ts`
 - `npm run query "SELECT * from article"` lets you inspect the database directly

Success means the database is created and the query step shows at least one `Article` row for `hello-world`.

## 4. What Was Learned

You now have a real persistence layer.

This step added:

 - the store plugin
 - the moved app plugin structure under `plugins/app`
 - database registration
 - SQL behavior through `stackpress-sql`
 - populate data for the article model

The app now has stored article data, which makes the next step meaningful.
