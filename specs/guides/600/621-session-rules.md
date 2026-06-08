# 621 Session Rules

Session rules decide which roles can reach which routes or events. They are
the gate between "this user is signed in" and "this user is allowed to do this
specific thing." A session can prove who someone is, but access rules decide
what that identity can touch.

This matters because private apps rarely have only two states. A guest, a
normal user, a manager, and an admin may all be signed in or browsing the same
site, but they should not all reach the same URLs.

**Previously:** `Roles And Permissions` explained where roles come from. This
lesson follows those roles into `session.access`, the request authorization
hook, and the route-matching helpers that decide whether a request is allowed.

## 621.1. Flow Goal

The flow goal is to turn a request into a yes-or-no access decision. The
session plugin loads the browser session, reads its roles, expands those roles
into permissions, and checks whether the current route matches one of those
permissions.

Think of it like a building badge. The badge says who you are and which groups
you belong to, but each door still has its own allowlist. A session rule is
one entry on that door allowlist.

## 621.2. Config Surface

A scaffolded app defines route permissions under `session.access`. Each key is
a role, and each value is a list of route permissions for that role.

```ts
export const session = {
  key: 'session',
  seed: seed.session,
  access: {
    ADMIN: [
      { method: 'ALL', route: '/' },
      { method: 'ALL', route: '/articles/**' },
      { method: 'ALL', route: '/auth/**' },
      { method: 'ALL', route: '/admin/**' },
      { method: 'ALL', route: '/api/**' }
    ],
    GUEST: [
      { method: 'ALL', route: '/' },
      { method: 'ALL', route: '/articles/**' },
      { method: 'ALL', route: '/auth/signup' },
      { method: 'ALL', route: '/auth/signin' },
      { method: 'ALL', route: '/auth/signin/**' }
    ]
  }
};
```

This example shows the allowlist shape. `ADMIN` can reach admin and API paths,
while `GUEST` can reach the public homepage, article pages, and selected auth
routes.

The session plugin registers those rules during the `config` lifecycle:

```ts
const key = ctx.config.path('session.key', 'session');
const seed = ctx.config.path('session.seed', 'abc123');
const access = ctx.config.path<SessionPermissionList>('session.access', {});
ctx.register('session', Session.configure(key, seed, access));
```

This example connects config to runtime behavior. The configured session key,
seed, and access list become the session plugin used by request handlers and
authorization events.

## 621.3. Rule Evaluation

When `session.access` exists, the session plugin registers a request listener
that runs before normal route behavior finishes. That request listener asks the
`authorize` event whether the current request is allowed.

```ts
if (ctx.config.path('session.access')) {
  ctx.import.on('request', () => import('./pages/authorize.js'));
}
```

This example explains why adding an access list changes the whole app. Once
the list exists, every request can pass through authorization before the final
page response is accepted.

The authorization page delegates to the `authorize` event:

```ts
const authorized = await ctx.resolve('authorize', req);
if (authorized.code !== 200) {
  res.fromStatusResponse(authorized);
  await ctx.emit('error', req, res);
}
```

This example shows how a failed authorization becomes the response. The route
does not silently continue; it copies the unauthorized response and lets the
app error flow render the result.

The session class performs the actual permission check:

```ts
permits.unshift({
  method: req.method.toUpperCase(),
  route: req.url.pathname
});
const permitted = await session.can(...permits);
```

This example adds the current request to the permission list being checked. A
request for `GET /admin/article/search` becomes a route permit that must match
one of the active session role permissions.

## 621.4. Allowed And Blocked Paths

Allowed paths come from the active session roles. If there is no valid token,
the session behaves as `GUEST`. If there is a token, the roles in the token are
used to collect permissions from `session.access`.

```ts
const data = await this.data();
const roles: string[] = data?.roles || [ 'GUEST' ];
return roles.map(
  role => SessionServer.access[role] || []
).flat();
```

This example is the bridge from identity to access. A session with
`roles: ['USER']` gets the `USER` permission list, while a missing session gets
the `GUEST` list.

Route matching supports exact paths, `:params`, `*`, and `**` style patterns:

```ts
const pattern = !isRegExp.test(permission.route)
  ? `/^${permission.route
    .replace(/(\:[a-zA-Z0-9\-_]+)/g, '*')
    .replaceAll('*', '([^/]+)')
    .replaceAll('([^/]+)([^/]+)', '(.*)')
  }$/ig`
  : permission.route;
```

This example shows why `/articles/**` can allow a whole article section. The
helper turns the route pattern into a regular expression and compares it with
the current request path.

Method matching happens before path matching:

```ts
if (permission.method !== 'ALL' && permission.method !== permit.method) {
  return false;
}
```

This example means `{ method: 'GET', route: '/admin/**' }` does not allow
`POST /admin/article/create`. Use `ALL` only when the role should truly be able
to use every method for that route pattern.

## 621.5. Security Checks

Session rules are easy to make too broad. The safest habit is to start with the
smallest route pattern that supports the workflow, then widen it only when the
product requirement is clear.

### 621.5.1. Protect Admin Routes

Admin routes should belong to roles that are meant to use admin tools. In the
A scaffolded app, `ADMIN` can reach `/admin/**`, but `USER` and `GUEST` do not
list that pattern.

```ts
ADMIN: [
  { method: 'ALL', route: '/admin/**' }
],
USER: [
  { method: 'ALL', route: '/' },
  { method: 'ALL', route: '/articles/**' }
]
```

This example protects admin pages by omission. The `USER` role is not denied
explicitly; it simply does not receive a matching `/admin/**` permission.

### 621.5.2. Allow Public Dependencies

Public pages often need supporting routes such as auth pages, client scripts,
stylesheets, or API paths. If those URLs are not allowlisted, a public page can
render incorrectly even when the main page route is allowed.

```ts
GUEST: [
  { method: 'ALL', route: '/' },
  { method: 'ALL', route: '/articles/**' },
  { method: 'ALL', route: '/auth/signin/**' },
  { method: 'ALL', route: '/api/**' }
]
```

This example is broad because it comes from a scaffolded app. Before copying
it into another app, ask whether all guest API routes should really be public
or whether the app needs narrower API rules.

### 621.5.3. Understand The No-Access-List Case

The session class allows everything when no access list is configured. That is
useful for early development, but it should not be mistaken for protected
behavior.

```ts
if (Object.keys(this._access).length === 0) {
  return true;
}
```

This example is the empty-rule shortcut inside `Session.authorize()`. Once a
project needs route protection, add an explicit `session.access` map so the app
has real allowlist behavior.

## 621.6. Verify

Verify session rules by checking the active roles and the exact route permit.
The `me` event returns session authorization data, including roles, token, and
computed permits, so it is useful when a route is unexpectedly blocked.

```ts
const me = session.load(req);
res.results(await me.authorization());
```

This example shows the source behind the `me` event. It loads the current
session and returns the authorization view of the token, which helps you see
what the server thinks the current user can do.

Use these files when debugging session rules:

```text
config/common.ts
packages/stackpress-session/src/session/plugin.ts
packages/stackpress-session/src/session/Session.ts
packages/stackpress-session/src/session/helpers.ts
packages/stackpress-session/src/session/pages/authorize.ts
packages/stackpress-session/src/session/events/authorize.ts
packages/stackpress-session/src/session/events/session.ts
packages/stackpress-session/src/session/types.ts
```

These files cover config loading, request authorization, role-to-permit
expansion, route matching, and the diagnostic session event. Read them in that
order when debugging because each file hands the request to the next part of
the access decision.

**Next step:** Read `631 Profile` to see where roles live on profile data
before they are copied into a session token.

**Learning checkpoint:** You should be able to explain why a missing
`/admin/**` rule blocks a non-admin user. You should also be able to explain
why an empty `session.access` object allows every request instead of protecting
routes.
