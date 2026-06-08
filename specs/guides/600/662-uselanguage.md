# 662 useLanguage

`useLanguage()` is the view-side hook that turns configured translations into
rendered text. Stackpress view exports it from `stackpress-view/client`, and
some handwritten views import it directly from `r22n`. In both cases, the
common pattern is to call `_()` with the phrase you want to render.

This lesson focuses on `_()` because that is the pattern used through
Stackpress views and generated view output. The goal is to make translated text
feel like a normal part of a component instead of a separate manual lookup
step.

**Previously:** `Language Config` explained where locales and translations
come from. This lesson shows the component side of the same flow.

## 662.1. Use Case

Use `useLanguage()` inside a component rendered below `LayoutProvider`. The
provider gives `r22n` the active language label and translation map, and the
hook reads that provider context.

If the component is outside the provider boundary, the hook has no configured
Stackpress language context to read. That is why standard layouts matter for
translated pages.

## 662.2. Minimal Hook Example

The sign-in option view uses the normal Stackpress pattern:

```tsx
import {
  useConfig,
  useLanguage,
  useRequest,
  useTheme,
  LayoutBlank
} from 'stackpress-view/client';

export function AuthSigninBody() {
  const { _ } = useLanguage();

  return (
    <h1 className="title">
      {_('Sign In Options')}
    </h1>
  );
}
```

This example keeps the translation call close to the text being rendered.
`_('Sign In Options')` asks the active language for a translated value and
falls back to the phrase when no translation exists.

Handwritten views sometimes import the hook directly from `r22n`:

```tsx
import { useLanguage } from 'r22n';

export function Body() {
  const { _ } = useLanguage();
  return <p>{_('Stackpress Publication')}</p>;
}
```

This example uses the same provider underneath. The direct `r22n` import works
because `LayoutProvider` mounts `R22nProvider` around the rendered page.

## 662.3. How The Hook Works

`LayoutProvider` selects the active language data from server props and passes
it into `R22nProvider`. That provider is the boundary that makes `_()` work in
child components.

```tsx
const { languages = {}, locale = 'en_US' } = data?.language || {};
const { label = 'EN', translations = {} } = languages[locale] || {};

<R22nProvider language={label} translations={translations}>
  {children}
</R22nProvider>
```

This example is the provider boundary the hook depends on. If `data.language`
does not contain the active locale or translations, `_()` will not have the
expected text map.

`stackpress-view/client` re-exports the hook:

```ts
export {
  R22nContext,
  R22nProvider,
  Translate,
  useLanguage
} from 'r22n';
```

This example explains why package views can import `useLanguage` from
`stackpress-view/client` even though the underlying hook comes from `r22n`. The
Stackpress export keeps view imports consistent while still using the shared
translation library.

## 662.4. Common Patterns

The hook is most useful when the displayed phrase is user-facing and belongs in
the translation map. Keep the call close to the rendered label so future
readers can see which text is translatable.

### 662.4.1. Translate Labels

Use `_()` for headings, button labels, menu labels, form labels, and short
messages that users read repeatedly. Those phrases are the text most likely to
need stable translations across pages.

```tsx
<span className="label">{_(option.name)}</span>
```

This example translates a menu option from auth config. It lets configured menu
text become locale-aware without hardcoding every menu label in the view.

### 662.4.2. Translate Generated View Text

Generated and package views use the same hook pattern. That means i18n is not
only for handwritten pages.

```tsx
const { _ } = useLanguage();
```

This example appears throughout auth, account, form, list, and view output. It
keeps generated UI text tied to the same provider used by handwritten views.

### 662.4.3. Switch Locale Through Request Data

The hook does not switch the server locale by itself. Locale changes are
handled by the language plugin when a request contains a valid configured
locale.

```ts
if (language.locales.includes(locale)) {
  language.load(req, defaultLocale).update(locale, res);
}
```

This example belongs to the server-side language plugin. The hook renders the
active provider state; the plugin is what updates that state for later renders.

## 662.5. Mistakes To Avoid

`useLanguage()` mistakes usually come from using the wrong provider boundary or
assuming every phrase is automatically configured. The hook is simple, but it
depends on the earlier config and layout steps being correct.

### 662.5.1. Use `translate()` Instead Of `_()` In Views

The local view pattern is `_()`, not a hand-written `language.translate()`
call inside React components. Keeping the hook pattern consistent makes
handwritten and generated views easier to scan.

```tsx
const { _ } = useLanguage();
return <button>{_('Save')}</button>;
```

This example is concise and matches package views. It keeps component code
consistent with the Stackpress view style used elsewhere.

### 662.5.2. Call The Hook Above The Provider

Do not call the hook in code that renders before `LayoutProvider` exists. The
provider supplies the translations the hook reads.

```tsx
export function Body() {
  const { _ } = useLanguage();
  return <h1>{_('Home Page')}</h1>;
}
```

This example is safe when `Body` is rendered inside a standard Stackpress page
layout. If the same component were rendered outside that layout stack, it would
not be using the configured language provider.

### 662.5.3. Ignore Missing Text

When text does not translate, do not start by changing the hook. Check that the
active locale has the phrase key used by the component.

```tsx
{_('Stackpress Publication')}
```

This example will fall back to `Stackpress Publication` unless the active
locale has that exact phrase in its translations. The hook is doing its job;
the missing piece is usually the translation map.

## 662.6. Reference Pointers

Use these files when debugging `useLanguage()`:

```text
packages/stackpress-view/src/client/index.ts
packages/stackpress-view/src/client/layout/LayoutProvider.tsx
packages/stackpress-session/src/auth/views/signin/index.tsx
packages/stackpress-session/src/session/views/account.tsx
plugins/app/views/home.tsx
packages/stackpress-language/src/Language.ts
```

These files cover the hook export, provider setup, package view usage,
handwritten view usage, and fallback translation behavior. Read them together
when a component renders text but not the expected translation.

**Next step:** Read `670 Components` when translated text appears inside shared
Stackpress and Frui UI components.

**Learning checkpoint:** You should be able to explain why `_('Sign In
Options')` depends on both `LayoutProvider` and language config. You should
also be able to explain why missing translations usually fall back to the
original phrase.
