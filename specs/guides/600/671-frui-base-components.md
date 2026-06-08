# 671 frui Base Components

Base components are the reusable UI pieces that keep Stackpress pages from
rebuilding the same controls in every view. They are the layout shells,
buttons, menus, notifications, and small interaction helpers that support a
page before the page starts dealing with a specific form field or formatted
data value.

## 671.1. Use Case

Use base components when the page needs a shared interface behavior instead of
one-off markup. A sign-in page, an account page, and an OAuth permission page
should not each invent their own layout, notification system, or action button
style.

Stackpress view code usually starts from the browser-safe client entrypoint:

```tsx
import {
  LayoutBlank,
  useConfig,
  useLanguage,
  useRequest,
  useTheme
} from 'stackpress-view/client';
```

This example comes from the sign-in view. The view uses Stackpress helpers to
read config, translate labels, read request data, toggle the theme, and wrap
the page in a blank layout.

## 671.2. Minimal Layout Example

Layout helpers are base components because they control the frame around the
page, not the page's domain data. The account views use an `AccountLayout`
helper so account pages share the same panel and menu.

```tsx
export function AccountLayout(props: AccountLayoutProps) {
  const { children } = props;
  const { _ } = useLanguage();
  const base = props.data.auth?.base || '/auth';
  const menu = [
    {
      name: _('Personal Information'),
      icon: 'user',
      path: `${base}/account`,
      match: `${base}/account`
    },
    {
      name: _('Security Settings'),
      icon: 'lock',
      path: `${base}/account/security`,
      match: `${base}/account/security`
    }
  ];
  return (
    <LayoutPanel {...props} menu={menu}>
      {children}
    </LayoutPanel>
  );
}
```

This helper builds the account menu once and passes it to `LayoutPanel`. Each
account page can focus on its own body content because the shared frame is
handled by the layout component.

## 671.3. Props And State

Base components still need props and state, but the state usually supports the
interface frame. In `LayoutPanel`, Stackpress tracks whether the left and right
panels are open, reads the current pathname, and passes toggles into the
layout head.

```tsx
const [ left, toggleLeft ] = useToggle();
const [ right, toggleRight ] = useToggle();
const { theme, toggle: toggleTheme } = useTheme();
```

These lines do not describe a product model like `Article` or `Profile`. They
describe interface state: whether navigation panels are open and which theme
is active.

## 671.4. Common Patterns

The common base-component patterns are easiest to read by separating layout,
actions, and feedback. These patterns show up in different packages, but the
source-backed lesson is the same: shared UI behavior belongs in a reusable
component or helper.

### 671.4.1. Layout Wrappers

A layout wrapper gives many pages the same outer structure. `LayoutPanel`
wraps children in `LayoutProvider`, then renders head, left, right, main, and
portal roots for popups, dialogs, and dropdowns.

```tsx
return (
  <LayoutProvider
    data={data}
    session={session}
    request={request}
    response={response}
  >
    <LayoutPanelApp menu={menu}>{children}</LayoutPanelApp>
  </LayoutProvider>
);
```

The important part is that the provider comes before the visible panel app.
That gives children access to server data, session data, request data,
response data, language, theme, and notifier context.

### 671.4.2. Action Components

Buttons are base components because they represent an action the user can
take. The OAuth permission form imports `Button` from Frui instead of using a
plain `<button>` with local styling.

```tsx
import Button from 'frui/Button';

<Button className="submit" type="submit">{_('Grant')}</Button>
```

This example keeps the submit action in the same component family as other
Frui controls. The label is translated with `useLanguage`, while the button
itself carries the reusable action styling and behavior.

### 671.4.3. Notifications

Notifications are base behavior because they let any page show feedback
without building a local message box. `LayoutProvider` mounts the Frui notifier
provider, and `LayoutPanel` unloads server flash messages when the page
hydrates.

```tsx
<Notifier.Provider {...notify}>
  {children}
</Notifier.Provider>
```

This provider makes notification state available to the page tree. Without the
provider, a local call to a notifier helper would not have the same shared
place to render messages.

## 671.5. Mistakes To Avoid

Base component mistakes usually come from treating shared behavior as local
markup. The problem may look small on one page, but the inconsistency becomes
obvious when many pages need the same layout, action, or feedback behavior.

### 671.5.1. Hand-Build A Shared Layout

```tsx
export function AccountPage() {
  return <main className="account-page">...</main>;
}
```

This markup may render, but it skips the shared account layout, menu, and
provider context. Use the account layout helper when the page belongs to the
account section, because the helper already knows how the section should be
framed.

### 671.5.2. Recreate A Button By Appearance

```tsx
<button className="submit theme-bg-accent">Grant</button>
```

This copies the look instead of using the component. It can drift from other
buttons as the design system or interaction behavior changes, so use the Frui
button when the action belongs with the shared component set.

### 671.5.3. Render Feedback Locally

```tsx
{error && <div className="toast">{error}</div>}
```

This creates one local message, but it does not share behavior with server
flash messages or global notifications. Use the notifier surface when feedback
should behave consistently across Stackpress pages.

## 671.6. Reference Pointers

For Stackpress-owned browser helpers, start with
`packages/stackpress-view/src/client/index.ts`. For source-backed examples of
base components in use, inspect the session account views, the Stackpress view
layout files, and the API OAuth view.

Full Frui prop tables are outside this course page. This lesson is meant to
teach when to use the base component family and where to inspect the local
Stackpress examples that already use it.

**Learning checkpoint:** You should now recognize base components as shared UI
behavior, not schema-driven field output. The next lesson narrows the focus to
form components, where schema metadata starts choosing inputs for you.

**Next course:** Continue with `frui Form Components`. That page shows how
`@field.*` metadata turns into generated inputs and controls.
