# 145 Theme

Theme state lets the UI change presentation without spreading visual decisions
through every component. In Stackpress views, theme lives inside the layout
provider stack and is read with `useTheme()`.

**Previously:** `Language` used a provider-backed hook below the layout. Theme
uses the same boundary rule: mount the layout first, then read the hook inside
`Body` or a child component.

## 145.1. Use Case

Theme is one of the first UI preferences that needs to travel through a page
shell. A user can switch the theme once, and the layout can apply that state to
the page chrome.

The view source shows the initial theme comes from `request.session.theme` and
falls back to `light`. `ThemeProvider` then makes that theme available to child
components.

`LayoutProvider` is where that initial value is chosen:

```ts
const theme = request?.session?.theme as string || 'light';
```

This line keeps the first render tied to request/session data when it exists.
When no theme is present, the page starts in `light` mode instead of forcing
each component to choose its own fallback.

## 145.2. Minimal Theme Hook

Use the theme hook inside `Body`:

```tsx
import { useTheme } from 'stackpress/view/client';

export function Body() {
  const { theme, toggle } = useTheme();

  return (
    <button type="button" onClick={toggle}>
      Current theme: {theme}
    </button>
  );
}
```

The component reads the current theme and calls `toggle` when the user clicks
the button. The hook works here because `Body` is rendered under
`LayoutProvider`.

The provider toggles between `light` and `dark` and stores the browser-side
choice in a cookie:

```ts
const toggle = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  cookie.set('theme', newTheme, { path: '/' });
};
```

This source detail matters because theme is not only a React variable. The
provider also persists the choice so the browser can keep the user's theme
preference across page loads.

## 145.3. Apply Theme Values

Layouts use theme state to change the outer shell class, such as `layout-blank`
or `layout-panel` combined with the active theme. That is the right level for
page-wide theme behavior.

The layout components apply the class at the shell boundary:

```tsx
<div className={`${theme} layout-panel`}>
  ...
</div>
```

This example keeps page-wide styling on the page shell. Child components can
then rely on CSS under `.light` or `.dark` instead of each component repeating
the same conditional color logic.

Components can still read the active theme when they need to adjust local UI.
For repeated styling, prefer classes or CSS variables over inline color values
in every component.

## 145.4. Override Safely

Keep theme decisions close to layout and presentation. If the theme is only a
UI mode, it should not become model data or route logic.

If the product truly stores user theme preference, then schema or session data
may be appropriate. Make that a product decision, not the default for a first
view lesson.

## 145.5. Mistakes To Avoid

Theme mistakes usually come from reading the hook outside the provider or
turning a presentation preference into unrelated app data. The examples below
keep theme behavior in the view layer unless the product explicitly needs to
model it elsewhere.

### 145.5.1. Call `useTheme()` Above The Layout

```tsx
export default function Page(props) {
  const theme = useTheme();
  return <LayoutPanel {...props}>...</LayoutPanel>;
}
```

The hook runs before the layout creates `ThemeProvider`. Move the hook into
`Body` or a child component rendered inside the layout.

### 145.5.2. Inline Every Theme Style

```tsx
return <button style={{ background: theme.primary }}>Save</button>;
```

This spreads visual rules across many components. Use the active theme to
choose a class or data attribute, then let CSS handle repeated visual details.

### 145.5.3. Store Theme As Schema Metadata By Default

```idea
model Profile {
  theme string
}
```

Theme affects presentation, so it should not become schema metadata unless the
product is intentionally modeling user preferences. If the theme is only a UI
mode, keep it in the view/session layer.

**Next course:** Continue with `Notifier`. That course uses another
layout-provided UI surface.
