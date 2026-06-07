# 155 Theme

Use theme values through the layout-provided view context instead of hard-coding every component. The local example shows why that choice matters in an app.

**Previously:** The previous lesson, `154 Language`, gave you the setup this page builds on. Here, the focus shifts to `Theme` so you can place the next Stackpress surface in the course path.

## 155.1. Use Case

Theme state is one of the first pieces of UI context that needs to travel through a layout. This lesson shows where that state lives and how a component reads or changes it without inventing a separate pattern.

## 155.2. Minimal Theme Setup

Use the theme hook inside `Body`:

```tsx
import { useTheme } from 'stackpress/view/client';

export function Body() {
  const theme = useTheme();

  return (
    <button type="button" onClick={theme.toggle}>
      Current theme: {theme.theme}
    </button>
  );
}
```

In this example, the useful part is the value being passed, returned, or configured. That is usually the first thing a developer changes when adapting the pattern.

## 155.3. Apply Theme Values

The layout provider exposes theme state to child components. The component reads the current value and calls `toggle()` to switch it.

## 155.4. Override Safely

This part of the Theme workflow is easier to follow when the smaller pieces are compared together. The subsections cover Theme State, Layout Responsibility, Component Styling, so the reader can see how each piece changes the local decision.

### 155.4.1. Theme State

Theme state is view context. It belongs in the provider-backed view tree, not in unrelated route logic.

### 155.4.2. Layout Responsibility

Layouts usually apply theme classes or page chrome. Individual components should consume the theme without recreating the whole provider setup.

### 155.4.3. Component Styling

Use shared classes, CSS variables, or framework styles for repeated visual changes. Avoid hard-coding a complete color decision in every component.

## 155.5. Mistakes To Avoid

Theme mistakes usually come from mixing presentation with app data. Keep theme decisions close to layout and styling, not model definitions or business routes.

### 155.5.1. Hide The Toggle On One Page

```tsx
export function SettingsPage() {
  return <ThemeToggle />;
}
```

This only gives users access to the toggle from one page. Place a theme toggle in a layout or navigation component when the choice should apply across the app.

### 155.5.2. Inline Every Theme Style

```tsx
return <button style={{ background: theme.primary }}>Save</button>;
```

This can spread visual rules across many components. Prefer using the active theme to choose a class name or data attribute, then let CSS handle the visual details.

### 155.5.3. Store Theme As Schema Metadata By Default

```idea
model Profile {
  theme string
}
```

Theme affects presentation, so it should not become schema metadata unless the product models user preferences. If the theme is only a UI mode, keep it in the view or session layer instead.

## 155.6. Reference Pointers

The important part is the reason behind Theme: it gives the app a clearer way to organize one kind of behavior. Keep that role in mind as the lesson moves into the concrete shape.

**Next step:** Read `156 Notifier` to use another layout-provided UI surface. It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `156 Notifier`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
