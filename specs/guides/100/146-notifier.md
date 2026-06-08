# 146 Notifier

Notifications are short UI messages that tell the user what just happened.
Stackpress views get notifier support from the standard layout provider, so
most pages can trigger feedback without building a notification system by hand.

**Previously:** `Theme` used provider-backed view state. Here, the focus shifts
to feedback helpers such as `notify()`, `flash()`, `unload()`, and the notifier
container.

## 146.1. Use Case

Users need feedback after saves, validation failures, redirects, imports, and
client-side actions. A notifier gives the app a consistent message channel
instead of scattering temporary status text across unrelated components.

The standard layouts mount `Notifier.Provider` through `LayoutProvider`. That
means pages using `LayoutBlank` or `LayoutPanel` usually already have notifier
context.

`LayoutProvider` reads notifier options from `data.view.notify` and passes
them into the provider:

```tsx
const notify = data?.view?.notify;

<Notifier.Provider {...notify}>
  {children}
</Notifier.Provider>
```

This example shows the provider boundary. Page code can call `notify()` or
`flash()` because the layout already mounted the notification provider above
the page content.

## 146.2. Show A Client Message

For client-side actions, import helpers from `stackpress/view/client`:

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

`flash()` is useful for short-lived success or status messages. `notify()` is
useful when the page should show immediate feedback, especially for an error
while the user stays on the same page.

## 146.3. Trigger From Handler

Server-side feedback usually travels through the response or session. For a
message that should survive a redirect, set flash data before redirecting.
That gives the next page something to display after navigation completes:

```ts
res.session.set('flash', JSON.stringify({
  type: 'success',
  message: 'Your password has been updated.'
}));
res.redirect('/next-page');
```

This example follows the current session-page pattern. It writes serialized
flash data into the response session changes, then sends the browser to another
page. The standard layout can unload that flash message when the next page
mounts.

Errors can use the same redirect-friendly shape:

```ts
res.session.set('flash', JSON.stringify({
  type: 'error',
  message: 'Two-factor authentication failed.'
}));
res.redirect('/auth/signin');
```

This example keeps the error visible after navigation. It is useful when the
handler needs to redirect away from the failed request but still explain what
happened on the next page.

## 146.4. Render In View

Layouts surface normal response errors automatically. `LayoutBlank` and
`LayoutPanel` call `unload(cookie)` on mount and call `notify('error',
response.error)` when `response.error` exists.

The layout effect is the same in both standard layouts:

```tsx
useEffect(() => {
  unload(cookie);
}, []);

useEffect(() => {
  response?.error && notify('error', response.error);
}, [ response?.error ]);
```

This example is why normal response errors do not need a custom notification
effect in every page. Pass the response into the layout, and the layout raises
the error notification consistently.

`NotifierContainer` is the display component for notification UI. Use it only
when building a custom shell outside the standard layouts and you need explicit
control over where notifications render.

## 146.5. Mistakes To Avoid

Notifier mistakes usually make feedback vague, stale, or disconnected from the
action that caused it. The examples below focus on making feedback specific,
durable across redirects when needed, and connected to the standard layout
provider.

### 146.5.1. Show A Generic Success Message

```ts
flash('success', 'Done.');
```

This confirms that something happened, but not what changed. Prefer a short,
specific message such as `Profile saved.` or `Invite sent.` The user should be
able to connect the message to the action they just took.

### 146.5.2. Use Client Notification For Redirect-Only Feedback

```tsx
notify('success', 'Saved.');
window.location.href = '/account';
```

The notification may disappear when the browser navigates. Use server-side
flash data before redirecting when the next page should show the message.

### 146.5.3. Rebuild Provider Wiring In Every Page

```tsx
<Notifier.Provider>
  <PageContent />
</Notifier.Provider>
```

This duplicates the provider Stackpress layouts already mount. Use
`LayoutBlank` or `LayoutPanel` first, and only wire notifier pieces manually
when building a custom shell.

**Next course:** Continue with `Hooks`. That course explains request,
response, listen, and route lifecycle moments before the debugging lesson
closes the first runtime level.
