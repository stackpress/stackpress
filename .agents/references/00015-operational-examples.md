# Operational Examples

Use these source-backed recipes to teach or document complete Stackpress flows.
Replace names/paths with the target app's config; examples are patterns, not
required domains.

## Baseline Application Shape

```text
schema.idea
config/common.ts
config/develop.ts
config/build.ts
plugins/app/plugin.ts
plugins/app/pages/*.ts
plugins/app/views/*.tsx
plugins/store/plugin.ts
public/
package.json
```

`package.json.plugins` lists local plugins before `stackpress`; framework and
local order is application-controlled. The maintained blog also loads optional
AI/desktop packages after Stackpress. Local plugins may register lifecycle work
before the aggregate package, but should consume services only in the owning
lifecycle phase.

## Configure And Bootstrap

```ts
import { server as http } from 'stackpress/http';
import type { Config } from 'stackpress/types';

export const config: Config = {
  server: { cwd: process.cwd(), mode: 'development', port: 3000 },
  terminal: { idea: 'schema.idea' },
  client: {
    package: 'app-client', module: 'app-client',
    tsconfig: 'tsconfig.json', revisions: '.build/revisions'
  },
  database: { seed: process.env.DATABASE_SEED!, migrations: '.build/migrations' },
  session: { seed: process.env.SESSION_SEED!, access: { GUEST: ['GET /'] } }
};

export default async function bootstrap() {
  const app = http();
  app.config.set(config);
  await app.bootstrap();
  await app.resolve('config');
  await app.resolve('listen');
  await app.resolve('route');
  return app;
}
```

The actual permission shape uses `{ method, route }` objects rather than the
illustrative event-like string above for routes:

```ts
access: { GUEST: [{ method: 'GET', route: '/' }] }
```

Load secrets from environment policy and fail startup when production secrets
are absent; template fallback seeds are development examples only.

## Generate And Start

```bash
yarn install
yarn generate
yarn push
yarn populate
yarn dev
```

Maintained scripts expand to config-specific events such as:

```bash
stackpress generate --b config/develop -v
stackpress push --b config/develop -v
stackpress populate --b config/develop -v
stackpress develop --b config/develop -v
```

`generate` must precede commands that import the client. First `push` may install
tables; later pushes use adjacent revisions. Inspect generated package, newest
revision, migration/diff behavior, database schema, and reachable routes. Do not
treat command status alone as proof.

## Register A Database

```ts
import type { HttpServer } from 'stackpress/server';
import connect from 'stackpress/pglite';
import { PGlite } from '@electric-sql/pglite';

export default function plugin(server: HttpServer) {
  server.on('config', async ({ ctx }) => {
    const native = new PGlite('./.build/app.pglite');
    ctx.register('database', connect(native));
  });
}
```

Maintained templates isolate native connection creation in `connect.ts` and
register the resulting Engine as `database` during `config`. Use the matching
`stackpress/mysql`, `pgsql`, `pglite`, or `sqlite` adapter and preserve one native
resource per transaction.

## Declare A Model And Use Generated Events

```idea
model Article @display("{{title}}") {
  id String @id @default("cuid()")
  slug String @unique @searchable @field.slug @view.text
  title String @is.required @searchable @field.text @list.text
  published Datetime? @sortable @field.datetime @view.date
}
```

After generation, the SQL plugin registers `article-create`, `article-search`,
`article-detail`, `article-get`, `article-update`, `article-remove`, `article-
restore` when restorable, `article-upsert`, `article-batch`, and `article-purge`.

```ts
const created = await ctx.resolve('article-create', {
  slug: 'first-post', title: 'First Post'
});
const found = await ctx.resolve('article-search', {
  q: 'first', sort: { published: 'desc' }, take: 20
});
```

Generated event names and payloads are internal capabilities. Expose them through
pages/API/MCP only with explicit authorization and input policy.

## Expose Capabilities Through Interfaces

Load [Interface Exposure Examples](./00017-interface-exposure-examples.md) for
handwritten handler/view pairs and API/MCP adapters over the same event.

## Build And Preview

Development view config supplies client/document templates, CSS imports, Vite/
UnoCSS plugins, optimization, and watch policy. Build config supplies asset,
client, and page output paths plus client/page templates.

```bash
stackpress build --b config/build -v
stackpress serve --b config/preview -v
```

Verify package metadata, generated client/page/assets, manifest routes, direct
asset requests, SSR HTML, hydration, browser console/network, and production
config. Development HMR uses Node HTTP native resources.

## Schema Change Workflow

1. Change Idea source intentionally.
2. Run clean/repeat generation and inspect stale-file removal.
3. Review the new revision and generated types/stores/components.
4. Run `migrate` to inspect SQL without applying it.
5. Back up the target database.
6. Run `push`/`upgrade` against the expected adjacent state.
7. Verify schema, data, routes/events, and affected UI/API/MCP paths.

Ambiguous rename candidates fail safe during live upgrade. `--force` accepts
the generic destructive diff; it is not a rename hint. `migrate` instead writes
that raw drop/add SQL without warning so it can be reviewed before execution.
Revision history does not prove live applied state.

## Source Anchors And Authority

Anchors: maintained blog/store/website templates, scaffold scripts/configs,
local app/store plugins, Idea schemas, package command scripts, Stackpress skill
examples, and owning package contracts. Recipes are demonstrated paths plus
source contracts, not a blanket support or production-readiness guarantee.
