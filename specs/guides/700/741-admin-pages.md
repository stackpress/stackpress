# 741 Admin Pages

Admin pages are generated route handlers for common model workflows. They load
config for the view layer, call model events such as search or create, and
decide whether to return data, render a view, or redirect to another admin
page.

## 741.1. What You Are Looking For

When you inspect admin pages, you are looking for the server-side part of the
admin workflow. A generated page is not the React screen itself; it is the
handler that prepares data and runs the event behind that screen.

For a scaffolded app, the generated Article admin files live under:

```txt
client-source/Article/admin/pages
client-source/Article/admin/routes.ts
client-source/admin.ts
```

These paths show the page layer and the route layer together. The route file
registers URLs, while each page file handles one workflow such as search,
create, update, import, or export.

## 741.2. Route Registration

The admin generator writes one `admin/routes.ts` file per model. For Article,
the generated route file uses `admin.base` from config and registers model
workflow URLs under that base.

```ts
export default function routes(server: Server) {
  const base = server.config.path('admin.base', '/admin');

  server.import.get(
    `${base}/article/search`,
    () => import('./pages/search.js')
  );

  server.import.get(
    `${base}/article/detail/:id`,
    () => import('./pages/detail.js')
  );
}
```

This example shows two server-side page routes. The first route loads the
search page handler, and the second route loads the detail page handler for a
specific Article ID.

The generated top-level `admin.ts` imports each model's route function and
calls it:

```ts
import articleRoutes from './Article/admin/routes.js';

export default function admin(server: Server) {
  articleRoutes(server);
}
```

This file is the model-level admin entrypoint. It keeps each model's routes in
its own folder while still giving the runtime one generated function that can
register all admin routes.

## 741.3. Search Page Handler

The search page prepares view data, reads query values, calls the generated
search event, and stores rows for the response. This is the server-side reason
the search view later has data to render.

```ts
const query = req.data<{ skip?: number; take?: number }>();
let { skip, take } = query;

if (skip && !isNaN(Number(skip))) {
  skip = Number(skip);
}

const response = await ctx.resolve(
  'article-search',
  { ...query, skip, take },
  res
);

if (res.code === 200) {
  const total = response.total;
  const rows = response.results as UnknownNest[];
  res.rows(rows, total || rows.length);
}
```

The key detail is the event name: `article-search`. The page handler does not
manually query the database; it delegates to the generated event and then
places the results on the response for the view layer.

## 741.4. Create And Update Pages

Create and update pages are form workflows, so they include CSRF handling. The
create page generates a token, validates the token on `POST`, resolves
`article-create`, and redirects to the detail page when the request is not a
JSON-style no-view request.

```ts
const csrf = ctx.plugin<CsrfPlugin>('csrf');
csrf.generate(res, ctx);

if (req.method === 'POST') {
  if (!csrf.valid(req, res)) return;
  const response = await ctx.resolve<Article>('article-create', req, res);
  if (res.code !== 200) {
    return;
  }
  const base = admin.base ?? '/admin';
  res.redirect(`${base}/article/detail/${response.results!.id}`);
}
```

This example shows the server-side flow behind the create form. The page
protects the write with CSRF, runs the generated create event, and sends the
browser to the new record's detail page after success.

Update follows the same idea, but it accepts `POST` or `PUT`, emits
`article-update`, and loads existing data with `article-detail` when the form
has not been submitted. That split matters because the same URL has to support
two moments: opening the form with current data and submitting changed data
back to the server.

## 741.5. Import And Export Pages

Generated admin pages also include import and export handlers. The import page
is intentionally small because it delegates batch processing to the generated
batch event.

```ts
if (req.method === 'POST') {
  await ctx.emit('article-batch', req, res);
}
```

This example shows that import is still event-driven. The page accepts the
request, then lets `article-batch` handle the rows and response errors.

Export searches all matching Article rows, builds CSV text, sets a download
header, and sends the response as `text/csv`. This makes export different from
search or detail pages because the successful output is a file download, not a
React page.

```ts
res.headers.set(
  'Content-Disposition',
  `attachment; filename=article-${Date.now()}.csv`
);
res.set('text/csv', csv);
```

This example is a response-level detail worth noticing. The generated page
does not render a React view for export; it sends a CSV response directly.

## 741.6. Mistakes To Avoid

Admin page mistakes usually come from confusing the server handler with the
React view or confusing generated output with the source you should edit. Keep
the page layer focused on route handling and event delegation.

### 741.6.1. Edit Generated Page Handlers First

```ts
// client-source/Article/admin/pages/create.ts
```

This file is useful evidence, but it is generated output. If the create flow is
wrong for every model, inspect the admin generator; if it is wrong because of
Article metadata, inspect the idea source that generated Article.

### 741.6.2. Debug The View Before The Event

```ts
await ctx.resolve('article-search', { ...query, skip, take }, res);
```

If the search page renders empty rows, the view may not be the first problem.
Check whether the page handler called the expected event and whether the event
returned rows before changing table markup.

### 741.6.3. Forget The Admin Base

```ts
const base = server.config.path('admin.base', '/admin');
```

Generated admin URLs are built from `admin.base`. If a route is not where you
expect it, inspect the admin config before assuming the generated route file is
missing.

## 741.7. Reference Pointers

Use `packages/stackpress-admin/src/transform/routes.ts` and
`packages/stackpress-admin/src/transform/pages` to understand generation
rules. Use `client-source/Article/admin/pages` and
`client-source/Article/admin/routes.ts` to inspect concrete
generated output.

**Learning checkpoint:** You should now be able to trace an admin URL to a
generated page handler and the model event it calls. The next lesson follows
the same route into the React view that renders the admin screen.

**Next course:** Continue with `Admin Views`. That lesson inspects the
generated React layer for search, create, and detail pages.
