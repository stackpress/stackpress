# 144 Language

Language support keeps user-facing text from being hard-coded into every view.
Stackpress separates the server-side locale choice from the React hook that
translates labels inside the page.

**Previously:** `Layouts` showed that `LayoutProvider` creates the language
context. Here, the focus shifts to adding translations and reading them from a
view component.

## 144.1. Use Case

Hard-coded text is fine for the first page and painful once the app needs
another locale. The language flow gives labels a shared place to live, then
lets components render the right text for the active locale.

There are two layers involved. `stackpress-language` owns locale configuration
and request/session updates on the server side, while `stackpress-view` adapts
that language data into React context through `useLanguage()`.

## 144.2. Minimal Translation

Start with language config:

```ts
export const language = {
  key: 'locale',
  locale: 'en_US',
  languages: {
    en_US: {
      label: 'EN',
      translations: {
        'Home Page': 'Home Page'
      }
    },
    th_TH: {
      label: 'TH',
      translations: {
        'Home Page': 'Home Pagesss'
      }
    }
  }
};
```

The config names the locale key, the default locale, and the available
languages. Each language entry has a display label and a translation map.

Now use the hook inside a component rendered below the layout:

```tsx
import { useLanguage } from 'stackpress/view/client';

export function Body() {
  const { _ } = useLanguage();
  return <h1>{_('Home Page')}</h1>;
}
```

The `_()` helper translates the phrase for the active locale. The phrase is the
stable key, and the rendered text changes when the active language changes.

## 144.3. Load Language Config

Page routes should call `setViewProps(req, res, ctx)` when they need the shared
view config. That helper copies language config into `res.data`, where the view
engine can pass it into the page props.

The helper copies the language shape explicitly:

```ts
res.data.set('language', {
  key: language.key || 'locale',
  locale: language.locale || 'en_US',
  languages: language.languages || {}
});
```

This example is the bridge from server config to React props. Without this
data in `res.data`, the layout provider would not have the language map it
needs to create the React language context.

At render time, `LayoutProvider` reads `data.language`, finds the active locale,
and creates `R22nProvider`. After that, `Body` and its child components can call
`useLanguage()`.

The provider lookup is small but important:

```ts
const { languages = {}, locale = 'en_US' } = data?.language || {};
const { label = 'EN', translations = {} } = languages[locale] || {};
```

This code chooses the current language entry before rendering `R22nProvider`.
The `label` becomes the provider language name, and `translations` becomes the
phrase map that `useLanguage()` reads.

## 144.4. Switch Or Read Locale

`stackpress-language` can inspect the request for locale changes. The source
guide describes two common forms: a query or body value using the configured
key, such as `?locale=th_TH`, and the first URL segment, such as
`/th_TH/page`.

If the locale is valid, the language plugin can update the session and use that
locale for later requests. That keeps locale choice connected to the visitor
instead of forcing every component to decide the language again.

The server-side plugin only updates the session when the requested locale is in
the configured locale list:

```ts
let locale = req.data<string>(key);
if (language.locales.includes(locale)) {
  language.load(req, defaultLocale).update(locale, res);
}
```

This example prevents unsupported locale names from becoming active just
because they appeared in the request. The same source also checks the first URL
segment and rewrites the request path when a valid locale prefix is used.

## 144.5. Missing Translation Behavior

Missing translations should be noticeable without crashing the page. The
`useLanguage()` hook reads the phrase map and falls back to the original phrase
when a key is missing.

```ts
const translation = translations[phrase] ?? phrase;
```

This fallback is useful while building a page because the UI can still render.
It should not be treated as a reason to leave translations incomplete; it is a
safety behavior, not a review process.

## 144.6. Mistakes To Avoid

Language mistakes usually happen when text, identifiers, and locale settings
are treated as the same kind of value. The examples below separate UI copy from
framework behavior so translation does not accidentally change routing or app
structure.

### 144.6.1. Use `t()` When The App Pattern Uses `_()`

```tsx
const { t } = useLanguage();
return <h1>{t('Home Page')}</h1>;
```

The confirmed Stackpress guide uses `const { _ } = useLanguage()`. Follow that
pattern so examples match the codebase readers will see.

### 144.6.2. Add A Phrase In Only One Locale

```ts
translations: {
  'Home Page': 'Home Page'
}
```

This works until the app switches to another supported locale. Add the same
phrase key to every supported locale so missing translations are easier to
review.

### 144.6.3. Translate Code Identifiers

```ts
server.get(_('routes.account'), handler);
```

This makes route behavior depend on translated UI text. Use translations for
labels, headings, and short user-facing copy, not route paths, event names, or
code identifiers.

**Next course:** Continue with `Theme`. That course uses another context
created by the same layout provider boundary.
