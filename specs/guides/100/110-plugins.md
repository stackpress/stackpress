# 110 Plugins

Small apps can put everything in one file, but that stops working once routes,
events, stores, and integrations all need a place to live. Plugins give
Stackpress a way to load app behavior in focused units instead of forcing every
concern into one startup file.

**Previously:** `Getting Started` showed the local run loop. Here, the focus shifts
to the runtime boundary that tells Stackpress what app behavior should exist.

## 110.1. Why Plugins Exist

A plugin is a function that receives the server and registers the behavior it
owns. That behavior can be a route, event listener, service registration,
config setup, or another piece of startup work.

The Ingest guide shows that plugins are optional because you can still wire
everything manually. Plugins become useful when manual wiring starts to mix
unrelated work, such as audit logging, database setup, user routes, and error
handling.

## 110.2. Manual Wiring First

Manual wiring is valid because it makes the moving parts obvious. The problem
is that one file can quickly become responsible for too many jobs.

```ts
import { server } from '@stackpress/ingest/http';
import auditRoutes from './routes/audit';
import userRoutes from './routes/users';
import createDatabase from './services/database';

const app = server();
const database = createDatabase();

app.on('request', ({ req }) => {
  console.log(req.method, req.url.pathname);
});

app.register('database', database);
app.use(auditRoutes);
app.use(userRoutes);
```

This example creates the server, creates a database service, logs each request,
registers the service, and mounts two route groups. None of those lines are
wrong, but they are different responsibilities living in the same place.

## 110.3. What A Plugin Changes

A plugin moves one responsibility into a unit Stackpress can load. The app can
still inspect the behavior, but the startup file no longer has to own every
detail.

```ts
import type { HttpServer } from 'stackpress/http';

export default function auditPlugin(server: HttpServer) {
  server.on('request', ({ req }) => {
    console.log(req.method, req.url.pathname);
  });

  server.get('/health', ({ res }) => {
    res.json({ ok: true });
  });
}
```

This plugin owns audit-related behavior and a small health route. The important
shift is ownership: Stackpress receives a focused function, and that function
registers the routes or events for one app concern.

## 110.4. What The Plugin Lessons Cover

This parent page introduces the plugin group before the smaller lessons begin.
The next pages move from the mental model to the practical file shape.

`111 Composition` explains how framework plugins and local plugins work
together. `112 Local Plugins` shows how to create app-owned plugin behavior
without treating plugins as only a folder convention.

## 110.5. How To Read The Group

Start with composition before adding more files. If you understand how
Stackpress combines framework behavior with local app behavior, later file
layout choices will feel less arbitrary.

Then use the local plugin lesson to make the concept concrete. Config is not
part of the first runtime path anymore; it returns later in `520 Config` after
you have a reason to organize project settings.

**Learning checkpoint:** Before moving on, make sure you can explain why
plugins are more than folders. They are loadable units that attach behavior to
the app and give that behavior a clear owner.

**Next course:** Continue with `Composition`. That course explains how local
plugins and framework plugins fit together.
