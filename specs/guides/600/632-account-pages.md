# 632 Account Pages

Account pages are the built-in screens where a signed-in profile can inspect
and manage its own data. They sit on top of session state, profile records,
auth records, CSRF-protected forms, and built-in views. The pages are not admin
pages; they are current-user pages.

That difference matters because a user should not choose which profile to edit
by changing a URL. The account pages load the active profile from the session
token and then use package routes to show or update that account.

**Previously:** `Profile` explained the identity record behind a session. This
lesson maps the built-in account routes that let the signed-in user work with
that profile.

## 632.1. Flow Goal

The goal is to give the signed-in user a safe account surface. They can view
their profile, edit personal information, manage security, export profile data,
change password, enable or remove 2FA, and schedule account removal.

The mental model is a self-service desk. The user is already inside the app,
so the desk can help with their own account, but it still checks their badge
before showing or changing anything.

## 632.2. Config Surface

Account routes are registered only when session and auth config are active. The
route base comes from `auth.base`, so a scaffolded app uses `/auth/account`
paths because `auth.base` is `/auth`.

```ts
const base = ctx.config.path('auth.base', '/auth');

ctx.import.get(`${base}/account`, () => import('./pages/account.js'));
ctx.import.get(`${base}/account/update`, () => import('./pages/update.js'));
ctx.import.get(`${base}/account/security`, () => import('./pages/account.js'));
ctx.import.get(`${base}/account/security/export`, () => import('./pages/export.js'));
ctx.import.get(`${base}/account/security/password`, () => import('./pages/password.js'));
ctx.import.get(`${base}/account/security/2fa`, () => import('./pages/2fa/detail.js'));
```

This example corrects a common path mistake. The account security page is
`/auth/account/security`, not `/account/security`, unless the app changes the
auth base or adds custom routes.

The plugin also registers built-in views:

```ts
ctx.view.get(
  `${base}/account`,
  'stackpress-session/esm/session/views/account',
  -100
);
```

This example shows the package view boundary. Stackpress Session provides the
default view module, and the priority value lets the framework register it
without forcing every app to handwrite the account page first.

## 632.3. Account Page Flow

Every account page starts by loading the session and rejecting guests. The
profile ID comes from the session token, not from a route parameter supplied by
the browser.

```ts
const session = ctx.plugin<SessionPlugin>('session');
const me = session.load(req);
const data = await me.data();

if (!data || await me.guest()) {
  res.statusCode(401, 'Unauthorized');
  return;
}
```

This example appears across the account flows. It protects the pages from
signed-out users and keeps account ownership tied to the active session.

The main account page loads profile data and linked auth records:

```ts
const profile = await ctx.resolve<ProfileExtended>(
  'profile-detail',
  { id }
);
const auth = await ctx.resolve<AuthExtended[]>('auth-search', {
  eq: { profileId: id }
});
```

This example explains why account pages can show both personal information and
sign-in identifiers. The profile provides identity fields, while auth rows
provide username, email, phone, 2FA, and other sign-in method state.

## 632.4. User Feedback

The account views share a layout helper that builds a small account menu from
the auth base. That keeps account navigation tied to the same route prefix as
the page handlers.

```tsx
const base = props.data.auth?.base || '/auth';
const menu = [
  {
    name: _('Personal Information'),
    icon: 'user',
    path: `${base}/account`,
    match: `${base}/account`
  },
  {
    name: _('Security Settings'),
    icon: 'lock',
    path: `${base}/account/security`,
    match: `${base}/account/security`
  }
];
```

This example shows how account navigation follows config. If the auth base
changes, account view links can follow the new base instead of hardcoding
`/auth`.

Account forms include CSRF fields through a shared helper:

```tsx
export function AccountCsrfFields() {
  const { config } = useServer<AuthConfigProps>();
  const tokenKey = config.path('csrf.name', 'csrf');
  const token = config.path('csrf.token', '');
  return <input type="hidden" name={tokenKey} value={token} />;
}
```

This example keeps form protection consistent across account actions. The view
reads the configured CSRF field name and token, then posts them back with the
form.

## 632.5. Security Checks

Account pages are current-user pages, so every write should prove both session
ownership and action intent. Some pages need only an active session, while
security-sensitive pages also require a current password or confirmation.

### 632.5.1. Update Personal Information

The account update page loads the current account profile, then updates profile
fields and auth identifiers on POST. It uses the session profile ID as the
target.

```ts
await ctx.resolve('profile-update', {
  id: data.id,
  name: input.name,
  image: input.image
}, res);
```

This example updates the signed-in user's profile. The browser does not choose
the profile ID because the handler uses `data.id` from the session.

### 632.5.2. Change Password

The password page requires the current password before it updates auth records.
It validates the new password against `auth.password` config and then writes
the new secret to each linked auth record.

```ts
if (!auths.results.find(auth => auth.secret === hash(current))) {
  res.setError('Invalid Parameters', {
    current: 'Current password is incorrect'
  });
  return;
}
```

This example shows the extra proof required for password change. An active
session is not enough; the user must also know the current password.

### 632.5.3. Export Or Remove Account Data

The export page shows a warning page first, then downloads CSV only when the
request includes `download`. The remove page requires confirmation and current
password before removing auth records and the profile.

```ts
if (!req.data('download')) {
  setViewProps(req, res, ctx);
  return;
}
```

This example explains the export flow. Opening the route directly does not
immediately download data; the user sees the warning page before choosing the
download action.

## 632.6. Verify

Verify account pages by tracing route, session, profile, view, and write
behavior. A working account page should load under the auth base, reject guests,
load the current profile from the session ID, render the built-in view, and
protect POST actions with the appropriate checks.

Use these files when debugging account pages:

```text
packages/stackpress-session/src/session/plugin.ts
packages/stackpress-session/src/session/pages/account.ts
packages/stackpress-session/src/session/pages/update.ts
packages/stackpress-session/src/session/pages/password.ts
packages/stackpress-session/src/session/pages/export.ts
packages/stackpress-session/src/session/pages/remove.ts
packages/stackpress-session/src/session/pages/2fa/detail.ts
packages/stackpress-session/src/session/views/helpers.tsx
packages/stackpress-session/src/session/views
```

These files cover route registration, current-user loading, profile/auth
loading, account updates, password changes, export, removal, 2FA, shared
layout, and built-in views. Use them to decide whether a problem belongs in
route registration, page handler logic, or the built-in view layer.

**Next step:** Read `633 Flash Messages` to see how account actions carry
success or failure feedback across redirects.

**Learning checkpoint:** You should be able to explain why the account route is
`/auth/account` in a scaffolded app. You should also be able to describe why
account pages use the session profile ID instead of accepting a profile ID from
the URL.
