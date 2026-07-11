# Node HTTP Adapter

`stackpress/http` connects Stackpress's normalized server runtime to Node's HTTP
request and response objects. It exports native aliases, adapter and loader
classes, request/response factories, a dispatcher, gateway and handler helpers,
and URL, query, stream, cookie, and session utilities.

```ts
import { server } from 'stackpress/http'

const app = server()

app.get('/health', async (_req, res) => {
  res.setResults({ ok: true })
})

await app.bootstrap()
await app.listen()
```

The request factory maps method, URL, headers, query values, cookies, session
state, and the request stream into a Stackpress `Request`. The native
`IncomingMessage` remains available through `request.resource`. The response
factory and dispatcher translate status, headers, cookies, body, results, and
redirects back to `ServerResponse`.

## Edge Behavior

Body parsing and size enforcement belong to this adapter. Stream consumption is
an edge operation, while the normalized request caches the loaded body for
application handlers. Session changes made on the response are converted into
the adapter's cookie representation during dispatch.

Forwarded protocol headers are trust-sensitive and should only influence URL
construction behind a trusted proxy configuration. Multiple `Set-Cookie`
values must remain distinct when crossing the normalized/native boundary.
Native streams are escape hatches: once application code writes directly to the
underlying response, normal dispatch guarantees can no longer be assumed.

The HTTP entrypoint is specifically the Node deployment adapter. Use the WHATWG
entrypoint for Fetch-style requests; its included gateway may still provide a
Node listener, but its request conversion and body semantics are different.

