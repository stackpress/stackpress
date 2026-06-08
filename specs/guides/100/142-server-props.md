# 142 Server Props

Server props are the handoff from route code to React code. The route prepares
data, response state, session state, request details, and styles; the view reads
those values through props and provider-backed hooks.

**Previously:** `First React Page` showed a handler setting `res.data` and a
view reading `data.user`. Here, the focus expands to the full prop shape a
Stackpress view can receive.

## 142.1. Use Case

A page often needs values from the server before React can render it. The
important habit is knowing whether a value belongs in `data`, `session`,
`request`, `response`, or `styles`.

This separation keeps views from guessing. Page metadata can live in `data`,
the main route result can live in `response`, and the active visitor can live
in `session`.

## 142.2. Minimal Server Props

Set route output with separate response surfaces:

```ts
export default action(async function HomePage({ req, res, ctx }) {
  res.results({ title: 'Hello Stackpress' });
  res.data.set('page', { eyebrow: 'First page' });
  setViewProps(req, res, ctx);
});
```

`res.results(...)` stores the main route outcome. `res.data.set(...)` stores
view-facing page data, and `setViewProps(req, res, ctx)` copies shared view
config such as `view`, `brand`, and `language` into the response data surface.

Now read both surfaces in `Body`:

```tsx
import { useConfig, useResponse } from 'stackpress/view/client';

export function Body() {
  const config = useConfig();
  const response = useResponse<{ title: string }>();

  return (
    <main>
      <p>{config.path('page.eyebrow')}</p>
      <h1>{response.results?.title}</h1>
    </main>
  );
}
```

`useConfig()` reads the view-facing `data` prop through a nested helper.
`useResponse()` reads the route outcome, including `results`, status, errors,
and other response state.

## 142.3. The Full Prop Set

The view engine can pass these server-shaped props into a page:

 - `data` for view-facing config and page metadata
 - `session` for current visitor or signed-in profile state
 - `request` for serialized URL, headers, method, session, and request data
 - `response` for route results, status, errors, and stack data
 - `styles` for generated stylesheet URLs that `Head` can render

Each prop answers a different question. If a value describes the page shell,
look in `data`; if it describes the request outcome, look in `response`.

## 142.4. Read Request And Session Props

The same provider-backed pattern works for request and session data. Use these
hooks when the view needs to display information about the current URL, method,
active visitor, or permissions.

```tsx
import { useRequest, useSession } from 'stackpress/view/client';

export function Body() {
  const request = useRequest();
  const session = useSession();

  return (
    <main>
      <p>Current path: {request.url.pathname}</p>
      <p>Signed in: {session.guest ? 'No' : 'Yes'}</p>
    </main>
  );
}
```

This example reads already-prepared server props. `useRequest()` wraps the
serialized request props, and `useSession()` wraps the current session props so
the component can ask whether the visitor is a guest.

When a component needs all server surfaces together, use `useServer()`:

```tsx
import { useServer } from 'stackpress/view/client';

export function Body() {
  const { config, request, response, session } = useServer();

  return (
    <main>
      <p>{config.path('brand.name')}</p>
      <p>{request.method}</p>
      <p>{response.code}</p>
      <p>{session.data.name}</p>
    </main>
  );
}
```

This example shows the shape returned by the hook source. `config` is the
callable nested data helper, while `request`, `response`, and `session` are
client-side wrappers around the server props.

## 142.5. Provider Boundary

`LayoutBlank` and `LayoutPanel` create the provider stack through
`LayoutProvider`. That is why hooks such as `useConfig()`, `useRequest()`,
`useResponse()`, `useSession()`, and `useServer()` belong in `Body` or a child
component rendered below the layout.

The page entry usually chooses a layout and passes the props through:

```tsx
export default function Page(props) {
  return (
    <LayoutPanel {...props}>
      <Body />
    </LayoutPanel>
  );
}
```

This example keeps `Page` thin. The layout receives the server props, creates
the providers, and then `Body` can safely use the provider-backed hooks.

## 142.6. Mistakes To Avoid

Server prop mistakes usually come from reading the right value in the wrong
layer. The fix is to keep the provider boundary visible.

### 142.6.1. Use A Hook Above The Layout

```tsx
export default function Page(props) {
  const response = useResponse();
  return <LayoutPanel {...props}>...</LayoutPanel>;
}
```

This calls the hook before `LayoutPanel` creates the provider tree. Move the
hook into `Body` or a child component rendered inside the layout.

### 142.6.2. Put View Metadata In Results

```ts
res.results({
  page: { eyebrow: 'First page' },
  title: 'Hello Stackpress'
});
```

This mixes view metadata with the route result. Keep page metadata in
`res.data`, and keep the main route payload in `res.results(...)`.

### 142.6.3. Ignore `styles` In `Head`

```tsx
export function Head() {
  return <title>Home</title>;
}
```

This is fine for a tiny page, but it drops generated stylesheet URLs when the
page receives them. If the view depends on generated or page-specific styles,
accept props in `Head` and render the `styles` links.

## 142.7. Reference Pointers

Server props are the first bridge between server output and React hooks. Once
you can name the prop surfaces, layout and hook behavior becomes much easier to
debug.

**Next course:** Continue with `Layouts`. That course explains the provider
boundary that makes these hooks safe to use.
