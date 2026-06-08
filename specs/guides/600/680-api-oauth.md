# 680 API / OAuth

API and OAuth flows let another client use part of your Stackpress app without
going through a normal page. That makes the route contract more important: the
app has to know who is calling, which scopes they have, which event should run,
and what response should be sent back.

## 680.1. Flow Goal

The built-in API package turns config into routes. Public endpoints can call an
event without authorization, app endpoints authorize an application, and
session endpoints authorize a user session created through the OAuth flow.

This lesson focuses on the source-backed shape that exists today in
`packages/stackpress-api`. It is not a full OAuth reference, but it shows how
the config, route registration, authorization helper, OAuth page, and token
endpoint connect.

## 680.2. Config Surface

A scaffolded app enables API behavior with an `api` config object. The config
defines session expiration, webhooks, scopes, and endpoint definitions.

```ts
export const api = {
  expires: 1000 * 60 * 60 * 24 * 365,
  scopes: {
    user: {
      name: 'User API Service',
      description: 'Profile Endpoints'
    }
  },
  endpoints: [
    {
      method: 'GET' as 'GET',
      route: '/api/profile/search',
      type: 'app' as 'app',
      scopes: [ 'user' ],
      event: 'profile-search',
      data: {}
    }
  ]
};
```

This example maps `GET /api/profile/search` to the `profile-search` event. The
endpoint is type `app`, so it requires application authorization and the
`user` scope before Stackpress emits the event.

## 680.3. Route Registration

The API plugin only registers routes when `api` config exists. During the
`route` lifecycle, it imports the OAuth pages and then registers each endpoint
based on its type.

```ts
ctx.import.all('/auth/oauth/token', () => import('./pages/token.js'));
ctx.import.all('/auth/oauth', () => import('./pages/oauth.js'));
ctx.view.all('/auth/oauth', 'stackpress-api/esm/views/oauth', -100);

for (const endpoint of endpoints) {
  cors(endpoint, ctx);
  if (endpoint.type === 'session') {
    session(endpoint, ctx);
  } else if (endpoint.type === 'app') {
    app(endpoint, ctx);
  } else if (endpoint.type === 'public') {
    open(endpoint, ctx);
  }
}
```

This code is the bridge between config and runtime behavior. The endpoint type
chooses which route wrapper is used, and the wrapper decides whether
authorization is required before the configured event runs.

## 680.4. Endpoint Types

Endpoint type is the first security decision a junior developer should check.
It decides whether a route is open, tied to an application, or tied to a user
session.

Public endpoints set endpoint data and emit the event:

```ts
export function open(endpoint: ApiEndpoint, ctx: Server) {
  ctx.route(endpoint.method, endpoint.route, async function PublicAPI({ req, res, ctx }) {
    req.data.set(endpoint.data || {});
    await ctx.emit(endpoint.event, req, res);
  }, endpoint.priority || 0);
}
```

This example shows the public path. No authorization helper is called, so the
route depends on the configured event and any checks inside that event.

App endpoints require an authorization token, load an application, check the
secret for non-GET requests, and verify scopes:

```ts
const authorization = authorize(req, res);
if (!authorization) {
  return;
}
const { id, secret } = authorization;
const response = await ctx.resolve('application-detail', { id });
const application = response.results as Application;
const permits = endpoint.scopes || [];
if (!application.scopes.some(scope => permits.includes(scope))) {
  return unauthorized(res);
}
```

This example shows why app endpoints need both identity and permission. The
application ID identifies the caller, while scopes decide whether the caller is
allowed to use this configured endpoint.

Session endpoints follow the same pattern but load `session-detail` instead of
`application-detail`. They also set `profileId` into request data before
emitting the configured event, so the downstream event can know which profile
the session belongs to.

## 680.5. OAuth Request Flow

The OAuth route starts by preparing view, brand, and API config for the
authorization page. It then requires `client_id` and `redirect_uri`; without
those values, the request is unauthorized.

```ts
const id = req.data<string>('client_id');
const redirect = req.data<string>('redirect_uri');
const state = req.data<string>('state');

if (!id || !redirect) {
  return unauthorized(res);
}
```

This check protects the authorization page from starting without the two
values it needs. The client ID identifies the application, and the redirect URI
tells Stackpress where to send the user after authorization.

If the current user is not signed in, the OAuth action redirects to the sign-in
page and preserves the original OAuth request path:

```ts
const session = await ctx.resolve<SessionTokenData>('me', req);
if (!session.results?.id) {
  const redirect = encodeURIComponent(
    req.url.pathname + req.url.search
  );
  res.redirect(`/auth/signin?redirect_uri=${redirect}`);
  return;
}
```

This step keeps the flow user-centered. Stackpress cannot grant a user session
until it knows which user is signed in, so it sends the browser to sign in and
then returns to the original OAuth request.

## 680.6. Token Result

After the OAuth form is submitted, Stackpress creates a session record for the
application and profile. It redirects back to the client with the created
session ID as the `code` query parameter.

```ts
const response = await ctx.resolve<Session>('session-create', {
  ...req.data(),
  applicationId: id,
  profileId: (session.results as SessionData).id,
  expires: new Date(Date.now() + expires)
});

params.set('code', response.results.id);
```

This example shows the handoff from authorization page to client callback. The
created session becomes the temporary code that the client later exchanges at
the token endpoint.

The token endpoint validates the application authorization and the session
code, then returns bearer-style token data:

```ts
res.results({
  token_type: 'Bearer',
  access_token: data.id,
  access_secret: data.secret,
  expires_in: data.expires
    ? Math.floor((data.expires.getTime() - Date.now()) / 1000)
    : 0,
  user: {
    id: data.profile.id,
    name: data.profile.name,
    image: data.profile.image,
    created: data.profile.created
  }
});
```

This response gives the client the access token, access secret, expiration
time, and basic user data. The source currently uses the session ID as the
access token and the session secret as the access secret.

## 680.7. Security Checks

Most API mistakes happen before the event code runs. Check the endpoint type,
authorization header, scope list, request method, and configured event before
you debug the event handler itself.

### 680.7.1. Missing Authorization

```ts
const authorization = req.headers.get('authorization') as string;
if (!authorization) {
  unauthorized(res);
  return false;
}
```

The authorization helper rejects requests without an authorization header.
That means an `app` or `session` endpoint can fail before your configured
event receives the request.

### 680.7.2. Missing Secret On Writes

```ts
if (req.method.toUpperCase() !== 'GET'
  && (!secret || !secret?.trim().length)
) {
  unauthorized(res);
  return false;
}
```

This check allows GET requests to identify the caller with the token ID alone,
but non-GET requests require a secret. When a POST, PUT, PATCH, or DELETE call
returns unauthorized, check whether the caller sent the secret part of the
token.

### 680.7.3. Missing Scope

```ts
const permits = endpoint.scopes || [];
if (!application.scopes.some(scope => permits.includes(scope))) {
  return unauthorized(res);
}
```

This check compares the caller's scopes against the endpoint's required
scopes. If the endpoint requires `user`, the application or session must carry
that scope before the event can run.

## 680.8. Verify

Verify the flow from config outward. First confirm the endpoint exists in
`api.endpoints`, then confirm the endpoint type matches the caller you expect,
then confirm the required scopes match the application or session record.

For OAuth, verify the browser can reach `/auth/oauth` with `client_id` and
`redirect_uri`, that unsigned users are redirected to sign in, and that a
submitted authorization redirects back with a `code`. Then inspect
`/auth/oauth/token` behavior to confirm the code exchanges for token data.

**Learning checkpoint:** You should now be able to explain how API config
becomes a route and why OAuth exists in this package. The main idea is that the
endpoint config chooses the route contract, while the OAuth flow creates the
session token a client can use later.

**Next course:** Continue with `Studio`. That section is more planning-focused
today, so carry this same habit forward: check what source exists before
treating a generated or built-in surface as stable.
