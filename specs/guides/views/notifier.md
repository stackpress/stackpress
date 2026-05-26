# Notifier

This guide explains how notifications work in Stackpress views and when to use `notify()`, `flash()`, `unload()`, and `NotifierContainer`.

## Start Here

Use this page when you want to:

 - show an error, success, or status message in the UI
 - understand why some page errors appear automatically
 - handle one-time messages after a page load or form action
 - know where notifier context comes from in a Stackpress page

## Quick Start

For client-side actions, import notifier helpers from `stackpress/view/client`:

```tsx
import { notify, flash } from 'stackpress/view/client';

export function SaveButton() {
  async function onClick() {
    const success = true;

    if (success) {
      flash('success', 'Saved successfully');
    } else {
      notify('error', 'Save failed');
    }
  }

  return <button onClick={onClick}>Save</button>;
}
```

For normal page rendering, use `LayoutBlank` or `LayoutPanel` so the notifier provider is already present.

## What Just Happened

The notifier system in this repo has two layers:

 - `LayoutProvider` creates `Notifier.Provider`
 - page and component code calls helpers such as `notify()` and `flash()`

That means most application code does not have to wire a notifier provider by hand. If the page is already using the standard Stackpress layouts, the notifier context is usually already available.

## Core Concepts

### The Provider Comes From `LayoutProvider`

`LayoutProvider` reads notifier settings from `data.view.notify` and mounts:

 - `Notifier.Provider`

That provider sits inside the normal page layout stack alongside the server, language, and theme providers.

In practice, if you use `LayoutBlank` or `LayoutPanel`, notifier support comes with the layout.

### Layouts Surface Response Errors Automatically

`LayoutBlank` and `LayoutPanel` both do two notifier-related things:

 - call `unload(cookie)` on mount
 - call `notify('error', response.error)` when `response.error` exists

This is why a page with a response error can show a notification without every page author manually writing the same effect.

### `notify()` Is For Immediate Client Feedback

Use `notify()` when you want to surface feedback right away during client-side behavior.

Common cases:

 - async action failed
 - validation failed outside the normal page response flow
 - import/export action needs immediate UI feedback

In generated admin views, `notify()` is commonly passed into helper flows so background actions can raise errors while staying on the current page.

### `flash()` Is For One-Time Success Or Status Messages

Use `flash()` when you want a short-lived success or status message.

In this repo, one common pattern is:

 - start a client-side action
 - if the action succeeds, call `flash('success', ...)`
 - then refresh or redirect after that

Flash messages are especially useful when you want to carry a message across a redirect and show it once on the next page load.

On the server side, that usually means setting flash data in the session before redirecting. For example:

```ts
res.session.set('flash', {
  type: 'success',
  message: 'Success!'
});
res.redirect('/next-page');
```

In this repo, some generated admin flows currently serialize that payload first:

```ts
res.session.set('flash', JSON.stringify({
  type: 'error',
  message: 'This page may have been requested from an external source.',
  close: 2000
}));
res.redirect('/next-page');
```

### `unload()` Clears Server-Carried Notifications

`unload()` is used by layouts to clear any flash data tied to the current request cycle after the page has mounted.

Most app pages should not call `unload()` themselves because the standard layouts already do it.

### `NotifierContainer` Renders The Notification UI

`NotifierContainer` is the display component for active notifications.

Use it when you are building a custom page shell and need to render the visual notification list yourself. If you stay within the standard layouts and existing app shell conventions, you may never need to place it directly.

## Common Tasks

### Show A Success Message After A Client Action

```tsx
import { flash } from 'stackpress/view/client';

async function onImported() {
  flash('success', 'File imported successfully');
}
```

This pattern already appears in generated admin search views after successful imports.

### Set A Flash Message Before Redirecting

When the next page should show a one-time message after a redirect, set the flash payload on the server before calling `redirect(...)`:

```ts
res.session.set('flash', {
  type: 'success',
  message: 'Success!'
});
res.redirect('/next-page');
```

If your current session flow stores flash values as serialized JSON, use the same shape but serialize it before saving.

### Show An Error Without Reloading The Page

```tsx
import { notify } from 'stackpress/view/client';

async function onFailed() {
  notify('error', 'Something went wrong');
}
```

Use this for immediate client-side feedback when the page stays mounted.

### Let Layouts Handle Normal Response Errors

If the page error is already part of `response.error`, prefer passing the standard server props into `LayoutBlank` or `LayoutPanel` and let the layout raise the notifier entry automatically.

That avoids repeating the same `useEffect` pattern in every page.

### Add Notifier Settings Through View Config

If you need to tune notifier behavior globally for rendered views, set notifier options in the `view.notify` config so `LayoutProvider` can pass them into `Notifier.Provider`.

That is the correct boundary for provider-level notifier settings.

### Know When You Need `NotifierContainer`

You usually need `NotifierContainer` only when:

 - you are building a custom shell outside the standard layouts
 - you need explicit control over where notification UI is rendered

If you are only triggering notifications, `notify()` or `flash()` is usually enough.

## Next Steps

Read [Views And Pages](../views-and-pages.md) for the provider boundary rules. Read [Layouts](./layouts.md) to understand where notifier behavior is mounted by default. Use [View Client API](../../api/view-client.md) if you need the exact exported notifier symbols.
