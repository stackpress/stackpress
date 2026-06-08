# 121 Request

Read request input in a route so your app can respond to path, query, body,
header, method, URL, and session data. The request object is the route's input
envelope, so this lesson teaches how to open the right part of that envelope at
the right time.

**Previously:** `Pages` introduced route handlers as the place where browser
input becomes an app response. Here, the focus shifts to the incoming side of
that handler.

## 121.1. Use Case

A route starts with a question from the outside world. The request object is
the envelope that carries that question: path params, query values, form data,
headers, method, URL, and session state. If you know which part of the envelope
you are opening, the handler is easier to validate and debug.

## 121.2. Minimal Handler

First, add a route that reads a query value from the merged request data
surface:

```ts
server.get('/hello', ({ req, res }) => {
  const name = req.data('name') || 'developer';
  res.set('text/plain', `Hello ${name}`);
});
```

This route reads `name` from `req.data()`, the merged request data surface. If
the request does not include a name, the route falls back to `developer`; then
it sends a plain text response with the chosen value.

Open:

```text
http://localhost:3000/hello?name=Stackpress
```

You should see:

```text
Hello Stackpress
```

The visible result connects the query string to the route response. Changing
`name=Stackpress` changes the text because `req.data('name')` reads that
incoming value, and the response uses the value it found.

## 121.3. Read Params And Body

The request object carries normalized input for the current HTTP request.
In normal route handlers, prefer `req.data()` when you want the merged view
of route params, wildcard args, query values, parsed body values, and values
added by hooks.

Use narrower request surfaces when the source matters:

```ts
server.post('/articles/:slug', ({ req, res }) => {
  const slug = req.data('slug');
  const title = req.post.get('title');
  const preview = req.query.get('preview') === '1';

  res.json({ slug, title, preview });
});
```

This example separates the sources on purpose. `slug` comes from the route,
`title` comes from the request body, and `preview` comes from the query string.
They can all be returned together, but knowing where they came from helps you
validate and debug the route.

Route params such as `:slug` are copied into `req.data()` during route
matching. Parsed body values are available through `req.post`, and query
string values are available through `req.query`.

In adapter-driven request handling, the body is usually loaded before the
route lifecycle reaches your handler. That is why normal Stackpress route code
can read `req.post` and `req.data` without calling `req.load()` manually.

## 121.4. Read Session Or Headers

This section separates request surfaces that are easy to mix up when you are
new to route handlers. Path data identifies the resource, query data adjusts
the view of the resource, body data carries submitted input, and session or
header data adds context around the visitor.

### 121.4.1. Path Data

Path data comes from route parameters such as `/articles/:slug`. Use it when
the URL identifies one resource.

```ts
server.get('/articles/:slug', ({ req, res }) => {
  const slug = req.data('slug');
  res.results({ slug });
});
```

Here `:slug` acts like a named blank in the URL. When the request matches the
route, Stackpress places the actual value into `req.data('slug')`.

### 121.4.2. Query Data

Query data comes after `?` in the URL. Use it for filtering, sorting,
pagination, and optional page state.

```ts
server.get('/articles', ({ req, res }) => {
  const page = Number(req.query.get('page') || '1');
  const sort = req.query.get('sort') || 'created';

  res.results({ page, sort });
});
```

This example reads optional page state. A missing `page` becomes `1`, and a
missing `sort` becomes `created`, so the route has predictable defaults.

### 121.4.3. Body Data

Body data usually comes from forms or JSON requests. Use it for create,
update, and action routes.

```ts
server.post('/articles', ({ req, res }) => {
  const title = req.post.get('title');

  if (!title) {
    res.setError('Title is required.', {
      title: 'Enter a title.'
    }, [], 400);
    return;
  }

  res.json({ title });
});
```

Body data is usually the data the user submitted. This example checks `title`
before using it, because request values should not be trusted just because they
arrived in the expected field.

### 121.4.4. Session Data

Session data represents the current visitor or signed-in user state when the
session layer is active. Use it when the route needs to know who is visiting
before returning protected data.

```ts
server.get('/account', ({ req, res }) => {
  const userId = req.session.get('userId');

  if (!userId) {
    res.redirect('/auth/signin');
    return;
  }

  res.results({ userId });
});
```

The route treats session state as proof of who is visiting. If the session does
not have a user ID, the response redirects instead of returning account data.

### 121.4.5. Headers

Headers carry request metadata such as content type, authentication, and user
agent values. Use them when the route decision depends on information around
the request instead of normal form or URL input.

```ts
server.get('/api/me', ({ req, res }) => {
  const authorization = req.headers.get('authorization');

  if (!authorization) {
    res.setError('Authentication required.', {}, [], 401);
    return;
  }

  res.json({ authenticated: true });
});
```

Headers are useful when the request carries metadata instead of normal form or
URL values. In this example, the route refuses to continue unless an
authorization header is present.

### 121.4.6. Method And URL

`req.method` tells you which HTTP method matched the request. `req.url` is a
standard URL object, so common reads include `req.url.pathname`,
`req.url.search`, and `req.url.origin`.

```ts
server.get('/debug', ({ req, res }) => {
  res.json({
    method: req.method,
    path: req.url.pathname
  });
});
```

This example is small, but it shows two common inspection points. The method
tells you how the request arrived, and the URL object gives you the path and
other location details.

## 121.5. Mistakes To Avoid

Request mistakes usually happen when every input source is treated the same. A
route should know whether it is reading a path value, query value, body value,
header, or session value.

### 121.5.1. Use Merged Data Without Knowing The Source

```ts
const data = req.data();
const title = data.title;
```

This example reads from the merged request data object without checking where
`title` came from. `req.data()` is useful when a downstream helper needs all
values together, but it is not the best choice when a body value and query
value must be treated differently.

### 121.5.2. Normalize Without Writing The Normalized Value

```ts
const sort = req.data('sort') || 'created';
await ctx.emit('article-search', req, res);
```

This code chooses a local default but never writes the default back to the
request. If `article-search` reads `req.data('sort')`, it may still see an
empty value even though the handler has a local `sort` variable.

Write the normalized value into the request data surface when later code should
share it:

```ts
const sort = req.data('sort') || 'created';
req.data.set('sort', sort);
await ctx.emit('article-search', req, res);
```

Now the helper and the handler are reading the same normalized request state.
That matters when hooks, events, or generated actions expect values to already
be present on `req.data()`.

### 121.5.3. Trust Raw Input Too Early

```ts
const role = req.post.get('role');
await ctx.resolve('profile-update', { role });
```

This example sends user input straight into a write operation. Validate or
normalize request values before database writes, permission decisions,
redirects, and anything else that changes app state.

### 121.5.4. Assume Every Value Is A String

```ts
const tags = req.data('tags');
const first = tags.trim();
```

This can fail when the value is an array, parsed JSON object, uploaded file, or
hook-provided value. Check the shape before using string methods, especially
when the route accepts more than a simple query string.

## 121.6. Reference Pointers

By the end of this lesson, the request should feel like the route's input
envelope. It gathers values from several places, and your job is to read the
right surface for the decision you are making.

**Next step:** Read `122 Response` to shape the output from a request handler.
For request helper details, use [HTTP route exports](/reference/http). Read it
as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain why a
request has more than one data surface. You should know when to read params,
query values, body values, headers, cookies, or session data instead of
treating every input as the same kind of value.

**Next course:** Continue with `Response`. The next lesson turns from the
route's input envelope to the answer the route sends back.
