# 630 Sessions And Account

Learn how session state, profile data, account pages, and security pages work together around the current user. This group connects authentication results to the everyday account surfaces a signed-in user sees.

**Previously:** The previous course, `Session Rules`, explained how access config is evaluated for allowed and blocked paths. Here, the focus shifts to the confirmed account and session routes provided by `stackpress-session`.

## 630.1. Why Sessions And Account Belong Together

Session state answers what is true about the current request. Account and profile pages use that state to show or change information for the current user.

That connection is why account behavior should not be treated as a generic profile editor. The route needs to know which user is signed in, which session token is active, and which account action is being requested.

## 630.2. The Session Plugin

The session plugin only runs when `session` config exists. During config, it registers a `session` plugin with the configured cookie key, seed, and access list.

```ts
const key = ctx.config.path('session.key', 'session');
const seed = ctx.config.path('session.seed', 'abc123');
const access = ctx.config.path<SessionPermissionList>('session.access', {});

ctx.register('session', Session.configure(key, seed, access));
```

This example shows the foundation for session-aware pages. The cookie key tells Stackpress where to store the token, the seed signs the token, and the access list powers permission checks.

## 630.3. Account Routes

When auth config exists, the session plugin registers account and security routes under `auth.base`. With the default base, these routes live under `/auth/account`.

```ts
ctx.import.get(`${base}/account`, () => import('./pages/account.js'));
ctx.import.get(`${base}/account/update`, () => import('./pages/update.js'));
ctx.import.get(`${base}/account/security`, () => import('./pages/account.js'));
ctx.import.get(`${base}/account/security/export`, () => import('./pages/export.js'));
ctx.import.get(`${base}/account/security/remove`, () => import('./pages/remove.js'));
ctx.import.get(`${base}/account/security/password`, () => import('./pages/password.js'));
ctx.import.get(`${base}/account/security/2fa`, () => import('./pages/2fa/detail.js'));
```

This example shows the account surface as routes, not just views. Account display, update, export, removal, password change, and 2FA setup are separate request paths that can be inspected and protected.

The plugin also registers `POST` routes for state-changing account actions:

```ts
ctx.import.post(`${base}/account/update`, () => import('./pages/update.js'));
ctx.import.post(`${base}/account/security/remove`, () => import('./pages/remove.js'));
ctx.import.post(`${base}/account/security/password`, () => import('./pages/password.js'));
ctx.import.post(`${base}/account/security/2fa`, () => import('./pages/2fa/detail.js'));
```

This example separates reading account pages from changing account state. The `POST` routes are the ones that need especially careful validation, authorization, and user feedback.

## 630.4. Built-In Views

The session plugin registers built-in views for the account and security routes with priority `-100`. That gives the app a default UI while still making the route-to-view mapping visible.

```ts
ctx.view.get(
  `${base}/account/security/password`,
  'stackpress-session/esm/session/views/password',
  -100
);
```

This example tells you which view module renders the password page by default. The route and view are paired, which makes account pages easier to inspect than a single hidden account controller.

## 630.5. The Current User Thread

The thread through this group is the current user. A route should know whose profile is being read, whose account page is being updated, and which user should see the feedback message.

That thread matters for safety and clarity. Account behavior should not accidentally read or change data for the wrong user.

## 630.6. How To Verify Account Behavior

Verify account behavior while signed in as the user the page is meant to represent. Then check the blocked or signed-out case so the route does not leak profile or account information.

For account changes, verify both the response and the underlying state. A page can render successfully while the session, profile, password, or 2FA state did not change as expected.

**Learning checkpoint:** Before moving on, make sure you can explain how session config creates the session plugin and how account routes are mounted under `auth.base`. You should also know why current-user ownership is the key safety concern in this group.

**Next course:** Continue with `Profile`. That course follows the profile model, signup-created profile data, account loading, and current-user ownership.
