# 124 Session

Use request sessions to read state that arrived with the request, and response
sessions to write state that should exist on the next request. This lesson is
about the `req.session` and `res.session` interface, not the higher-level auth
and permission system.

**Previously:** `Data Surfaces` separated request input, response output, and
metadata storage. Session data is another surface in that same request flow:
read from the request, write to the response, and let the adapter carry the
cookie changes across requests.

## 124.1. Use Case

Session data is useful when one request needs to remember something for a later
request. A route might read a user id, a theme choice, a flash marker, or a
temporary token that arrived through cookies.

The important split is direction. `req.session` reads what the client already
sent, while `res.session` records what the server wants the client to carry
next.

## 124.2. Read From `req.session`

The request session is a callable session store. You can read it by calling the
store like a function or by using map-style helpers such as `get()` and
`has()`.

```ts
server.get('/account', ({ req, res }) => {
  const profileId = req.session('profileId');

  if (!profileId) {
    res.redirect('/auth/signin');
    return;
  }

  res.results({ profileId });
});
```

This route reads `profileId` from the incoming request session. If the value is
missing, the route redirects; if the value exists, the route can use it as
request state for the rest of the handler.

The same read can use `get()` when you prefer map-style code:

```ts
const profileId = req.session.get('profileId');
const hasTheme = req.session.has('theme');
const snapshot = req.session.data;
```

These helpers all read from the same request-side store. `data` is a snapshot
of the current session values, while `has()` helps distinguish a missing key
from a key that exists with an empty-looking value.

## 124.3. Write To `res.session`

The response session records changes that should be written back to the client
by the adapter. Use it when the current handler decides what the next request
should remember.

```ts
server.post('/theme', ({ req, res }) => {
  const theme = req.post('theme') || 'light';

  res.session.set('theme', theme, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });

  res.redirect('/account');
});
```

This handler reads a submitted theme from the request body and writes the new
theme to `res.session`. The redirect is the immediate response, while the
session write prepares the next request to see the new theme.

You can also delete a value when the next request should forget it:

```ts
server.post('/signout', ({ res }) => {
  res.session.delete('profileId');
  res.redirect('/auth/signin');
});
```

This example records a removal revision. The route does not need to manually
build a `Set-Cookie` header because the response session tracks the change for
the adapter.

## 124.4. How The Store Works

The shared session helper is `CallableSession`. It keeps the usual map-style
methods and also lets you read through function invocation.

```ts
const value = req.session('profileId');
const sameValue = req.session.get('profileId');
```

Both lines read the same key. The callable style is compact, while `get()` can
be clearer when the surrounding code already uses `has()`, `keys()`, or
`values()`.

On the write side, `res.session` tracks revisions:

```ts
res.session.set('profileId', 'profile_123', { httpOnly: true });
const pending = Array.from(res.session.revisions.entries());
```

The `revisions` map is the evidence that the response has pending session
changes. Adapters use those revisions to write cookies or equivalent
transport-specific session output.

## 124.5. Mistakes To Avoid

Session mistakes usually come from mixing request reads and response writes.
Keep the direction clear: request state came in, response state goes out.

### 124.5.1. Write To `req.session`

```ts
req.session.set('theme', 'dark');
```

This is the wrong surface for route intent. The request describes what already
arrived, while the response describes what should be sent back to the client.

### 124.5.2. Read The New Value From The Wrong Request

```ts
res.session.set('theme', 'dark');
const theme = req.session('theme');
```

This example writes a response revision and then expects the current request to
change. The new value is meant for the next request, after the client receives
and sends back the updated session cookie.

### 124.5.3. Store Complex Objects Without Encoding Them

```ts
res.session.set('permissions', permissions);
```

Session values are string-oriented cookie data. If you need to store structured
values, encode them intentionally or store a stable identifier and load the
full object from a safer source.

## 124.6. Reference Pointers

For the interface details, read the library session, request, and response
specs. For auth-specific rules, roles, and permissions, read `621 Session
Rules` later in the built-ins level.

**Next course:** Continue with `Nest`. That course explains the nested data
store behind `req.data`, `req.query`, `req.post`, and `res.data`.
