# 220 Engine

The engine is the main surface for schema changes, query builders, raw SQL, and
transactions. Once a connection exists, the engine is where app code starts
describing database work.

**Previously:** The connection lessons showed how a driver becomes a shared
database surface. Here, the focus shifts to the methods that let code build and
run database operations.

## 220.1. Why The Engine Comes Next

Connections answer "which database are we using?" The engine answers "what do
we want the database to do?"

That separation matters because route code should not become a pile of
unexplained SQL strings. The engine gives common operations named entry points
such as `select`, `insert`, `update`, `delete`, `query`, `sql`, and
`transaction`.

## 220.2. Smallest Engine Surface

Most Stackpress apps get an engine-shaped database surface from a connection
package or Stackpress re-export. In a scaffolded app, that starts with PGlite:
The native PGlite driver stays inside the connection function, while the rest
of the app receives the wrapped engine surface.

```ts
import { PGlite } from '@electric-sql/pglite';
import { connect as pglite } from 'stackpress/pglite';

const engine = pglite(async () => new PGlite('./.build/database'));
```

The wrapper receives a native driver resource and returns an object with the
engine methods this course uses. The store plugin then registers that result as
`database` so routes, events, and generated code can resolve the same surface.

## 220.3. Builder Methods

The engine has builder methods for common table operations:

```ts
const select = engine.select(['id', 'email']);
const insert = engine.insert('users');
const update = engine.update('users');
const remove = engine.delete('users');
```

These examples do not execute a full feature by themselves. They show where
each operation begins, so the child lessons can focus on filters, values,
returned rows, and verification.

## 220.4. Table Helpers

The engine also supports table-level helpers such as `create`, `alter`, `diff`,
`drop`, `rename`, and `truncate`. Those methods belong closer to schema and
maintenance workflows than to everyday route handlers.

```ts
const alter = engine.diff(fromSchema, toSchema);
const statements = alter.query();
```

This example compares two table definitions and produces alteration
statements. It is useful when your source of truth is schema shape rather than
one user-facing route action.

## 220.5. What Success Looks Like

Success is more than a query returning without throwing an error. The correct
row should load, the intended row should change, or the deleted row should no
longer appear where the app expects it.

The child lessons need verification because database behavior needs evidence.
Use returned results, database inspection, route output, or browser behavior to
prove the operation did the right thing.

## 220.6. Mistakes To Avoid

Engine mistakes usually come from using the right method at the wrong layer.
Keep route actions focused on product behavior and reserve table helpers for
schema or maintenance workflows.

### 220.6.1. Start With Raw SQL For A Basic Read

```ts
await engine.query('SELECT * FROM users');
```

Raw SQL can be useful, but it should not be the first tool for every basic
operation. Start with the normal operation lessons unless the feature needs SQL
that the builder path cannot express clearly.

### 220.6.2. Use Table Helpers In User Actions

```ts
await engine.drop('users');
```

Dropping or truncating tables is maintenance behavior, not a normal page action.
Keep destructive table helpers away from routes that respond to ordinary users.

**Next course:** Continue with `Select`. That page starts the operation lessons
with the common flow of loading rows for a route, event, or view.
