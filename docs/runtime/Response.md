# `Response`

`Response` gives handlers one consistent output model for JSON, HTML, rows,
redirects, headers, errors, and session revisions.

## Import

```ts
import { Response } from 'stackpress/server';
```

## Instantiation

```ts
const res = new Response({
  headers: { 'Content-Type': 'application/json' }
});
```

In normal route handling, the adapter creates `res` and passes it into handler
props. Manual construction is most useful in tests or direct event resolution.

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `headers` | `CallableMap<string, string \| string[]>` | Response headers. |
| `session` | `CallableSession` | Response-side session revisions. |
| `errors` | `CallableNest` | Validation or error details. |
| `data` | `CallableNest` | Extra response-side metadata. |
| `body` | `Body \| null` | Response body. |
| `code` | `number` | HTTP status code. |
| `status` | `string` | HTTP status message. |
| `error` | `string \| undefined` | Error message. |
| `total` | `number` | Total count for row responses. |
| `mimetype` | `string \| undefined` | Response MIME type. |
| `redirected` | `boolean` | Whether the response redirects. |
| `sent` | `boolean` | Whether the response has been dispatched. |

## Methods

### `json(body, code?, status?)`

Sets a JSON response.

**Returns** the response instance for chaining.

### `html(body, code?, status?)`

Sets an HTML response.

**Returns** the response instance for chaining.

### `results(body, code?, status?)`

Sets a single result payload.

**Returns** the response instance for chaining.

### `rows(body, total?, code?, status?)`

Sets a collection payload and optional total count.

**Returns** the response instance for chaining.

### `redirect(url, code?, status?)`

Sets a redirect response.

**Returns** the response instance for chaining.

### `set(type, body, code?, status?)`

Sets the response MIME type and body directly.

**Returns** the response instance for chaining.

### `setError(error, errors?, stack?, code?, status?)`

Sets an error response.

**Returns** the response instance for chaining.

## Example

```ts
server.get('/articles', async ({ res }) => {
  res.rows([
    { id: '1', title: 'Hello' }
  ], 1);
});
```

This example returns a list response with a total count. Use `res.data` for
extra view metadata and `res.results` or `res.rows` for the actual payload.

## Related

 - [Request](./Request.md)
 - [View Client Hooks](../view/hooks.md)
