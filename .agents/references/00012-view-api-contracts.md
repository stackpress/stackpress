# View API Contracts

Use this reference for Stackpress view routing, Reactus SSR/build behavior,
browser-safe hooks/providers/layouts, notifications, and `setViewProps`.

## Ownership And Entrypoints

Reactus owns host-routed React SSR, hydration templates, document manifests,
Vite development, and builds. `stackpress-view` adapts Reactus to Ingest routes,
serializes server state into props, and supplies shared client providers/layouts.
Frui owns notifications/components; r22n owns phrase translation.

| Import | Surface |
| --- | --- |
| `stackpress/view` | aggregate server + client view exports |
| `stackpress/view/client` | browser-safe view exports plus admin helpers/layout |
| `stackpress/view/types` | public view/type contracts |
| `stackpress-view` | underlying package server + core client exports |
| `stackpress-view/client` | underlying browser-safe core only |

Aggregate `stackpress/view/client` additionally re-exports `filter`, `order`,
`paginate`, `LayoutAdmin`, CSV/batch helpers, and admin types from
`stackpress-admin/client`. Those are not owned by `stackpress-view/client`.

## Reactus Templates And Helpers

`DOCUMENT_TEMPLATE` provides the HTML root, `<!--document-head-->`, body,
serialized props script, and hydrated client script markers. `PAGE_TEMPLATE`
wraps a page entry and re-exports its `Head`/styles. `CLIENT_TEMPLATE` reads the
props JSON and calls `hydrateRoot` under React StrictMode.

```ts
fileHash(content: string, length = 32): string
renderJSX(element?: ElementType, props: UnknownNest = {}): string
```

`fileHash` is an MD5-derived base62 content ID, not a security hash.
`renderJSX` uses React server `renderToString` under StrictMode and returns `''`
without an element.

Vite helpers:

- `viteCSSPlugin(cssFiles)` injects imports into TSX;
- `viteFilePlugin(loader, extnames?)` resolves package/relative modules;
- `viteHMRPlugin(server)` serves live TSX client entries by manifest ID;
- `viteVFSPlugin(vfs)` resolves/loads virtual Reactus files and reloads changes.

## Reactus Runtime Classes

| Class | Responsibility |
| --- | --- |
| `Document` | one page entry with stable ID, loader, builder, and renderer |
| `DocumentLoader` | absolute/relative resolution and live page import |
| `DocumentBuilder` | page/client/asset source and build operations |
| `DocumentRender` | server markup and HMR client rendering |
| `ServerManifest` | entry-to-document registry, persistence, ID lookup |
| `ServerLoader` | cwd/filesystem import, fetch, and file resolution |
| `ServerResource` | Vite build/dev/middleware/plugin resource |
| `VirtualServer` | in-memory file map |
| `Server` | configured development host and HTTP middleware |
| `Builder` | manifest-wide page/client/asset builds |

Reactus `dev(options)` exposes config/paths/routes/templates, Vite dev and HTTP
middleware, manifest methods, entry path/import methods, HMR rendering, and SSR.
`build(options)` adds all-assets/clients/pages build methods. Production
`serve(options)` loads compiled pages and renders markup without Vite dev state.

## Stackpress Plugin Lifecycle

The view plugin is disabled when config has no `view` section. During `config`
it chooses production only when `server.mode === 'production'`; any other mode
loads development Reactus. It registers plugin `reactus`, assigns
`server.view.render`, and installs the Ingest view engine. During `listen` it
registers `build`; during `route`, development adds Node HTTP asset/HMR handling;
during `idea`, it contributes the generated view transform.

Build registers every Ingest view entry in a Reactus manifest, then builds only
configured outputs: clients when `clientPath`, assets when `assetPath`, pages
when `pagePath`. The deployment build event also writes package metadata with
generation/start/postinstall scripts.

Development middleware requires native Node `IncomingMessage` and
`ServerResponse`; the general render contract remains transport-neutral, but
this HMR/asset path is not automatically WHATWG-portable.

## Server Rendering Flow

For an Ingest view action, the engine normalizes response status and skips SSR
when redirected, when request data contains `view.noview` (default `json`), or
when the body is already a string. Otherwise it resolves `me` and renders:

```ts
{
  data: { ...config.view.props, ...response.data },
  session: me.results,
  request: { url, headers, session, method, mime, data },
  response: response.toStatusResponse()
}
```

Successful markup becomes `res.html(html, code, status)`. Response data wins
same-named shared props. The serialized snapshot is browser-visible: do not put
secrets, native resources, functions, cycles, or unnecessary headers/session
data into it. Current code forwards all normalized request headers and session
data; applications must assess that exposure.

## `setViewProps`

```ts
setViewProps(req: Request, res: Response, ctx: Server): void
```

It returns immediately when the no-view flag exists. Otherwise it copies
sanitized config subsets into `res.data`:

- `view`: `base` default `/`, `props` default `{}`, notifier options from
  `notify` default `{}`;
- `brand`: name `Stackpress`, logo `/logo.png`, icon `/icon.png`, favicon
  `/favicon.ico`;
- `language`: key `locale`, locale `en_US`, languages `{}`.

It does not copy `view.engine` or arbitrary full config. Routes should call it
before rendering when their page expects these config props.

## Browser Snapshot Classes And Hooks

`ServerProvider` supplies data, session, request, and response, with a Guest/
unknown-host fallback. Client `ServerRequest`, `ServerResponse`, and
`ServerSession` are local wrappers over serialized state, not live server
objects.

| Hook | Returns |
| --- | --- |
| `useRequest<I>()` | request wrapper with data/headers/session maps, URL, method |
| `useResponse<O>()` | status, error/errors, results, stack, total; exception/status conversion |
| `useConfig<C>()` | nested controller over serialized `data` |
| `useSession()` | session wrapper with `guest` and `can(...permits)` |
| `useServer<C,I,O>()` | all four wrappers/controllers |
| `useTheme()` | `{ theme, toggle }` theme context |
| `useLanguage()` | r22n language context |

`useSession().can()` requires every requested permit and supports event/route
wildcards. It is a display/UX check only; server authorization remains required.

## Providers And Layouts

`LayoutProvider` composes `ServerProvider`, `R22nProvider`, `ThemeProvider`, and
Frui Notifier. It selects translations from serialized language config, notifier
options from `data.view.notify`, and initial theme from request session.
`ThemeProvider` toggles light/dark and stores cookie `theme` at `/`.

`LayoutBlank` provides optional header/main plus popup/dialog/dropdown roots.
`LayoutPanel` adds responsive header, permission-filtered left menu, right user
panel, theme/sidebar toggles, and main content. Both unload server flash cookies
on mount and notify response errors. Lower-level exports are `LayoutHead`,
`LayoutLeft`, `LayoutMain`, `LayoutMenu`, `LayoutRight`, and `LayoutUser`.

Current `LayoutUser` contains hard-coded EN/TH and auth/admin paths/role checks;
treat it as current shared UI behavior, not a general configurable identity UI.

## Notifications And Admin URL Helpers

Frui exports `flash(type, message, options?)` to write a notification cookie,
`notify(type, message, options?)` for immediate toast, `unload(cookie?, name?)`
to consume the flash cookie, `useNotifier`, and `NotifierContainer`. Defaults
include 5-second close, bottom-center dark theme, cookie name `flash`, path `/`.

Aggregate client helpers mutate `window.location` query parameters:

- `paginate(name, skip)` sets a numeric parameter;
- `filter(name, value)` sets it or deletes for null/undefined;
- `order(name)` cycles absent -> `desc` -> `asc` -> absent.

## Source Anchors And Authority

Anchors: Stackpress view index/client, plugin/config/helpers/scripts, client
providers/wrappers/hooks/layouts/theme; aggregate view facades; Reactus constants,
helpers, plugins, runtime classes/types; Frui Notifier; admin client helpers;
maintained template views/configs. Source is authority; existing docs are parity
benchmarks and may conflate aggregate versus underlying exports.
