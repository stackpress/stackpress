# 141 First React Page

The first React page turns a plain server answer into visible app UI. The
important idea is the handoff: a page handler prepares data, and a React view
renders that data in the browser.

**Previously:** `Views` introduced the server-to-view path. Here, the focus is
the smallest working route-plus-view shape from the Stackpress first React page
guide.

## 141.1. Goal

This lesson upgrades the home route into a React-rendered page. Success means
opening `/` shows `Hello Stackpress` and a sentence that includes the user name
prepared by the page handler.

The example intentionally stays small. You only need a page handler, a React
view file, route registration, view registration, and the server/view plugins
loaded by the app.

## 141.2. Create The View Folders

First, create separate folders for route handlers and React views:

```bash
mkdir -p pages views
```

The `pages` folder holds the server-side handler for the route. The `views`
folder holds the React component that renders the browser output.

## 141.3. Add The Route And View Registration

Replace the plugin body with the two registrations that connect the home route
to both a handler and a view. This keeps the URL in one place while still
letting the server handler and React component live in separate files.

```ts
import type { HttpServer } from 'stackpress/http';

export default function plugin(server: HttpServer) {
  server.import.get('/', () => import('./pages/home.js'));
  server.view.get('/', '@/views/home');
}
```

The first line inside the plugin registers the route handler for `/`. The
second line registers the React view for the same path, so Stackpress knows
which page to render after the handler prepares response data.

## 141.4. Create The Page Handler

Now create `pages/home.ts`. This file prepares the data the React page will
receive.

```ts
import { action } from 'stackpress/server';

export default action(async function HomePage({ res }) {
  res.data.set('user', 'John');
});
```

The handler does not return HTML directly. It sets `user` on `res.data`, which
is the view-data surface Stackpress View can pass into the React page.

## 141.5. Create The React View

Next, create `views/home.tsx`. This file receives the prepared data and renders
the visible page.

```tsx
type HomePageProps = {
  data: {
    user: string;
  };
};

export default function Home({ data }: HomePageProps) {
  return (
    <main>
      <h1>Hello Stackpress</h1>
      <p>Your first React page is rendering for {data.user}.</p>
    </main>
  );
}
```

The `data.user` value comes from the page handler, not from the component
itself. That is the first important view lesson: React renders the UI, while
the route handler prepares the server-side values.

## 141.6. Add A Head When The Page Needs One

The smallest view can be one default component, but real pages often need a
title, metadata, and a stable place for provider-backed content. Stackpress
views support an optional `Head` export and a `Page`/`Body` split for that
larger shape.

The view guide shows the pattern this way:

```tsx
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutPanel } from 'stackpress/view/client';

export function Head(props: ServerConfigPageProps) {
  const { styles = [] } = props;

  return (
    <>
      <title>Hello Stackpress</title>
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function Body() {
  return <main>Hello Stackpress</main>;
}

export function Page(props: ServerConfigPageProps) {
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

export default Page;
```

This example adds structure without changing the basic route-to-view handoff.
`Head` owns the page-specific `<head>` markup, `Page` chooses the layout and
passes server props into it, and `Body` renders the content inside the provider
boundary created by the layout.

## 141.7. Load The Server And View Plugins

Update the plugin list last so the app has the server and view capabilities it
needs. This order keeps the coding steps focused first, then turns on the
framework plugins that know how to serve and render the result.

```json
{
  "plugins": [
    "./plugin",
    "stackpress-server",
    "stackpress-view"
  ]
}
```

The local `./plugin` entry registers your route and view. `stackpress-server`
turns on the server behavior, and `stackpress-view` turns on the React view
rendering behavior.

## 141.8. Check In Browser

Run the development command and open the home route:

```bash
npx stackpress develop -v
```

This command starts the app in development mode with verbose output. The page
is working when `/` renders `Hello Stackpress` and `Your first React page is
rendering for John.` If the text does not appear, inspect the route
registration, view registration, and page handler in that order.

## 141.9. What The Page Owns

The page handler owns server-side preparation. The React view owns display.
The plugin owns the registration that connects the route path to both pieces.

This separation is what makes later view topics easier to debug. When data is
wrong, inspect the handler first; when markup is wrong, inspect the view after
you know the handler passed the expected value.

There is one more ownership rule to keep in mind before adding hooks. Layouts
such as `LayoutPanel` create provider boundaries, so hooks like
`useResponse()`, `useConfig()`, and `useSession()` usually belong in `Body` or
children rendered by `Body`, not in the same component that creates the layout.

**Learning checkpoint:** Before moving on, make sure you can point to the route
registration, the view registration, the handler that sets `res.data`, and the
React component that reads `data.user`. You should also be able to explain why
`Head`, `Page`, and `Body` become useful once the page needs metadata, layout
props, or provider-backed hooks.

**Next course:** Continue with `Server Props`. That course expands the same
handoff into the full props shape Stackpress View can provide.
