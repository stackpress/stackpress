# 154 Language

Add one translation and read it in a view with the language context. The local example shows why that choice matters in an app.

**Previously:** The previous lesson, `153 Layouts`, gave you the setup this page builds on. Here, the focus shifts to `Language` so you can place the next Stackpress surface in the course path.

## 154.1. Use Case

Hard-coded text is fine for the first page and painful once the app needs another language. The language flow gives text a shared place to live so views can render words based on the active locale.

## 154.2. Minimal Translation

Add language config:

```ts
export const language = {
  key: 'locale',
  locale: 'en_US',
  languages: {
    en_US: 'English',
    es_ES: 'Spanish'
  },
  translations: {
    en_US: {
      hello: 'Hello'
    },
    es_ES: {
      hello: 'Hola'
    }
  }
};
```

Read it in a view:

```tsx
import { useLanguage } from 'stackpress/view/client';

export function Body() {
  const language = useLanguage();
  return <h1>{language.translate('hello')}</h1>;
}
```

This example gives the idea something concrete to inspect. Look for the file, helper, or value that changed; that is the part you would adjust first in your own app.

## 154.3. Load Language Config

The config declares the default locale and available translations. The layout provider exposes language state to the view, and `useLanguage()` reads it.

## 154.4. Switch Or Read Locale

This part of the Language workflow is easier to follow when the smaller pieces are compared together. The subsections cover Locale, Translation Key, View Hook, so the reader can see how each piece changes the local decision.

### 154.4.1. Locale

A locale is the current language-region choice, such as `en_US`. Compare the concrete details to see the practical meaning.

### 154.4.2. Translation Key

A translation key is a stable identifier such as `hello`. The visible text can change per locale without changing the component.

### 154.4.3. View Hook

`useLanguage()` belongs below the layout provider, usually in `Body` or a child component. The examples below turn the concept into concrete Stackpress project surfaces.

## 154.5. Mistakes To Avoid

Language mistakes usually happen when copy, identifiers, and locale settings are treated as the same kind of value. Translate user-facing text, but keep framework names and stable keys predictable.

### 154.5.1. Add A String In Only One Locale

```ts
language: {
  languages: {
    en: { save: 'Save' }
  }
}
```

This works until the app switches to another supported locale. Add the same key to each supported locale so missing translations are easier to catch during review.

### 154.5.2. Translate Code Identifiers

```ts
const route = t('routes.account');
server.get(route, handler);
```

This makes the route path depend on translated copy. Do not translate route paths, code identifiers, event names, or config keys unless the framework feature explicitly expects translated values.

### 154.5.3. Add Translation Machinery Too Early

```ts
const label = t('singleUseHeadline');
```

A translation key for one piece of temporary copy can make an early app harder to read. If an app has one language, configure it once and add translation keys when repeated or product-level text needs stability.

## 154.6. Reference Pointers

This gives you the first mental handle for Language; later pages can add more detail without starting from zero. The nearby example or check shows the project detail affected by this idea.

**Next step:** Read `661 Language Config` later for the deeper built-in language setup. For language APIs, use [Language Reference](/reference/language). That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `155 Theme`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
