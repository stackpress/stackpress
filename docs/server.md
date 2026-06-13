# `stackpress/server`

`stackpress/server` is the consolidated runtime-facing server module. It exposes the server bootstrap helpers, request and response primitives, loaders, lifecycle routers, terminal support, and transport-bridging helpers that power Stackpress apps.

## Import

```ts
import {
  server,
  router,
  action,
  ConfigLoader,
  PluginLoader,
  Terminal
} from 'stackpress/server';
```

## When To Use It

Use this module when you want the broad Stackpress server surface without committing yet to `stackpress/http` or `stackpress/whatwg`. This path is also the place to look up CLI-adjacent server runtime helpers such as `Terminal`, `control`, `events`, and `scripts`.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `server`, `router`, `action`, `handler`, `gateway` | functions | Create server pieces and action wrappers |
| `Request`, `Response`, `Router`, `Server` | classes/types | Runtime primitives for request flow |
| `ConfigLoader`, `PluginLoader` | classes | Load config modules and plugin modules |
| `ActionRouter`, `EntryRouter`, `ImportRouter`, `ViewRouter` | classes | Resolve lifecycle routing tasks |
| `Terminal`, `control` | class/function | Terminal and CLI runtime helpers |
| `events`, `scripts` | namespaces | Grouped server event and script surfaces |
| `imToURL`, `reqToURL`, stream/query helpers | functions | Bridge IM/WHATWG helpers into app code |

## Detailed Exports

### `server`

- Kind: function
- Use it to create a Stackpress server instance from the consolidated server shelf.
- **Returns** a server instance that can accept config, plugin registration, and lifecycle listeners.

```ts
import { server } from 'stackpress/server';

const app = server();
```

### `router`

- Kind: function
- Use it to create a route-aware server router.
- **Returns** a router instance that can register handlers and match route definitions.

```ts
import { router } from 'stackpress/server';

const routes = router();
```

### `action`

- Kind: helper namespace/function family
- Use it to wrap request handlers into Stackpress actions. The most common pattern is a props-style handler such as `action(async function Name({ req, res, ctx }: RouteProps) { ... })`.
- **Returns** an action function that runs inside the Stackpress request pipeline.

```ts
import { action } from 'stackpress/server';
import type { RouteProps } from 'stackpress/types';

export default action(async function HomePage({ res }: RouteProps) {
  res.results({ ok: true });
});
```

### `ConfigLoader`

- Kind: class
- Use it to load one or more config modules into the server runtime.
- **Returns** a loader object that understands Stackpress config module conventions.

```ts
import { ConfigLoader } from 'stackpress/server';

const loader = new ConfigLoader();
```

### `PluginLoader`

- Kind: class
- Use it to load plugin modules from the app plugin list.
- **Returns** a loader object that resolves and installs plugin functions.

```ts
import { PluginLoader } from 'stackpress/server';

const loader = new PluginLoader();
```

### `Request`, `Response`, `Router`, `Server`

- Kind: runtime classes/types
- Use them when annotating app code, writing advanced integrations, or reasoning about the Stackpress runtime object model.
- `Request` and `Response` describe request-state and response-state objects.
- `Router` owns route registration and matching.
- `Server` owns config, registration, lifecycle events, and plugin coordination.

```ts
import type { Server, Request, Response } from 'stackpress/server';

function attach(server: Server, req: Request, res: Response) {
  console.log(server.config.path('server.mode'), req.method, res.code);
}
```

### `Terminal`

- Kind: class
- Use it when you need the Stackpress terminal runtime directly instead of only using the `stackpress` CLI commands.
- **Returns** a terminal object that can register and execute CLI scripts/events.

```ts
import { Terminal } from 'stackpress/server';

const terminal = new Terminal();
```

### `control`

- Kind: function
- Use it to integrate terminal control behavior in lower-level runtime code.

```ts
import { control } from 'stackpress/server';
```

### Transport Helpers

- `imToURL`, `imQueryToObject`, `readableStreamToReadable`
- `reqToURL`, `reqQueryToObject`, `readableToReadableStream`

Use these when you need to bridge incoming request shapes or stream implementations into values Stackpress can consume consistently.

```ts
import { reqToURL } from 'stackpress/server';
```

## Related

 - [Server Detail Pages](./server/README.md)
 - [Runtime Class Details](./runtime/README.md)
 - [Request](./runtime/Request.md)
 - [Response](./runtime/Response.md)
 - [Router](./runtime/Router.md)
 - [Server](./runtime/Server.md)
 - [Terminal](./server/Terminal.md)
 - [HTTP](./http.md)
 - [WHATWG](./whatwg.md)
 - [CLI Reference](./cli-reference.md)
