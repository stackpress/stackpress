# 143 Layouts

Layouts are both page shells and provider boundaries. They decide what the page
looks like, but they also create the context that lets child components read
server data, language, theme, and notifications.

**Previously:** `Server Props` explained the values a view can receive from the
server. Here, the focus shifts to the layout components that pass those values
into the React provider stack.

## 143.1. What Layouts Do

Use `LayoutBlank` when a page should stay minimal. Use `LayoutPanel` when the
page should use the standard app shell with navigation, user controls, theme
controls, and shared page chrome.

Both layouts wrap their content in `LayoutProvider`. That shared provider stack
includes `ServerProvider`, `R22nProvider`, `ThemeProvider`, and
`Notifier.Provider`.

The provider source shows that the layout is not only a visual wrapper:

```tsx
return (
  <ServerProvider
    data={data}
    session={session}
    request={request}
    response={response}
  >
    <R22nProvider language={label} translations={translations}>
      <ThemeProvider theme={theme}>
        <Notifier.Provider {...notify}>
          {children}
        </Notifier.Provider>
      </ThemeProvider>
    </R22nProvider>
  </ServerProvider>
);
```

This example explains why the layout choice affects behavior. Hooks for server
props, language, theme, and notifier state work because the layout puts those
providers above the page content.

## 143.2. Use `LayoutBlank`

`LayoutBlank` is the right starting point for simple pages such as sign-in,
sign-up, OAuth consent, or focused standalone flows. These pages usually need
provider context, but they do not need the full app navigation shell.

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

This example passes the server props into the layout and renders `Body` inside
the provider boundary. The page stays visually light, but child components can
still use the normal view hooks.

## 143.3. Use `LayoutPanel`

`LayoutPanel` is the right starting point for app-style pages that need shared
navigation or user controls. Use it when the page should feel like part of the
main authenticated app surface.

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

This example passes the four main server props explicitly. The layout can then
create the provider stack and render the standard app shell around `Body`.

`LayoutPanel` can also receive `menu` or `left` content for the left side of
the shell. That keeps shared navigation attached to the layout instead of
being rebuilt by every page that needs the same app chrome.

## 143.4. Shared UI Boundaries

The layout boundary is the point where provider-backed hooks become safe to
use. Put hook logic in `Body` or child components rendered by `Body`, not in
the same component that is creating the layout.

Layouts also handle page-wide notifier behavior. `LayoutBlank` and
`LayoutPanel` unload flash messages on mount and raise an error notification
when `response.error` exists.

## 143.5. Common Choices

Choose `LayoutBlank` when the page has one main task and full app navigation
would be distracting. Choose `LayoutPanel` when the page belongs to the normal
authenticated app experience.

If you need lower-level pieces such as `LayoutHead`, `LayoutLeft`,
`LayoutMain`, `LayoutMenu`, `LayoutRight`, or `LayoutUser`, treat them as
building blocks for custom shells. Most app pages should start with
`LayoutBlank` or `LayoutPanel` first.

## 143.6. Mistakes To Avoid

Layout mistakes usually hide the provider boundary or spread shell decisions
across too many components. The examples below show both problems with the
smallest code shape that exposes the issue.

### 143.6.1. Call Hooks Before The Layout Exists

```tsx
export default function Page(props) {
  const session = useSession();
  return <LayoutPanel {...props}>...</LayoutPanel>;
}
```

The hook runs before `LayoutPanel` creates the provider context. Move the hook
into `Body`, then render `Body` inside the layout.

### 143.6.2. Use `LayoutPanel` For A Focused Auth Page

```tsx
<LayoutPanel {...props}>
  <SignInForm />
</LayoutPanel>
```

This can add navigation and user chrome to a page that should stay focused.
Use `LayoutBlank` when the page is a single-task flow.

### 143.6.3. Rebuild The Standard Shell In Every Page

```tsx
return <main className="custom-admin-shell">...</main>;
```

This spreads shared page chrome across many files. Use a standard layout first,
then customize lower-level layout pieces only when the standard shell cannot
represent the page.

**Next course:** Continue with `Language`. That course uses one of the contexts
created by the layout provider.
