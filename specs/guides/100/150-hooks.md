# 150 Hooks

Use hooks to run code at important moments in the Stackpress request lifecycle.
This lesson focuses on the runtime hooks most visible to app developers:
`request` and `response`, then shows how user-defined `config`, `listen`, and
`route` hooks wire startup behavior in a local plugin.

**Previously:** `Notifier` showed how user feedback reaches the view layer.
Hooks explain how an app can react before a request is handled, after a
response is prepared, and while the server is registering behavior.

## 150.1. Why Hooks Exist

Hooks are useful when behavior needs to happen around many routes instead of
inside one route. A route should still own the request it answers, but a hook
can observe or adjust a shared lifecycle moment.

Think of hooks as checkpoints in a hallway. The visitor still enters a room
for a specific route, but the hallway can check the badge, record the visit, or
notice that the response needs special handling.

## 150.2. Request And Response Hooks

The `request` hook runs when Stackpress is processing a request. Use it for
shared request-side behavior that should happen before or around route work,
such as logging, request defaults, or early request checks.

```ts
server.on('request', async ({ req, res, ctx }) => {
  console.log(req.method, req.url.pathname);
});
```

This hook receives the same `{ req, res, ctx }` shape you have seen in routes
and events. The example only logs the method and path, but the important point
is the timing: this behavior is attached to the request lifecycle instead of a
single page handler.

The `response` hook runs after route work has prepared a response. Use it when
the app needs to inspect the outgoing response before it is dispatched.

```ts
server.on('response', async ({ req, res, ctx }) => {
  if (res.error) {
    await ctx.emit('error', req, res);
  }
});
```

This example checks whether the response has an error, then emits the reusable
`error` event with the same request and response objects. That keeps the error
decision near the response lifecycle instead of spreading it through many page
handlers.

## 150.3. User-Defined Startup Hooks

`config`, `listen`, and `route` are also hooks, but they are usually defined by
app or framework plugins during startup. They help separate when behavior is
attached from the request that eventually uses that behavior.

The `config` hook belongs to the setup side of the app. It gives plugins a
place to prepare configuration before later hooks depend on those settings, so
it should be treated as startup wiring instead of request handling.

```ts
server.on('listen', async _ => {
  server.on('error', () => import('./pages/error.js'));
});
```

This startup hook registers the `error` event when the app begins listening.
The event handler is lazy-loaded, so the plugin can name the behavior without
loading the error page module immediately.

An app plugin can also use `route` to register page and view routes:

```ts
server.on('route', async _ => {
  server.import.get('/', () => import('./pages/home.js'));
  server.view.get('/', '@/plugins/app/views/home');
});
```

This hook is where route and view registration happens. It is user-defined
startup behavior, not a browser request, so it belongs in the plugin file
rather than inside a page handler.

## 150.4. Build An Error Hook

An error hook starts by connecting two lifecycle moments. First, the plugin
registers an `error` event during `listen`, then the `response` hook emits
that event whenever the response has an error.

```ts
server.on('listen', async _ => {
  server.on('error', () => import('./pages/error.js'));
  server.on('response', async ({ req, res, ctx }) => {  
    if (res.error) {
      await ctx.emit('error', req, res);
    }
  });
});
```

The `listen` hook makes the error handler available. The `response` hook
decides when to call it, which keeps error rendering out of every individual
route.

Next, the error event handler prepares the response for browser rendering:

```ts
export default action(async function ErrorPage({ req, res, ctx }) {
  if (req.mimetype === 'terminal/arguments') return false;
  if (req.method.toUpperCase() !== 'GET' || res.body) return;

  res.data.set('server', { 
    mode: ctx.config.path('server.mode', 'production'),
  });

  setViewProps(req, res, ctx);
});
```

This shortened example shows the guardrails before rendering. Terminal errors
are skipped, non-GET or already-bodied responses are left alone, and view data
is prepared only when the response is likely to become an HTML error page.

The full handler also builds stack snippets in development, supports JavaScript
and CSS error responses, resolves the current session, renders the error view,
and writes the HTML response with `res.html(...)`. Those details are still part
of the same error flow, but the lifecycle decision was already made by the
response hook before the view was rendered.

## 150.5. Render The Error View

The error view turns the prepared response into a page. It reads response
state through view hooks and chooses between a not-found message and a general
error message.

```tsx
export function Body() {
  const { _ } = useLanguage();
  const config = useConfig<ErrorConfig>();
  const response = useResponse();
  const production = config.path('server.mode', 'production') === 'production';
  const notFound = response.code === 404;
  const title = notFound ? _('Not Found') : _('Oops...');
}
```

This view code does not decide when an error should be handled. The lifecycle
hook and error event already made that decision; the view focuses on rendering
the response that was prepared for it.

The page wraps the body in `LayoutPanel`:

```tsx
export function Page(props: ErrorPageProps) {
  const { data, session, request, response } = props;
  return (
    <LayoutPanel
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <Body />
    </LayoutPanel>
  );
}
```

This wrapper passes server props into the same layout system used by normal
pages. The error page is special because of when it is called, not because it
uses a separate rendering model.

## 150.6. Mistakes To Avoid

Hook mistakes usually come from using a lifecycle hook as if it were a normal
route. Keep the hook's timing and responsibility clear before adding logic.

### 150.6.1. Put Page Rendering In Every Route

```ts
if (res.error) {
  await ctx.emit('error', req, res);
}
```

This logic belongs in a shared response hook when the app wants consistent
error handling. Putting it in every route creates repetition and makes one
missed route behave differently from the rest.

### 150.6.2. Handle Terminal Errors Like Browser Errors

```ts
if (req.mimetype === 'terminal/arguments') return false;
```

This guard matters because terminal responses should not automatically become
HTML pages. The error hook should respect the caller medium instead of assuming
every response is headed to a browser.

### 150.6.3. Register Routes During A Request Hook

```ts
server.on('request', async () => {
  server.import.get('/', () => import('./pages/home.js'));
});
```

This mixes startup behavior with request behavior. Route registration belongs
in a startup hook such as `route`, while `request` should handle work tied to
an actual incoming request.

## 150.7. Next Step

Hooks are lifecycle boundaries. Use `request` and `response` when behavior
wraps request handling, and use startup hooks such as `listen` and `route` when
plugins define what the app should register.

**Next course:** Continue with `Debugging And Inspection`. That course closes
the first runtime level by showing how to inspect source, runtime behavior,
generated output, and local data when something breaks.
