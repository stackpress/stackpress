# Plugin Scaffold Reference

This reference contains the fuller Stackpress plugin scaffold details that
support the `stackpress-plugin-scaffold` skill.

## Shape

 - All plugins should go into the `plugins/` folder in the root of the
   project.
 - If a `plugins/` folder is not found, ask the user where to create the
   plugin. Plugins can technically live elsewhere, but `plugins/` should be the
   default assumption.
 - When creating a plugin, follow this shape:
   - `components/` is for reusable React components and layouts
   - `events/` is for server event handlers
   - `pages/` is for server route handlers
   - `tests/` is for tests owned by this plugin
   - `transform/` is for files used to generate code to the client library
     based on models defined in the project's main idea file, usually
     `schema.idea` in the project root
   - `views/` is for React pages served to the browser
   - `client.ts` is for browser-safe exports of reusable elements that other
     plugins may consume
   - `index.ts` is for exporting reusable elements that other plugins may
     consume
   - `plugin.ts` is the entry file which Stackpress will consume
   - `types.ts` is where TypeScript typings should go
 - `plugin.ts` is the only required file in a plugin folder.
 - Be careful when importing files into a view or component. Anything used by
   browser-facing code should stay browser safe.

Example shape:

```text
plugins/
  my-plugin/
    components/
    events/
    pages/
    tests/
    transform/
    views/
    client.ts
    index.ts
    plugin.ts
    types.ts
```

## Plugin File

Every plugin starts with the same entry shape.

```ts
import type { Server } from 'stackpress/server';

export default function plugin(server: Server) {}
```

The plugin entry function can optionally contribute to four Stackpress
lifecycle events:

```ts
import type { Server } from 'stackpress/server';

export default function plugin(server: Server) {
  server.on('config', () => {});
  server.on('listen', () => {});
  server.on('route', () => {});
  server.on('idea', () => {});
}
```

Lifecycle notes:

 - `config`
   - Happens after all plugins are registered.
   - Use it to read config and register shared plugin services.
   - Common examples:
     - `server.config.path<string>('some.config.path', 'defaultValue')`
     - `server.register('plugin_name', { /* shared object */ })`
 - `listen`
   - Use it to add event listeners.
 - `route`
   - Use it to add route handlers.
 - `idea`
   - Use it when the plugin contributes to code generation.

## Config Lifecycle

Use `config` when the plugin needs to read project configuration or expose
shared runtime services to other parts of the app.

Common responsibilities:

 - read config values
 - register adapters, clients, or connections
 - register shared plugin services

Example:

```ts
import type { Server } from 'stackpress/server';

export default function plugin(server: Server) {
  server.on('config', async _ => {
    const enabled = server.config.path<boolean>('myPlugin.enabled', false);
    if (!enabled) {
      return;
    }

    server.register('my_plugin', {
      enabled
    });
  });
}
```

## Listen Lifecycle

Use `listen` when the plugin needs to attach event listeners after startup.

Common responsibilities:

 - register event handlers
 - register response or error listeners
 - wire generated client listeners into runtime behavior

Example:

```ts
import type { Server } from 'stackpress/server';

export default function plugin(server: Server) {
  server.on('listen', async _ => {
    server.on('my-event', async ({ req, res }) => {
      res.results({ ok: true });
    });
  });
}
```

## Route Lifecycle

Use `route` when the plugin needs to register routes, page handlers, or view
bindings.

Common responsibilities:

 - add route imports
 - attach views to routes
 - register browser-facing pages

Example:

```ts
import type { Server } from 'stackpress/server';

export default function plugin(server: Server) {
  server.on('route', async _ => {
    server.import.get('/hello', () => import('./pages/hello.js'));
    server.view.get('/hello', '@/plugins/my-plugin/views/hello');
  });
}
```

If the route is already being registered and the task moves into authoring the
handwritten page module under `views/`, use `stackpress-plugin-views`.

## Idea Lifecycle

Use `idea` when the plugin needs to participate in generation.

In most cases, an `idea` handler looks like this:

```ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Transformer } from '@stackpress/idea';
import type { CLIProps } from 'stackpress/server';
import type { Server } from 'stackpress/server';

export default function plugin(ctx: Server) {
  ctx.on('idea', async ({ req }) => {
    //get the transformer from the request
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    const schema = await transformer.schema();
    //if no plugin object exists, create one
    if (!schema.plugin) {
      schema.plugin = {};
    }
    const dirname = typeof __dirname === 'undefined'
      //@ts-ignore - The import.meta only allowed in ESM
      ? path.dirname(fileURLToPath(import.meta.url))
      : __dirname;
    //add this plugin generator to the schema
    //so it can be part of the transformation
    schema.plugin[`${dirname}/transform`] = {};
  });
}
```

Notes:

 - The `//@ts-ignore` comment is intentional.
 - `${dirname}/transform` means Stackpress will look for the generator entry at
   `[plugin]/transform/index.ts`.

## Transform Folder

The `transform/` folder is only needed when the plugin contributes to
generation.

Default expectation:

```text
plugins/
  my-plugin/
    transform/
      index.ts
```

Use this folder when the plugin needs to:

 - inspect schema models
 - generate code based on defined models in a project
 - add assets and files to the generated client library
 - emit generated files into the client library
 - patch generated package exports
 - participate in `stackpress generate`

Do not move generation logic into runtime listeners if it belongs in the normal
transform pipeline.

## Browser-Safe Exports

Be deliberate about what is exported from `client.ts`, `components/`, and
`views/`.

Rules:

 - browser-facing code must stay browser safe
 - do not import server-only modules into components or views
 - do not leak Node-only dependencies into `client.ts`
 - keep `client.ts` focused on reusable browser-safe exports

Good candidates for `client.ts`:

 - reusable UI helpers
 - browser-safe components
 - generated client-facing registries
 - shared browser-safe types or constants

When the task is specifically about implementing a Stackpress page under
`views/` with `Head`, layouts, `setViewProps`, or page props, hand off to
`stackpress-plugin-views`.

## Index File

Use `index.ts` to re-export reusable elements from the plugin.

Typical uses:

 - re-export browser-safe modules
 - re-export shared types
 - expose plugin helpers intended for other plugins

Keep `index.ts` intentional. Do not export everything by default if some files
should stay private to the plugin.

## Types File

Use `types.ts` to centralize TypeScript types for the plugin.

This is especially useful when:

 - config types are shared across files
 - service contracts are reused
 - event payloads are reused
 - browser-safe and server-safe modules need a shared type surface

Keeping types in one place reduces circular imports and keeps the rest of the
plugin files smaller.

## Setup Order

Use this order when scaffolding a new plugin:

 1. confirm the project root and locate `plugins/`
 2. create `plugins/<plugin-name>/plugin.ts`
 3. create only the folders and files needed for the plugin role
 4. wire the appropriate lifecycle events in `plugin.ts`
 5. add `transform/` only if generation is required
 6. update config if the plugin needs config-driven behavior
 7. register the plugin path in `package.json`
 8. update related `package.json` scripts last

Do not start by editing `package.json`.

If the plugin is not registered in the app's `plugins` array, Stackpress will
not load it no matter how complete the folder itself is.

Stackpress uses a custom top-level `plugins` array in `package.json`. This is
not a standard npm key.

Example:

```json
{
  "plugins": [
    "./plugins/app/plugin",
    "./plugins/store/plugin",
    "stackpress"
  ]
}
```

To register a local plugin:

 - add the plugin entry module to the top-level `plugins` array
 - use a relative module path
 - omit the file extension

For a plugin at `plugins/my-plugin/plugin.ts`, the `package.json` entry should
be:

```json
{
  "plugins": [
    "./plugins/my-plugin/plugin"
  ]
}
```

Installed package plugins use package names instead of relative paths.

## Default Questions To Resolve

Before scaffolding, answer these:

 - What will this plugin do?
 - What other plugins does this plugin depend on?
 - Does it need browser-safe exports?
 - Does it need generated client output?
 - Does it need config-driven behavior?
 - Does it need routes, event handlers, or both?
 - Does it need plugin-local tests under `plugins/<plugin-name>/tests/`?

If the answer to one of these is unclear, clarify it before creating more than
`plugin.ts`.

## Common Mistakes

Avoid these mistakes:

 - assuming a `plugins/` directory exists without checking
 - importing server-only code into browser-facing files
 - putting generation behavior in runtime hooks instead of `idea`
 - creating all folders by default even when the plugin does not need them
 - editing `package.json` before the plugin files exist
 - forgetting to register the plugin path in `package.json`
 - forgetting that `plugin.ts` is the only required file
 - putting plugin tests in a separate root-level `tests/` folder instead of
   the owning plugin's `tests/` folder

## Minimal Plugin

This is the smallest valid plugin:

```text
plugins/
  my-plugin/
    plugin.ts
```

```ts
import type { Server } from 'stackpress/server';

export default function plugin(server: Server) {}
```

Everything else is optional and should be added only when the plugin actually
needs it.
