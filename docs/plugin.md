# `stackpress/plugin`

`stackpress/plugin` exports the aggregate Stackpress plugin. It loads the default framework capability stack into a server instance so an application can start from one plugin entry instead of registering each framework plugin by hand.

## Import

```ts
import plugin from 'stackpress/plugin';
```

## When To Use It

Use this module when you want the standard Stackpress framework behavior loaded as one plugin. It is the highest-level plugin entrypoint for apps that want server, schema, language, CSRF, SQL, view, session, API, and admin behavior together.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `default` | async plugin function | Registers the standard Stackpress plugin stack on a server |

## Detailed Exports

### `default`

- Kind: plugin
- Signature:

```ts
async function plugin(ctx: Server): Promise<void>
```

- Arguments:
  - `ctx`: the server instance receiving plugin registrations
- **Returns** a promise that resolves after the aggregate plugin has registered its child plugins.
- Behavior:
  - loads the server plugin
  - loads schema support
  - loads language support
  - loads CSRF protection
  - loads SQL support
  - loads view support
  - loads session support
  - loads API support
  - loads admin support

```ts
import { server } from 'stackpress/http';
import plugin from 'stackpress/plugin';

const app = server();
await plugin(app);
```

## Usage Notes

- Reach for this plugin when you want the full framework stack quickly.
- Reach for app-local plugins or explicit plugin lists when you want tighter control over which framework layers are active.

## Related

 - [Server](./server.md)
 - [Config Reference](./config-reference.md)
 - [Plugins](../guides/100/110-plugins.md)
