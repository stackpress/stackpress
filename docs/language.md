# `stackpress/language`

`stackpress/language` exposes the public `Language` runtime class and the translation-related type surface behind Stackpress language handling.

## Import

```ts
import { Language } from 'stackpress/language';

const language = new Language();
```

## When To Use It

Use this path when you need to work with the translation runtime directly instead of only consuming language values through the view layer.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `Language` | class | Main translation/runtime language object |

## Detailed Exports

### `Language`

- Kind: class
- Use it to represent and resolve the active language map for a Stackpress app.
- Common responsibilities:
  - hold the active locale
  - expose translation data
  - coordinate locale-aware value lookup

```ts
import { Language } from 'stackpress/language';
```

## Related

 - [Language Detail Pages](./language/README.md)
 - [Language Class](./language/Language.md)
 - [View](./view.md)
 - [Types](./types.md)
