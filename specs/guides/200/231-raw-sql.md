# 231 Raw SQL

Raw SQL is the escape hatch for queries that generated events or builders do
not express cleanly. It gives you direct control over the statement, but it
also makes input safety and dialect behavior your responsibility.

**Previously:** `Querying` introduced the advanced query group. Here, the focus
narrows to hand-written SQL and the safe ways to pass values into it.

## 231.1. Operation Goal

The goal is to run a specific hand-written query without turning the rest of
the app into scattered SQL strings. Use raw SQL for the narrow case that needs
it, then verify the result against the configured database.

Think of raw SQL as stepping closer to the database. That can solve a sharp
problem, but it also removes some of the guardrails that generated actions and
builders provide.

## 231.2. When Raw SQL Is Appropriate

Use this decision order before writing raw SQL:

 1. Try a generated event such as `article-search`, `article-create`, or
    `article-update`.
 2. Try a builder such as `select`, `insert`, `update`, or `delete`.
 3. Use raw SQL when the query is specific enough that the higher-level paths
    would hide the important part.

This order keeps common work readable for junior developers. Raw SQL stays
available, but it becomes a deliberate choice instead of the first habit.

## 231.3. Write The Query

Use `engine.query()` when you already have the SQL string:

```ts
type UserRow = {
  id: number;
  email: string;
};

const rows = await engine.query<UserRow>(
  'SELECT id, email FROM users WHERE id = ?',
  [1]
);
```

The first argument is the SQL text, and the second argument is the value list.
The `?` placeholder marks where the value belongs without mixing the value into
the SQL string.

You can also pass a query object:

```ts
const rows = await engine.query<UserRow>({
  query: 'SELECT id, email FROM users WHERE id = ?',
  values: [1]
});
```

This is the same idea in object form. It is useful when a helper already has a
`query` string and a `values` array ready to pass around together.

## 231.4. Bind Inputs

Use `engine.sql` for small hand-written queries where a template string is
easier to read:

```ts
const rows = await engine.sql<{ id: number }>`
  SELECT id
  FROM users
  WHERE email LIKE ${'%@example.com'}
`;
```

The interpolated value is not pasted into the SQL as text. Inquire converts it
into a placeholder for the active dialect, which keeps the query readable while
still binding values safely.

PostgreSQL-family wrappers rewrite `?` placeholders to `$1`, `$2`, and so on.
If you truly need a literal question mark, the raw SQL guide notes that `??`
can protect it during placeholder rewriting.

## 231.5. Verify Data

Use the terminal query command when you want to inspect the configured database
directly:

```bash
stackpress query "SELECT * FROM article" --b config -v
```

This command runs direct SQL against the configured database connection. It is
useful for checking whether the data problem is in the database, the route, or
the view handoff.

For app-level debugging, keep raw SQL in a focused event or helper and log the
request shape through a `before` hook when needed:

```ts
engine.before = async (request) => {
  console.log(request.query, request.values);
};
```

The hook gives you a small inspection point before the query reaches the
connection. Keep it predictable because it can run for every query through that
engine.

## 231.6. Common Mistakes

Raw SQL mistakes usually come from treating SQL text like ordinary string
building. Keep the SQL statement and user-provided values separate unless you
have a source-backed reason to do otherwise.

### 231.6.1. Build SQL With String Concatenation

```ts
const rows = await engine.query(
  `SELECT id FROM users WHERE email = '${email}'`
);
```

This mixes a value into SQL text before the engine can bind it safely. Pass the
value separately through `query(..., values)` or use the tagged `sql` helper.

### 231.6.2. Use Raw SQL As The Default

```ts
await engine.query('SELECT * FROM article');
```

This can be valid for inspection or a special case, but it should not replace
generated actions and builders for normal app behavior. Start with the
higher-level path so model rules, response shapes, and verification stay easy
to follow.

### 231.6.3. Forget Dialect Behavior

```ts
await engine.query('SELECT id FROM users WHERE id = ?', [1]);
```

This is the correct placeholder style for the engine API, but the native driver
may see a different placeholder after the connection wrapper formats it.
Remember that the active dialect and connection decide the final SQL shape.

**Learning checkpoint:** Before moving on, make sure you can explain the
difference between `engine.query(sql, values)`, `engine.query({ query,
values })`, and the tagged `engine.sql` helper.

**Next course:** Continue with `Transactions`. That course uses raw query
control inside a larger all-or-nothing database workflow.
