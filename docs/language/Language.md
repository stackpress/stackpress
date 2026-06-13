# `Language`

`Language` manages locale selection and phrase translation. Stackpress uses it
with request/session data and saves locale changes back through the response.

## Import

```ts
import { Language } from 'stackpress/language';
```

## Static Properties

| Property | Type | Description |
| --- | --- | --- |
| `locales` | `string[]` | Configured locale keys. |
| `key` | `string` | Request/session key used for locale storage. |

## Static Methods

### `Language.configure(key, languages)`

Configures the locale storage key and language map.

**Returns** the `Language` class.

### `Language.language(name)`

Finds one configured language by locale key.

**Returns** the language entry with `label` and `translations`, or `null`.

### `Language.load(req, defaults?)`

Creates a `Language` instance from request data/session data.

**Returns** a `Language` instance.

## Instance Properties

| Property | Type | Description |
| --- | --- | --- |
| `label` | `string` | Human-readable label for the active locale. |
| `locale` | `string` | Active locale. Can be assigned to change locale. |
| `translations` | `Record<string, string>` | Translation map for the active locale. |

## Instance Methods

### `save(res)`

Saves the current locale to the response/session surface.

**Returns** the language instance.

### `update(locale, res)`

Changes locale and saves it to the response.

**Returns** the language instance.

### `translate(phrase, ...variables)`

Translates a phrase and interpolates scalar variables.

**Returns** the translated string, or the input phrase when no translation is
available.

## Example

```ts
const language = Language.load(req, 'en_US');
const label = language.translate('Sign In');
language.update('en_US', res);
```

This example loads the active language from the request, translates one phrase,
and writes the selected locale back to the response.

## Related

 - [Language Module](../language.md)
 - [View Client](../view-client.md)
