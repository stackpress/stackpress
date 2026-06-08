# 520 Config

Learn how configuration acts as the app bootstrap and orchestration surface. Stackpress config is where plugins, runtime behavior, build behavior, generated client output, database behavior, view behavior, and environment choices become visible before the app starts.

**Previously:** The previous course, `Generated Output`, explained the source-to-output boundary. Config belongs here because it decides which source, runtime, and output settings are active for a given command.

## 520.1. Why Config Matters

Configuration can look like a list of options, but in a Stackpress app it is closer to a launch plan. It tells the framework which plugins to load, which paths to use, which runtime mode is active, and which environment-specific choices should apply.

That is why config moved out of the early plugin lesson and into project structure. The reader has already seen plugins, routes, views, data, and generated output, so config now has real behavior to organize.

## 520.2. The Basic Import Pattern

At its smallest, config is a plain object passed into a server instance. The Stackpress config reference shows this pattern with an HTTP server and a typed `Config` object.

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

This example does one important thing: it makes runtime settings explicit before the app handles requests. The server does not have to guess that it is in development mode because config sets that value directly.

## 520.3. The Scaffolded Bootstrap

The scaffold config files go one step further than the tiny example. They export both a `config` object and a `bootstrap()` function that creates the server, sets config, loads plugins, and resolves lifecycle phases.

```ts
export default async function bootstrap() {
  const server = http();
  server.config.set(config);
  await server.bootstrap();
  await server.resolve('config');
  await server.resolve('listen');
  await server.resolve('route');
  return server;
}
```

This example shows config as orchestration, not only storage. The `config` phase gives plugins a chance to register resources, the `listen` phase gives them a chance to prepare runtime behavior, and the `route` phase gives them a chance to register routes.

## 520.4. Top-Level Config Areas

The public Stackpress config type includes several top-level areas. Not every app needs every area at the same time, so treat this list as a map of possible surfaces instead of a checklist to fill out immediately.

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

Most apps start by caring about `server`, then add `client`, `database`, and `view` as the project grows. Auth, session, email, language, API, and admin settings become more important once the app adopts those built-in features.

## 520.5. Server Config

Use `server` config to control runtime behavior. The common keys shown in the reference include `mode`, and the scaffold also keeps `port`, `cwd`, and build path values close to the server setup.

```ts
server: {
  mode: 'development'
}
```

This example is small, but it has a large effect. A development-mode app can make different runtime and tooling choices than a production-oriented build, so mode belongs in the bootstrap config instead of being hidden in route code.

## 520.6. Client Config

Use `client` config to control generated client output. The config reference names keys such as `lang`, `module`, `package`, and `build`.

```ts
client: {
  lang: 'ts',
  module: 'client-source',
  package: 'client-source',
  build: path.join(process.cwd(), 'client-source')
}
```

This example describes generated client code as an output surface. `lang` chooses JavaScript or TypeScript, while `module`, `package`, and `build` tell Stackpress how the generated client code should be named, resolved, and written.

## 520.7. Database Config

Use `database` config for migration output, schema defaults, and populate behavior. In the scaffold, database config includes a seed, a migrations folder, relation update/delete defaults, and populate entries that emit creation events.

```ts
database: {
  migrations: path.join(process.cwd(), '.build/migrations'),
  schema: {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT'
  },
  populate: [
    {
      event: 'profile-create',
      data: {
        id: 'developer',
        name: 'Developer',
        type: 'person',
        roles: [ 'ADMIN' ]
      }
    }
  ]
}
```

This example connects config to real command behavior. Migration paths affect generated migration output, schema defaults affect generated database relationships, and populate entries give `stackpress populate` data to insert through events.

## 520.8. View And Brand Config

Use `view` config to control rendering behavior and shared page props. Use `brand` config for shared brand-facing values such as name, logo, icon, and favicon.

```ts
view: {
  base: '/',
  props: {
    appName: 'Example'
  },
  noview: 'json'
}
```

This example shows that view config is not just visual styling. `base` helps the view layer understand the app path, `props` can expose shared values, and `noview` defines the request flag used to skip view rendering and show raw data.

Brand config is a related shared-data surface. It gives layouts and document rendering a predictable place to find the app name and shared asset paths.

```ts
brand: {
  name: 'Example App',
  logo: '/logo.png',
  icon: '/icon.png',
  favicon: '/favicon.ico'
}
```

This example keeps repeated strings and asset paths out of individual route handlers. When a layout needs the app name, logo, icon, or favicon, it can read those values from config instead of hardcoding them again.

## 520.9. One File Or Split Files

The first config decision is whether one file is enough. Small projects often benefit from a single, obvious config because it keeps the app easy to inspect.

The scaffold uses split files because it needs different development, build, and client behaviors. `develop.ts` uses development mode and live view tooling, `build.ts` writes build assets under `public` and `.build`, and `client.ts` changes generated client output to `client-source`.

## 520.10. How To Inspect Config Problems

When the app loads the wrong behavior, check config before changing route or view code. A missing plugin, wrong path, mismatched environment file, or client/build split can make correct source code look broken.

Use verbose logs and generated output as evidence. Config is successful when Stackpress loads the expected plugins and the app behavior matches the selected environment.

**Learning checkpoint:** Before moving on, make sure you can explain config as the surface that organizes plugin, runtime, client, database, view, and environment behavior. You should also know why one config file is often the easiest default, while split config files are useful when they make different command paths clearer.

**Next course:** Continue with `Config Splitting`. That course explains when one config file is enough and when command-specific config files make behavior easier to inspect.
