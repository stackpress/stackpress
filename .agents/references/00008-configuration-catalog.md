# Stackpress Configuration Catalog

Use this reference for application config areas, keys, defaults, consumers, and
operational effects. Package API details belong in their domain references.

## Configuration Model
Stackpress config is executable TypeScript passed to `server.config.set(config)`
before plugin bootstrap. Imports, environment variables, functions, path helpers,
and object spreads are valid. Normal JavaScript assignment/spread order decides
precedence; later properties win.

```ts
import type { Config } from 'stackpress/types';
export const config: Config = {
  server: { cwd: process.cwd(), mode: 'development' },
  terminal: { idea: 'schema.idea' }
};
```

`Config` intersects `UnknownNest` and declares common aggregate sections:
`brand`, `terminal`, `server`, `client`, `cookie`, `admin`, `api`, `email`,
`language`, `database`, `view`, `auth`, and `session`. Optional packages add
sections such as `csrf`, `mcp`, and `desktop`. A type-compatible key does not
prove that its owning plugin is installed or loaded.

There is no central runtime schema validation, unknown-key rejection, secret
classification, provenance tracking, or environment drift detection. Each
package reads and defaults its own paths during lifecycle events.

## `server` And `terminal`
| Key | Type/default | Owner and effect |
| --- | --- | --- |
| `server.build` | `string?` | general build location; consumers opt in |
| `server.cwd` | `process.cwd()` | schema/view/build path resolution |
| `server.mode` | `'production'` | view production/development mechanism |
| `server.host` | `'127.0.0.1'` | serve and transport binding |
| `server.port` | `3000` in serve flows | serve and optional transport binding |
| `server.process` | `'STACKPRESS_CHILD'` | development child-process name |
| `terminal.label` | `''` | verbose terminal brand label |
| `terminal.idea` | `string?` | main Idea source path for generation commands |

Host/port/build are conventions consumed by commands/packages, not intrinsic
requirements of the transport-neutral Ingest server.

## `client`
| Key | Type/default | Effect |
| --- | --- | --- |
| `build` | `<cwd>/node_modules/<package>` | generated package output |
| `lang` | `'js'`; `'ts'` supported | emit JS/declarations or retain formatted TS |
| `module` | `'stackpress-client'` when loaded | runtime dynamic import target |
| `package` | `'stackpress-client'` | generated package name |
| `revisions` | `string?` | schema snapshot history needed for migration history |
| `tsconfig` | required by generate event | base TypeScript project configuration |
| `prettier` | supported Prettier subset | formatting when `lang: 'ts'` |

`build`, `module`, and `package` may differ, but importability and package
metadata must align. Revision files are not an applied-migration ledger.

## `database`
| Key | Type/default | Effect |
| --- | --- | --- |
| `seed` | required by type; some paths fall back to `''`/`abc123` | generated hash/encryption and auth helpers |
| `migrations` | `string?` | writes migration SQL; does not apply it |
| `schema.onDelete` | `CASCADE` intended default | generated relation rule; implementation TODO exists |
| `schema.onUpdate` | `CASCADE` intended default | generated relation rule; implementation TODO exists |
| `populate` | `{ event, data }[]` | sequential population event plan |

Use environment-provided non-default seeds. Changing a seed can make encrypted
data unreadable. Population has no automatic plan-wide transaction or
idempotency guarantee.

## `view` And `brand`
| Key | Type/default | Effect |
| --- | --- | --- |
| `view.noview` | `'json'` | request-data flag bypassing template rendering |
| `view.base` | `'/'` | Vite/development and generated page base |
| `view.props` | `{}` | shared server-to-view config props |
| `view.notify` | Frui notifier options | browser notification behavior |
| `view.engine` | absent disables Reactus setup | render/build/route/path/template policy |
| `brand.name` | `'Stackpress'` in consuming auth flows | display name |
| `brand.logo`, `icon`, `favicon` | `string?` | layout and browser assets |

Maintained-template `view.engine` keys include `basePath`, `assetPath`,
`clientPath`, `pagePath`, `clientRoute`, `cssFiles`, `clientTemplate`,
`documentTemplate`, `pageTemplate`, `plugins`, `optimizeDeps`, `watchIgnore`,
and raw `vite`. Reactus owns these settings. Production requires coherent
routes, output paths, templates, and manifests.

## `language`
```ts
type LanguageConfig = {
  key?: string;       // default 'locale'
  locale?: string;    // default 'en_US'
  languages?: Record<string, {
    label: string; translations: Record<string, string>;
  }>;
};
```

The key names the request/session cookie field. Translation maps use source
phrases as keys, so wording changes can change translation identity.

## `session` And `auth`
`session.key` defaults to `session`; `session.seed` has a source fallback of
`abc123`; `session.access` maps roles to event strings or `{ method, route }`
permissions. It is an allowlist: access is denied unless permitted. Put dev/HMR
asset permissions only in development config.

| Auth key | Shape/default |
| --- | --- |
| `base` | string, default `'/auth'` |
| `redirect` | string, default `'/'` in redirecting flows |
| `2fa`, `captcha` | package extension objects/placeholders |
| `email` | `{ name, address }` sender identity |
| `roles` | signup roles, default `[]` |
| `menu` | `{ type?, target?, name, icon?, path }[]` |
| `password` | `{ min?, max?, upper?, lower?, number?, special? }`, default `{}` |

These configure built-in flows; they do not replace route authorization,
transport security, rate limiting, or identity proofing.

## `api`
`api.expires` is an optional application/session lifetime; omission means no
configured expiry window. `webhooks` are `{ event, uri, method, validity, data }`
external calls. `scopes` map names to `{ icon?, name, description }`.

```ts
type ApiEndpoint = {
  name?: string; description?: string; example?: string;
  method: Method; route: string;
  type: 'public'|'app'|'session'; scopes?: string[];
  cors?: boolean|string|string[];
  event: string; priority?: number; data: Record<string, Data>;
};
```

Scopes limit configured endpoints but do not automatically authorize the same
event through another surface.

## `admin`, `email`, `cookie`, And `csrf`
- `admin.name` defaults to `Admin`; `admin.base` defaults to `/admin`;
  menu items require `name`, `path`, and `match`, with optional `icon`.
- `email` is a NodeMailer transport options union or connection string. Load
  transport credentials from the environment.
- `cookie` accepts `domain`, `expires`, `httpOnly`, `maxAge`, `path` (adapter
  default `/`), `partitioned`, `priority`, `sameSite`, and `secure`. Production
  auth cookies need intentional HTTPS, script, same-site, domain, and lifetime policy.
- `csrf.name` defaults to `csrf`; `csrf.error` defaults to the package page-expiry
  message. Invalid/missing/mismatched tokens produce status 419.

## Optional `mcp`
The AI package activates only when an `mcp` section exists.

| Key | Default/effect |
| --- | --- |
| `name`, `title` | `'Stackpress AI Server'` |
| `version` | current package default `'0.10.7'` |
| `description` | optional MCP server description |
| `host`, `port` | inherit `server.host`/`server.port` |
| `route` | `'/mcp'` |
| `mode` | `'stateful'`, or `'stateless'` |
| `messages` | `'/messages'` for legacy SSE |
| `sse` | optional host/port/route/key overrides |
| `tools` | serializable tool definitions |

A tool has optional `mode: event|plugin`, visibility `type: public|app|user`,
name/title/description/method, JSON Schema input/output, required `event`, scopes,
and fixed `data`. Same host/port attaches routes to the main server; different
values create a dedicated listener. MCP authorization does not replace target
event authorization.

## Optional `desktop`

Desktop adds runtime, app identity, local server/open route, window, route
allowlist, navigation/devtools/native capability security, menu, updater, data,
build, packaging, and raw Electron settings. Current implemented runtime is
local HTTP; protocol mode is reserved. The desktop package normalizes defaults.

## Environment Composition

```ts
export const config: Config = {
  ...common,
  server: { ...common.server, mode: 'development' },
  view: { ...common.view, engine: { ...common.engine, plugins: [unocss()] } },
  session: { ...common.session, access: developmentAccess }
};
```

Shallow-spreading a section discards unspread nested keys. Layer nested policy
deliberately and keep secrets outside committed defaults.

## Source Anchors And Authority

Anchors: aggregate `packages/stackpress/src/client/types.ts`; package config
types, plugins, scripts, and generated consumers; maintained
`templates/blog/config/*.ts`; Ingest cookie options; Reactus config types. Types
state authoring shape, consumers prove defaults/effects, and template values are
demonstrated examples rather than defaults. Existing docs are benchmarks only.
