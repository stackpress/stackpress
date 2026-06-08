# 620 Roles And Permissions

Learn how roles and session access rules shape what a signed-in user can reach. This lesson connects profile role data, signup defaults, session tokens, and route permission lists so authorization becomes visible app behavior instead of scattered conditionals.

**Previously:** The previous course, `OTP / 2FA`, separated email OTP from app-based 2FA and traced the confirmed challenge flow. This page focuses on the role and session access surfaces that decide what a signed-in user can reach afterward.

## 620.1. Why Permissions Need Their Own Step

Signing in answers identity, but it does not answer authorization. A user may be known to the app and still be blocked from admin routes, account actions, or protected data.

Roles and permission rules give those decisions a place to live. The goal is to keep access checks clear enough that another developer can inspect why a path is allowed or blocked.

## 620.2. Where Roles Come From

The session schema defines `Profile.roles` as a string array with a default of `GUEST`. The field description says those roles are used with sessions to determine app access levels.

```idea
roles         String[]
              @label("Roles")
              @default([ "GUEST" ])
              @description("Roles held by the profile. This is used with sessions to determine access levels of the app.")
```

This example shows that roles are profile data, not just route labels. When sign-in succeeds, the auth event copies profile roles into the session token so later permission checks can use them.

## 620.3. Signup Defaults

Auth config can assign roles to newly created users. A scaffolded app uses `roles: [ 'USER' ]` under `auth`, and the signup event reads that value before creating the profile and auth records.

```ts
export const auth = {
  base: '/auth',
  redirect: '/',
  roles: [ 'USER' ]
};
```

This example means new signups start as `USER` in the scaffolded app. If the app wants a different default, the source-backed place to inspect first is auth config, not the route handler.

## 620.4. Session Access Rules

Session config maps roles to route or event permissions. A scaffolded app separates `ADMIN`, `MANAGER`, `USER`, and `GUEST` access lists so each role can be inspected independently.

```ts
export const session = {
  key: 'session',
  seed: seed.session,
  access: {
    ADMIN: [
      { method: 'ALL', route: '/' },
      { method: 'ALL', route: '/admin/**' },
      { method: 'ALL', route: '/api/**' }
    ],
    GUEST: [
      { method: 'ALL', route: '/' },
      { method: 'ALL', route: '/auth/signup' },
      { method: 'ALL', route: '/auth/signin/**' }
    ]
  }
};
```

This example is shortened, but it shows the shape of the rule list. A role maps to allowed route patterns, and `ALL` means the permission is not limited to one HTTP method.

## 620.5. How Rules Are Checked

The session plugin registers a session helper during config. When `session.access` exists, it imports a request-level authorizer that resolves the `authorize` event for each request before normal handling continues.

```ts
if (ctx.config.path('session.access')) {
  ctx.import.on('request', () => import('./pages/authorize.js'));
}
```

This example shows why access config changes runtime behavior. With an access list, requests pass through authorization; without one, the session source notes that routes are effectively whitelisted.

The session helper checks route permissions by method and route pattern. Route patterns can use exact paths, `:params`, `*`, `**`, or regular expression strings.

```ts
{ method: 'ALL', route: '/auth/**' }
```

This example allows any method under `/auth/**`. That is useful for public auth flows, but it should be used carefully because broad patterns can allow more routes than intended.

## 620.6. How To Inspect Access Problems

When access behavior is wrong, inspect the user state first, then the rule that consumes it. If the user does not have the expected role, changing the route rule may hide the real problem.

After that, check route matching, redirects, and feedback. Permission failures are easier to debug when the app clearly distinguishes unauthenticated, authenticated-but-blocked, and allowed states.

**Learning checkpoint:** Before moving on, make sure you can explain the difference between authentication and authorization. You should also know that profile roles feed session roles, and `session.access` decides which role can reach which routes or events.

**Next course:** Continue with `Session Rules`. That course turns the access-rule shape into a source-backed walkthrough of allowed and blocked paths.
