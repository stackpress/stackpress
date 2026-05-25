# Language And Translations

This guide explains how Stackpress language config becomes a usable `useLanguage()` hook inside page views.

## Start Here

Use this page when you want to:

 - configure app locales
 - understand what `stackpress-language` is responsible for
 - translate page labels with `useLanguage()`
 - understand how locale selection reaches the view layer

## Quick Start

Start with the app `language` config:

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

Then make sure the page route calls `setViewProps(req, res, ctx)`.

Finally, use the hook in a component rendered inside the page layout:

```tsx
import { useLanguage } from 'stackpress/view/client';

export function Body() {
  const { _ } = useLanguage();
  return <h1>{_('Home Page')}</h1>;
}
```

## What Just Happened

There are two separate layers involved:

 - `stackpress-language` handles locale configuration and request/session updates on the server side
 - `stackpress-view` turns the active language data into a React context that components can consume with `useLanguage()`

That means `stackpress-language` does not directly provide the React hook. It provides the language data and locale behavior that the view layer then adapts for React.

## Core Concepts

### The `language` Config Is The Source Of Truth

The app config defines:

 - the locale key, usually `locale`
 - the default locale
 - the language map

Each language entry contains:

 - `label`
 - `translations`

The label is what the view layer passes into `R22nProvider` as the language name. The translations object is the actual phrase map used by the hook.

### `stackpress-language` Owns Locale Selection

The server-side language plugin does three main jobs:

 - register the language runtime during config
 - inspect requests for locale changes
 - persist the chosen locale in the session

It checks for locale changes in two common forms:

 - query or body data using the configured key, such as `?locale=th_TH`
 - the first URL segment, such as `/th_TH/page`

If the locale is valid, it updates the session and uses that locale for later requests.

### `setViewProps()` Bridges Language Config Into The View

`setViewProps(req, res, ctx)` copies the common view-facing config into `res.data`. That includes the `language` config:

 - `key`
 - `locale`
 - `languages`

At render time, that data becomes part of `props.data`.

This is the bridge between framework config and view props.

### `LayoutProvider` Creates The React Language Context

The language hook becomes available when `LayoutProvider` reads `data.language` and creates `R22nProvider`.

The important steps are:

 1. read `data.language.locale`
 2. find `data.language.languages[locale]`
 3. pass that language label and translations into `R22nProvider`
 4. render the page below that provider

After that, child components can call `useLanguage()`.

### `useLanguage()` Is For View Components

Inside a rendered page component, `useLanguage()` gives you translation helpers from `r22n`.

In this repo, the most common pattern is:

```tsx
const { _ } = useLanguage();
```

Then translate labels inline:

```tsx
<button>{_('Sign In')}</button>
```

In normal JSX usage:

```tsx
<h1>{_('Whats New')}</h1>
```

The same hook can also expose language-changing helpers such as `changeLanguage(...)`, which the built-in user layout uses for simple locale switching.

## Common Tasks

### Add A New Translation

Add the phrase to the `translations` object for each locale you support:

```ts
translations: {
  'Sign In': 'Signin',
  'Home Page': 'Home Page',
  'Whats New': 'What is new'
}
```

Then use the original phrase in the page:

```tsx
const { _ } = useLanguage();
<h1>{_('Whats New')}</h1>
```

### Translate Page Content Safely

Only call `useLanguage()` in components that render below the page layout provider boundary. In practice, that usually means `Body` or child components rendered by `Body`.

### Understand Why `Page` Usually Does Not Call `useLanguage()`

The page component is usually the place where the layout is mounted, and the layout is what introduces `R22nProvider`. That means the safe default is:

 - `Page` mounts the layout
 - `Body` uses `useLanguage()`

This is the same provider-boundary rule used for the other view hooks.

### Use Translations In `Head`

This repo also uses `useLanguage()` inside some `Head` exports, especially in shared auth and OAuth views.

So the practical rule in this codebase is:

 - prefer `Body` for most translated content
 - use `Head` when page metadata itself needs translation

### Keep Translation Strings User-Facing

Use `useLanguage()` for labels, headings, and short UI text. Do not use it as a substitute for broader content modeling or per-record localized data that should come from your actual content source.

## Next Steps

Read [Views And Pages](../views-and-pages.md) to see how the provider boundary shapes page files. Use [Language API](../../api/language.md) and [View Client API](../../api/view-client.md) when you need the import surface rather than the conceptual flow.
