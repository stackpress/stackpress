# 662 useLanguage

Translate content inside `Body` or child components with the language hook. The local example shows why that choice matters in an app.

**Previously:** The previous lesson, `661 Language Config`, gave you the setup this page builds on. Here, the focus shifts to `useLanguage` so you can place the next Stackpress surface in the course path.

## 662.1. Use Case

A translated string only helps if the view can read it at the right provider boundary. `useLanguage()` is the view-side hook that turns language config into rendered text.

## 662.2. Minimal Hook Example

Use the hook:

```tsx
import { useLanguage } from 'stackpress/view/client';

export function Body() {
  const language = useLanguage();
  return <h1>{language.translate('hello')}</h1>;
}
```

This is the smallest useful version of the idea. Once you can name the moving parts here, the larger version is easier to inspect and debug.

## 662.3. How The Hook Works

The component read the active language context and resolved the translation key. Compare the concrete details to see the practical meaning.

## 662.4. Common Patterns

This part of the useLanguage workflow is easier to follow when the smaller pieces are compared together. The subsections cover Provider Boundary, Translation Key, Language Switch, so the reader can see how each piece changes the local decision.

### 662.4.1. Provider Boundary

Use `useLanguage()` inside `Body` or a child component rendered by the layout. The examples stay practical by tying the idea to something you can run, change, or verify.

### 662.4.2. Translation Key

The key stays stable while the visible text changes per locale. That is why this detail appears in the lesson before reference material.

### 662.4.3. Language Switch

Layouts can expose language switching when the app provides multiple locales. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 662.5. Mistakes To Avoid

`useLanguage()` mistakes usually come from calling the hook outside its provider or using translation keys for the wrong kind of text. Keep the hook inside the UI tree that owns language context.

### 662.5.1. Translate One-Off Debug Text

```tsx
const label = t('temporaryDebugMessage');
```

Translation keys are most useful for labels repeated across pages or copy that must stay stable. One-off debugging text usually does not need to become part of the language catalog.

### 662.5.2. Call The Hook Above The Provider

```tsx
export function Page() {
  const language = useLanguage();
  return <Layout>{language.t('save')}</Layout>;
}
```

This fails if `Page` renders before the provider is available. Keep translation hooks below the layout provider, or pass translated values through props from a component that already has access.

### 662.5.3. Ignore Missing Text

```tsx
return <button>{t('profile.save')}</button>;
```

If the button renders the key or an empty value, the language config is missing something. Inspect `language.languages` and the active locale before assuming the component is broken.

## 662.6. Reference Pointers

What changed in this lesson is your map: useLanguage now has a place in the Stackpress system. The examples below turn the concept into concrete Stackpress project surfaces.

**Next step:** Read `671 frui Base Components` when translated text appears inside shared UI components. Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `671 frui Base Components`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
