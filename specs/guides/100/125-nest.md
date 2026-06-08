# 125 Nest

Learn the nested data helper behind `req.data`, `req.query`, `req.post`, and
`res.data`. Stackpress uses `Nest` so request and response data can be read
with simple keys, nested paths, query strings, form payloads, and callable
stores.

**Previously:** `Session` separated request-side reads from response-side
writes. This lesson returns to normal data surfaces and explains the shared
nested-object interface underneath them.

## 125.1. Use Case

`Nest` is useful when data is object-shaped. Query strings, form bodies, route
params, view metadata, and CLI arguments often become nested data before route
or event handlers consume them.

That is why `req.data`, `req.query`, `req.post`, and `res.data` feel similar.
They are callable nested stores built on the same helper instead of four
unrelated APIs.

## 125.2. Read Values

A `Nest` store can be called like a function. The callable form is the compact
read style used throughout route and event examples.

```ts
server.get('/articles/:slug', ({ req, res }) => {
  const slug = req.data('slug');
  const page = req.query('page') || '1';

  res.results({ slug, page });
});
```

This handler reads the route value from `req.data` and the URL query value from
`req.query`. Both reads use the same callable pattern, but they still come from
different request surfaces.

You can also use `get()` when the code benefits from an explicit method:

```ts
const slug = req.data.get('slug');
const page = req.query.get('page');
```

The result is the same kind of read. The choice is usually readability: use the
callable style for short access and `get()` when pairing it with other methods
such as `has()` or `keys()`.

## 125.3. Read Paths

Nested data can be read with separate path segments or with dot notation. Dot
notation is useful when a key path is already stored as a string.

```ts
const city = req.data.get('address', 'city');
const sameCity = req.data.path('address.city');
```

Both lines read the nested `address.city` value. The segmented form is nice
when the path is known in code, while `path()` is useful when the path comes
from config, metadata, or generated field names.

`withPath` exposes the same idea as a helper object:

```ts
const title = req.data.withPath.get('article.title');
```

This example reads through the path helper instead of the main store. It is
most useful when several reads or writes in the same block are dot-path based.

## 125.4. Write Values

Writable `Nest` stores can set individual nested values or merge a plain
object. Route examples often use this when preparing request data for an event.

```ts
req.data.set('status', 'PUBLISHED');
req.data.set('filters', 'limit', 10);
```

The first line writes one top-level key. The second line writes a nested value
at `filters.limit`, which lets later code read either `req.data('filters')` or
`req.data.get('filters', 'limit')`.

`res.data` uses the same write shape for response metadata:

```ts
res.data.set('view', 'title', 'Articles');
res.data.set({ layout: 'panel' });
```

This example prepares view-oriented response metadata. It does not replace
`res.results(...)`; it gives the view layer extra context that belongs beside
the main response body.

## 125.5. Inspect And Iterate

`Nest` also exposes inspection helpers. These are useful when debugging a
handler or writing generic code that should not assume every key up front.

```ts
if (req.data.has('filters')) {
  for (const key of req.data.keys()) {
    console.log(key, req.data.get(key));
  }
}
```

This code first checks whether the `filters` key exists, then lists the
top-level keys in the request data store. Use this style when you need to
inspect what the store actually received.

`forEach()` can iterate arrays, objects, or strings at a path:

```ts
await req.data.forEach('tags', async (value, key) => {
  console.log(key, value);
});
```

This example keeps traversal inside the store helper. It is better than
guessing whether `tags` is currently an array or an object before every use.

## 125.6. Parse Input Shapes

`Nest` can parse query strings, form data, JSON, and CLI-style arguments
through helper properties and exported utilities. That is why adapters can
turn outside input into the same route-facing data shape.

```ts
import { Nest } from '@stackpress/lib';

const input = new Nest();
input.withQuery.set('filter[type]=article&tags[]=news&tags[]=docs');

const type = input.path('filter.type');
const firstTag = input.path('tags.0');
```

The query string becomes nested data. `filter[type]` turns into
`filter.type`, and repeated `tags[]` values become array-like values that can
be read by path.

The exported helpers do the same kind of conversion when you need them outside
an existing request object:

```ts
import { objectFromQuery } from '@stackpress/lib';

const data = objectFromQuery('page=2&filter[status]=PUBLISHED');
```

This helper returns a plain object. You can then pass that object into `Nest`
or use it as normal parsed input, depending on the workflow.

## 125.7. Mistakes To Avoid

Nest mistakes usually come from forgetting which surface owns the data or from
flattening nested input too early. Keep the source surface and path shape
visible while you work.

### 125.7.1. Treat All Request Data As The Same Source

```ts
const value = req.data('status');
```

This may be correct, but it hides whether `status` came from route data, query
data, body data, or a value the route added. Use `req.query` or `req.post`
when the source matters.

### 125.7.2. Put View Metadata In Results

```ts
res.results({ title: 'Articles', rows });
```

This mixes response body data with view metadata. Use `res.data.set(...)` for
metadata and `res.results(...)` or `res.rows(...)` for the main payload.

### 125.7.3. Flatten A Nested Query Too Early

```ts
const status = req.query('filter[status]');
```

Parsed query data is nested. Read the nested path with
`req.query.get('filter', 'status')` or `req.query.path('filter.status')` so
the code matches the data shape.

## 125.8. Reference Pointers

The source API is `/Users/cblanquera/server/projects/stackpress/lib/specs/api/data/Nest.md`.
Use it when you need the full method list for `entries()`, `values()`,
`clear()`, `delete()`, `toString()`, path helpers, and parser utilities.

**Next course:** Continue with `Events`. That course shows why routes often
prepare request data first, then hand reusable business behavior to named
events.
