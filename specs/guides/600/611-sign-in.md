# 611 Sign In

Sign-in is the point where an anonymous browser request becomes a session that
can reach private app behavior. The page looks like a form, but the flow is
really a chain of checks: choose an auth type, protect the POST with CSRF,
verify the credential, create a session cookie, and redirect the user.

That chain is worth learning slowly because sign-in bugs are often confusing.
A wrong menu path looks like a routing problem, a missing CSRF token looks like
a form problem, and a bad password looks like a database problem. The source
flow gives each failure a place to inspect.

**Previously:** `Authentication` introduced the built-in auth plugin and the
routes it registers. This lesson follows the sign-in path in detail, using the
confirmed username flow as the anchor before naming the email and phone
variations.

## 611.1. Flow Goal

The goal of sign-in is to prove the submitted credential belongs to a profile
and then create a session for that profile. In Stackpress Session, auth records
store identifiers such as username, email, or phone, while the session plugin
creates the browser session after the auth check succeeds.

The simple mental model is a front desk. The form asks for an identifier and a
secret, the auth event checks the record, and the session cookie becomes the
visitor badge that future protected routes can read.

## 611.2. Config Surface

A scaffolded app enables auth routes with an `auth` config object. The `base`
sets the route prefix, and the `menu` lists the sign-in options shown by the
built-in sign-in view.

```ts
export const auth = {
  base: '/auth',
  roles: [ 'USER' ],
  menu: [
    {
      name: 'With Username',
      icon: 'user',
      path: '/auth/signin/username'
    },
    {
      name: 'With Email',
      icon: 'envelope',
      path: '/auth/signin/email'
    },
    {
      name: 'With Phone',
      icon: 'phone',
      path: '/auth/signin/phone'
    }
  ]
};
```

This example does not create the auth routes by itself. It gives the auth
plugin the route base and visible menu options, while the plugin source
registers the actual GET and POST handlers under that base.

The plugin registers the username route like this:

```ts
ctx.import.get(`${base}/signin/username`, () => (
  import('./pages/signin/username.js')
));
ctx.import.post(`${base}/signin/username`, () => (
  import('./pages/signin/username.js')
));
ctx.view.get(
  `${base}/signin/username`,
  'stackpress-session/esm/auth/views/signin/username',
  -100
);
```

This example shows the three surfaces involved in one sign-in option. The GET
route displays the page, the POST route handles the submitted form, and the
view registration points Stackpress at the built-in username sign-in view.

## 611.3. Sign In Request Flow

Start with the username flow because it is the smallest password-based path.
The page handler prepares view data, generates a CSRF token, and waits for a
POST before attempting sign-in.

```ts
csrf.generate(res, ctx);

if (req.method === 'POST') {
  if (!csrf.valid(req, res)) return;
  req.data.set('password', true);
  req.data.set('type', 'username');
  await ctx.emit('auth-signin', req, res);
}
```

This example shows the handoff from page code to auth event code. The page
sets `password` to require a password check, sets the auth `type` to
`username`, and emits `auth-signin` so the shared auth event can verify the
credential.

The `auth-signin` event loads the submitted type and asks `AuthActions` to
verify it:

```ts
const type = req.data.path('type', 'username') as SigninType;
const password = req.data.path('password', true);
const actions = AuthActions.make(ctx);
const results = await actions.signin(type, req.data(), Boolean(password));
```

This example keeps the event generic. The same event can handle username,
email, phone, OTP, or magic-link flows because the page handler decides the
`type` and whether a password should be required.

The action checks the database record and password:

```ts
const results = await this.find({
  columns: [ '*', 'profile.*' ],
  eq: { type, token: String(input[type]) }
});
```

This example searches for an auth row whose `type` matches the sign-in method
and whose `token` matches the submitted identifier. For username sign-in, that
means `type: 'username'` and `token` equal to the posted username.

When the auth check succeeds and no 2FA redirect is required, the event creates
the session:

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

This example is the point where sign-in becomes a browser session. The session
payload stores the profile identity and roles, then the response writes the
session cookie under the configured session key.

## 611.4. User Feedback

The built-in sign-in pages use response errors and redirects as feedback. If
the auth event fails, it sets the response error and the page can render the
failed form state. If the auth event succeeds, the page clears the CSRF token
and redirects.

```ts
if (res.code !== 200) return;
csrf.clear(req, res, ctx);
res.redirect(req.data.path('redirect_uri', '/'));
```

This example shows the successful end of username sign-in. The current source
uses `redirect_uri` from request data and falls back to `/`, so do not assume
`auth.redirect` controls this specific sign-in redirect unless the source is
changed to read it.

Invalid credentials produce errors before the session is created:

```ts
throw Exception
  .for('Invalid Parameters')
  .withErrors({ secret: 'Invalid Password' })
  .withCode(401);
```

This example shows why a failed password should not create a session. The
action throws a structured error, the event converts it into the response, and
the page stops before clearing CSRF or redirecting.

## 611.5. Security Checks

The sign-in flow protects several boundaries at once. CSRF protects the form
submission, password checks protect the auth record, 2FA can interrupt the
flow before a session is created, and session creation happens only after the
auth event succeeds.

### 611.5.1. CSRF Comes Before Sign-In

The page validates CSRF before it emits `auth-signin`. That keeps a forged POST
from reaching the credential-checking event.

```ts
if (!csrf.valid(req, res)) return;
```

This example is small, but the order matters. If the token is invalid, the page
returns immediately, so the submitted username and password are not used for a
sign-in attempt.

### 611.5.2. Choose The Right Identifier

Each password-based sign-in page sets its own auth type. Username uses
`username`, email uses `email`, and phone uses `phone`.

```ts
req.data.set('type', 'phone');
req.data.set('phone', normalizePhone(req.data.path<string>('phone', '')));
```

This example comes from the phone sign-in page. It normalizes the phone value
before emitting `auth-signin`, which prevents different phone formats from
being treated as unrelated tokens.

### 611.5.3. Treat Email Variations Separately

Email sign-in supports multiple methods: password, OTP, and magic link. The
page reads the posted `auth` method before choosing which helper to run.

```ts
const method = req.data.path('auth', 'pass');

if (method === 'pass') {
  await PasswordSignin(req, res, ctx);
} else if (method === 'otp') {
  await OTPSignin(req, res, ctx);
} else if (method === 'magic') {
  await MagicLinkSignin(req, res, ctx);
}
```

This example is why email sign-in should not be described as only
email-and-password. Password sign-in can complete immediately, while OTP and
magic-link flows send a challenge first and continue on later routes.

## 611.6. Verify

Verify sign-in by checking the config, route, event, and session effect in that
order. The menu path should match a route registered by the auth plugin, the
page should generate a CSRF token, the POST should emit `auth-signin`, and a
successful response should redirect with a session cookie.

Use these source checks when debugging:

```text
config/common.ts
packages/stackpress-session/src/auth/plugin.ts
packages/stackpress-session/src/auth/pages/signin/username.ts
packages/stackpress-session/src/auth/events/signin.ts
packages/stackpress-session/src/auth/AuthActions.ts
```

These files cover the sign-in chain from app configuration to database
verification. If one part looks wrong, trace the flow in order instead of
changing the view first.

**Next step:** Read `612 Sign Up` for account creation. Sign-up uses the same
auth system, but it creates profile and auth records before the user can sign
in.

**Learning checkpoint:** You should be able to explain why the username page
sets `type: 'username'` before emitting `auth-signin`. You should also be able
to describe the difference between a failed password, an invalid CSRF token,
and a successful sign-in redirect.
