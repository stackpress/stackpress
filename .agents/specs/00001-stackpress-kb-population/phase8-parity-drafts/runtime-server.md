# Runtime Server

`Server` is Stackpress's transport-neutral capability host. It combines a
configuration loader, event and route router, view router, plugin registry, and
request/response factories. A transport adapter supplies native resources at
the edge; the server runs application behavior against normalized runtime
objects.

```ts
import { Server } from 'stackpress/server'

const server = new Server()

server.get('/health', async (_req, res) => {
  res.setResults({ ok: true })
})

await server.bootstrap()
```

The server can register plugins, create requests and responses, resolve events,
handle normalized requests, emit lifecycle events, and listen through an
installed gateway. Plugin registration establishes capabilities; bootstrap
runs each registered loader's lifecycle once.

## Request Flow

An adapter converts the native request into a Stackpress `Request`, preserving
the native object as `resource`. The request exposes URL, method, MIME type,
headers, query, post body, session, and general data. Body loading is cached so
handlers share one normalized result.

Routing resolves method routes and event routes in priority order. A handler
updates the shared `Response`, which tracks status, body, results, errors,
headers, session changes, totals, stack information, and its native resource.
Redirected or already-sent responses short-circuit later dispatch work. The
adapter ultimately serializes the normalized response.

## Boundaries

Emitting an event does not make it an HTTP endpoint, authorize it, or wrap it in
a transaction. Exposure and policy are separate plugin responsibilities. The
server itself is not tied to Node HTTP, WHATWG Request, or terminal execution;
each adapter owns parsing, streaming, cookie/header conversion, and gateway
behavior for its native environment.

Configuration should be loaded before bootstrap. Plugin order matters when a
later plugin consumes routes, schema, language, data, or views established by
an earlier one.

