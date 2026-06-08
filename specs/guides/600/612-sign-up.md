# 612 Sign Up

Sign-up is where Stackpress creates the identity that sign-in will later use.
It is not just a form that saves a password. The flow creates a profile, adds
one or more auth records for that profile, applies default roles, protects the
POST with CSRF, and redirects the user back into the auth flow.

This lesson is important because account creation is easy to oversimplify. A
junior developer might think "new user" means one database row, but Stackpress
separates the user-facing profile from the auth records used for username,
email, or phone sign-in.

**Previously:** `Sign In` followed an existing auth record into a session.
This lesson follows the earlier step: creating the profile and auth records
that make future sign-in possible.

## 612.1. Flow Goal

The goal of sign-up is to create a profile and attach at least one way to sign
in. The profile stores identity and roles. The auth rows store login
identifiers such as email, phone, or username, plus the secret used for
password-based sign-in.

Think of it like opening a new building account. The profile is the tenant
record, while each auth row is a keycard that can unlock the account later. A
single tenant can have more than one keycard, but every keycard points back to
the same profile.

## 612.2. Config Surface

A scaffolded app config gives sign-up its route base, default roles, visible
menu item, and password rules. The built-in auth plugin registers `/auth/signup`
under the configured base.

```ts
export const auth = {
  base: '/auth',
  roles: [ 'USER' ],
  menu: [
    {
      name: 'Create a New Account',
      icon: 'user-plus',
      path: '/auth/signup'
    }
  ],
  password: {
    min: 8,
    max: 32,
    upper: true,
    lower: true,
    number: true,
    special: true
  }
};
```

This example explains what the sign-up page can read from config. `roles`
becomes the default role list for new accounts, `menu` makes the sign-up link
visible in the auth UI, and `password` controls the validation rules used by
`AuthActions`.

The auth plugin registers the route and view:

```ts
ctx.import.get(`${base}/signup`, () => import('./pages/signup.js'));
ctx.import.post(`${base}/signup`, () => import('./pages/signup.js'));
ctx.view.get(`${base}/signup`, 'stackpress-session/esm/auth/views/signup', -100);
ctx.view.post(`${base}/signup`, 'stackpress-session/esm/auth/views/signup', -100);
```

This example shows that the same page module handles both GET and POST. GET
renders the form, while POST validates CSRF and emits the account-creation
event.

## 612.3. Sign Up Request Flow

The sign-up page prepares the built-in view in the same way the sign-in pages
do. It sets shared view props, sends auth config into response data, and
generates a CSRF token before the form is submitted.

```ts
res.data.set('auth', {
  base: auth.base || '/auth',
  roles: auth.roles || [],
  menu: auth.menu || [],
  password: auth.password || {}
});
csrf.generate(res, ctx);
```

This example gives the view enough data to render the form and password rules.
The CSRF token is also placed into config data so the rendered form can submit
it back with the POST.

On POST, the page validates CSRF and emits `auth-signup`:

```ts
if (req.method === 'POST') {
  if (!csrf.valid(req, res)) return;
  await ctx.emit('auth-signup', req, res);
  if (res.code !== 200) return;
  csrf.clear(req, res, ctx);
  const base = ctx.config.path('auth.base', '/auth');
  res.redirect(req.data.path('redirect_uri', `${base}/signin`));
}
```

This example shows the control flow after form submission. A bad CSRF token
stops the request early, a signup error leaves the response for the view, and a
successful signup redirects to sign-in by default.

The event adds default roles and normalizes phone input before calling the
action layer:

```ts
const roles = ctx.config.path<string[]>('auth.roles', []);
const input: Record<string, any> & { roles: string[] } = {
  roles,
  ...(req.data() as Record<string, any>)
};
input.phone = normalizePhone(input.phone);
const results = await actions.signup(input);
```

This example explains why default roles belong in config instead of the form.
The browser submits account fields, while the server decides which roles should
be assigned to new profiles.

## 612.4. User Feedback

User feedback comes from validation errors, duplicate errors, and redirects.
The view receives the response data and errors, so a failed submission can
render field-level messages instead of creating a broken account.

The sign-up form includes the fields that can create profile and auth records:

```tsx
<Input name="name" className="field" required />
<Input name="email" className="field" />
<PhoneInput name="phone" defaultCountry="PH" className="field" />
<Input name="username" className="field" />
<PasswordInput name="secret" required />
```

This example shows the split between profile and auth information. `name`
belongs to the profile, while `email`, `phone`, `username`, and `secret`
provide possible auth records for that profile.

Password feedback comes from the configured rules:

```tsx
{!!password && (
  <PasswordStrength secret={secret} rules={password} />
)}
```

This example is view-level feedback, not the final security check. The UI can
help the user see missing password requirements, but `AuthActions.assert()`
still validates the submitted password on the server.

## 612.5. Security Checks

The sign-up flow protects the account before it exists. It checks CSRF,
requires a name, requires at least one identifier, validates password rules,
normalizes phone numbers, and rejects duplicate identifiers.

### 612.5.1. Required Identity

The action layer requires a profile name and at least one login identifier. A
form that submits only a password is not enough to create a usable account.

```ts
if (!input.name) {
  errors.name = 'Name is required';
}
if (!input.username && !input.email && !input.phone) {
  errors.username = 'Username, email, or phone is required';
}
```

This example shows server-side validation before any profile or auth rows are
created. The user needs a display identity and at least one way to sign in
later.

### 612.5.2. Password Policy

Password rules come from `auth.password`. The action layer checks the same
rules the view uses for feedback.

```ts
if (min && input.secret.length < min) {
  errors.secret = `Password must be at least ${min} characters`;
} else if (upper && !/[A-Z]/.test(input.secret)) {
  errors.secret = 'Password must contain at least one uppercase letter';
}
```

This example shows why password policy belongs on the server too. A browser UI
can be bypassed, but the action layer still rejects a password that does not
match the configured rules.

### 612.5.3. Duplicate Identifiers

Each auth identifier becomes a token. If a token already exists, the action
maps the duplicate token error back to the field the user submitted.

```ts
results.auth.email = await this.create({
  profileId: results.id,
  type: 'email',
  token: String(input.email),
  secret: String(input.secret)
}).catch(e => {
  if ((e as Exception).errors && e.errors.token) {
    e.withErrors({
      email: e.errors.token,
      token: e.errors.token
    });
  }
  throw e;
});
```

This example explains duplicate email handling. The lower-level auth store
knows `token` is duplicated, and the signup action rewrites the error so the
form can show the problem next to the email field.

### 612.5.4. Verification Delivery Hooks

The auth store includes a `verified` boolean that defaults to `false`. That
field is the account record's memory of whether an email or phone auth method
has been verified.

```ts
schema.addField('verified', {
  type: 'BOOLEAN',
  default: false,
  nullable: false,
  comment: 'Indicates if the type has been verified (email, phone, etc.).'
});
```

This example shows why sign-up and verification are not the same step. Sign-up
can create the auth row, but another flow still has to prove the email address
or phone number belongs to the user before the method should be treated as
verified.

After signup succeeds, the event attempts two extension calls:

```ts
if (input.email) {
  ctx.resolve('email-email-send', { email: input.email, ...results });
}
if (input.phone) {
  ctx.resolve('auth-phone-verify', { phone: input.phone, ...results });
}
```

These calls are extension points after the profile and auth rows exist. In the
checked workspace, the confirmed email plugin registers `email-send`, not
`email-email-send`, and no `auth-phone-verify` handler appears in the local
sources searched for this pass.

That means this lesson should describe those calls as handoff points, not as a
complete verification delivery system. A project that needs welcome emails,
email verification, or phone verification must provide handlers for those
event names or wire the flow to a confirmed delivery event.

## 612.6. Verify

Verify sign-up by tracing from the route to the action result. The route should
exist under `auth.base`, the form should include a CSRF token, the POST should
emit `auth-signup`, the action should create a profile, and each submitted
identifier should create an auth row.

Then check verification separately. The created auth rows start with
`verified: false`, and the post-signup extension calls only prove that the
event attempted a handoff to delivery or verification code.

Use these files when debugging the flow:

```text
config/common.ts
packages/stackpress-session/src/auth/plugin.ts
packages/stackpress-session/src/auth/pages/signup.ts
packages/stackpress-session/src/auth/events/signup.ts
packages/stackpress-session/src/auth/AuthActions.ts
packages/stackpress-session/src/auth/AuthStore.ts
packages/stackpress-session/src/auth/views/signup.tsx
packages/stackpress-session/src/profile/types.ts
packages/stackpress-email/src/events.ts
```

These files cover route registration, form rendering, server validation,
profile creation, auth record creation, and duplicate handling. The current
event also attempts extension calls such as `email-email-send` and
`auth-phone-verify`, but this lesson does not treat those as complete delivery
flows without a confirmed handler source.

**Next step:** Read `613 OTP / 2FA` for challenge-based sign-in. That page
continues from sign-up and sign-in by showing what happens when a user must
prove a second factor before the session is created.

**Learning checkpoint:** You should be able to explain why sign-up creates a
profile plus auth rows instead of only one user row. You should also be able to
describe where default roles, password rules, duplicate errors, and the
success redirect come from.
