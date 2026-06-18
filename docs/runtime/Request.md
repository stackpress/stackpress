# `Request`

`Request` normalizes incoming request state across Node HTTP and WHATWG-style
runtimes. Handlers use it to read query data, post data, headers, session data,
and the original runtime resource.

## Import

```ts
import { Request } from 'stackpress/server';
```

## Instantiation

```ts
const req = new Request({
  url: 'http://localhost:3000/articles?page=1',
  method: 'GET'
});
```

This example creates a request object manually. In normal route handling, the
adapter creates `req` and passes it into the handler props.

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `data` | `CallableNest` | Combined query, post, and extra data. |
| `query` | `CallableNest` | URL query parameters. |
| `post` | `CallableNest` | Parsed request body data. |
| `headers` | `CallableMap<string, string \| string[]>` | Request headers. |
| `session` | `CallableSession` | Cookie-derived session data. |
| `url` | `URL` | Normalized request URL. |
| `method` | `Method` | HTTP method. |
| `body` | `Body \| null` | Raw loaded body. |
| `loaded` | `boolean` | Whether body loading has completed. |
| `mimetype` | `string` | Request body MIME type. |
| `resource` | `R` | Original runtime request resource. |

## Methods

### `load()`

Loads and parses the request body with the configured loader.

**Returns** the request instance for chaining.

```ts
await req.load();
const input = req.post.get();
```

Adapters usually call `load()` before route handling begins. Call it manually
only when you created a request yourself or are testing request parsing.

## Data Access Example

```ts
const page = req.query.get('page');
const title = req.post.get('title');
const all = req.data();
const userId = req.session.get('userId');
```

This example shows the common request surfaces. Use `req.session` to read
incoming session data and `res.session` to write session changes back.

## Related

 - [Response](./Response.md)
 - [Server Module](../server.md)
 - [HTTP Module](../http.md)
