# 223 Update

Update operations change rows that already exist. They are more sensitive than
inserts because the code must identify the correct row before applying new
values.

**Previously:** `Insert` created an Article row from form input. Here, the
focus shifts to the generated update flow: find the row, validate the change,
apply the update, and redirect after success.

## 223.1. Operation Goal

The goal is to change one intended row without accidentally changing another
row or hiding a validation failure. A good update path has an identifier,
controlled input, validation, a source-backed write, and a visible result.

The generated Article admin update page gives this lesson a concrete source.
It accepts `POST` or `PUT`, validates CSRF, emits `article-update`, and
redirects back to the detail page when the update succeeds.

## 223.2. Inputs

First, look at the generated update page:

```ts
if (req.method === 'POST' || req.method === 'PUT') {
  if (!csrf.valid(req, res)) return;
  await ctx.emit('article-update', req, res);
  if (res.code === 200) {
    if (!req.data.has(noview)) {
      const base = admin.base ?? '/admin';
      res.redirect(`${base}/article/detail/${req.data('id')}`);
    }
  }
  return;
}
await ctx.emit('article-detail', req, res);
```

The route has two modes. A submitted form runs the update event, while a normal
page load fetches the current article detail so the form can start with the
existing values.

## 223.3. Find The Row

The generated update event refuses to continue without an `id`:

```ts
const id = req.data<string>('id');
if (typeof id === 'undefined' || id === null || id === '') {
  const errors = { id: 'Missing or invalid value' };
  res.setError('Invalid Parameters', errors).statusCode(400, 'Bad Request');
  return;
}
```

This check is the first safety boundary. Without a valid identifier, the event
cannot build a trustworthy filter for the row that should change.

After the ID check, the event builds the update filter:

```ts
const eq = {
  id
};
const results = await actions.update({ eq }, req.data());
res.results(results[0] || null);
```

The update target is explicit: `eq: { id }`. The event passes the request data
as the proposed change, then stores the first updated result in the response.

## 223.4. Apply Changes

The generated action cleans and validates input before it updates anything:

```ts
public async update(query: StoreSelectFilters, input: Partial<Article>) {
  const filtered = this.store.filter(input);
  const serialized = this.store.serialize(filtered);
  const unserialized = this.store.unserialize(serialized);
  const defined = removeEmptyStrings(unserialized);
  const sanitized = removeUndefined(defined);

  const errors = this.store.assert(sanitized) || {};
  if (Object.keys(errors).length > 0) {
    throw Exception.for('Invalid parameters')
      .withCode(400)
      .withErrors(errors);
  }
}
```

This mirrors the insert lesson, but update validation is partial by design.
The action sanitizes the submitted values and validates the fields being
changed instead of requiring a complete new record.

Then the action reads the existing rows before writing:

```ts
const rows = await this.findAll(query);
const results = rows.map((row) => ({ ...row, ...sanitized })) as Article[];
if (rows.length === 0) return results;
```

Reading first lets the action return a predictable updated shape even though
database drivers do not all return update results the same way. If no rows
matched the filter, there is nothing safe to update.

The lower-level Inquire update builder has the direct SQL shape:

```ts
await engine.update('users')
  .set({ active: false })
  .where('last_login < ?', [new Date('2024-01-01')]);
```

This example shows the two pieces every update needs: values to set and a
`where` clause that narrows which rows can change. Generated Stackpress actions
build this through the model store so filters, fields, and dialect quoting stay
consistent.

## 223.5. Verify Data

A successful generated update redirects to the detail page:

```ts
res.redirect(`${base}/article/detail/${req.data('id')}`);
```

That redirect is more than navigation. It reloads the record through the detail
route, which gives the user a visible check that the saved row now contains the
updated values.

For terminal inspection, query the row directly:

```bash
stackpress query "SELECT * FROM article" --b config -v
```

This helps separate a database update problem from a view rendering problem.
If the database row changed but the page still shows the old value, inspect the
detail route or view handoff next.

## 223.6. Common Mistakes

Update mistakes usually come from weak targeting or from assuming the submitted
form is enough proof. Keep the row filter, validation, and post-update check
visible while debugging.

### 223.6.1. Update Without An Identifier

```ts
await ctx.emit('article-update', req, res);
```

This call only works when `req.data()` contains a valid `id`. The generated
event rejects missing IDs because an update without a target cannot safely
decide which row should change.

### 223.6.2. Trust Hidden Fields As Authorization

```tsx
<input type="hidden" name="id" value={input.id} />
```

A hidden form field can identify the target row, but it does not prove the
current visitor is allowed to edit that row. Permission and ownership checks
belong in the route or surrounding access rules before the write is trusted.

### 223.6.3. Forget The `where` Clause

```ts
await engine.update('users').set({ active: false });
```

The direct builder example is intentionally incomplete because it does not
limit which users should change. Always pair update values with a filter unless
the operation is truly meant to affect every row.

**Learning checkpoint:** Before moving on, make sure you can trace an Article
update from submitted `id`, to `article-update`, to `actions.update({ eq },
req.data())`, to the redirected detail page.

**Next course:** Continue with `Delete`. That course uses the same targeting
discipline, but the operation removes or disables data instead of changing it.
