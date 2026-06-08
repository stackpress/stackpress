# 613 OTP / 2FA

OTP and 2FA both ask the user for a short code, but they solve different
problems in the Stackpress auth flow. Email OTP proves the user can receive a
one-time challenge for an email auth record. App-based 2FA proves the user has
an authenticator secret attached to their profile.

Keeping those ideas separate matters because the routes connect. An email OTP
can finish by handing the browser to the shared two-factor checkpoint, and the
two-factor checkpoint can finish by creating the same session that password
sign-in creates.

**Previously:** `Sign Up` created profile and auth records, and `Sign In`
showed how an auth record becomes a session. This lesson follows the challenge
routes that can sit between those two moments.

## 613.1. Flow Goal

The goal of OTP is to prove possession of a temporary code sent through a
sign-in method such as email. The goal of 2FA is to prove possession of a
second factor, usually an authenticator app secret stored as a `2fa` auth
record for the profile.

The mental model is a second checkpoint. The first checkpoint identifies the
account, and the second checkpoint asks for proof that is harder to steal than
the original password or email link alone.

## 613.2. Config Surface

A scaffolded app sets the 2FA issuer in auth config. The setup page also falls
back to `brand.name` and finally `Stackpress` if an issuer is not configured.

```ts
export const auth = {
  base: '/auth',
  '2fa': {
    issuer: 'Stackpress'
  }
};
```

This example controls the issuer name used when building the authenticator-app
URI. The account setup route uses it when generating the QR code and secret
that the user scans.

The account route is registered under the auth base:

```ts
ctx.import.get(
  `${base}/account/security/2fa`,
  () => import('./pages/2fa/detail.js')
);
ctx.import.post(
  `${base}/account/security/2fa`,
  () => import('./pages/2fa/detail.js')
);
```

This example means a scaffolded app route is `/auth/account/security/2fa`
because the configured base is `/auth`. A URL like `/account/security/2fa`
would not match this built-in route unless the app adds a separate custom
route.

## 613.3. OTP Request Flow

Email OTP begins on the email sign-in page. The page finds the email auth
record, rotates the `consumed` timestamp, creates a six-digit code, hashes the
timestamp plus code into a challenge, sends email, and redirects to the OTP
route.

```ts
const code = Math.floor(Math.random() * 1000000)
  .toString()
  .padStart(6, '0');
const challenge = hash(latest.consumed.toString() + code);
const link = `${base}/signin/otp/${encodeURIComponent(latest.id)}/${
  encodeURIComponent(challenge)
}?redirect_uri=${encodeURIComponent(redirect)}`;
```

This example shows how the OTP route is bound to the latest auth state. The
challenge is not only the code; it is the code plus the persisted `consumed`
timestamp, which lets newer OTP emails invalidate older challenges.

The OTP route validates the submitted code:

```ts
const code = String(req.data.path('code', '')).trim();
const padded = code.padStart(6, '0');
const answer = hash(results.consumed.toString() + padded);

if (answer !== challenge) {
  res.setError('Invalid OTP Code', {
    code: 'The OTP code is invalid or has expired'
  });
  return;
}
```

This example explains why the OTP page can reject an old or wrong code without
storing the code directly. The route recomputes the expected hash from the
auth record timestamp and the submitted six-digit value.

After OTP passes, the route redirects into the shared 2FA checkpoint:

```ts
const twoFactorChallenge = hash(results.consumed.toString());
res.redirect(
  `${auth.base}/signin/2fa/${encodeURIComponent(results.profileId)}/${
    encodeURIComponent(results.id)
  }/${encodeURIComponent(twoFactorChallenge)}?redirect_uri=${
    encodeURIComponent(redirect)
  }`
);
```

This example is the bridge between email OTP and the normal sign-in completion
path. The OTP route proves the email challenge first, then the shared 2FA route
decides whether the profile also has a `2fa` auth record.

## 613.4. User Feedback

The challenge pages use errors, redirects, and flash messages to explain what
happened. Invalid OTP codes stay on the OTP page with a field error. Invalid
2FA handoff challenges can redirect the user back to the sign-in method with a
flash message.

```ts
res.session.set(
  'flash',
  JSON.stringify({
    type: 'error',
    message: 'Two-factor authentication failed.'
  })
);
```

This example comes from the shared 2FA sign-in route. It stores a short-lived
flash message in the response session before redirecting, so the next page can
tell the user why the challenge failed.

The 2FA form asks for the authenticator code:

```tsx
<input
  className="otp-field auth-2fa-otp"
  type="text"
  name="code"
  maxLength={6}
  autoComplete="off"
  required
/>
```

This example shows the browser-side input for the second factor. The view
limits the input to six characters, but the server still verifies the submitted
code before creating a session.

## 613.5. Security Checks

OTP and 2FA are security flows, so the order of checks matters. A route should
validate the challenge link, validate CSRF on POST, verify the code, and only
then create or continue a session.

### 613.5.1. Setup Requires A Signed-In User

The account setup page refuses guests before it generates a secret or QR code.
That keeps anonymous users from creating second-factor records for profiles
they do not own.

```ts
const me = session.load(req);
const data = await me.data();

if (!data || await me.guest()) {
  res.statusCode(401, 'Unauthorized');
  return;
}
```

This example shows the ownership check at the beginning of the setup route.
The page must know the signed-in profile before it can create or update a
`2fa` auth record.

### 613.5.2. Setup Stores A 2FA Auth Record

The account setup page creates or updates an auth record whose type is `2fa`.
That record stores the authenticator secret used later by sign-in.

```ts
await ctx.resolve('auth-create', {
  profileId: data.id,
  type: '2fa',
  token: secret,
  secret
}, res);
```

This example shows that 2FA is modeled as another auth method attached to the
profile. During later sign-in, the shared 2FA route searches the profile's auth
records to see whether this `2fa` record exists.

### 613.5.3. Sign-In Verifies TOTP Before Session Creation

When the user has a `2fa` record, the shared 2FA sign-in route checks the
submitted code against the stored secret. Only a valid code rebuilds the
`auth-signin` payload and creates the session.

```ts
const valid = verifyTOTP(padded, twoFA.token);
if (!valid) {
  res.setError('Invalid code');
  return;
}
req.data.set('password', false);
req.data.set('type', currentAuth.type);
req.data.set(currentAuth.type, currentAuth.token);
req.data.set('2fa', false);
await ctx.emit('auth-signin', req, res);
```

This example explains the final checkpoint. The route skips the password check
only after the previous auth challenge and the authenticator code have passed,
then reuses the normal `auth-signin` event to create the session.

## 613.6. Verify

Verify the OTP and 2FA paths separately. For email OTP, check that email
sign-in can send a challenge link and that `/auth/signin/otp/:auth/:challenge`
rejects wrong codes. For app-based 2FA, check that a signed-in user can open
`/auth/account/security/2fa`, scan or copy the secret, submit a valid code, and
then hit the 2FA checkpoint during the next sign-in.

Use these files when debugging:

```text
config/common.ts
packages/stackpress-session/src/auth/pages/signin/email.ts
packages/stackpress-session/src/auth/pages/signin/otp.ts
packages/stackpress-session/src/auth/pages/signin/2fa.ts
packages/stackpress-session/src/session/plugin.ts
packages/stackpress-session/src/session/pages/2fa/detail.ts
packages/stackpress-session/src/session/pages/2fa/remove.ts
packages/stackpress-session/src/session/helpers.ts
```

These files cover issuer config, OTP link creation, OTP validation, shared 2FA
sign-in, account setup, removal, and TOTP helper behavior. If one part fails,
trace the challenge in order instead of changing the form first.

**Next step:** Read `621 Session Rules` to understand how roles and route
access decide which signed-in users can reach protected pages.

**Learning checkpoint:** You should be able to explain the difference between
email OTP and app-based 2FA. You should also be able to trace why
`/auth/account/security/2fa` is the setup route when `auth.base` is `/auth`.
