# 410 Generate And Build

Learn how Stackpress and Ingest expose application structure to build tools. This lesson focuses on server routes, lazy imports, entry files, views, and event listeners because those are the surfaces a bundler or deployment script needs to understand before it can produce useful output.

**Previously:** The previous course, `Build And Deploy`, introduced the idea that deployment is a runtime-shape problem. Here, the focus moves to the metadata that lets a project describe that shape without asking build tools to reverse-engineer every source file.

## 410.1. Why Build Tools Need A Map

A build tool is good at compiling files, but an application is more than a folder of files. It has routes, handlers, view entries, lazy imports, event listeners, and runtime boundaries that decide what must be bundled together.

Stackpress exposes that information through server metadata. The metadata acts like a map of the app: it tells tooling which paths exist, which files belong to those paths, and which listeners should run for lifecycle events.

## 410.2. Runtime Shapes First

Ingest has two main runtime entrypoints. The HTTP entrypoint is for a long-lived Node server, while the WHATWG entrypoint is useful when the platform already sends a native `Request` and expects a native `Response`.

```ts
import { server as httpServer } from '@stackpress/ingest/http';
import { server as whatwgServer } from '@stackpress/ingest/whatwg';
```

This example imports both runtime shapes. The important lesson is not that every app uses both; it is that build and deployment decisions start by knowing which runtime shape the target environment needs.

For a local Node server, the HTTP runtime can create and listen on a port:

```ts
const app = httpServer();
app.create().listen(3000);
```

This example creates a server process that keeps running. That is the shape most junior developers have seen before: start the process, leave it alive, and let incoming HTTP requests reach the app.

For a platform that already works with native request objects, the WHATWG runtime can handle the request directly:

```ts
const app = whatwgServer();

export default function handle(request: Request) {
  return app.handle(request, undefined);
}
```

This example exports a handler instead of opening a port. That difference matters because platforms such as serverless hosts often call your function directly, so the app must fit the host's request and response shape.

## 410.3. Route Metadata

When routes, imports, entries, views, or listeners are registered, Ingest keeps metadata about them. That metadata is what lets build tooling understand the app without guessing from raw source text.

```ts
import { Router } from '@stackpress/ingest';

const app = new Router();

app.get('/users/:id', ({ res }) => res.json({ ok: true }));
app.import.get('/lazy', () => import('./routes/users.js'));
app.entry.get('/entry/:id', './routes/user.js');
app.view.get('/profile', './views/profile.hbs');
app.on('request', ({ req }) => console.log(req.url.pathname));
```

This example registers several kinds of application surfaces. The first route is a normal handler, the lazy route points to a dynamic import, the entry route points to a file path, the view route points to a view entry, and the request listener attaches behavior to a lifecycle event.

After those registrations, the app can expose the related collections:

```ts
console.log(app.routes);
console.log(app.imports);
console.log(app.entries);
console.log(app.views);
console.log(app.listeners);
```

These logs are not something you add to production code as a habit. They show the shape that build and deployment tooling can inspect when it needs to know what routes, imports, entries, views, and listeners exist.

## 410.4. What The Metadata Looks Like

The metadata is organized by route keys and event keys. Some keys are exact strings, while parameterized routes can be represented by generated regular expressions.

```json
{
  "routes": [
    ["/^GET \\/users\\/([^/]+)\\/*$/g", { "method": "GET", "path": "/users/:id" }],
    ["GET /lazy", { "method": "GET", "path": "/lazy" }]
  ],
  "imports": [
    ["GET /lazy", [{ "priority": 0 }]]
  ],
  "entries": [
    ["/^GET \\/entry\\/([^/]+)\\/*$/g", [{ "entry": "./routes/user.js", "priority": 0 }]]
  ],
  "views": [
    ["GET /profile", [{ "entry": "./views/profile.hbs", "priority": 0 }]]
  ],
  "listeners": [
    ["request", [{ "item": "[Handler]", "priority": 0 }]]
  ]
}
```

This example compresses the source shape so it is easier to read. The important pattern is that each collection answers a different build question: what paths exist, what code can be imported lazily, what file entries belong to routes, what views must be built, and what event listeners are attached.

## 410.5. View Builds

Views add another build concern because client assets and page modules may need to be produced from the registered view entries. Stackpress can trigger that work through the build lifecycle with `await app.emit('build')`.

```ts
await app.emit('build');
```

This example emits the build event on the app. In a view-enabled Stackpress project, build listeners can use the registered `app.views` entries to prepare client scripts, assets, and page output through the configured view engine.

## 410.6. How To Read This As A Junior Developer

The first instinct is often to memorize commands, but the stronger habit is to ask what information the command needs. If the command is building routes, lazy entries, or views, the metadata collections are the map that make those pieces visible.

This is also why build work should be verified with evidence. A command finishing is useful, but the better proof is that the expected route, view, asset, or handler entry exists and behaves the way the app source described.

**Learning checkpoint:** Before moving on, make sure you can explain why `app.routes`, `app.imports`, `app.entries`, `app.views`, and `app.listeners` matter to build tooling. You should also know why views can participate in the build lifecycle through `await app.emit('build')`.

**Next course:** Continue with `Generated Artifacts`. That course inspects the output side of this source-to-build relationship.
