# 222 Insert

Insert operations create new records. This is the first data operation where a
page changes the database instead of only reading from it.

**Previously:** `Select` followed article rows from route filters to
`response.results`. Here, the focus shifts to the create path: form input,
generated create event, generated action validation, insert, and redirect.

## 222.1. Operation Goal

The goal is to turn trusted request input into one new database row. The route
should protect the submission, call the generated create event, handle errors,
and send the user to a clear next page after success.

The generated Article admin create page gives this lesson a concrete source.
It uses a form, validates CSRF, resolves `article-create`, checks the response,
and redirects to the created article detail page.

## 222.2. Inputs

First, look at the generated create route:

```ts
if (req.method === 'POST') {
  if (!csrf.valid(req, res)) return;

  const response = await ctx.resolve<Article>('article-create', req, res);

  if (res.code !== 200) {
    return;
  } else if (!isObject(response.results)) {
    res.setError('Unknown creation response results');
    return;
  }

  if (!req.data.has(noview)) {
    const results = response.results!;
    const base = admin.base ?? '/admin';
    res.redirect(`${base}/article/detail/${results.id}`);
  }
}
```

This route only runs the create flow for `POST` requests. It validates CSRF
before writing, lets the generated `article-create` event handle the database
work, and redirects to the detail page when the result contains a created
record.

The generated form sends the values that become request data:

```tsx
<form method="post">
  <input type="hidden" name={tokenKey} value={token} />
  <TitleFormFieldControl
    name="title"
    value={input.title}
    error={errors.title?.toString()}
    required
  />
  <SlugFormFieldControl
    name="slug"
    value={input.slug}
    error={errors.slug?.toString()}
    required
  />
  <Button className="submit" type="submit">
    <i className="icon fas fa-fw fa-save"></i>
    {_('Save')}
  </Button>
</form>
```

The form names become keys in `req.data()`. The route does not manually build
an insert statement from those fields; it passes the request through the
generated create event so validation and schema-aware mapping stay centralized.

## 222.3. Build The Insert

The generated create event is the bridge between the route and the action
class:

```ts
async function ArticleCreateEvent({ req, res, ctx }: RouteProps) {
  const engine = ctx.plugin<DatabasePlugin>('database');
  if (!engine) return;

  const seed = ctx.config.path('database.seed', '');
  const actions = new ArticleActions(engine, seed);

  try {
    const results = await actions.create(req.data());
    res.results(results);
  } catch (e) {
    const exception = Exception.upgrade(e as Error);
    res.setError(exception.toResponse());
  }
}
```

The event resolves the registered database engine, creates `ArticleActions`,
and passes `req.data()` into `actions.create(...)`. If creation succeeds, the
created record goes into `res.results`; if it fails, the exception becomes a
response error that the page can render.

Inside the generated action, insert work starts only after the input has been
cleaned and checked:

```ts
public async create(input: Partial<Article>) {
  const filtered = this.store.filter(input);
  const populated = this.store.populate(filtered);
  const serialized = this.store.serialize(populated);
  const unserialized = this.store.unserialize(serialized);
  const defined = removeEmptyStrings(unserialized);
  const sanitized = removeUndefined(defined);

  const errors = this.store.assert(sanitized, true) || {};

  const insert = this.store.insert(sanitized);
  insert.engine = this.engine;
  const rows = await insert;
}
```

This sequence is important because insert is not just "save whatever came from
the form." The generated action filters unknown values, applies default data,
serializes values for storage, removes empty values, validates the sanitized
shape, then builds and runs the insert. That keeps the database write tied to
the model rules instead of whatever fields happened to arrive in the request.

## 222.4. Return Or Redirect

The low-level Inquire insert builder can insert one row or many rows:

```ts
await engine.insert('users').values([
  { email: 'ada@example.com', name: 'Ada' },
  { email: 'grace@example.com', name: 'Grace' }
]);
```

This direct builder example shows the database operation underneath the
generated action. Most Stackpress app pages will use generated events and
actions first, then reach for the builder when writing custom database code.

Returned rows depend on the active database path:

```ts
const rows = await insert;

if (rows.length > 0) {
  return this.store.unserialize(rows[0]);
}

if (this.engine.connection.lastId) {
  const eq = { id: this.engine.connection.lastId };
  return (await this.find({ eq })) || (input as unknown as Article);
}
```

The generated action does not assume every driver returns inserted rows the
same way. PostgreSQL-style inserts can return rows, while MySQL or SQLite-style
paths may require `connection.lastId` followed by a lookup.

After the route receives a created record, redirecting gives the browser a
stable next page:

```ts
res.redirect(`${base}/article/detail/${results.id}`);
```

The redirect matters because a successful form submission should not leave the
browser sitting on a POST response. Moving to the detail page also gives the
student a visible confirmation that the new row exists.

## 222.5. Verify Data

The generated create view keeps failed submissions understandable:

```tsx
const input = { ...response.results, ...request.data() };
const errors = response.errors();
```

This lets the form repopulate with request data and show response errors after
a failed create attempt. The user can fix the form without losing everything
they typed.

Use database inspection after a successful create:

```bash
stackpress query "SELECT * FROM article" --b config -v
```

This command checks the configured database directly. If the redirect worked
but the row is missing, inspect the create event and generated action before
debugging the view.

## 222.6. Common Mistakes

Insert mistakes usually come from trusting request data too early or ignoring
the response path after the write. Keep the create event, action validation,
and redirect behavior visible while debugging.

### 222.6.1. Write Unchecked Request Data Directly

```ts
await engine.insert('article').values(req.data());
```

This skips the generated action's filtering, default population,
serialization, validation, duplicate checks, and dialect-aware return handling.
Use the generated create event when the model already has generated actions.

### 222.6.2. Ignore The Create Error

```ts
await ctx.resolve<Article>('article-create', req, res);
res.redirect('/admin/article/search');
```

This redirects even when the create event set an error response. Check
`res.code` and the response result before redirecting, so validation failures
can render back into the form.

### 222.6.3. Assume Every Driver Returns Inserted Rows

```ts
const rows = await insert;
return rows[0];
```

The generated action avoids this shortcut because database drivers return
insert results differently. Use returned rows when they exist, and use
`connection.lastId` plus a lookup when the connection exposes the new ID.

**Learning checkpoint:** Before moving on, make sure you can trace a create
submission from the form, to `article-create`, to `ArticleActions.create`, to
`res.results`, and finally to the redirect.

**Next course:** Continue with `Update`. That course keeps the same validation
discipline but changes an existing row instead of creating a new one.
