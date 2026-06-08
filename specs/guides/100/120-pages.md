# 120 Pages

A page route is where an incoming request becomes an outgoing answer. It is the
place a browser visit turns into handler code, response data, and sometimes a
rendered view.

**Previously:** `Local Plugins` showed how app behavior becomes part of the
running server. Here, the focus shifts to the handler flow that makes that
behavior visible to a browser.

## 120.1. Why Pages Need Their Own Group

A route is simple when it only returns a small response. Real pages need more
shape because they read input, choose behavior, prepare data, handle session
state, and decide what the browser should receive.

The Ingest lazy-route guide shows the smallest version of this split. The app
registers the route in one place, then loads the handler module only when that
route is needed.

## 120.2. A Small Lazy Route

Start by reading the route registration. This registration keeps the route path
visible while moving the handler into a separate module.

```ts
app.import.get('/users', () => import('./routes/users.js'));
```

This line registers `GET /users` and tells Stackpress how to import the module
that handles it. The route stays visible to tooling, and the handler code does
not have to be loaded until the app needs it.

Now look at the handler file the route imports:

```ts
export default function UsersIndex({ res }) {
  res.results([
    { id: 1, name: 'Ada' },
    { id: 2, name: 'Grace' }
  ]);
}
```

The handler receives a route context object and uses `res` to shape the answer.
`res.results(...)` stores the result set for the response, so the route can
return structured data instead of a loose string.

## 120.3. The Request And Response Pair

The request is what the visitor brought to the route. It can include the path,
query string, body, method, headers, cookies, and session context.

The response is the answer the route sends back. It can carry JSON, HTML, a
redirect, status information, headers, cookies, result data, or view data
depending on what the route needs to accomplish.

## 120.4. Data Has Different Surfaces

Stackpress keeps different kinds of data on different surfaces so later code
can read the right value for the right reason. Request input, response results,
response view data, plugin data, and generated data should not be treated as
one shared bucket.

That separation matters most when a route prepares a view. The handler may read
request input, set response data, attach view props, and keep session state
separate from the page payload.

## 120.5. How To Read The Page Lessons

Start with `121 Request` and `122 Response` because those are the two halves of
a handler. Then read `123 Data Surfaces` to understand where values should live
after they enter the flow.

After that, `124 Session` explains request-side session reads and
response-side session writes. `125 Nest` explains the nested data helper behind
`req.data`, `req.query`, `req.post`, and `res.data`, so it makes more sense
after the plain request/response pattern is familiar.

**Learning checkpoint:** Before moving on, make sure you can describe a route
as a path from request input to response output. You should also know that not
every value belongs in the same data surface.

**Next course:** Continue with `Request`. That course studies the incoming side
of the route handler.
