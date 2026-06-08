# 221 Select

Selecting data is the read side of an app. The route or event asks for records,
the data layer filters and orders them, and the view renders the rows that came
back.

**Previously:** `Engine` introduced the database surface that builders and
generated actions use. Here, the focus shifts to the first everyday operation:
loading records for a page.

## 221.1. Operation Goal

The goal is to load the right records and prove that the page received them.
For a junior developer, the important habit is to follow the row from request
input, to generated search event, to response payload, to view rendering.

In a scaffolded app, the home page shows articles by emitting the generated
`article-search` event. That gives this lesson a concrete path instead of a
made-up query example.

## 221.2. Inputs

First, look at the route that prepares the article list:

```ts
export default action(async function HomePage({ req, res, ctx }) {
  req.data.set('status', 'PUBLISHED');
  if (!req.data.has('sort')) {
    req.data.set('sort', 'published', 'desc');
  }
  await ctx.emit('article-search', req, res);
  setViewProps(req, res, ctx);
});
```

The route does two data-shaping jobs before it emits the search event. It
limits the query to published articles and gives the request a default sort
when the caller did not already provide one.

The generated search event receives the same request and response:

```ts
async function ArticleSearchEvent({ req, res, ctx }: RouteProps) {
  const engine = ctx.plugin<DatabasePlugin>('database');
  if (!engine) return;

  const actions = new ArticleActions(engine, seed);
  const results = await actions.findAll(req.data());
  const total = await actions.count(req.data());
  res.rows(results, total);
}
```

This event is where the route turns into a database read. It resolves the
registered `database` plugin, creates `ArticleActions`, passes `req.data()` into
`findAll`, counts the matching rows, and writes the rows plus total back to the
response.

## 221.3. Build The Select

The generated action class turns the request data into a select operation. It
does this through the generated store, so model columns, relation selectors,
and the active dialect stay together.

```ts
public async findAll(query: StoreSelectQuery) {
  const { columns = ['*'] } = query;
  const selectors = this.store.selectors(columns);
  const select = this.store.select(query, this.engine.dialect.q);
  select.engine = this.engine;
  const results = await select;
  return results.map((row) => {
    const nest = new Nest();
    // map flat row aliases back into nested result objects
  });
}
```

The `columns` value controls which selectors the store prepares. The call to
`this.store.select(query, this.engine.dialect.q)` builds a dialect-aware select,
and assigning `select.engine` gives the builder the engine it needs to execute.

The lower-level Inquire builder has the same read shape:

```ts
const users = await engine.select<{ id: number; email: string }>([
    'users.id',
    'users.email'
  ])
  .from('users')
  .where('users.active = ?', [true])
  .order('users.email')
  .limit(10)
  .offset(20);
```

This example shows the direct builder API that generated store code is built
on top of. `from` chooses the table, `where` narrows the rows, `order` sorts
them, and `limit` plus `offset` control the page of results.

## 221.4. Return Results

The generated search event uses `res.rows(results, total)` because a list
response needs both the selected rows and the total count. That is useful for
list pages, admin tables, and any view that needs pagination-like metadata.

The onboarding guide also shows a route resolving the event and writing only
the rows into `res.results(...)`:

```ts
const articles = await ctx.resolve('article-search', req.data());

if (articles.code !== 200) {
  return;
}

res.results(articles.results || []);
setViewProps(req, res, ctx);
```

This version makes the route responsible for deciding what lands in
`response.results`. Both patterns are source-backed, but the scaffolded app
uses the emitted event path where the search event writes rows to the response
directly.

## 221.5. Verify Data

The home view verifies the final handoff by reading the response payload:

```tsx
export function Body() {
  const response = useResponse<ArticleExtended[]>();
  const rows = response.results || [];
  const [ featured, recent ] = getFeaturedArticle(rows);
}
```

This view does not query the database itself. It trusts the route and search
event to prepare `response.results`, then renders from the rows it receives.

If the page is empty, inspect the operation in layers. Check the request data
first, then the generated `article-search` event, then the generated
`ArticleActions.findAll` method, and finally the database contents.

```bash
stackpress emit article-search --b config -v
stackpress query "SELECT * FROM article" --b config -v
```

The first command tests the event path without the browser page. The second
command checks the configured database directly, which helps you tell the
difference between a route/view problem and a missing-data problem.

## 221.6. Common Mistakes

Select mistakes usually happen when the read path becomes too broad or the
handoff between route, event, and view becomes unclear. Keep the filters
visible, keep the response shape predictable, and inspect generated code before
rewriting it.

### 221.6.1. Drop The Page Filter

```ts
await ctx.emit('article-search', req, res);
```

This is only safe when `req.data()` already contains the right filters. The
scaffolded home route sets `status` to `PUBLISHED` first because the page
should not show every article record blindly.

### 221.6.2. Read Data In The View

```tsx
const rows = await engine.select('*').from('article');
```

A Stackpress view should render the data it receives instead of opening a
database path itself. Keep database reads in routes, events, or generated
actions, then read `response.results` in the view.

### 221.6.3. Edit Generated Select Code First

```ts
const select = this.store.select(query, this.engine.dialect.q);
```

Generated action code is evidence of what the source produced. Inspect it to
understand the query path, but fix source inputs, generated schema, or request
data before editing generated output by hand.

**Learning checkpoint:** Before moving on, make sure you can trace the
published article list from route request data, to `article-search`, to
`ArticleActions.findAll`, to `response.results` in the view.

**Next course:** Continue with `Insert`. That course moves from reading rows to
creating rows from application input.
