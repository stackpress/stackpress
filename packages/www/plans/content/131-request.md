# 131 Request

Read request input in a route so your app can respond to path, query, body, header, method, URL, and session data. The request object is the route's input envelope, so this lesson teaches how to open the right part of that envelope at the right time.

**Previously:** The previous lesson, `123 Plugin Config`, gave you the setup this page builds on. Here, the focus shifts to `Request` so you can place the next Stackpress surface in the course path.

## 131.1. Use Case

A route starts with a question from the outside world. The request object is the envelope that carries that question: path params, query values, form data, headers, method, URL, and session state.

## 131.2. Minimal Handler

Add a route that reads a query value from the merged request data surface:

```ts
server.get('/hello', ({ req, res }) => {
  const name = req.data('name') || 'developer';
  res.set('text/plain', `Hello ${name}`);
});
```

This route reads `name` from `req.data()`. If the request does not include a
name, the route falls back to `developer`; then it sends a plain text response
with the chosen value.

Open:

```text
http://localhost:3000/hello?name=Stackpress
```

You should see:

```text
Hello Stackpress
```

The visible result connects the query string to the route response. Changing `name=Stackpress` changes the text because `req.data('name')` reads that incoming value.

## 131.3. Read Params And Body

The request object carries normalized input for the current HTTP request.
In normal route handlers, prefer `req.data()` when you want the merged view
of route params, query values, parsed body values, and values added by hooks.

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

## 131.4. Read Session Or Headers

This section separates request surfaces that are easy to mix up when you are new to route handlers. Path data identifies the resource, query data adjusts the view of the resource, body data carries submitted input, and session or header data adds context around the visitor.

### 131.4.1. Path Data

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

### 131.4.2. Query Data

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

### 131.4.3. Body Data

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

### 131.4.4. Session Data

Session data represents the current visitor or signed-in user state when the
session layer is active. Use it when the route needs to know who is visiting before returning protected data.

```ts
server.get('/account', ({ req, res }) => {
  const profileId = req.session.get('profileId');

  if (!profileId) {
    res.redirect('/auth/signin');
    return;
  }

  res.results({ profileId });
});
```

The route treats session state as proof of who is visiting. If the session does
not have a profile ID, the response redirects instead of returning account
data.

### 131.4.5. Headers

Headers carry request metadata such as content type, authentication, and user
agent values. Use them when the route decision depends on information around the request instead of normal form or URL input.

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

### 131.4.6. Method And URL

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

## 131.5. Mistakes To Avoid

Request mistakes usually happen when every input source is treated the same. A route should know whether it is reading a path value, query value, body value, header, or session value.

### 131.5.1. Use Merged Data Without Knowing The Source

```ts
const data = req.data();
const title = data.title;
```

`req.data()` returns the merged request data object, which is useful when a downstream helper needs all values together. It is not the best choice when the source matters, because a body value and query value can look the same after they are merged.

### 131.5.2. Normalize Without Writing The Normalized Value

```ts
const sort = req.data('sort') || 'created';
req.data.set('sort', sort);
```

The first line chooses a safe default, and the second line writes that default back into the request data surface. That matters when another helper later expects `sort` to already be present.

### 131.5.3. Trust Raw Input Too Early

```ts
const role = req.post.get('role');
await ctx.resolve('profile-update', { role });
```

This example sends user input straight into a write operation. Validate or normalize request values before database writes, permission decisions, redirects, and anything else that changes app state.

### 131.5.4. Assume Every Value Is A String

```ts
const tags = req.data('tags');
const first = tags.trim();
```

This can fail when the value is an array, parsed JSON object, uploaded file, or hook-provided value. Check the shape before using string methods, especially when the route accepts more than a simple query string.

## 131.6. Reference Pointers

By the end of this lesson, the request should feel like the route's input
envelope. It gathers values from several places, and your job is to read the
right surface for the decision you are making.

**Next step:** Read `132 Response` to shape the output from a request handler. For request helper details, use [HTTP route exports](/reference/http). Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `132 Response`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
