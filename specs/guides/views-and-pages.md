# Views And Pages

This guide explains how a Stackpress page view works, what a view file is expected to export, and where the `stackpress/view/client` components fit in.

## Start Here

Use this page when you are creating or editing a page file under `views` and need to know:

 - what the default export should be
 - when to add a `Head` export
 - where providers should be added
 - how page props get from a route into the rendered view

## Quick Start

A view file should default export the main page component. It can also export a `Head` component.

```tsx
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutPanel } from 'stackpress/view/client';

export function Head(props: ServerConfigPageProps) {
  const { styles = [] } = props;
  const title = 'The Blog';
  const description = 'A simple blog built with Stackpress.';
  const url = 'https://stackpress.dev/blog';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/icon.png" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/icon.png" />

      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function Body() {
  return <main>Hello world</main>;
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

## What Just Happened

That file is doing two different jobs:

 - `Page` creates the page shell and provider boundary
 - `Body` renders the actual page content inside those providers

This separation matters because `LayoutPanel` and `LayoutBlank` create the provider tree for the page. That provider tree includes:

 - server context
 - language context
 - theme context
 - notifier context

If you try to call a context-based hook in the same component that is creating those providers, the hook will run before those providers exist for that render. In practice, that means hooks such as `useResponse()`, `useConfig()`, `useSession()`, `useTheme()`, and `useLanguage()` belong below the page shell, usually in a `Body` component or in components rendered by `Body`.

## Core Concepts

### The Default Export Is The Main Page Component

The default export is the component Stackpress renders as the page entry point.

That component usually does very little work itself:

 - receive the page props
 - choose a layout
 - pass the page props into that layout
 - render a child content component

This keeps the page entry predictable and makes it easier to reason about which hooks are safe to call.

### `Head` Is Optional

If a view file exports `Head`, Stackpress uses it to render page-specific `<head>` markup.

Typical uses:

 - `<title>`
 - meta description
 - Open Graph and Twitter tags
 - favicon links
 - page-level stylesheet links

The `styles` prop is the main place where Stackpress passes generated stylesheet URLs for the page, so most `Head` components should map over `styles` and render `<link rel="stylesheet">` tags.

### Page Props Come From The Router And The Response

The page receives a server-shaped props object:

 - `data`
 - `session`
 - `request`
 - `response`
 - `styles`

Those props are assembled by the view engine at render time.

For most app code, the two important sources are:

 - `res.data.set(...)` for view-facing data that should land in `props.data`
 - `res.results(...)` and status/error methods for the main response payload that should land in `props.response`

That separation is intentional. View data belongs in `data`, not in `response.results`.

### `setViewProps()` Adds Shared View Data

Most page routes should call `setViewProps(req, res, ctx)` before rendering.

That helper copies the common view-facing config into `res.data`, including:

 - `view`
 - `brand`
 - `language`

That is how layouts and hooks get access to things like:

 - `data.view.base`
 - `data.brand.name`
 - `data.language.locale`

### Hooks Read Wrapped Server Data

The main hooks exported from `stackpress/view/client` are thin readers over provider-backed server data:

 - `useConfig()` reads `props.data`
 - `useRequest()` reads the serialized request
 - `useResponse()` reads status, errors, and `response.results`
 - `useSession()` reads the active session
 - `useServer()` reads all of them together

These hooks return helper wrappers instead of raw objects in some cases. For example:

 - `useResponse()` returns a readonly response helper
 - `useRequest()` returns a readonly request helper
 - `useSession()` returns a session helper with permission checks like `session.can(...)`

## Common Tasks

### Add Page-Specific Props From A Route

Set page-only data through `res.data.set(...)` in the page router:

```ts
export default action(async function HomePage({ req, res, ctx }) {
  await ctx.emit('article-search', req, res);
  res.data.set('page', {
    title: 'Home',
    description: 'Latest articles'
  });
  setViewProps(req, res, ctx);
});
```

Then read it in the page with `useConfig()` or directly from `props.data`.

### Read Main Results In `Body`

Use `useResponse()` inside the content component when the page should render the main response payload:

```tsx
import { useResponse } from 'stackpress/view/client';

export function Body() {
  const response = useResponse<{ title: string }>();
  return <h1>{response.results?.title}</h1>;
}
```

### Use `props.response` In `Head`

If the page title or metadata depends on the main results payload, compute it from `props.response` in `Head`.

The blog article page does this by reading `response.results.title` to build the page title.

### Keep `Page` Thin

A good page entry component usually looks like this:

 1. choose `LayoutBlank` or `LayoutPanel`
 2. pass through `data`, `session`, `request`, and `response`
 3. render `Body`

If a page entry starts accumulating business logic, move that logic into `Body` or into smaller child components.

### Know What Belongs In `data` Versus `response`

Use `data` for configuration-like view props:

 - branding
 - locale settings
 - navigation items
 - per-page labels or metadata

Use `response` for request outcome state:

 - `results`
 - `code`
 - `status`
 - `error`
 - `errors`
 - `stack`

## Brief Notes On Theme And Server Helpers

Theme support is part of the provider stack, but it is intentionally small. The theme layer exposes `theme` and `toggle()` through `useTheme()`. Layout components use that state to change classes and page chrome.

The server helper classes under `stackpress-view/src/client/server` are also intentionally small. They make request, response, and session data safer and easier to consume in React without turning the view layer into a full server runtime.

## Next Steps

If you already understand the page file contract, read these next:

 - [Layouts](./views/layouts.md)
 - [Language And Translations](./views/language-and-translations.md)
 - [Notifier](./views/notifier.md)
 - [View Client API](../api/view-client.md)
 - [View API](../api/view.md)
