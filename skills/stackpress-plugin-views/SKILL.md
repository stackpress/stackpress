---
name: stackpress-plugin-views
description: Use when an agent needs to implement or revise handwritten Stackpress plugin page views under `plugins/*/views`, especially when pairing `pages/*.ts` handlers with `server.view.get(...)`, choosing `LayoutPanel` or `LayoutBlank`, exporting `Head`, wiring `setViewProps`, or keeping browser-safe page code inside the Stackpress view layer.
---

# Stackpress Plugin Views

Implement handwritten Stackpress plugin pages using the normal `pages/` plus
`views/` contract instead of improvising React page structure.

## Overview

Treat Stackpress page views as a framework contract, not generic TSX.

This skill owns handwritten page implementation inside plugin `views/` folders,
including the server page handler pairing that feeds those views.

## Use This Skill For

- creating or editing `plugins/*/views/*.tsx`
- pairing a route handler in `pages/*.ts` with `server.view.get(...)`
- deciding between `LayoutPanel` and `LayoutBlank`
- writing the `default` page export and optional `Head`
- wiring `setViewProps(req, res, ctx)` and `res.data.set(...)`
- consuming `useResponse()`, `useConfig()`, `useSession()`, `useTheme()`, or
  `useLanguage()` safely inside page content

## Do Not Use This Skill For

- deciding whether the feature belongs in schema, runtime, generation, or
  route/view work in the first place
- scaffolding a new plugin folder from scratch
- implementing schema-driven generation transforms
- explaining schema `@view.*` attributes in `schema.idea`
- generic reusable React component work that is not specifically page-view
  authoring

Use `stackpress-plugin-router` for lane selection and
`stackpress-plugin-scaffold` for plugin shape first when needed.

## Core Workflow

1. Confirm the route/view lane is correct and the target plugin already exists.
2. Check how the route is bound:
   - `server.import.get(...)` should point at a page handler in `pages/`
   - `server.view.get(...)` should point at a view module in `views/`
3. Make sure the page handler populates view data intentionally:
   - use `res.results(...)` for the main response payload
   - use `res.data.set(...)` for view-facing props
   - call `setViewProps(req, res, ctx)` for shared `view`, `brand`, and
     `language` data
4. In the `views/*.tsx` file, export:
   - an optional `Head`
   - a main page component
   - the page component as the `default` export
5. Keep the page component thin:
   - choose `LayoutPanel` or `LayoutBlank`
   - pass `data`, `session`, `request`, and `response`
   - render a `Body` component below the layout
6. Put context-based hooks in `Body` or deeper children, not in the page
   component that is introducing the layout/provider boundary.
7. Keep browser-facing code browser safe.
8. Verify the route and rendered page behavior with the smallest convincing
   check.

## Route And View Pairing

The standard route/view shape is:

```ts
server.import.get('/hello', () => import('./pages/hello.js'));
server.view.get('/hello', '@/plugins/my-plugin/views/hello');
```

Treat these as a pair:

- the page handler prepares the server props
- the view renders them

If one side is missing, the page contract is incomplete.

## Page Handler Rules

In `pages/*.ts`, the common responsibilities are:

- fetch or resolve the data the page needs
- place the main payload in `res.results(...)` when it is the primary result
- place page-specific view props in `res.data.set(...)`
- call `setViewProps(req, res, ctx)` before rendering when the page should have
  shared view, brand, and language props

Use `res.data` for view-facing configuration-like values. Do not stuff those
values into `response.results`.

## View File Contract

The normal handwritten view shape is:

```tsx
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutPanel, useResponse } from 'stackpress/view/client';

export function Body() {
  const response = useResponse<{ title: string }>();
  return <h1>{response.results?.title}</h1>;
}

export function Head(props: ServerConfigPageProps) {
  const { styles = [] } = props;
  return (
    <>
      <title>Hello World</title>
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
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

Keep the shape predictable unless the user explicitly needs a different page
shell.

## Provider Boundary Rule

`LayoutPanel` and `LayoutBlank` mount the provider stack for:

- server context
- language
- theme
- notifier

That means context-based hooks such as:

- `useResponse()`
- `useConfig()`
- `useSession()`
- `useTheme()`
- `useLanguage()`

should normally be called in `Body` or deeper children, not in the page
component that is mounting the layout.

When in doubt:

- `Page` mounts layout and passes props
- `Body` reads hooks

## Layout Choice

Choose `LayoutBlank` when:

- the page is isolated
- the page is auth-like or single-purpose
- full app navigation would be distracting

Choose `LayoutPanel` when:

- the page should look like part of the main app shell
- shared navigation or user controls matter
- the standard theme and notifier behavior should come from the normal panel
  shell

## `Head` Rules

Use `Head` for page-level `<head>` markup such as:

- `<title>`
- meta tags
- favicon links
- stylesheet links

Most `Head` exports should map over the `styles` prop and render stylesheet
links.

If metadata depends on the main results payload, read it from `props.response`.

## Browser-Safe Rule

Files in `views/` are browser-facing.

- do not import server-only modules
- do not import Node-only dependencies
- prefer `stackpress/view/client` for page-facing helpers
- keep route-time logic in `pages/*.ts`, not in the TSX page module

## Verification

Prefer the smallest checks that prove the page is real:

- inspect the route registration and `server.view.get(...)` target
- inspect the page handler for `setViewProps(...)` and response shaping
- open the route through the app and confirm the page renders
- confirm `Head` metadata or layout choice when that was the requested change

## Common Mistakes

- putting page-specific view props into `response.results` instead of
  `res.data.set(...)`
- calling context hooks in the page component before the layout/provider
  boundary exists
- forgetting `setViewProps(req, res, ctx)` on rendered HTML pages
- importing server-only code into `views/*.tsx`
- treating `views/` files as generic React pages with no Stackpress contract
- using the schema `@view.*` meaning when the task is actually handwritten page
  implementation
