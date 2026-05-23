# Config Reference

This page documents the app-facing Stackpress config surface. Use it when you are shaping `config.ts` or another bootstrap module and need to know what each config area is for.

## Import Pattern

Stackpress config is usually a plain object passed into a server instance:

```ts
import { server as http } from 'stackpress/http';
import type { Config } from 'stackpress/types';

const config: Config = {
  server: {
    mode: 'development'
  }
};

const app = http();
app.config.set(config);
```

## Top-Level Config Areas

The public Stackpress config type includes these top-level areas:

- `brand`
- `terminal`
- `server`
- `client`
- `cookie`
- `admin`
- `api`
- `email`
- `language`
- `database`
- `view`
- `auth`
- `session`

Not every app needs every area. Most apps start with `server`, then add `client`, `database`, and `view` as the project grows.

## `server`

Use `server` to control server runtime behavior.

### Common Keys

#### `mode`

- Type: string
- Common values: `'development'`, `'production'`
- Use it to tell Stackpress what runtime mode the app is booting under.
- This value affects how the runtime and supporting tooling behave during development versus production-oriented flows.

```ts
server: {
  mode: 'development'
}
```

### What It Affects

- server bootstrap behavior
- environment-sensitive runtime choices
- command flows such as `develop` and build-oriented scripts

## `client`

Use `client` to control generated client output.

### Common Keys

#### `lang`

- Type: `'js' | 'ts'`
- Use it to choose whether generated client code is emitted as JavaScript or TypeScript.

#### `module`

- Type: string
- Use it to choose the module name that Stackpress uses when it imports generated client code into memory.

#### `package`

- Type: string
- Use it to choose the package name used for generated client output in your app environment.

#### `build`

- Type: string path
- Use it to choose where generated client code is written.

```ts
import path from 'node:path';

client: {
  lang: 'ts',
  module: 'client-source',
  package: 'client-source',
  build: path.join(process.cwd(), 'client-source')
}
```

### What It Affects

- `stackpress generate`
- readable client inspection workflows
- how generated client code is resolved and imported

## `database`

Use `database` to control schema migrations, schema defaults, and populate behavior.

### Common Keys

#### `migrations`

- Type: string path
- Use it to choose where generated migrations are written.

#### `schema`

- Type: object
- Use it to define database-wide schema defaults such as relation update/delete behavior.

Common nested keys:
- `onDelete`
- `onUpdate`

#### `populate`

- Type: array
- Use it to define rows or events that should be inserted during `populate`.
- Each entry typically includes:
  - `event`
  - `data`

```ts
database: {
  migrations: path.join(process.cwd(), '.build/migrations'),
  schema: {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT'
  },
  populate: [
    {
      event: 'article-create',
      data: {
        title: 'Hello World',
        slug: 'hello-world'
      }
    }
  ]
}
```

### What It Affects

- `stackpress push`
- `stackpress populate`
- `stackpress query`
- generated migration output
- default schema behavior for generated SQL

## `view`

Use `view` to control rendering behavior and shared page props.

### Common Keys

#### `base`

- Type: string
- Use it to define the base URL path exposed to the view layer.

#### `props`

- Type: object
- Use it to attach shared view props that should be available across pages.

#### `noview`

- Type: string
- Use it to define the request-data flag that tells Stackpress not to render a view for a request.

```ts
view: {
  base: '/',
  props: {
    appName: 'Example'
  },
  noview: 'json'
}
```

### What It Affects

- page rendering behavior
- `setViewProps(...)`
- values exposed under `res.data.view`

## `brand`

Use `brand` to define shared brand-facing values injected into the view layer.

### Common Keys

- `name`
- `logo`
- `icon`
- `favicon`

```ts
brand: {
  name: 'Example App',
  logo: '/logo.png',
  icon: '/icon.png',
  favicon: '/favicon.ico'
}
```

### What It Affects

- values exposed under `res.data.brand`
- shared layout and document rendering behavior

## `language`

Use `language` to define locale and translation behavior.

### Common Keys

- `key`
- `locale`
- `languages`

```ts
language: {
  key: 'locale',
  locale: 'en_US',
  languages: {
    en_US: 'English'
  }
}
```

### What It Affects

- values exposed under `res.data.language`
- translation and language helpers in the view layer

## `session` And `auth`

Use these sections when your app introduces authentication or session-aware behavior.

- `session` controls session runtime behavior
- `auth` controls auth-facing settings such as signin/signup flows

These areas usually become relevant only after the app has adopted the session/auth layer.

## `api`

Use `api` when your app exposes OAuth, REST, or webhook configuration through the Stackpress API layer.

This section usually controls:

- endpoint registration
- scope definitions
- OAuth/application behavior
- webhook configuration

## `admin`

Use `admin` when your app exposes generated admin behavior.

This section usually controls:

- admin routes
- admin layout or UI behavior
- generated admin integration points

## `email`

Use `email` when your app needs framework-level email delivery settings.

This section usually controls:

- transport settings
- sender defaults
- email plugin integration

## `cookie`

Use `cookie` to define shared cookie behavior such as cookie options passed into session or response flows.

## `terminal`

Use `terminal` when your app exposes or customizes terminal behavior directly through the Stackpress terminal layer.

## Related

 - [CLI Reference](./cli-reference.md)
 - [View](./view.md)
 - [Types](./types.md)
