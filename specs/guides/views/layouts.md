# Layouts

This guide explains how Stackpress page layouts work, when to use `LayoutBlank` versus `LayoutPanel`, and what each layout is responsible for.

## Start Here

Use this page when your view file already has a page component and you need to choose or understand its layout shell.

In most app views, the choice is:

 - `LayoutBlank` for simple pages such as auth or standalone flows
 - `LayoutPanel` for app-style pages with navigation and user controls

## Quick Start

Use `LayoutBlank` for minimal pages:

```tsx
import { LayoutBlank } from 'stackpress/view/client';

export default function Page(props) {
  return (
    <LayoutBlank {...props}>
      <Body />
    </LayoutBlank>
  );
}
```

Use `LayoutPanel` for pages that need the standard app shell:

```tsx
import { LayoutPanel } from 'stackpress/view/client';

export default function Page(props) {
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

## What Just Happened

Both layouts do more than render markup. They also create the provider stack for the page through `LayoutProvider`.

That means a layout is both:

 - a visual shell
 - the place where common page contexts are wired

Because of that, the layout choice is part of page behavior, not only page appearance.

## Core Concepts

### `LayoutProvider` Is The Shared Composition Root

`LayoutBlank` and `LayoutPanel` both wrap their app content in `LayoutProvider`.

`LayoutProvider` creates these providers in order:

 - `ServerProvider`
 - `R22nProvider`
 - `ThemeProvider`
 - `Notifier.Provider`

That is why pages normally pass the full server prop set into the layout and then render `Body` inside it.

### `LayoutBlank` Is The Minimal Shell

`LayoutBlank` is the right choice when the page does not need app navigation.

Common examples:

 - sign in
 - sign up
 - OAuth consent
 - other focused single-task pages

It can still render a header bar when needed, but its structure stays much lighter than `LayoutPanel`.

### `LayoutPanel` Is The App Shell

`LayoutPanel` is the right choice when the page should feel like part of the main app surface.

It includes support for:

 - top header controls
 - left navigation
 - right-side user panel
 - themed page chrome
 - popup, dialog, and dropdown roots

If the page should show shared navigation or user controls, start with `LayoutPanel`.

### Layouts Also Handle Notifications

Both `LayoutBlank` and `LayoutPanel` run two small layout-level effects:

 - unload flash messages from the server on mount
 - raise a notifier error when `response.error` exists

That behavior is why the layout layer is a good boundary for page-wide UX concerns that should happen consistently across many pages.

### Theme Is Applied At The Shell Level

The active theme becomes a class on the outer layout container:

 - `layout-blank`
 - `layout-panel`

The layout components use that theme state to drive page chrome and toggles. The initial theme comes from `request.session.theme` and the browser-side provider can persist changes in a cookie.

## Common Tasks

### Choose The Right Layout

Choose `LayoutBlank` when:

 - the page is isolated
 - the page has one main task
 - full app navigation would be distracting

Choose `LayoutPanel` when:

 - the page is part of the normal app experience
 - the user should have access to shared navigation
 - the page benefits from the standard user menu and theme controls

### Pass Props Through Cleanly

If you are using `LayoutPanel`, pass the four main server props explicitly:

```tsx
<LayoutPanel
  data={data}
  session={session}
  request={request}
  response={response}
>
  <Body />
</LayoutPanel>
```

If you are using `LayoutBlank`, spreading the props is usually acceptable because the shape is smaller and common in auth-style views:

```tsx
<LayoutBlank {...props}>
  <Body />
</LayoutBlank>
```

### Add Left Navigation To `LayoutPanel`

`LayoutPanel` can render menu items through its `menu` prop. That is the standard path when you want the left side to be route-driven rather than hand-authored page content.

If you need a custom left panel instead, pass custom content through `left`.

### Keep Layout Decisions Out Of `Body`

The layout choice should happen in the page component, not deep inside content components. That keeps page structure easy to scan and avoids mixing shell concerns with content concerns.

### Treat Lower-Level Layout Pieces As Building Blocks

Lower-level layout components such as:

 - `LayoutHead`
 - `LayoutLeft`
 - `LayoutMain`
 - `LayoutMenu`
 - `LayoutRight`
 - `LayoutUser`

exist so the standard layouts can be composed consistently. Most app code should start with `LayoutBlank` or `LayoutPanel` first, then only drop lower if there is a real customization need.

## Next Steps

Read [Views And Pages](../views-and-pages.md) if you need the full view file contract. Read [Language And Translations](./language-and-translations.md) if your layout or page needs translated UI labels. Read [Notifier](./notifier.md) if you need to raise or clear page notifications.
