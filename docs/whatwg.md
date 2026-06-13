# `stackpress/whatwg`

`stackpress/whatwg` exposes the WHATWG request/response variant of the Stackpress server runtime. Use it when your runtime is naturally built around `Request`, `Response`, URL, and stream primitives from the WHATWG model.

## Import

```ts
import { server, router, gateway, handler } from 'stackpress/whatwg';
```

## When To Use It

Use this path when you want the Stackpress server runtime but your environment is closer to fetch-style request and response objects than Node HTTP objects.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `server`, `router`, `gateway`, `handler` | functions | Create WHATWG-oriented server pieces |
| `Request`, `Response`, `Router`, `Server`, `Route` | runtime types | Core WHATWG runtime shapes |
| `ConfigLoader`, `PluginLoader` | classes | Load config and plugin modules |
| `ActionRouter`, `EntryRouter`, `ImportRouter`, `ViewRouter` | classes | Resolve lifecycle route tasks |
| `reqToURL`, `reqQueryToObject`, `readableToReadableStream` | helpers | Convert WHATWG requests and streams |

## Detailed Exports

### `server`

- Kind: function
- Signature shape: `server(options?)`
- **Returns** a `WhatwgServer` instance.
- Use it when you want a fetch-style Stackpress server bootstrap.

```ts
import { server } from 'stackpress/whatwg';

const app = server();
```

### `router`

- Kind: function
- **Returns** a `WhatwgRouter`.

```ts
import { router } from 'stackpress/whatwg';

const routes = router();
```

### `gateway` and `handler`

- Kind: functions
- Use them to adapt incoming WHATWG-style request handlers into the Stackpress runtime pipeline.

```ts
import { gateway, handler } from 'stackpress/whatwg';
```

### `reqToURL`

- Kind: function
- Use it to derive a `URL` from an incoming WHATWG request object.
- **Returns** a `URL` object.

```ts
import { reqToURL } from 'stackpress/whatwg';
```

### `reqQueryToObject`

- Kind: function
- Use it to convert request query parameters into a plain object.
- **Returns** an object representation of the query.

```ts
import { reqQueryToObject } from 'stackpress/whatwg';
```

### `readableToReadableStream`

- Kind: function
- Use it to bridge Node-readable content into a WHATWG `ReadableStream`.
- **Returns** a WHATWG-compatible readable stream.

```ts
import { readableToReadableStream } from 'stackpress/whatwg';
```

## Related

 - [Server](./server.md)
 - [HTTP](./http.md)
