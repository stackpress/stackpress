# 122 Local Plugins

Organize app-specific behavior into local plugin files so routes, events, stores, and integrations stay easy to find. This lesson introduces `plugin.ts` as a first-class app primitive instead of treating it like a random startup file.

**Previously:** The previous lesson, `121 Composition`, gave you the setup this page builds on. Here, the focus shifts to `Local Plugins` so you can place the next Stackpress surface in the course path.

## 122.1. Goal

A plugin file is a small module that teaches Stackpress how to add behavior to the app. Instead of hiding every route, event, or integration inside the framework, Stackpress lets your app provide a plugin function that receives the server and registers the behavior it owns.

For a first lesson, think of `plugin.ts` as the app's instruction sheet. Stackpress loads it during startup, then the plugin tells the server what routes or hooks should exist.

## 122.2. Create A Local Plugin

Create a local app plugin. This example starts with one route so the shape is easy to see before the lesson adds more folders. Put the file in the app's plugin folder so the path matches the behavior it owns:

```ts
import type { HttpServer } from 'stackpress/http';

export default function plugin(server: HttpServer) {
  server.on('route', async () => {
    server.get('/health', ({ res }) => {
      res.json({ ok: true });
    });
  });
}
```

This plugin waits for the route phase, then registers `GET /health`. The route
answers with JSON, which makes the endpoint easy to check from a browser,
terminal, or another program.

Save it as:

```text
plugins/app/plugin.ts
```

Register it:

```json
{
  "plugins": [
    "./plugins/app/plugin",
    "stackpress"
  ]
}
```

The code above shows two separate jobs. The plugin file defines behavior, and the plugin list tells Stackpress to load that behavior when the app starts.

## 122.3. Register It

You moved app behavior into a named plugin folder. The route still works the same way, but the file path now explains the role of the code.

The handler receives one route context object. Use destructuring such as
`({ req, res, ctx })` to read only the objects the route needs.

This is where the earlier `plugin.ts` idea starts to matter. The plugin owns the registration, while each handler owns the request-and-response work for one route.

## 122.4. Add A Route Or Event

After the first route works, the next question is where additional behavior should live. The subsections below show how local plugins stay readable by grouping related routes, lifecycle hooks, and supporting files.

### 122.4.1. One Plugin, One Responsibility

A local plugin should usually own one broad responsibility:

 - `plugins/app` for routes, pages, and app events
 - `plugins/store` for database or store wiring
 - `plugins/<integration>` for external services

One `plugin.ts` is fine for a first route, but it becomes crowded once the app has pages, events, stores, and integrations. Splitting by responsibility gives each concern a labeled room, so a new developer can predict where behavior belongs.

### 122.4.2. Lifecycle Hooks

Local plugins often register behavior through lifecycle events such as `route` and `listen`. This keeps registration grouped by the phase when Stackpress needs it.

### 122.4.3. Folder Shape

A larger plugin folder can hold:

 - `plugin.ts`
 - `pages/*`
 - `events/*`
 - `views/*`
 - local helpers

## 122.5. Run And Check

Checking a local plugin is partly about whether the route works and partly about whether the folder still explains itself. The next examples show how to keep the registration file readable as the plugin grows.

### 122.5.1. Move A Route Into A Page Module

Keep `plugin.ts` responsible for registration:

```ts
server.import.get('/', () => import('./pages/home.js'));
```

This keeps `plugin.ts` focused on wiring. The page module owns the actual
handler, so the plugin remains readable as the feature grows.

Then put the handler in `pages/home.ts`. The route registration stays short, while the page module becomes the place where the actual page behavior can grow.

### 122.5.2. Add An Integration Plugin

Create a separate folder when a feature talks to an outside service:

```text
plugins/email/plugin.ts
plugins/payments/plugin.ts
plugins/webhooks/plugin.ts
```

These folders are examples of plugin ownership boundaries. Each one represents a feature area that can have its own routes, events, helpers, and configuration without crowding the first app plugin.

### 122.5.3. Keep Generated Code Separate

Do not place generated output inside local plugin folders unless a generator is intentionally writing there. Most generated output should remain disposable and inspectable.

## 122.6. What The Plugin Owns

You have seen the basic shape of local plugins: put related behavior in a
predictable folder, register it once, and let the plugin own its own routes or
events. That shape gives the next developer a map before they open every file.

Read `123 Plugin Config` to pass settings into local plugin behavior. Use [Plugins And Customization](/guides/plugins-and-customization) for the broader workflow. Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `123 Plugin Config`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
