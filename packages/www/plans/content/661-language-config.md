# 661 Language Config

Configure a default language and one alternate locale for translated views. The nearby example or check shows the project detail affected by this idea.

**Previously:** The previous lesson, `650 Email`, gave you the setup this page builds on. Here, the focus shifts to `Language Config` so you can place the next Stackpress surface in the course path.

## 661.1. Use Case

Translations need setup before a view can read them. Language config tells the app which locale is the default, which alternatives exist, and where the translated values come from.

## 661.2. Minimal Config

Configure language:

```ts
export const language = {
  key: 'locale',
  locale: 'en_US',
  languages: {
    en_US: {
      label: 'English',
      translations: {
        hello: 'Hello'
      }
    },
    es_ES: {
      label: 'Spanish',
      translations: {
        hello: 'Hola'
      }
    }
  }
};
```

This example keeps the first version narrow on purpose. Once this shape is clear, the surrounding section can add options without making the first step harder to follow.

## 661.3. Load Translations

The config defines the session key, default locale, available language labels, and translation maps. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 661.4. Common Patterns

This part of the Language Config workflow is easier to follow when the smaller pieces are compared together. The subsections cover Language Key, Locale, Translation Map, so the reader can see how each piece changes the local decision.

### 661.4.1. Language Key

The key is the session/config name used to track the active locale. The local example shows why that choice matters in an app.

### 661.4.2. Locale

The locale identifies the active language and region, such as `en_US`. Compare the concrete details to see the practical meaning.

### 661.4.3. Translation Map

The translation map stores key-to-text values per locale. The nearby example or check shows the project detail affected by this idea.

## 661.5. Mistakes To Avoid

Language config mistakes usually make text work in one locale and fail quietly in another. Keep locale names, defaults, and translation keys stable so the app can switch languages predictably.

### 661.5.1. Add A Locale Without Text

```ts
language: {
  languages: {
    en: { save: 'Save' },
    es: {}
  }
}
```

This registers the locale, but it leaves the app without translated strings for that locale. Add a new locale entry and include the keys the UI already expects.

### 661.5.2. Forget The Default Locale

```ts
language: {
  languages: {
    en: { save: 'Save' }
  }
}
```

The app needs a clear first locale when no user preference has been selected. Set `language.locale` to the locale the app should use first.

### 661.5.3. Rename Keys When Copy Changes

```ts
language: {
  languages: {
    en: { saveButtonText: 'Save changes' }
  }
}
```

Changing a key because the sentence changed can break components that still read the old key. Keep keys stable and change the translated value when the displayed copy changes.

## 661.6. Reference Pointers

You do not need the full reference yet. For Language Config, focus on recognizing the pattern and knowing where to look next.

**Next step:** Read `662 useLanguage` to translate text in a view. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `662 useLanguage`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
