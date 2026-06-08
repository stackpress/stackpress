# 123 Data Surfaces

Routes become easier to debug when each value has the right home. Stackpress
and Ingest use several related data surfaces, and they can look similar at
first because many of them are callable nested stores. The important lesson is
not that they share a shape; it is that each one answers a different question.

**Previously:** `Response` showed the surfaces a route can use when preparing
an answer. Here, the focus shifts to choosing the correct surface before a
value becomes hard to trace.

## 123.1. What Data Surfaces Are

A data surface is a place where route code, event code, view code, or config
code reads and writes values. Ingest uses callable nested structures for these
surfaces, so `req.data`, `req.query`, `req.post`, `res.data`, and config access
feel related without meaning the same thing.

Think of the surfaces as labeled trays on a desk. The trays may be the same
size, but one is for incoming request values, one is for the main result, one
is for view notes, and one is for app setup.

## 123.2. Request Data

Request-side data has more than one surface because incoming values can come
from different places. `req.query()` is URL query data, `req.post()` is parsed
body data, and `req.data()` is the merged request surface most handlers use by
default.

```ts
app.post('/users/:id', async ({ req, res }) => {
  res.json({
    query: req.query(),
    post: req.post(),
    data: req.data()
  });
});
```

This example returns the three request-side surfaces together so you can see
the distinction. `req.query()` shows query-string values, `req.post()` shows
parsed body values, and `req.data()` shows the main request data object.

`req.data()` is not only body data. Route params, wildcard args, query values,
parsed body values, and hook-added values can all land there before the handler
does its work.

```ts
app.post('/users/:id', ({ req, res }) => {
  res.json({
    id: req.data('id'),
    form: req.data()
  });
});
```

The route param `:id` is readable through `req.data('id')` because route
matching pushes params into the merged request data surface. That keeps a
normal handler simple, while `req.query()` and `req.post()` remain available
when the source of a value matters.

## 123.3. Response Data And Results

The response has different surfaces because not every outgoing value is the
same kind of answer. `res.results(...)` is for the main successful payload,
while `res.data` is response-side metadata, especially for view rendering.

```ts
if (res.code === 200) {
  res.data.set('sessionId', 'abc123');
  res.data.set('sessionUser', 'John Doe');
}

res.results(results);
```

This example stores extra response metadata separately from the main result
set. The `results` payload is what the route produced, while `sessionId` and
`sessionUser` are additional response-side values that a view or later handler
may need.

Stackpress view guides use the same split. Page-only values such as title and
description go through `res.data.set(...)`, while the main payload goes through
`res.results(...)`.

```ts
res.data.set('page', {
  title: 'Articles',
  description: 'Latest articles'
});

res.results({ articles });
```

The page metadata helps the view render the document, but it is not the main
business result. Keeping it in `res.data` prevents the `articles` payload from
turning into a mixed bag of page chrome and data.

## 123.4. Config Data

Config is the app's setup surface. It is available before a request-specific
decision is made, so it should hold shared values such as route bases, brand
settings, language defaults, server settings, database settings, and feature
options.

```ts
app.config.set('database', {
  host: 'localhost',
  port: 5432
});

const host = app.config('database', 'host');
```

This example uses the same nested callable model as request and response
surfaces, but the meaning is different. `database.host` is not something the
visitor submitted; it is app configuration.

Stackpress package code often reads config through `ctx.config.path(...)` when
dot notation is clearer:

```ts
const host = ctx.config.path('server.host', '127.0.0.1');
const port = ctx.config.path('server.port', 3000);
```

This example reads server defaults from config. The fallback values make the
route or event safer because the app can still choose a default when the config
path is missing.

## 123.5. How To Choose

Choose the surface by asking what job the value is doing. A value from the
current visitor belongs on the request side, the main output belongs in
results, render-only support data belongs in response data, and app setup
belongs in config.

### 123.5.1. Default The Current Request

```ts
if (!req.data.has('sort')) {
  req.data.set('sort', {
    field: 'created',
    direction: 'desc'
  });
}
```

This example normalizes missing input for the current request. The default
still belongs to `req.data` because it changes how this request should be
handled, not how every app request is configured forever.

### 123.5.2. Return The Main Payload

```ts
const articles = await ctx.resolve('article-search', req.data());
res.results(articles.results || []);
```

This example uses request data as the search input, then stores the found
articles as the main response result. The route is not setting page metadata;
it is returning the data the route was meant to produce.

### 123.5.3. Add View Metadata

```ts
res.data.set('page', {
  title: 'Articles',
  description: 'Latest articles'
});
```

This example supports rendering, so it belongs in `res.data`. The view can use
the title and description without confusing them with the primary result set.

### 123.5.4. Read Shared App Setup

```ts
const base = ctx.config.path('admin.base', '/admin');
```

This example reads a shared route base from config. It should not come from
`req.data` because a visitor should not decide the app's admin base through the
current request.

## 123.6. Mistakes To Avoid

Data-surface mistakes usually happen when code chooses the surface that is
closest instead of the surface that matches the value's job. The app may still
run, but the next developer has a harder time understanding where the value
came from and who is supposed to read it.

### 123.6.1. Put View Metadata In Results

```ts
res.results({
  articles,
  page: {
    title: 'Articles'
  }
});
```

This mixes the main payload with view-only metadata. Use `res.results(...)` for
the route's primary result and `res.data.set(...)` for page rendering support
so API-style output and view props do not blur together.

### 123.6.2. Put Request Defaults In Config

```ts
ctx.config.set('sort', {
  field: 'created',
  direction: 'desc'
});
```

This stores a request-level default in app setup. If the value only shapes the
current search request, put it in `req.data` so it does not become a global
setting by accident.

### 123.6.3. Ignore Source-Specific Request Surfaces

```ts
const preview = req.data('preview');
```

This can be fine when the merged value is all you need. If the route must know
whether `preview` came from the query string instead of the body or a hook, use
`req.query()` or `req.query.get(...)` so the source is explicit.

## 123.7. Next Step

The main shift in this lesson is that similar-looking helpers are not
interchangeable. `req.data`, `req.query`, `req.post`, `res.results`,
`res.data`, and config are related by shape, but separated by purpose.

Read `142 Server Props` when you are ready to consume response data and
results from React views. That page uses the same surface discipline on the
view side of the request.

**Learning checkpoint:** Before moving on, make sure you can explain the job of
request data, query data, body data, response results, response view data, and
config data. You should also be able to choose a surface by asking who needs
the value and when they need it.

**Next course:** Continue with `Session`. The next lesson applies the same
surface discipline to data that follows a user across requests.
