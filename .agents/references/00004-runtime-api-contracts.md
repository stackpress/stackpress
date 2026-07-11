# Runtime API Contracts

Load this reference for document-level details about `Request`, `Response`,
`Router`, and `Server`. Authority: current sibling Ingest/lib design intent;
Stackpress consumes the corresponding `0.10.5` packages in this checkout.

## Request

Canonical imports: `@stackpress/ingest/Request`, `stackpress/server`,
`stackpress/http`, or `stackpress/whatwg` depending on the entry surface.
Ingest's `Request<R>` extends the lib request without changing behavior.

```ts
new Request<R>(init?: Partial<RequestOptions<R>>)
```

Public controllers and fields:

- `data`: callable nested data merged from query, post, and explicit `init.data`;
- `headers`: callable map of string or string-array values;
- `query`, `post`: callable nested query/form data;
- `session`: callable cookie-backed session map;
- `url`: normalized `URL`, defaulting to `http://unknownhost/`;
- `method`: request method, default `GET`;
- `body`, `mimetype`, `type`, `loaded`, `resource`: body and native-resource
  inspection.

Set `request.loader` to a `RequestLoader<R>`. `await request.load()` invokes it
once, merges returned post data into `post` and `data`, updates body, marks the
request loaded, and returns the request. Repeated loads return immediately.

Body `type` reports `buffer`, `uint8array`, `object`, `array`, `string`, `null`,
or JavaScript `typeof`. `resource` preserves the original host request.

```ts
const req = router.request({
  method: 'POST',
  url: 'https://example.test/items?page=2',
  data: { source: 'docs' }
});
req.data.path('page');
```

## Response

Canonical imports mirror Request. Ingest's `Response<S>` extends the lib response
without changing behavior.

```ts
new Response<S>(init?: Partial<ResponseOptions<S>>)
```

Public controllers:

- `headers`, `session`, `errors`, and `data` are callable stores;
- `body`, `code`, `status`, `error`, `stack`, `total`, `mimetype`, `resource`,
  `type`, `sent`, and `redirected` expose response state;
- writable `body`, `code`, `status`, `error`, `stack`, `total`, `mimetype`, and
  `resource` support low-level adapters.

Primary methods:

```ts
dispatch(): Promise<S>
fromException(exception): this
fromStatusResponse<T>(response): this
redirect(url, code = 302, status?): this
set(type, body, code = 200, status?): this
setError(error, errors = {}, stack = [], code = 400, status?): this
html(body, code = 200, status?): this
json(body, code = 200, status?): this
results(body, code = 200, status?): this
rows(body, total = 0, code = 200, status?): this
statusCode(code, message?): this
xml(body, code = 200, status?): this
stop(): this
toException(message?): Exception
toStatusResponse<T>(): Partial<StatusResponse<T>>
```

`results()` sets `total` to one. `rows()` uses the supplied total. `json()`
stringifies object input; `results()` and `rows()` retain object/array bodies
while setting JSON MIME type. `redirect()` sets `Location`; `redirected` checks
that header. `stop()` marks sent without dispatch. `dispatch()` invokes an
optional native dispatcher once and returns the native resource.

```ts
const res = router.response();
res.rows([{ id: 'a' }], 1).statusCode(200);
return res.toStatusResponse();
```

## Router

Ingest `Router<R,S>` composes four routing facets over the same action router:

- `action`: direct functions;
- `import`: lazy parameterless import callbacks;
- `entry`: module entry actions;
- `view`: string view-entry actions plus render engine.

Public maps are available through `entries`, `expressions`, `imports`,
`listeners`, `routes`, and `views`.

Route helpers are `all`, `connect`, `delete`, `get`, `head`, `options`, `patch`,
`post`, `put`, and `trace`. Each accepts `(path, action, priority?)` and delegates
to `route(method, path, action, priority = 0)`.

`on(event, action, priority = 0)` dispatches by action shape: string to view,
anonymous zero-argument function to lazy import, otherwise direct action.

```ts
on(event: string | RegExp, action, priority = 0): this
emit(event, req, res): Promise<Status>
resolve<T>(event, request?, response?): Promise<Partial<StatusResponse<T>>>
resolve<T>(method, path, request?, response?): Promise<Partial<StatusResponse<T>>>
request(init?): Request<R>
response(init?): Response<S>
route(method, path, action, priority = 0): this
use(router): this
mount(...decoratedControllers): this
```

Plain object request input to `resolve()` becomes `request({data: input})`.
Route resolution converts method/path to an uppercase event name. Missing events
return `Status.NOT_FOUND`. Route params and positional expression args are merged
into `req.data`. Returning `false` from an action cooperatively stops the queue.

`use()` merges action, entry, import, and view facets. Registration order and
priority remain observable.

## Server

`Server<R,S,C,P>` extends Router and adds:

- `config`: callable nested config;
- `loader`: `PluginLoader`;
- `plugins`: callable plugin map;
- configurable native `gateway` and `handler`.

```ts
new Server(options?: ServerOptions<R,S,C,P>)
bootstrap(): Promise<this>
create(options?: NodeServerOptions): NodeServer
handle(request: R, response: S): Promise<unknown>
props(req, res): {request, response, context, req, res, ctx}
plugin(name): registered plugin
register(name, config): narrowed this
```

`bootstrap()` loads package/application plugins once and registers object results.
It does not resolve Stackpress's `config`, `listen`, or `route`; Stackpress
bootstrap/Terminal performs those phases afterward.

`create()` delegates to the configured gateway. The default gateway creates a
Node HTTP server and forwards native resources to `handle()`. The default handler
returns the response resource unchanged, allowing transport packages to supply
real adapters.

```ts
const app = server();
app.config.set({ server: { mode: 'development' } });
await app.bootstrap();
await app.resolve('config');
await app.resolve('listen');
await app.resolve('route');
```

## Source Anchors

- `../lib/src/router/Request.ts`, `Response.ts`, `Router.ts`
- `../ingest/ingest/src/Request.ts`, `Response.ts`, `Router.ts`, `Server.ts`
- Ingest/lib router and response tests

