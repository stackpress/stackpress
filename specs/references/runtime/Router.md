# `Router`

`Router` registers route handlers, event listeners, import handlers, and view
routes. `Server` extends `Router`, so these methods are also available on a
server instance.

## Import

```ts
import { Router } from 'stackpress/server';
```

## Instantiation

```ts
const router = new Router();
router.get('/health', ({ res }) => {
  res.json({ ok: true });
});
```

This example creates an isolated router and registers one GET route.

## Properties

| Property | Description |
| --- | --- |
| `action` | Action router extension. |
| `entry` | Entry router extension. |
| `import` | Import router extension. |
| `view` | View router extension. |
| `routes` | Registered route map. |
| `listeners` | Registered event listener map. |
| `imports` | Registered import map. |
| `views` | Registered view map. |

## Route Methods

`Router` exposes method-specific route helpers: `all`, `connect`, `delete`,
`get`, `head`, `options`, `patch`, `post`, `put`, and `trace`.

```ts
router.post('/articles', async ({ req, res }) => {
  res.results(req.data());
});
```

Each route helper registers a handler and returns the router instance.

## Event And Resolution Methods

### `on(event, action, priority?)`

Registers an event listener, import handler, or view action depending on the
action shape.

**Returns** the router instance.

### `emit(event, req, res)`

Calls listeners for an event.

**Returns** a promise for the event dispatch.

### `resolve(event, request?, response?)`

Emits an event and returns a status response.

**Returns** a promise resolving to a partial status response.

### `resolve(method, path, request?, response?)`

Routes to a method/path pair and returns a status response.

**Returns** a promise resolving to a partial status response.

## Factory Methods

### `request(init?)`

Creates a `Request`.

### `response(init?)`

Creates a `Response`.

### `use(router)`

Copies another router's action, entry, import, and view routes into this router.

## Related

 - [Server](./Server.md)
 - [Request](./Request.md)
 - [Response](./Response.md)
