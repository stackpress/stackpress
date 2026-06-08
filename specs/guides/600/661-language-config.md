# 661 Language Config

Language config tells Stackpress which locales exist, which locale should be
used first, and which translation map belongs to each locale. Without that
config, a view hook has nothing predictable to read.

The goal is to make language selection explicit. The app should know the
session key used to store the locale, the default locale for new visitors, and
the translation values available to rendered views.

**Previously:** `i18n` introduced the full translation path. This lesson
focuses on the config and runtime language plugin before the next lesson moves
into React components.

## 661.1. Use Case

Use language config when the app needs user-facing text to change by locale.
The config does not translate the page by itself. It gives the language plugin
and view layer the data they need to choose and render translated strings.

The useful mental model is a phrasebook. The config is the phrasebook, the
active locale chooses which chapter to open, and the view hook asks for the
phrase it wants to print.

## 661.2. Minimal Config

A scaffolded app has a small language config with a default locale and one
alternate locale. It is enough to show the shape without pretending this is a
complete production translation catalog.

```ts
export const language = {
  key: 'locale',
  locale: 'en_US',
  languages: {
    en_US: {
      label: 'EN',
      translations: {
        'Sign In': 'Signin',
        'Home Page': 'Home Page'
      }
    },
    th_TH: {
      label: 'TH',
      translations: {
        'Sign In': 'Signin',
        'Home Page': 'Home Pagesss'
      }
    }
  }
};
```

This example shows the three pieces the language plugin reads. `key` is the
session/query name, `locale` is the default locale, and `languages` contains
the label and translations for each locale.

## 661.3. Load Translations

The language plugin registers only when language config exists. During the
`config` lifecycle, it configures the `Language` class with the key and
language map.

```ts
ctx.register('language', Language.configure(
  ctx.config.path('language.key', 'locale'),
  ctx.config.path<LanguageMap>('language.languages', {})
));
```

This example turns config into a runtime plugin. After this registration, the
plugin can answer which locales exist and which translations belong to the
active locale.

On each request, the plugin can update the active locale from request data:

```ts
const key = ctx.config.path('language.key', 'locale');
const defaultLocale = ctx.config.path('language.locale', 'en_US');
let locale = req.data<string>(key);

if (language.locales.includes(locale)) {
  language.load(req, defaultLocale).update(locale, res);
}
```

This example means a valid `locale` request value can update the session-backed
locale. Invalid locale names are ignored because they are not in the configured
language map.

The plugin also supports locale prefixes in the URL:

```ts
const pathArray = req.url.pathname.split('/');
locale = pathArray[1] || '';

if (language.locales.includes(locale)) {
  language.load(req, defaultLocale).update(locale, res);
  pathArray.splice(1, 1);
  await ctx.resolve(req.method, pathArray.join('/'), request, res);
}
```

This example lets a URL such as `/th_TH/auth/signin` set the locale and then
resolve the request as `/auth/signin`. The locale prefix is used for language
selection, not as the final app route.

## 661.4. Common Patterns

Language config has a few small moving parts, and each one has a different job.
Keep those jobs separate when debugging missing translations.

### 661.4.1. Language Key

The key is the request/session name used to store the active locale. In the
A scaffolded app, the key is `locale`.

```ts
key: 'locale'
```

This example means the plugin looks for request data named `locale` and stores
the chosen locale under that same session key. If the key changes, both the
request value and session value should follow the new name.

### 661.4.2. Default Locale

The default locale is used when the request does not already have a saved
locale. It keeps the app from guessing which language to load first.

```ts
locale: 'en_US'
```

This example tells the language class to use `en_US` when no session value has
been selected yet. If the default locale is missing from `languages`, views may
fall back to untranslated phrases.

### 661.4.3. Translation Map

The translation map stores phrase-to-text values for each locale. The `Language`
class returns the phrase itself when a translation is missing.

```ts
public translate(phrase: string, ...variables: Scalar[]) {
  let translation = this.translations[phrase] || phrase;
  for (let i = 0; i < variables.length; i++) {
    translation = translation.replace('%s', String(variables[i]));
  }
  return translation;
}
```

This example shows two behaviors. Missing translations fall back to the input
phrase, and `%s` placeholders can be replaced with variables.

## 661.5. Mistakes To Avoid

Language config mistakes usually make text work in one locale and fail quietly
in another. Keep locale names, defaults, and phrase keys stable so the app can
switch languages predictably.

### 661.5.1. Add A Locale Without Text

An empty locale entry lets the plugin recognize the locale, but it does not
give the view anything new to display. The app can switch to that locale while
still falling back to untranslated phrases.

```ts
languages: {
  en_US: { label: 'EN', translations: { 'Save': 'Save' } },
  th_TH: { label: 'TH', translations: {} }
}
```

This example makes `th_TH` valid while leaving `Save` untranslated. Add the
same phrase keys the UI already uses before treating the locale as complete.

### 661.5.2. Forget The Default Locale

The default locale should exist in the language map. Otherwise the layout can
load a locale that has no label or translations.

```ts
locale: 'en_US',
languages: {
  th_TH: { label: 'TH', translations: { 'Save': 'บันทึก' } }
}
```

This example names `en_US` as the default but does not configure it. Add an
`en_US` entry or change the default to a locale that exists.

### 661.5.3. Rename Keys When Copy Changes

The current source uses phrases as keys, such as `_(option.name)` or
`_('Sign In Options')`. If the phrase changes in the component, the config key
must match the new phrase.

```tsx
{_('Sign In Options')}
```

This example asks for the phrase `Sign In Options`. If config only contains
`Sign In`, the hook will not use that translation for this text.

## 661.6. Reference Pointers

Use these files when debugging language config:

```text
config/common.ts
packages/stackpress-language/src/plugin.ts
packages/stackpress-language/src/Language.ts
packages/stackpress-language/src/types.ts
packages/stackpress-view/src/helpers.ts
packages/stackpress-view/src/client/layout/LayoutProvider.tsx
```

These files cover config shape, plugin registration, locale storage,
translation lookup, server view props, and the provider boundary. Read them in
that order when a locale exists but text does not translate.

**Next step:** Read `662 useLanguage` to see how configured translations are
used inside a view.

**Learning checkpoint:** You should be able to explain what `language.key`,
`language.locale`, and `language.languages` each do. You should also be able to
trace how a valid locale request updates the session-backed active locale.
