# 112 Local Plugins

A local plugin is app-owned code that tells Stackpress what behavior to attach.
It is the first runtime primitive that feels specific to your project, because
the plugin can register the routes, events, and services your app needs.

**Previously:** `Composition` introduced the split between framework behavior
and local app behavior. Here, the focus shifts to writing a small local plugin
and understanding what that plugin owns.

## 112.1. Goal

The goal is to move from "the app has a route" to "the app has a plugin that
owns a route." That difference matters because the plugin becomes the place a
developer checks when they want to know how one concern is wired. The route
still works the same way, but the ownership becomes easier to see.

Think of `plugin.ts` as an instruction sheet. Stackpress loads the sheet during
startup, then the plugin tells the server which routes, events, or services
belong to that part of the app.

## 112.2. Create A Local Plugin

Start with one route so the shape is easy to inspect. This example uses the
same basic pattern as the Ingest plugin guide: export a function, receive the
server, and register behavior inside that function.

```ts
import type { HttpServer } from 'stackpress/http';

export default function appPlugin(server: HttpServer) {
  server.get('/health', ({ res }) => {
    res.json({ ok: true });
  });
}
```

The exported function is the plugin. `server.get('/health', ...)` registers a
`GET /health` route, and `res.json({ ok: true })` sends a structured JSON
answer that is easy to verify from a browser, terminal, or test.

## 112.3. Register It

After the plugin exists, the app needs to load it. In the Ingest guide, the
plugin entry is added to `package.json` so bootstrap can discover it.

```json
{
  "plugins": [
    "./src/plugins/app"
  ]
}
```

This example separates two jobs. The plugin file defines behavior, and the
plugin list tells the app which behavior should be loaded during startup.

## 112.4. Add A Route Or Event

Once the first plugin works, add behavior only when it belongs to the same
responsibility. A route that belongs to the same app surface can live in the
same plugin, while an unrelated integration should usually become a different
plugin later.

```ts
export default function appPlugin(server: HttpServer) {
  server.get('/health', ({ res }) => {
    res.json({ ok: true });
  });

  server.on('request', ({ req }) => {
    console.log(req.method, req.url.pathname);
  });
}
```

The second registration listens for each request and logs the method and path.
That demonstrates the plugin boundary: the same plugin can own both route
behavior and event behavior when they support the same concern.

## 112.5. Run And Check

Start the server and request `GET /health`. A successful check should return a
JSON response with `ok: true`, and the request listener should log the request
method and path if that listener is present.

This check proves two things. The route proves the plugin registered behavior,
and the log proves the plugin can also attach event listeners during startup.

## 112.6. What The Plugin Owns

A local plugin owns registration for a focused part of the app. It should not
become a dumping ground for every route, every store, and every integration.

One plugin file is fine while the app is small. As a project grows, split by
responsibility so a developer can predict where behavior belongs before opening
every file.

**Learning checkpoint:** Before moving on, make sure you can point to the
exported plugin function, the route registration, and the plugin list entry.
Those three surfaces explain how local behavior becomes part of the running
app.

**Next course:** Continue with `Pages`. Config has moved to `520 Config`, so
the course path now stays focused on runtime behavior before project structure.
