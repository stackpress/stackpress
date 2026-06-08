# `Server`

`Server` extends `Router` with config storage, plugin loading, plugin
registration, and request handling.

## Import

```ts
import { server, Server } from 'stackpress/server';
```

## Instantiation

Use the `server()` factory for normal app code.

```ts
const app = server();
app.config.set('server', { mode: 'development' });
await app.bootstrap();
```

This example creates a server, sets config, and bootstraps configured plugins.

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `config` | `CallableNest` | App config map. |
| `loader` | `PluginLoader` | Plugin loader. |
| `plugins` | `CallableMap` | Registered plugin instances/configs. |

`Server` also inherits router properties such as `routes`, `listeners`,
`imports`, and `views`.

## Methods

### `bootstrap()`

Loads configured plugins and lets plugin functions register themselves.

**Returns** a promise resolving to the server instance.

### `create(options?)`

Creates a native Node server through the configured gateway.

**Returns** the native server resource.

### `handle(request, response)`

Handles a native request/response pair through the configured handler.

**Returns** the handler result.

### `props(req, res)`

Builds the standard handler props object with `req`, `res`, `ctx`,
`request`, `response`, and `context`.

**Returns** the handler props object.

### `plugin(name)`

Reads a registered plugin by name.

**Returns** the registered plugin value.

### `register(name, config)`

Registers a plugin value by name.

**Returns** the server instance with narrowed plugin typing.

## Related

 - [Router](./Router.md)
 - [Server Module](../server.md)
 - [Config Reference](../config-reference.md)
