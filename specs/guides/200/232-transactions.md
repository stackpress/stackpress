# 232 Transactions

Transactions group database work that must succeed or fail together. They
protect the app from halfway-finished changes, which are often harder to debug
than a clean failure.

**Previously:** `Raw SQL` showed how to run hand-written statements safely.
Here, the focus shifts to grouping several database actions behind one
all-or-nothing boundary.

## 232.1. Operation Goal

The goal is to protect dependent writes. If the second or third write fails,
the earlier writes should not remain in the database as if the whole operation
succeeded.

In Stackpress generated code, the Article batch action gives a concrete
example. It processes several create, update, or upsert inputs inside one
transaction and marks the batch for rollback when any item fails.

## 232.2. When A Transaction Is Needed

Use a transaction when the app is making several database changes that describe
one logical change. A user import, batch update, checkout flow, or multi-row
create can all need this shape.

The Inquire API exposes that boundary with `engine.transaction()`:

```ts
await engine.transaction(async (tx) => {
  await tx.query({
    query: 'INSERT INTO users (email) VALUES (?)',
    values: ['ada@example.com']
  });

  await tx.query({
    query: 'INSERT INTO profiles (user_id) VALUES (?)',
    values: [1]
  });
});
```

Both inserts happen inside the transaction callback. The connection wrapper
decides how `BEGIN`, `COMMIT`, and `ROLLBACK` work for the native driver, so
app code can focus on the grouped database work.

## 232.3. Wrap The Operations

The generated Article batch action wraps every row in one transaction:

```ts
public async batch(
  inputs: Array<Partial<Article>>,
  mode: 'create' | 'update' | 'upsert' = 'upsert'
) {
  const results: StatusResponse<Article | null>[] = [];
  try {
    await this.engine.transaction(async () => {
      let rollback = false;
      for (const input of inputs) {
        // create, update, or upsert each row
      }
      if (rollback) {
        throw Exception.for('Batch operation failed');
      }
    });
  } catch (e) {}
  return results;
}
```

This example shows the transaction boundary before it shows the row details.
The action collects per-row results, but the database work still belongs to one
protected group.

Inside the loop, successful rows are recorded as normal status responses:

```ts
results.push({
  code: 200,
  status: 'OK',
  results: await this.upsert(input),
  total: 1
});
```

The batch action uses the same model actions from the previous lessons. In
`create` mode it calls `create`, in `update` mode it looks for an existing row
by ID or unique field, and in `upsert` mode it creates or updates as needed.

## 232.4. Handle Failure

When one row fails, the generated action stores the error response and marks
the transaction for rollback:

```ts
} catch (e) {
  const exception =
    typeof error.toResponse !== 'function' ?
      Exception.upgrade(error)
    : (error as Exception);
  const response = exception.toResponse();
  results.push({
    code: response.code,
    status: response.status,
    error: response.error,
    errors: response.errors
  });
  rollback = true;
}
```

This keeps the student-facing result understandable. The caller can see which
row failed, while the transaction still protects the database from keeping only
the successful part of the batch.

At the end of the transaction callback, rollback becomes an exception:

```ts
if (rollback) {
  throw Exception.for('Batch operation failed');
}
```

Throwing inside the callback tells the connection wrapper that the grouped work
should not commit. The generated action catches the outer exception so it can
return the collected row results to the caller.

## 232.5. Verify Data

The generated batch event validates the incoming rows before it calls the
action:

```ts
const mode = req.data.path('mode', 'upsert') as
  | 'create'
  | 'update'
  | 'upsert';
const rows = req.data('rows');

if (!Array.isArray(rows)) {
  const errors = { rows: 'Missing or invalid value' };
  res.setError('Invalid Parameters', errors).statusCode(400, 'Bad Request');
  return;
}
```

This is the request boundary for the batch. The event will not start the
transaction unless the incoming `rows` value is an array.

After the action runs, the event reports every row result and chooses a status:

```ts
const results = await actions.batch(rows, mode);
res.rows(results, results.length);
results.every((result) => result.code === 200) ?
  res.statusCode(200, 'OK')
: res.statusCode(400, 'Bad Request');
```

This response makes verification concrete. If every row succeeded, the batch
response is OK; if any row failed, the response becomes a bad request while the
row-level results explain what happened.

Use direct inspection when you need to prove rollback behavior:

```bash
stackpress query "SELECT * FROM article" --b config -v
```

Run the query before and after a deliberately failed batch. The database should
not keep partial changes from the transaction, even though the response can
still describe which row caused the failure.

## 232.6. Common Mistakes

Transaction mistakes usually come from grouping the wrong work or only testing
the happy path. A transaction is useful because of failure behavior, so the
failure path needs the same attention as the success path.

### 232.6.1. Wrap Unrelated Work Together

```ts
await engine.transaction(async (tx) => {
  await tx.query({ query: 'UPDATE profiles SET name = ?', values: ['Ada'] });
  await sendMarketingEmail();
});
```

The transaction should group database work that must commit or roll back
together. External side effects, such as sending email, do not automatically
roll back with the database.

### 232.6.2. Swallow Row Errors Without Rolling Back

```ts
try {
  await this.create(input);
} catch (e) {
  results.push({ error: 'failed' });
}
```

Collecting an error is useful for the response, but it is not enough for the
database. The generated batch action also sets `rollback = true` and throws at
the end of the transaction callback.

### 232.6.3. Use A Transaction For One Independent Read

```ts
await engine.transaction(async (tx) => {
  return tx.query({ query: 'SELECT id FROM users', values: [] });
});
```

A single independent read usually does not need a transaction boundary. Save
transactions for grouped work where partial success would leave the app in an
invalid or confusing state.

**Learning checkpoint:** Before moving on, make sure you can explain how
`ArticleActions.batch()` uses `engine.transaction()`, row-level results, and a
rollback flag to protect a batch write.

**Next course:** Continue with `JSON Fields`. That course moves from grouped
writes to data shapes that need JSON-aware modeling and filtering.
