# 510 Project Anatomy

Learn the main files and folders that make up the baseline Stackpress scaffold. This lesson uses the repository `stackpress-app-scaffold` skill as the source, because that skill defines the portable app shape new projects start from.

**Previously:** The previous course, `Project Structure`, explained why folder guidance belongs after the reader has seen routes, views, data, generation, and deployment. Here, the focus shifts from the reason for structure to the actual scaffolded files.

## 510.1. Why Anatomy Matters

Project anatomy is about ownership. If you know which folder owns a concern, you can make changes in the right place and avoid editing files that will be regenerated or overwritten by a later command.

This is especially important in Stackpress because a project mixes several kinds of files. Some files are handwritten source, some configure the runtime, some feed generation, and some are output or build state that should be inspected before being edited.

## 510.2. The Scaffolded Shape

The scaffold skill copies a fixed scaffold into an empty folder. That scaffold is the clearest source for the first recommended project layout because it is the shape Stackpress expects a new app to begin with.

```txt
my-app/
  .env.sample
  .gitignore
  package.json
  schema.idea
  tsconfig.json
  uno.config.ts
  config/
    common.ts
    develop.ts
    build.ts
    client.ts
  plugins/
    app/
      plugin.ts
    store/
      connect.ts
      plugin.ts
      populate.ts
```

This tree shows the project before generated output is the main focus. The scaffold source stores `.gitignore` as `gitignore` and writes it as `.gitignore` in the created app, because some package runners omit nested `.gitignore` files from packed installs.

## 510.3. Source Files

The top-level files give the project its first identity and tool setup. `package.json` names the package, lists Stackpress plugins, and defines commands such as `dev`, `generate`, `push`, `populate`, and `build`.

```json
{
  "plugins": [
    "./plugins/app/plugin",
    "./plugins/store/plugin",
    "stackpress"
  ],
  "scripts": {
    "dev": "dotenv -e .env -- stackpress serve --b config/develop -v",
    "generate": "stackpress generate --b config/develop -v",
    "build": "stackpress build --b config/build -v"
  }
}
```

This example shows how the project declares both local plugins and the built-in Stackpress plugin. It also shows that commands point at config files with `--b`, so the command does not have to guess which runtime settings to use.

The `schema.idea` file is the starting generation input. In the scaffold, it begins with a single `use` line that imports the built-in Stackpress idea definitions.

```idea
use "stackpress/stackpress.idea"
```

This small example matters because it establishes the idea file as source, not generated output. Later modeling lessons can add domain declarations to this file, and generation can turn those declarations into project output.

## 510.4. Config Files

The `config/` folder separates shared settings from environment-specific bootstraps. `common.ts` exports reusable pieces such as paths, seeds, brand values, client output settings, database settings, server settings, session settings, and view settings.

The environment files then assemble those common pieces into a runnable app. For example, `develop.ts`, `build.ts`, and `client.ts` each export a `config` object and a default `bootstrap()` function that creates an HTTP server, sets config, bootstraps plugins, resolves config, resolves listen events, and resolves routes.

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

This example is the project startup path in miniature. The config file does not only hold values; it also describes how the app is assembled before requests are handled.

## 510.5. Plugin Files

The `plugins/` folder holds handwritten app behavior. The scaffold starts with an `app` plugin for page behavior and a `store` plugin for database setup and populate behavior.

```ts
export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    server.import.get('/', () => import('./pages/home.js'));
    server.view.get('/', '@/plugins/app/views/home');
  });
}
```

This example shows why plugin files are runtime source. The app plugin waits for the route lifecycle event, then registers the home page import and the home view.

The store plugin has a different job because database setup belongs to a different concern than page routing. Read the next example as the database side of the same plugin ownership idea.

```ts
export default function plugin(server: Server) {
  server.on('config', async _ => {
    server.register('database', await connect());
  });
  server.on('listen', async _ => {
    server.on('populate', () => import('./populate.js'));
  });
}
```

This example keeps database setup out of the page plugin. During config, it registers the database resource, and during listen setup, it registers a populate handler.

## 510.6. Build And Output Areas

The scaffold config points several outputs at predictable locations. `common.ts` defines `.build` as the build folder, `public` as the asset folder, and client output settings under `client`.

In build config, view assets are written under `public/assets`, client scripts under `public/client`, and server-side page output under `.build/views`. These paths are output surfaces, so they should be inspected to understand what was built before they are treated as places to author product behavior.

## 510.7. How To Use The Map

When you want to change app behavior, start with the source that owns the behavior. Routes and views usually begin in plugins, database connection behavior begins in the store plugin and config, generated model behavior begins with `schema.idea`, and command behavior begins with `package.json` plus the selected config file.

When output looks wrong, use the output as evidence. Then trace it back to the source file that produced it, change the source, and rerun the command that refreshes the output.

**Learning checkpoint:** Before moving on, make sure you can name the baseline scaffold files and explain what each area owns. You should also know why `config/`, `plugins/`, `schema.idea`, `.build`, and `public` should not be treated as interchangeable folders.

**Next course:** Continue with `Source Of Truth`. That course turns the folder map into ownership rules for source files, generated output, config, plugins, and public assets.
