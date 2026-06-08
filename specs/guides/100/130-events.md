# 130 Events

Use events to give backend behavior a reusable name. Routes are good at
preparing a request and formatting a response, while events are good at
representing business rules that can be called from routes, the CLI, plugins,
or other runtime entry points.

**Previously:** `Nest` explained the nested data stores used by request and
response surfaces. Events use those same `{ req, res, ctx }` objects, but move
reusable work out of one route handler.

## 130.1. Why Events Exist

A route answers one HTTP request. If all backend logic lives inside that route,
the same behavior cannot be reused cleanly by a terminal command, another
route, a scheduled workflow, or a plugin extension.

An event gives the behavior a name. The route can prepare `req.data`, emit the
event, then decide how to send the final browser response.

## 130.2. The Route-To-Event Split

Think of the route as the front desk and the event as the department that does
the reusable work. The front desk collects the request details, sends them to
the right department, then explains the answer to the visitor.

```ts
server.post('/articles/search', async ({ req, res, ctx }) => {
  req.data.set('status', 'PUBLISHED');
  req.data.set('query', req.post('query'));

  await ctx.emit('article-search', req, res);
});
```

This route prepares the request before the event runs. It chooses the default
status, copies the submitted query into request data, and then emits the
`article-search` business event with the same request and response objects.

The event owns the reusable search rule:

```ts
server.on('article-search', async ({ req, res, ctx }) => {
  const query = req.data('query');
  const status = req.data('status') || 'PUBLISHED';
  const store = ctx.plugin('article-store');

  const rows = await store.search({ query, status });
  res.rows(rows, rows.length);
});
```

This event does not care whether the caller was a browser route or a terminal
command. It reads prepared request data, runs the business operation, and
writes the result to the response.

## 130.3. Events Are Reusable

The main reason to create an event is reuse. A named event can be called from
more than one route or from the command line when you need to inspect the
behavior without the browser.

```ts
await ctx.emit('article-search', req, res);
```

This call asks Stackpress to run every listener registered for
`article-search`. The caller passes `{ req, res, ctx }` through the event
system, so the event can use the same request, response, and app context shape
as a route handler.

Terminal usage is a natural follow-up because it uses the same event name:

```bash
stackpress emit article-search --b config -v
```

This command is not a different business rule. It is another medium calling
the same named behavior, which is why `131 Terminal Events` comes right after
this lesson.

## 130.4. Register Event Listeners

A plugin can register event listeners directly. Use this when the app owns the
behavior in the current file and the handler is small enough to keep nearby.

```ts
import type { HttpServer } from 'stackpress/http';

export default function plugin(server: HttpServer) {
  server.on('cart-total', async ({ req, res, ctx }) => {
    const cartId = req.data('cartId');
    const store = ctx.plugin('cart-store');

    const total = await store.total(cartId);
    res.results({ total });
  });
}
```

This plugin registers `cart-total` as a business event. A page route, terminal
command, or another plugin can call the event without knowing how totals are
calculated.

For larger handlers, lazy event modules keep startup files smaller:

```ts
ctx.import.on('article-search', () => import('./events/article-search.js'));
```

This registration tells Stackpress where the event handler lives without
loading the module immediately. The event name remains the public contract; the
file path is only the implementation location.

## 130.5. Emit Or Resolve

Use `emit(...)` when the caller already has request and response objects and
wants the event to write into that response. This is the most direct handoff
from a route because both caller and event share the same response object.

```ts
await ctx.emit('cart-total', req, res);
if (res.code !== 200) return;
```

This pattern lets the event own the result while the route decides what to do
afterward. The route can stop on errors, redirect on success, or render a page
from the response data.

Use `resolve(...)` when the caller wants a response-like object back:

```ts
const response = await ctx.resolve('cart-total', req, res);

if (response.code !== 200) {
  res.fromStatusResponse(response);
  return;
}
```

This pattern is useful when the caller needs to inspect the event outcome
before deciding how to shape the final response. It keeps the reusable event
separate from the browser-specific presentation choice.

## 130.6. Mistakes To Avoid

Event mistakes usually come from treating events as route aliases or from
putting browser-specific formatting inside reusable business behavior. A good
event should be useful even when the caller is not a browser page.

### 130.6.1. Put All Backend Logic In The Route

```ts
server.post('/checkout', async ({ req, res }) => {
  // calculate totals, reserve inventory, charge payment, send email
  res.redirect('/thanks');
});
```

This route is hard to reuse because the business rule is trapped inside a
browser-only handler. Move reusable operations into named events, then let the
route handle request preparation and browser response formatting.

### 130.6.2. Make The Event Depend On A Browser Redirect

```ts
server.on('checkout-submit', async ({ res }) => {
  res.redirect('/thanks');
});
```

This event may be awkward from the CLI because its main output is a browser
redirect. A reusable checkout event should write a clear result or error, and
the route should decide whether that result becomes a redirect.

### 130.6.3. Emit Without Preparing Request Data

```ts
await ctx.emit('article-search', req, res);
```

This can be fine only when the request already contains everything the event
expects. If the route needs to normalize defaults, copy form fields, or attach
context, do that before emitting the event.

## 130.7. Next Step

You should now be able to explain the split: routes prepare and present,
events process reusable business rules. That split is what lets the same
behavior be called from a page, another plugin, or the terminal.

**Next course:** Continue with `Terminal Events`. That course shows how the
same event model becomes inspectable from the command line.
