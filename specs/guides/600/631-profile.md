# 631 Profile

Profile is the user-facing identity record in Stackpress Session. It is where
the app stores the name, image, type, roles, tags, references, and active state
that describe the person or entity behind a session. Auth records answer "how
does this profile sign in?" while the profile answers "who is this?"

That distinction matters because many apps eventually need more than a login
row. A person can have username, email, phone, OTP, and 2FA auth records, but
the account page still needs one profile to show and update.

**Previously:** `Sessions And Account` introduced the session plugin and
account routes. This lesson focuses on the profile data those routes load and
why roles live there before becoming part of a session token.

## 631.1. Flow Goal

The profile flow connects stored identity to session behavior. Sign-up creates
a profile, sign-in copies profile roles into the session token, and account
pages load the current profile to render editable user-facing details.

A useful mental model is a contact card with keys attached. The profile is the
contact card, and auth records are keys that prove someone can use that card.
The session is the temporary badge issued after one key works.

## 631.2. Config Surface

A scaffolded app seeds an admin profile through populate config. This seed
uses the same profile model that account and session flows use later.

```ts
{
  event: 'profile-create',
  data: {
    id: 'developer',
    name: 'Developer',
    type: 'person',
    roles: [ 'ADMIN' ]
  }
}
```

This example creates a profile with an admin role. The important part is that
roles are profile data first; they only become session permissions after a
session token is created from the profile.

The profile model defines the same idea in `schema.idea`:

```idea
roles         String[]
              @label("Roles")
              @default([ "GUEST" ])
              @field.stringlist({ add "Add Role" })
              @description("Roles held by the profile. This is used with sessions to determine access levels of the app.")
```

This example shows why roles belong in the profile lesson. The model describes
roles as stored profile data, and the session layer later interprets those
roles against `session.access`.

## 631.3. Profile Request Flow

The sign-up action creates the profile before it creates auth records. That
order matters because every auth record needs a `profileId`.

```ts
const results = await this.profile.create({
  name: input.name as string,
  type: input.type || 'person',
  roles: input.roles || []
}) as ProfileAuth;
```

This example creates the profile from submitted name/type data and configured
roles. After this succeeds, the sign-up action can attach email, phone, or
username auth rows to `results.id`.

The TypeScript profile shape matches the fields from the model:

```ts
export type Profile = {
  id: string;
  image: string | null;
  name: string;
  type: string;
  roles: string[];
  tags: string[];
  references: Record<string, ScalarInput> | null;
  active: boolean;
};
```

This example is the runtime-facing shape other code can rely on. It confirms
that `roles` are an array on the profile, not a separate permission table in
the session package.

## 631.4. User Feedback

Account pages show profile data together with linked auth identifiers. The
loader first resolves `profile-detail`, then searches auth records for the
same profile.

```ts
const profile = await ctx.resolve<ProfileExtended>(
  'profile-detail',
  { id }
);
const auth = await ctx.resolve<AuthExtended[]>('auth-search', {
  eq: { profileId: id }
});
```

This example shows how the account page builds a complete account view. The
profile gives identity fields, and auth rows provide editable username, email,
phone, and related sign-in identifiers.

Before sending the account data to the view, the loader removes sensitive auth
details:

```ts
results.auth = auth.results.reduce((map, item) => {
  map[item.type] = {
    id: item.id,
    type: item.type,
    token: item.token,
    verified: item.verified
  };
  return map;
}, {} as AccountProfile['auth']);
```

This example is important for junior developers because it shows what not to
send to the browser. The account page exposes the auth token and verification
state, but it does not expose the stored secret.

## 631.5. Security Checks

Profile behavior is security-sensitive because roles and auth identifiers
affect access. Treat profile updates as current-user actions, not anonymous
form updates.

### 631.5.1. Require The Active Session

The account profile page loads the current session before it loads profile
data. Guests are rejected before profile data is returned.

```ts
const session = ctx.plugin<SessionPlugin>('session');
const me = session.load(req);
const data = await me.data();

if (!data || await me.guest()) {
  res.fromStatusResponse(
    Exception.for('Unauthorized').withCode(401).toResponse()
  );
  return;
}
```

This example prevents a signed-out request from reading account profile data.
The profile ID comes from the session token, not from a user-controlled URL
parameter.

### 631.5.2. Keep Roles And Access Rules Together

Adding a role to a profile is only half the job. The role also needs matching
permissions in `session.access`, or it will not grant useful access.

```ts
roles: [ 'ADMIN' ]
```

This example gives the profile an admin role. It matters only because the
session config also has an `ADMIN` allowlist; without that config, the role is
just stored data.

### 631.5.3. Separate Profile Fields From Auth Fields

Account update code updates profile fields and auth identifiers through
different events. That separation keeps display identity changes from being
confused with sign-in credential changes.

```ts
await ctx.resolve('profile-update', {
  id: data.id,
  name: input.name,
  image: input.image
}, res);
```

This example updates the profile's visible account data. Username, email, and
phone are handled separately through auth events because they are sign-in
identifiers.

## 631.6. Verify

Verify profile behavior by tracing one profile from model to session. The
profile model defines `roles`, sign-up creates a profile with configured roles,
sign-in copies those roles into the session token, and account pages load the
current profile by session ID.

Use these files when debugging profile behavior:

```text
packages/stackpress-session/schema.idea
packages/stackpress-session/src/profile/types.ts
packages/stackpress-session/src/profile/ProfileActions.ts
packages/stackpress-session/src/auth/AuthActions.ts
packages/stackpress-session/src/auth/events/signup.ts
packages/stackpress-session/src/session/pages/account.ts
packages/stackpress-session/src/session/pages/update.ts
config/common.ts
```

These files cover profile modeling, generated profile types/actions, signup
creation, configured roles, account loading, and account updates. Read them as
one chain from stored identity to current-user account behavior.

**Next step:** Read `632 Account Pages` to see the built-in routes that let a
signed-in profile inspect and update its own account data.

**Learning checkpoint:** You should be able to explain why Stackpress uses
`Profile` instead of treating every identity as only a login row. You should
also be able to describe how profile roles become session access behavior.
