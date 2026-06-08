# 610 Authentication

Learn authentication from the app developer perspective: which routes exist, which events run, and how successful sign-in becomes session state. The goal is to understand the built-in auth surface before customizing identity behavior.

**Previously:** The previous course, `Built-ins`, introduced built-in packages as config plus request flow. Here, the focus narrows to the auth package and the routes it registers under the configured auth base path.

## 610.1. Why Authentication Needs A Flow View

Authentication is not just a form on a page. It includes input, validation, lookup, session changes, redirects, feedback, and security checks.

That is why the authentication lessons use a security-flow shape. A junior developer needs to understand what happens after submit, not just which route displays the form.

## 610.2. The Auth Routes

The auth plugin only registers routes when `auth` config exists. It reads `auth.base` with a default of `/auth`, then mounts sign-up, sign-in, second-factor, link, OTP, phone, username, and sign-out routes under that base path.

```ts
const base = ctx.config.path('auth.base', '/auth');

ctx.import.get(`${base}/signup`, () => import('./pages/signup.js'));
ctx.import.get(`${base}/signin`, () => import('./pages/signin.js'));
ctx.import.get(`${base}/signin/email`, () => import('./pages/signin/email.js'));
ctx.import.get(`${base}/signin/phone`, () => import('./pages/signin/phone.js'));
ctx.import.get(`${base}/signin/username`, () => import('./pages/signin/username.js'));
ctx.import.get(`${base}/signout`, () => import('./pages/signout.js'));
```

This example is a shortened version of the route registration. The important idea is that `/auth` is not magic; it comes from config, and the plugin uses that base path to register the auth pages.

The plugin also registers second-factor routes:

```ts
ctx.import.get(
  `${base}/signin/2fa/:profile/:auth/:challenge`,
  () => import('./pages/signin/2fa.js')
);
ctx.import.get(
  `${base}/signin/otp/:auth/:challenge`,
  () => import('./pages/signin/otp.js')
);
```

This example shows that second-factor work is still route-based. The challenge values live in the path, so the follow-up pages can validate the user without pretending that sign-in is only one screen.

## 610.3. The Auth Events

The auth plugin registers event imports during the `listen` phase. These events are the action side of the auth flow.

```ts
ctx.import.on('auth-signup', () => import('./events/signup.js'));
ctx.import.on('auth-signin', () => import('./events/signin.js'));
ctx.import.on('auth-signout', () => import('./events/signout.js'));
```

This example separates page routing from auth work. The pages collect input and render feedback, while events such as `auth-signin` and `auth-signout` perform the identity and session changes.

## 610.4. What Sign-In Changes

The sign-in event reads the requested sign-in type, checks credentials through auth actions, handles the optional second-factor redirect, and creates session data when the flow succeeds. The session data includes the profile id, name, optional image, and roles.

```ts
res.session.set(session.key, await session.create({
  id: profile.id,
  name: profile.name,
  image: profile.image || undefined,
  roles: Array.isArray(profile.roles) && profile.roles.length > 0
    ? profile.roles
    : [ 'GUEST' ]
}));
```

This example is the state change that makes sign-in matter. After the session token is set, later routes can load the current user and check the user's roles.

## 610.5. Views And Priority

The auth plugin registers built-in views for auth routes with priority `-100`. That makes the default UI available while still giving project code a clear place to override or add behavior intentionally.

```ts
ctx.view.get(
  `${base}/signin`,
  'stackpress-session/esm/auth/views/signin/index',
  -100
);
```

This example shows the route, view module, and priority together. The page route answers the request, and the view registration tells Stackpress which built-in view should render when no higher-priority view replaces it.

## 610.6. How To Verify Authentication

Verify both success and failure. A successful sign-in should create the expected session behavior, while a failed sign-in should leave the user unauthenticated and show clear feedback.

Use browser behavior, redirects, session-visible state, and logs as evidence. Authentication is too important to verify by checking only that a form displayed.

**Learning checkpoint:** Before moving on, make sure you can explain authentication as routes plus events plus session state. You should also know that `auth.base` controls the route prefix and that successful sign-in writes a session token.

**Next course:** Continue with `Sign In`. That course follows the source-backed username sign-in flow from config to route, event, session token, redirect, and feedback.
