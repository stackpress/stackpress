# 633 Flash Messages

Flash messages are one-time feedback messages that survive a redirect. They
are useful when the server finishes a POST action, redirects the browser to a
new page, and still needs the next page to say what happened.

This is different from an immediate client notification. A normal notification
can disappear when the browser leaves the page. A flash message rides through
the redirect in session-backed data, then the layout unloads it on the next
page load.

**Previously:** `Account Pages` showed built-in account actions such as
password change, 2FA setup, and account removal. This lesson follows the
feedback those actions store before redirecting.

## 633.1. Flow Goal

The flow goal is to show the user a short message after a server-side redirect.
The action stores flash data, redirects, the next page uses a standard layout,
and the layout unloads the flash data so it does not keep showing forever.

Think of flash as a sticky note handed to the next page. The current page is
leaving, so it cannot show the message itself. The note travels with the
session just long enough for the next page to display it.

## 633.2. Config Surface

Flash display depends on the standard Stackpress view layouts. `LayoutProvider`
mounts the notifier provider, and `LayoutPanel` or `LayoutBlank` calls
`unload(cookie)` after the page mounts.

```tsx
<Notifier.Provider {...notify}>
  {children}
</Notifier.Provider>
```

This example comes from `LayoutProvider`. It creates the notification context
that page layouts and notifier helpers use to display messages.

The layout unloads server-carried flash data:

```tsx
useEffect(() => {
  unload(cookie);
}, []);
```

This example is why most pages do not need to manually clear flash messages.
If the page uses `LayoutPanel` or `LayoutBlank`, the layout handles the unload
step when the page mounts.

## 633.3. Set A Flash Message

Set flash data after the server action succeeds and before the redirect. The
password-change account page uses this pattern after updating all linked auth
records.

```ts
res.session.set('flash', JSON.stringify({
  type: 'success',
  message: 'Your password has been updated.'
}));
const base = ctx.config.path('auth.base', '/auth');
res.redirect(`${base}/account`);
```

This example stores a success message and then redirects to the account page.
The message is serialized as JSON because the current session flows store flash
payloads that way.

2FA setup uses the same pattern with a close duration:

```ts
res.session.set('flash', JSON.stringify({
  type: 'success',
  message: 'Two-Factor Authentication has been updated successfully.',
  close: 5000
}));
```

This example adds `close` so the notification can auto-close after a configured
time. The core shape is still `type` plus `message`, with optional fields added
for display behavior.

## 633.4. Render Feedback

Rendering feedback is mostly a layout job. The account pages use standard
layouts, so they get the notifier provider and flash unloading behavior without
each page rewriting the same effects.

```tsx
useEffect(() => {
  response?.error && notify('error', response.error);
}, [ response?.error ]);
```

This example shows a related layout behavior: response errors become error
notifications automatically. Flash messages are unloaded from cookies, while
response errors are read from the server response props.

The account layout uses `LayoutPanel`, which wraps account pages in the normal
provider stack:

```tsx
return (
  <LayoutPanel {...props} menu={menu}>
    {children}
  </LayoutPanel>
);
```

This example explains why account pages can show flash feedback without each
view importing notifier helpers. The shared layout provides the notification
environment.

## 633.5. Security Checks

Flash messages should describe the result of a completed server decision. They
should not be used as proof that the action was safe, and they should not
replace server-side validation.

### 633.5.1. Set Success After The Write

Set a success flash only after the write or security action succeeds. In the
password page, flash is set after current-password validation and auth updates.

```ts
for (const auth of auths.results) {
  await ctx.resolve('auth-update', { id: auth.id, secret: secret });
}
res.session.set('flash', JSON.stringify({
  type: 'success',
  message: 'Your password has been updated.'
}));
```

This example shows the correct order. The message is not stored before the
password updates run, so the next page does not claim success for a failed
write.

### 633.5.2. Use Error Flash Before A Redirect

Use an error flash when the flow needs to redirect away from the current page
but still explain why. The 2FA sign-in route does this when the challenge hash
does not match.

```ts
res.session.set(
  'flash',
  JSON.stringify({
    type: 'error',
    message: 'Two-factor authentication failed.'
  })
);
res.redirect(`${base}/signin/${currentAuth.type}?redirect_uri=${encodeURIComponent(redirect)}`);
```

This example stores error feedback because the route sends the browser back to
a sign-in page. Without flash, the user would land on another page without a
clear reason.

### 633.5.3. Let Layouts Clear The Message

Do not build pages that keep showing the same flash message on every render.
Use a standard layout so `unload(cookie)` clears the server-carried message
after the next page has mounted.

```tsx
useEffect(() => {
  unload(cookie);
}, []);
```

This example is the cleanup point. It keeps flash messages short-lived instead
of turning them into permanent session state.

## 633.6. Verify

Verify flash behavior by checking the set, redirect, render, and unload steps.
The server action should set `flash` before redirecting, the destination page
should use `LayoutPanel` or `LayoutBlank`, the notifier provider should be
mounted, and the layout should unload flash after mount.

Use these files when debugging flash messages:

```text
packages/stackpress-session/src/session/pages/password.ts
packages/stackpress-session/src/session/pages/2fa/detail.ts
packages/stackpress-session/src/session/pages/2fa/remove.ts
packages/stackpress-session/src/session/pages/remove.ts
packages/stackpress-session/src/auth/pages/signin/2fa.ts
packages/stackpress-view/src/client/layout/LayoutProvider.tsx
packages/stackpress-view/src/client/layout/LayoutPanel.tsx
packages/stackpress-view/src/client/layout/LayoutBlank.tsx
specs/guides/views/notifier.md
```

These files cover server flash creation, success and error examples, notifier
provider setup, automatic error notifications, and flash unload behavior. Read
them as the complete lifecycle from server redirect feedback to client-side
cleanup.

**Next step:** Read `640 CSRF` for the form protection that usually comes
before account actions set flash messages.

**Learning checkpoint:** You should be able to explain why a flash message is
set before `res.redirect(...)`. You should also be able to explain why standard
layouts call `unload(cookie)` after the redirected page loads.
