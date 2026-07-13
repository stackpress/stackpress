# Session And Language Contracts

Use this reference for server session tokens, permission matching, built-in auth
actions, locale selection, translation, and the server/browser boundary.

## Entrypoints And Ownership

| Import | Exports |
| --- | --- |
| `stackpress/session` | `Session`, `actions`, matching helpers, session/auth/profile types |
| `stackpress/language` | `Language` and language types |
| `stackpress/view/client` | snapshot `ServerSession`, permission helpers, r22n provider/hooks/components |

`stackpress-session` owns signed identity tokens and route/event permission
checks. `stackpress-language` owns server locale selection/persistence. r22n owns
browser phrase rendering. Client session checks are UX helpers, never the
authorization authority.

## Server `Session`

Static configuration:

```ts
Session.configure(key: string, seed: string, access: SessionPermissionList)
Session.expires = value
Session.create(data: SessionData): Promise<string>
Session.token(req: Request): string|null
Session.load(tokenOrRequest: string|Request): Session
Session.authorize(req, res, permits?: SessionPermission[]): Promise<boolean>
```

Defaults are key `session`, seed `abc123`, access `{}`, and no configured JWT
expiry. `configure()` mutates class-global state and returns the constructor.
`create()` signs `SessionData` with HS256 and issued-at; a nonzero expiry is
passed directly to jose `setExpirationTime`.

Despite its source comment mentioning an authorization header, current
`token(req)` reads only `req.session[Session.key]`. `load(Request)` therefore
uses normalized cookie/session state; `load(string)` uses the explicit JWT.

Instance contract:

```ts
new Session(token: string)
readonly token: string
data(): Promise<SessionData|null>
authorization(): Promise<SessionTokenData>
guest(): Promise<boolean>
can(...permits): Promise<boolean>
permits(): Promise<SessionPermission[]>
save(res: Response): this
```

JWT verification failures are swallowed and cached as `null`. Guest
authorization currently becomes `{ id: 0, roles: ['GUEST'], token, permits }`.
`permits()` unions configured permissions for token roles, defaulting to GUEST,
and removes duplicate entries by identity/value. `save()` writes the token to
the response session revision under the configured key.

## Permission Semantics

A permission is an event string or `{ method, route }`. `can()` returns true
with no requested permits and otherwise requires **every** requested permit to
match at least one granted permission.

- exact event/route matches are accepted;
- event `*` matches one hyphen-delimited segment and `**` spans segments;
- route `:param` behaves as one path segment;
- route `*` matches one segment and `**` spans segments;
- route method `ALL` matches any method;
- slash-delimited regex strings with JS flags are accepted directly.

`Session.authorize()` returns true immediately when the configured access map is
empty: empty access means allow-all, not default-deny. Otherwise it prepends the
current `{ method, pathname }` to the supplied permit array, checks all permits,
sets a 401 Unauthorized response on failure, and places authorization results on
the response on success. Passing a reusable permits array allows this method to
mutate it through `unshift`.

## Session Plugin Lifecycle

No `session` config disables the session plugin. During `config` it registers
the configured `Session` constructor. During `listen` it registers `me` and
`authorize`; when `session.access` exists it also installs a global `request`
authorization listener. During `route`, an `auth` config enables account,
profile update, security export/removal, password, and 2FA routes/views beneath
`auth.base` (default `/auth`).

The request guard skips when a response body or prior non-200 status exists. It
resolves `authorize`, copies failure status to the active response, then emits
the shared `error` event.

## `actions` Auth Namespace

`actions` is the `AuthActions` class export. `AuthActions.make(ctx)` gets the
database plugin, database seed, and password policy. Instances expose `engine`,
`store`, and related `profile` actions, with:

```text
assert, batch, count, create, delete, find, findAll, install, purge,
remove, restore, signin, signup, uninstall, update, upgrade, upsert
```

`assert` validates signup identity and configured password constraints.
`signin(type, input, password=true)` supports username/email/phone and allows
passwordless internal flows when explicitly false. `signup` coordinates profile
and auth creation. SQL CRUD/destructive/transaction semantics remain those in
the SQL contracts.

Session/auth code also contains TOTP secret generation, six-digit SHA1 code
generation with 30-second default steps, and windowed verification. These helpers
are internal package behavior, not exports from `stackpress/session`.

## Server `Language`

Static contract:

```ts
Language.configure(key: string, languages: LanguageMap): typeof Language
Language.locales: string[]
Language.key: string
Language.language(name): { label, translations }|null
Language.load(req: Request, defaults = 'en_US'): Language
```

Defaults are key `locale` and no languages. `language(name)` returns a shallow
copy of translations. `load()` reads the locale from normalized request session
state, then uses the supplied default.

Instance contract:

```ts
locale: string              // get/set; initial en_US
label: string               // configured label or locale
translations: Record<string,string>
save(res: Response): this
update(locale, res): this
translate(phrase, ...variables): string
```

`translate()` uses the source phrase as key/fallback and replaces one `%s` per
variable in order. Extra variables are ignored after placeholders are exhausted.
`save()` records locale in response session revisions.

## Language Plugin Request Flow

No `language` config disables the plugin. During `config` it registers the
configured class. During `listen`, each request checks:

1. request data under `language.key`; if it is a configured locale, save it;
2. the first URL path segment; if valid, save it, remove that segment, create a
   normalized request preserving native resource/body/headers/data/query/post/
   session, and resolve the same method against the rewritten path.

Only configured locales activate changes. This supports `?locale`-style data
and `/en_US/path` routing. The locale is persisted as a response session/cookie
revision; it is not a server-global user preference store.

## Browser r22n Contract

`R22nProvider` stores `{ language, translations }` and placeholder `%s` by
default. `useLanguage()` returns:

- `language` and `changeLanguage(language, translations?)`;
- `template(phrase)(...ReactNode)` preserving non-string nodes;
- tagged-template `t`;
- string-oriented `_(phrase, ...stringOrNumber)`.

`Translate` converts mixed children into phrase placeholders plus variables.
Changing source wording changes translation keys. Browser `changeLanguage`
changes provider state only; Stackpress `LayoutUser` currently calls it without
translation maps, so server persistence/request reload is a separate concern.

## Security Boundaries

- Replace default seeds and protect them as secrets.
- Configure cookie HTTPS, HttpOnly, SameSite, domain, and expiry policy.
- Empty access is allow-all; configure and test explicit policy when protection
  is intended.
- Client `can()` and hidden menus do not authorize server operations.
- Permission patterns are powerful; test wildcard/regex rules against denials.
- JWT verification failure intentionally appears as Guest, so guest permissions
  must be minimal.
- Language/session snapshots sent to views are browser-visible.

## Source Anchors And Authority

Anchors: Stackpress session `Session`, helpers, plugin, authorize/me events and
guard, auth actions/types/routes; language `Language`, plugin, types; view client
session/provider; r22n provider/hook/Translate. Source behavior is authority;
existing docs are benchmarks and source comments are not accepted over code.
