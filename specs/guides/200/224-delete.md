# 224 Delete

Delete-style operations remove data from the normal app flow. In Stackpress
generated admin pages, the safer default is often a remove flow that marks a
record inactive instead of immediately deleting the row.

**Previously:** `Update` changed an existing Article row through an `id`
filter. Here, the focus shifts to removal: confirmation, soft delete, restore,
and the lower-level hard delete path.

## 224.1. Operation Goal

The goal is to make destructive changes deliberate. A remove page should show
the record first, require confirmation, protect the request, target one row,
and send the user somewhere stable after the change.

The generated Article admin source gives this lesson a concrete flow. It uses
`article-remove` for removal, `article-restore` for undo-style recovery, and a
lower-level `delete(query)` action for hard deletes.

## 224.2. Inputs

First, look at the generated remove page:

```ts
if (req.data('confirmed')) {
  if (!csrf.valid(req, res)) {
    res.session.set('flash', JSON.stringify({
      type: 'error',
      message:
        'This page may have been requested from an external source. ' +
        'We corrected the issue. Please try again.',
      close: 2000
    }));
    const base = admin.base ?? '/admin';
    const id = req.data('id');
    res.redirect(`${base}/article/remove/${id}`);
    return;
  }
  await ctx.emit('article-remove', req, res);
  if (res.code === 200) {
    if (!req.data.has(noview)) {
      const base = admin.base ?? '/admin';
      res.redirect(`${base}/article/search`);
    }
  }
  return;
}

await ctx.emit('article-detail', req, res);
```

The page has the same two-mode shape as update. Without confirmation it fetches
the record detail, and with confirmation it validates CSRF before emitting the
remove event.

The generated remove view creates the confirmation link:

```tsx
const csrf = config.path('csrf.name', 'csrf');
const token = config.path('csrf.token', '');
const confirm = new URLSearchParams(`confirmed=true&${csrf}=${token}`);

<a className="action remove" href={'?' + confirm.toString()}>
  <i className="icon fas fa-fw fa-trash"></i>
  <span>{_('Confirmed')}</span>
</a>
```

This example shows that confirmation is not just a visual label. The request
needs a `confirmed=true` value and a CSRF token before the remove page will run
the destructive path.

## 224.3. Find The Row

The generated remove event requires an `id` before it can target a row:

```ts
const id = req.data<string>('id');

if (typeof id === 'undefined' || id === null || id === '') {
  const errors = { id: 'Missing or invalid value' };
  res.setError('Invalid Parameters', errors).statusCode(400, 'Bad Request');
  return;
}
```

This is the first database safety check. A remove event without an ID cannot
know which record should leave the normal app flow.

After the ID check, the event calls the generated action:

```ts
const eq = {
  id
};
const results = await actions.remove({ eq });
res.results(results[0] || null);
```

The filter stays explicit with `eq: { id }`. The event returns the first
affected result so the response still has a clear payload if another caller
needs it.

## 224.4. Delete Or Soft Delete

The generated Article `remove` action is a soft delete:

```ts
public async remove(query: StoreSelectFilters) {
  return await this.update(query, { active: false });
}
```

This does not remove the row from the database. It updates the row so normal
active-record views can stop showing it, while the restore path can still turn
it back on.

The matching restore action reverses that state:

```ts
public async restore(query: StoreSelectFilters) {
  return await this.update(query, { active: true });
}
```

This is why the generated admin has separate remove and restore pages. Removal
changes availability, while restore makes the record active again.

Hard delete exists lower in the generated action class:

```ts
public async delete(query: StoreSelectFilters) {
  const rows = await this.findAll(query);
  if (rows.length > 0) {
    const remove = this.store.delete(query, this.engine.dialect.q);
    remove.engine = this.engine;
    await remove;
  }
  return rows;
}
```

This method reads the matching rows first, then runs the store delete only when
there is something to delete. It returns the rows it found because database
drivers do not all return delete results the same way.

The lower-level Inquire delete builder has the direct SQL shape:

```ts
await engine.delete('sessions')
  .where('expires_at < ?', [new Date()]);
```

This example shows the most important rule for hard deletes: the `where` clause
controls what disappears. A delete builder without a narrow filter is a high
risk operation.

## 224.5. Verify Data

After a successful generated remove, the admin page redirects to the search
page:

```ts
res.redirect(`${base}/article/search`);
```

That redirect keeps the user away from a detail page for a record that should
no longer appear as active. The next visible check is whether the removed
article disappears from the normal search/list path.

For database inspection, query the article table:

```bash
stackpress query "SELECT * FROM article" --b config -v
```

This helps you see whether the row still exists and whether its active state
changed. If the row still appears in the UI, inspect the select filters before
assuming the remove event failed.

## 224.6. Common Mistakes

Delete mistakes usually come from skipping the guardrails that make destructive
actions deliberate. Confirmation, CSRF, row targeting, and soft-delete behavior
all exist to keep the operation understandable and recoverable.

### 224.6.1. Call Hard Delete For A Normal Admin Remove

```ts
await actions.delete({ eq: { id } });
```

The generated admin remove page uses `actions.remove({ eq })`, not hard delete.
Use the soft-delete path when the model supports active/restore behavior and
the user may need recovery.

### 224.6.2. Remove Without Confirmation

```ts
await ctx.emit('article-remove', req, res);
```

The generated page only emits this event after it sees `confirmed` and validates
CSRF. Calling it without a confirmation step makes accidental removal too easy.

### 224.6.3. Forget The Filter On A Hard Delete

```ts
await engine.delete('article');
```

This example is dangerous because it does not say which rows should be deleted.
Use a narrow `where` clause or generated action filter so the operation targets
the intended record.

**Learning checkpoint:** Before moving on, make sure you can explain the
difference between `article-remove`, `article-restore`, and the lower-level
`delete(query)` action.

**Next course:** Continue with `Querying`. That course steps back from single
operations and looks at more flexible database access patterns.
