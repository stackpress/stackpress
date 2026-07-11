# Sessions And Language

Stackpress sessions provide signed state and authorization, while the language
service resolves locale-specific source phrases. Both are server capabilities;
the browser receives only the view snapshot needed for interface behavior.

## Session Lifecycle

`Session.configure` establishes access rules, signing seed, cookie key, and
expiry. `Session.create` starts state, `save` produces a signed token, and
`load` verifies a token into a session. Failed verification degrades to a Guest
session rather than granting prior claims.

```ts
const token = await Session.create({ role: 'MEMBER', userId: 'user-1' })
const restored = Session.load(token)

if (await restored.can('GET /account')) {
  // server-authorized behavior
}
```

Authorization supports event and route patterns through `can`, `permits`, and
matching helpers. An empty access map allows all routes, so production policy
must be explicit when restriction is intended. Runtime authorization reads the
token from normalized request session state, not directly from an Authorization
header. An adapter or earlier plugin must perform that transport mapping.

The default signed-token strategy uses HS256 and the configured seed. The seed
must be secret and stable for the intended token lifetime. Browser-side session
helpers are presentation aids only; enforcement stays on the server.

## Language Lifecycle

`Language.configure` establishes supported locales, the storage key, and source
configuration. `Language.load` resolves the request's active locale and returns
a service with `label`, `locale`, and `translations`. `translate` looks up source
phrases and interpolates `%s` placeholders; `update` changes locale state and
`save` persists it through the configured request/response mechanism.

```ts
const language = Language.load(req)
const title = language.translate('Welcome, %s', 'Ada')
language.save(res)
```

Only configured URL or data locales activate. Source phrases act as translation
keys. The server language service owns loading and persistence; r22n owns the
browser rendering experience after the translation snapshot reaches the page.
