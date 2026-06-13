# `stackpress/http`

`stackpress/http` is the Node-style HTTP runtime shelf. It exposes the most common server bootstrap helpers, request/response primitives, lifecycle routers, and request parsing helpers for applications running on the Node HTTP model.

## Import

```ts
import {
  server,
  router,
  action,
  gateway,
  handler
} from 'stackpress/http';
```

## When To Use It

Use this path when your app is built around the Node HTTP request/response model and you want the most common Stackpress server runtime entrypoint.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `server` | function | Create an HTTP server instance |
| `router` | function | Create an HTTP router |
| `action` | helper namespace/function family | Wrap request handlers into Stackpress actions |
| `gateway`, `handler` | functions | Adapt handlers into the Stackpress runtime |
| `Request`, `Response`, `Router`, `Server`, `Route` | runtime types | Core HTTP runtime shapes |
| `ConfigLoader`, `PluginLoader` | classes | Load config and plugins |
| `ActionRouter`, `EntryRouter`, `ImportRouter`, `ViewRouter` | classes | Resolve lifecycle route tasks |
| `cookie`, `session` | helpers | Read/write cookie and session state |
| `objectFromQuery`, `objectFromFormData`, `objectFromJson`, `formDataToObject` | helpers | Parse inbound request data |
| `withUnknownHost` | helper | Build a host fallback wrapper |
| `Status`, `Exception` | classes | Response status and exception helpers |

## Detailed Exports

### `server`

- Kind: function
- Signature shape: `server(options?)`
- Arguments:
  - `options?`: HTTP server options
- **Returns** an `HttpServer` instance that can load config, register plugins, and resolve lifecycle listeners such as `config`, `listen`, and `route`.

```ts
import { server } from 'stackpress/http';

const app = server();
app.config.set({ server: { mode: 'development' } });
await app.bootstrap();
```

### `router`

- Kind: function
- Signature shape: `router(...)`
- Use it to create a route-aware HTTP router when you are working below the full server bootstrap level.
- **Returns** an `HttpRouter`.

```ts
import { router } from 'stackpress/http';

const routes = router();
```

### `action`

- Kind: helper namespace/function family
- Common usage: `action(async function Name({ req, res, ctx }: RouteProps) { ... })`
- Use it to create Stackpress handlers that receive the framework request context.
- **Returns** an `HttpAction`.

```ts
import { action } from 'stackpress/http';
import type { RouteProps } from 'stackpress/types';

export default action(async function HomePage({ res }: RouteProps) {
  res.results({ title: 'Hello' });
});
```

### `gateway`

- Kind: function
- Use it when you need a gateway-style adapter for incoming HTTP requests before they hit your action or route layer.
- **Returns** a gateway function compatible with the HTTP runtime.

```ts
import { gateway } from 'stackpress/http';
```

### `handler`

- Kind: function
- Use it to adapt raw logic into a Stackpress-compatible route handler.
- **Returns** a route handler function compatible with the HTTP runtime.

```ts
import { handler } from 'stackpress/http';
```

### `ConfigLoader` and `PluginLoader`

- Kind: classes
- `ConfigLoader` loads config modules into the runtime.
- `PluginLoader` loads the plugin list into the runtime.
- **Returns** loader instances used internally by server bootstrap and available for advanced integrations.

```ts
import { ConfigLoader, PluginLoader } from 'stackpress/http';

const configs = new ConfigLoader();
const plugins = new PluginLoader();
```

### `Request`, `Response`, `Router`, `Server`, `Route`

- Kind: runtime types/classes
- Use them to annotate app code or to understand the core runtime shapes.
- `Request` carries parsed request data and request metadata.
- `Response` carries body, result, status, and data payload state.
- `Router` matches routes to handlers.
- `Server` coordinates config, plugins, and lifecycle resolution.
- `Route` represents a single registered route entry.

```ts
import type { Request, Response } from 'stackpress/http';

function logRequest(req: Request, res: Response) {
  console.log(req.method, res.code);
}
```

### Request Parsing Helpers

#### `objectFromQuery`

- Kind: function
- Use it to convert a query string or query structure into a plain object.
- **Returns** a parsed object representation of the query input.

```ts
import { objectFromQuery } from 'stackpress/http';

const query = objectFromQuery('page=1&sort=title');
```

#### `objectFromFormData` and `formDataToObject`

- Kind: functions
- Use them to convert `FormData`-shaped input into plain objects.
- **Returns** plain object data that can be pushed into Stackpress request flows.

```ts
import { formDataToObject } from 'stackpress/http';

const data = formDataToObject(formData);
```

#### `objectFromJson`

- Kind: function
- Use it to parse JSON input into a plain object.
- **Returns** a parsed object.

```ts
import { objectFromJson } from 'stackpress/http';

const payload = objectFromJson('{"title":"Hello"}');
```

#### `cookie`

- Kind: helper
- Use it to read or write cookie values in HTTP request/response flows.

```ts
import { cookie } from 'stackpress/http';
```

#### `session`

- Kind: helper
- Use it to read or write session state from HTTP request/response flows.

```ts
import { session } from 'stackpress/http';
```

#### `withUnknownHost`

- Kind: helper
- Use it to provide a safe host fallback when a request does not carry a usable host value.

```ts
import { withUnknownHost } from 'stackpress/http';
```

## Integration Example

```ts
import { server as http, action } from 'stackpress/http';
import type { RouteProps } from 'stackpress/types';

const app = http();

app.import.get('/', () => import('./pages/home.js'));

export default action(async function HomePage({ res }: RouteProps) {
  res.results({ title: 'Hello Stackpress' });
});
```

## Related

 - [Runtime Class Details](./runtime/README.md)
 - [Request](./runtime/Request.md)
 - [Response](./runtime/Response.md)
 - [Router](./runtime/Router.md)
 - [Server](./runtime/Server.md)
 - [Server](./server.md)
 - [WHATWG](./whatwg.md)
 - [Config Reference](./config-reference.md)
