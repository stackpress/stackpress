# 230 Querying

The basic operation pages teach the safest default path. Querying gets its own
parent page because real features eventually need raw SQL, template SQL,
transactions, or JSON field filters.

**Previously:** `Delete` closed the basic operation sequence. Here, the focus
shifts to the cases where one ordinary operation is not enough.

## 230.1. Why Querying Gets A Parent Page

The normal operation path should stay the default while you are learning. It
keeps inputs, filters, values, and verification easier to see.

Advanced query tools are for specific problems. Raw SQL helps when you need a
database expression directly, `sql` helps bind values in a template-string
query, and transactions help when several writes must succeed or fail together.
Those tools are powerful because they move closer to the database, so this
group teaches when to use them and what extra checks they need.

## 230.2. Raw Query Methods

The engine can execute raw SQL with `query(query, values?)`:

```ts
const rows = await engine.query<{ id: number }>(
  'SELECT id FROM users WHERE id = ?',
  [1]
);
```

The SQL string uses `?` as a placeholder, and the value is passed separately.
That separation is important because user input should be bound as a value, not
assembled into SQL text by string concatenation.

The engine also supports a tagged `sql` helper:

```ts
const rows = await engine.sql<{ id: number }>`
  SELECT id FROM users WHERE id = ${1}
`;
```

This example keeps the SQL readable while still treating `${1}` as a bound
value. The engine can also rewrite backticks in the SQL string to the dialect's
quote character.

## 230.3. Transactions

Use a transaction when multiple database actions should behave like one unit of
work. If one step fails, the connection wrapper can roll the grouped work back.

```ts
await engine.transaction(async (tx) => {
  await tx.query({
    query: 'INSERT INTO users (email) VALUES (?)',
    values: ['ada@example.com']
  });
});
```

The callback receives a transaction-bound engine or connection surface. Work
inside the callback belongs to the same transaction, so it should represent one
logical change.

## 230.4. What This Group Covers

`231 Raw SQL` should explain when dropping below the builder is appropriate and
how to keep inputs safe. `232 Transactions` should teach all-or-nothing
behavior when multiple writes depend on each other.

`233 JSON Fields` connects flexible data storage to query behavior. It stops
before source-model changes because Idea files are introduced in the next
course level.

The common thread is evidence. Whether the page uses raw SQL, a transaction,
or JSON filters, the lesson should end with a way to inspect the result instead
of trusting that the command probably worked.

## 230.5. Mistakes To Avoid

Every page in this group has a safety concern. The examples below show why
advanced query tools need more care than the basic operation path.

### 230.5.1. Build SQL With User Input

```ts
const rows = await engine.query(
  `SELECT id FROM users WHERE email = '${email}'`
);
```

This mixes user input into SQL text. Pass user values separately through
`query(..., values)` or the tagged `sql` helper so the engine can bind them.

### 230.5.2. Use A Transaction For One Independent Read

```ts
await engine.transaction(async tx => {
  return tx.query('SELECT id FROM users');
});
```

A transaction is useful when several changes must succeed together. A single
independent read usually does not need that extra boundary.

### 230.5.3. Treat Advanced Querying As The Default

```ts
await engine.sql`SELECT * FROM articles`;
```

This may be valid, but it should not replace the basic operation path without a
reason. Start with the simplest operation that fits the feature, then use raw
SQL or transactions when the product need is specific enough.

**Next course:** Continue with `Raw SQL`. That page shows when to leave the
builder path, how to bind inputs safely, and how to inspect the resulting query.
