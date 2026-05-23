# `stackpress/unocss`

`stackpress/unocss` exports the Stackpress UnoCSS preset as a single default export.

## Import

```ts
import preset from 'stackpress/unocss';
```

## When To Use It

Use this path when your app already uses UnoCSS and you want the Stackpress preset for responsive variants, theme helpers, and pixel-oriented utility rules.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `default` | preset object | Stackpress UnoCSS preset |

## Detailed Exports

### `default`

- Kind: preset object
- Source shape: `definePreset(() => ({ ... }))`
- **Returns** a UnoCSS preset definition with:
  - responsive desktop-first variants such as `r4xl-*`, `rmd-*`, `rsm-*`
  - theme color helpers such as `theme-*`, `theme-bg-*`, `theme-bc-*`
  - hex/rgb/rgba color rules
  - pixel-based spacing, border, layout, size, and typography helpers

```ts
import preset from 'stackpress/unocss';

export default {
  presets: [preset]
};
```

## Related

 - [View](./view.md)
