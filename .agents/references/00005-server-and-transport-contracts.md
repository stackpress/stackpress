# Server And Transport Contracts

Use this reference for the Stackpress server package, terminal lifecycle, plugin
loading, and Node HTTP/WHATWG transport boundaries. For the transport-neutral
`Request`, `Response`, `Router`, and `Server` class APIs, load
[Runtime API Contracts](./00004-runtime-api-contracts.md).

## Design Intent

Stackpress keeps one Ingest capability runtime and adapts only its native edge.
The HTTP entry preserves Node `IncomingMessage` and `ServerResponse`; the WHATWG
entry accepts Web `Request` and returns Web `Response`. Events, routes, plugin
loading, request normalization, and response semantics remain shared.

This is explicit portability, not runtime erasure: native resources remain on
the normalized request/response and code that uses them becomes adapter-specific.

## Public Entrypoints

| Import | Contract |
| --- | --- |
| `@stackpress/server` | terminal, transformer, events/scripts, shared Ingest runtime exports, types, and both transport helper families |
| `@stackpress/server/http` | Node HTTP aliases, adapter, loader/dispatcher, factories, helpers, decorators, and shared runtime exports |
| `@stackpress/server/whatwg` | WHATWG aliases, adapter, factories, helpers, decorators, and shared runtime exports |

The aggregate Stackpress package may re-export these surfaces under its own
entrypoints. Document the import actually used by the application rather than
implying all symbols are available from every entry.

## Stackpress Terminal

```ts
new StackpressTerminal(args: string[], server: Server<any, any, any>)
```

Public state:

- `server`: the Ingest server that owns plugins and events;
- `verbose`: `--verbose` or `-v`, default `false`;
- `force`: bare or parsed `--force`/`-f`, default `false`;
- `config`: `--bootstrap` or `-b` value, default `null`;
- `brand`: terminal control brand;
- `cwd`: `server.loader.cwd`.

Construction registers the terminal as plugin `terminal` and takes its brand
from `terminal.label`. `bootstrap()` bootstraps plugins and resolves `config`,
`listen`, then `route`. `run()` creates a request with terminal data and
`mimetype: 'terminal/arguments'`, then emits the parsed command as an event.

A missing command returns its status and prints only in verbose mode, except for
`serve`. Errors from `serve` and `develop` are rethrown. Other command errors are
converted into the response error shape and offered to the shared `error` event;
they are rethrown unless that event returns status 200.

## Configuration And Plugin Loading

```ts
new ConfigLoader(options?: ConfigLoaderOptions)
new PluginLoader(options: PluginLoaderOptions)
```

`ConfigLoaderOptions` accepts `cwd`, `fs`, `key`, and `extnames`. Defaults are
the process cwd, `NodeFS`, key `plugins`, and this ordered search list:

```ts
['/plugins.js', '/plugins.json', '/package.json',
 '/plugins.ts', '.js', '.json', '.ts']
```

`load<T>(filepath, defaults?)` resolves a candidate, imports it, unwraps
`default`, then unwraps the configured key when present. An unresolved path
returns `defaults` only when a default was supplied; otherwise it throws.
`resolveFile(filepath = cwd)` applies the ordered extension search.

`PluginLoader` adds optional `modules` and `plugins` values:

- `plugins(): Promise<string[]>` discovers once and returns a defensive copy;
- a string config becomes a one-item list; invalid/non-list config becomes `[]`;
- `bootstrap(loader)` runs once, loads entries in order, and calls
  `loader(name, plugin)` for concrete plugins;
- an entry that loads to an array creates a child loader rooted at that entry,
  preserving nested package-relative plugin composition;
- plugin names are normalized relative to the modules directory or loader cwd
  and have their extension removed.

The one-time flag prevents duplicate bootstrap on the same loader instance. It
is not a global plugin registry or a package compatibility check.

## Shared Factory Shape

Both adapters expose:

```ts
gateway(server): (options: NodeServerOptions) => NodeServer
handler(context, request, response, action?): Promise<...>
server(options: ServerOptions = {}): Server
router(): Router
action(action): action
```

`server()` installs the adapter's gateway and handler only when the caller did
not supply custom implementations. `action()` is an identity helper that pins
the appropriate native action type. With no explicit action, adapters emit the
route event `${METHOD} ${pathname}` after loading the request body.

## Node HTTP Adapter

Native aliases are `IM = IncomingMessage` and
`SR = ServerResponse<IncomingMessage>`. `gateway()` passes Node server options
to `createServer` and delegates each pair to `server.handle(im, sr)`.

Request normalization:

- method is uppercased, default `GET`;
- content type defaults to `text/plain`;
- undefined headers are removed;
- cookies become initial session values;
- query and URL come from `imToURL()`;
- the body loader accumulates the stream once and parses form/JSON semantics
  through `formDataToObject()`;
- optional loader `size` rejects a body after it exceeds that character limit.

`imToURL()` collapses repeated slashes, removes a trailing slash, chooses HTTPS
for encrypted sockets, honors the first `x-forwarded-proto` value, and falls
back to an unknown host when URL construction fails. `imQueryToObject()` parses
its search params. `readableStreamToReadable()` bridges Web streams to Node.

The dispatcher writes status, cookies, headers, and content type. Strings,
buffers, byte arrays, Node streams, and Web streams pass through. Objects and
arrays become the standard JSON envelope with `code`, `status`, `results`,
errors, optional total, and stack. A status-only response uses the error envelope.

## WHATWG Adapter

Native aliases are `NodeRequest = globalThis.Request` and
`NodeOptResponse = globalThis.Response | undefined`. Its gateway uses
`@whatwg-node/server` to adapt Node's listener and calls
`server.handle(request, undefined)`.

Request normalization mirrors HTTP, but reads headers with the Web Headers API
and consumes the body through `Request.text()`. There is currently no WHATWG
body-size limit. `reqToURL()` normalizes repeated/trailing pathname slashes;
`reqQueryToObject()` parses query data; `readableToReadableStream()` bridges a
Node readable to a Web stream.

The dispatcher returns a route-supplied native Web `Response` unchanged.
Otherwise it creates one from the normalized response, converts Node streams,
JSON-encodes objects/arrays and status-only results, then applies session
revisions, headers, content type, status, and status text.

## Integration Examples

```ts
import { server, action } from '@stackpress/server/http';

const app = server({ cwd: process.cwd() });
app.on('GET /health', action(({ response }) => {
  response.setBody({ healthy: true });
}));
await app.bootstrap();
```

```ts
import { server } from '@stackpress/server/whatwg';

const app = server();
await app.bootstrap();
const response = await app.handle(new Request('http://localhost/health'));
```

Application startup still determines lifecycle resolution and listening policy;
the factories establish transport contracts, not a complete deployment recipe.

## Boundaries And Known Risks

- Both included gateways create Node HTTP servers; WHATWG refers to the handler
  contract, not an automatic edge-runtime deployment guarantee.
- HTTP honors forwarded protocol without independently validating a trusted proxy.
- Cookie dispatch uses header replacement semantics in the current adapters;
  verify multi-cookie behavior in the target runtime.
- WHATWG body loading has a source-marked size-limit TODO.
- Loader discovery proves resolvability, not plugin compatibility or support.

## Source Anchors And Authority

Accepted behavior is anchored to the current checkouts of:

- `packages/stackpress-server/src/{index,http,whatwg,types,Terminal}.ts`;
- `ingest/src/{Loader,types}.ts`;
- `ingest/src/http/{index,Adapter,helpers}.ts`;
- `ingest/src/whatwg/{index,Adapter,helpers}.ts`.

This reference promotes source-observed contracts. If implementation and this
file differ, re-research the source and update the KB before generating public
documentation. Existing `docs/` pages are parity benchmarks, not authority.
