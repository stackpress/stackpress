# `Engine`

`Engine` is the SQL execution surface exported from `stackpress/sql`. It comes
from Inquire and coordinates dialect-aware builders with a configured database
connection.

## Import

```ts
import { Engine } from 'stackpress/sql';
```

## Instantiation

Most Stackpress apps resolve an engine through the registered `database`
plugin instead of creating one directly.

```ts
const engine = ctx.plugin<DatabasePlugin>('database');
const rows = await engine.select('*').from('article').limit(10);
```

This example reads the app's configured database engine and runs a select
builder. The engine already knows the active connection and dialect because the
store plugin registered it.

## Common Operations

| Operation | Example | Purpose |
| --- | --- | --- |
| `select(...)` | `engine.select('*').from('article')` | Read rows. |
| `insert(...)` | `engine.insert('article').values(input)` | Insert rows. |
| `update(...)` | `engine.update('article').set(input)` | Update rows. |
| `delete(...)` | `engine.delete('article')` | Delete rows. |
| `sql(...)` | `engine.sql\`SELECT * FROM article\`` | Run template SQL when a builder is not enough. |

These methods return builder objects or executable query objects depending on
the Inquire operation. Builders are promise-like in common Stackpress examples,
so `await` is normally used at the end of the chain.

## Integration Example

```ts
import type { DatabasePlugin } from 'stackpress/sql';
import { action } from 'stackpress/server';

export default action(async ({ ctx, res }) => {
  const engine = ctx.plugin<DatabasePlugin>('database');
  const rows = await engine.select('*')
    .from('article')
    .where('status = ?', [ 'PUBLISHED' ])
    .order('published', 'desc');

  res.results(rows);
});
```

This example keeps database work in a route or event and writes rows to the
response. Views should render `response.results` instead of opening their own
database connection.

## Related

 - [SQL Module](../sql.md)
 - [Builder Classes](./builders.md)
 - [Connection Adapters](./connections.md)
