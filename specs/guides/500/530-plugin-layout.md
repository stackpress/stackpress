# 530 Plugin Layout

Plugin layout is how a Stackpress app keeps local behavior from becoming one
large file. Routes, page handlers, views, database wiring, and integrations all
need a home. A good plugin folder gives each responsibility a place where a
junior developer can look first.

The idea is similar to keeping tools on labeled shelves. The framework plugins
bring the Stackpress tools, while your local plugins hold the behavior that
belongs to this app. When those shelves are clear, debugging starts with the
right folder instead of a full-project search.

**Previously:** `Config Splitting` showed how each command loads a focused
bootstrap file. This lesson shows where the local plugin files live after that
bootstrap loads the app.

## 530.1. When To Create A Plugin

Create a local plugin when a group of behavior has a responsibility that is
larger than one handler but smaller than the whole app. In a scaffolded app,
`plugins/app` owns local page routing and response behavior, while
`plugins/store` owns database connection registration.

Do not create a plugin only because you added one file. A plugin folder earns
its place when it gives related handlers, helpers, views, events, or connection
code a predictable boundary.

## 530.2. Folder Layout

A scaffolded app uses two local plugin folders. The app plugin holds page
handlers, React views, and app helpers. The store plugin holds database setup.

```text
plugins/
  app/
    helpers.ts
    plugin.ts
    pages/
      article.ts
      error.ts
      home.ts
    views/
      article.tsx
      error.tsx
      home.tsx
  store/
    connect.ts
    plugin.ts
```

This example shows the first recommended split. Page routes and page rendering
stay near each other under `plugins/app`, while store registration stays under
`plugins/store` so database bootstrapping does not leak into page handlers.

The local plugins are registered in `package.json`:

```json
{
  "plugins": [
    "./plugins/app/plugin",
    "./plugins/store/plugin",
    "stackpress",
    "stackpress-ai"
  ]
}
```

This example tells Stackpress which plugin entrypoints to load. The two local
plugins load app-specific behavior, while `stackpress` loads the framework
layer and `stackpress-ai` loads the AI-facing integration layer used by the
scaffolded app.

## 530.3. Register Entrypoints

Each local plugin has a `plugin.ts` entrypoint because the plugin list needs a
single file to load. That entrypoint should register lifecycle behavior and
delegate detailed work to nearby files.

The app plugin registers route-time behavior:

```ts
server.on('route', async _ => {
  server.import.get('/', () => import('./pages/home.js'));
  server.view.get('/', '@/plugins/app/views/home');

  server.import.get('/articles/:slug', () => import('./pages/article.js'));
  server.view.get('/articles/:slug', '@/plugins/app/views/article');
});
```

This example separates the page handler from the view. `server.import.get()`
loads the route handler module, and `server.view.get()` points the view layer
at the React page module that should render the response.

The store plugin registers config-time behavior:

```ts
server.on('config', async _ => {
  const connection = await connect();
  connection.before = async request => {
    console.log('Executing query:', request);
  };
  server.register('database', connection);
});
```

This example keeps database registration in the `config` lifecycle because the
database needs to be available before generated store and action behavior use
it. The `connect()` helper stays in `plugins/store/connect.ts`, so the plugin
entrypoint remains readable.

## 530.4. Verify Loading

Verify plugin loading by checking both registration and behavior. Registration
means the plugin appears in `package.json`. Behavior means the thing it
registers actually works when the correct lifecycle runs.

### 530.4.1. App Plugin

For the app plugin, start with the route registration, then follow the route
into its page handler. The scaffolded homepage handler sets request data, emits an
article search event, and prepares view props.

```ts
export default action(async function HomePage({ req, res, ctx }) {
  req.data.set('status', 'PUBLISHED');
  await ctx.emit('article-search', req, res);
  setViewProps(req, res, ctx);
});
```

This example proves the app plugin is more than a route list. The page handler
sets the filter for published articles, asks the generated article search event
to load data, and prepares response/view data before the React page renders.

### 530.4.2. Store Plugin

For the store plugin, follow the entrypoint into `connect.ts`. The scaffolded
app uses PGlite and stores local database files under `.build/database`
unless `DATABASE_URL` overrides the path.

```ts
const url = process.env.DATABASE_URL || './.build/database';

export default async function connect() {
  return pglite(async () => {
    const file = path.resolve(process.cwd(), url);
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    return new PGlite(file);
  });
}
```

This example shows why store wiring belongs in its own plugin. It touches the
filesystem, environment variables, a database engine, and Stackpress' PGlite
connection helper, which would make a page handler harder to read.

### 530.4.3. Feature Plugin

A feature plugin is useful when one feature grows enough to own its own routes,
views, events, and helpers. A scaffolded app does not currently need a
separate `plugins/article` folder because generated article behavior and the
small handwritten article page are already covered by existing boundaries.

```text
plugins/article/
  plugin.ts
  pages/
  views/
  helpers.ts
```

This example is a layout pattern, not a confirmed scaffold folder. Use it
when a real feature becomes too large for `plugins/app`, and keep the same rule:
the plugin entrypoint registers behavior while nearby files hold the details.

## 530.5. Common Failures

Most plugin-layout mistakes come from putting correct code in the wrong place
or forgetting the entrypoint. The code may compile, but Stackpress will not use
it unless the plugin is registered and the right lifecycle registers the
behavior.

### 530.5.1. Missing Package Registration

Creating a folder is not enough. If the plugin entrypoint is not listed in
`package.json`, Stackpress does not know to load it during bootstrap.

```json
{
  "plugins": [
    "./plugins/app/plugin",
    "stackpress"
  ]
}
```

This example would load the app plugin and framework plugin, but it would skip
the store plugin. If database behavior is missing, compare the plugin list to
the folders you expect the app to load.

### 530.5.2. Route Code In The Store Plugin

The store plugin should register database resources, not page routes. Mixing
route code into the store plugin makes the app harder to debug because a route
problem now hides inside a database setup folder.

```ts
server.on('config', async _ => {
  server.import.get('/', () => import('../app/pages/home.js'));
});
```

This example puts a page route in the wrong lifecycle and the wrong plugin. A
route belongs in the app plugin's `route` lifecycle, where other developers
will look for local page registration.

### 530.5.3. View Path Drift

Route handlers and view modules often move together. If you move a view file
but do not update the route registration, the route can still load data while
the view path points at the old module.

```ts
server.view.get('/articles/:slug', '@/plugins/app/views/article');
```

This example depends on the view file staying at
`plugins/app/views/article.tsx`. If the file moves into a feature plugin, the
view registration should move or change with it so the route and view stay
connected.

## 530.6. Next Step

Plugin layout gives local behavior a predictable home. The important habit is
to ask what kind of behavior you are adding before choosing a folder: route and
view behavior belongs with the app plugin, database registration belongs with
the store plugin, and larger features can earn their own plugin boundary.

Read `540 Public Assets` next. That lesson covers the static files that do not
belong in a plugin entrypoint, such as images, stylesheets, favicons, and
browser-served assets.

**Learning checkpoint:** You should be able to explain why a scaffolded app
has both `plugins/app` and `plugins/store`. You should also be able to trace a
homepage request from `plugins/app/plugin.ts` into `pages/home.ts` and then to
`views/home.tsx`.
