# View Components

Use this reference for `@view.*` components that shape detail output.

## Type Affinities

Common type-to-view patterns:

- `String` -> `@view.string`, `@view.link(...)`, `@view.email(...)`,
  `@view.phone(...)`
- `Text` -> `@view.text`, `@view.markdown`, `@view.html`
- `Integer` or `Float` -> `@view.number`, `@view.price`, `@view.currency`
- `Date` or `Datetime` -> `@view.date(...)`, `@view.relative`, `@view.time(...)`
- `Hash` or `Json` -> `@view.metadata(...)`, `@view.json`
- image URLs -> `@view.image(...)`, `@view.carousel(...)`
- related scalar or relation-backed display -> `@view.template(...)`

## Formatting Components

- `@view.capitalize`
- `@view.lowercase`
- `@view.uppercase`
- `@view.comma`
- `@view.transform(...)`
- `@view.number`
- `@view.price`
- `@view.currency`
- `@view.country`
- `@view.relative`
- `@view.rel`
- `@view.date(...)`
- `@view.time(...)`
- `@view.line(...)`
- `@view.chars(...)`
- `@view.words(...)`

## Rich Content Components

- `@view.html`
- `@view.markdown`
- `@view.json`
- `@view.metadata(...)`
- `@view.code(...)`
- `@view.image(...)`
- `@view.carousel(...)`
- `@view.film(...)`
- `@view.formula(...)`
- `@view.rating(...)`

## Structural Components

- `@view.fieldset`
- `@view.list`
- `@view.ol`
- `@view.ul`
- `@view.tabular`
- `@view.spread`
- `@view.overflow`
- `@view.template(...)`

## Relation And Link Components

- `@view.rel(...)`
- `@view.link(...)`
- `@view.email(...)`
- `@view.phone(...)`

## Important Aliases

- `@view.table`
- `@view.taglist`
- `@view.clip`
- `@view.string`
- `@view.float`
- `@view.integer`
- `@view.boolean`
- `@view.datetime`
- `@view.object`
- `@view.hash`
- `@view.strings`
- `@view.texts`
- `@view.dates`
- `@view.datetimes`
- `@view.times`
- `@view.integers`
- `@view.floats`
- `@view.numbers`
- `@view.stringlist`
- `@view.textlist`
- `@view.datelist`
- `@view.datetimelist`
- `@view.timelist`
- `@view.integerlist`
- `@view.floatlist`
- `@view.numberlist`

## Prop-Heavy Definitions

### `@view.template(...)`

Required props:

- `template`

Canonical example:

```idea
@view.template({ template "{{profile.name}}" })
```

### `@view.image(...)`

Common props:

- `alt`
- `className`
- `style`

### `@view.metadata(...)`

Common props:

- `className`
- `style`

### `@view.code(...)`

Required props:

- `language`

Common optional props:

- `addDefaultStyles`
- `className`
- `langClassName`
- `langStyle`
- `numbers`
- `showLanguage`
- `showLineNumbers`
- `startingLineNumber`
- `style`

### `@view.carousel(...)`

Common props:

- `auto`
- `defaultIndex`
- `film`
- `frame`
- `hidden`
- `image`
- `repeat`
- `scroll`
- `style`
- `className`

### `@view.number`

Common props:

- `absolute`
- `decimal`
- `decimals`
- `separator`

### `@view.price`

Common props:

- `absolute`

Default formatting carries `2` decimals with standard separators.

### `@view.date(...)`, `@view.time(...)`, `@view.relative`, `@view.rel`

Shared common props:

- `locale`

`@view.date(...)` may also take `format`.

### `@view.link(...)`, `@view.email(...)`, `@view.phone(...)`

Shared common props:

- `className`
- `style`
- `target`
- `title`

### `@view.spread`

Common props:

- `className`
- `separator`
- `style`

### `@view.tabular`

Common props:

- `className`
- `style`
- `stripes`

### `@view.list`

Common props:

- `ordered`

### `@view.overflow`, `@view.chars`, `@view.words`

Shared common props:

- `length`
- `hellip`

`@view.overflow` may also take `words`.

### `@view.transform(...)`

Common props:

- `format`

### `@view.color(...)`, `@view.country`, `@view.currency`

Shared common props:

- `className`
- `style`

`@view.color(...)` may also take `box`, `text`, and size flags `sm`, `md`,
`lg`.

`@view.country` and `@view.currency` may also take `flag`, `text`, and size
flags `sm`, `md`, `lg`.

### `@view.rating(...)`

Common props:

- `max`
- `remainder`
- `round`

### `@view.film(...)`

Common props:

- `className`
- `frame`
- `image`
- `style`

### `@view.formula(...)`

Required props:

- `formula`

### `@view.yesno`

Common props:

- `yes`
- `no`

## Complete Built-In Catalog

Source view names mirrored from Stackpress:

- `@view.capitalize`
- `@view.carousel(...)`
- `@view.chars(...)`
- `@view.code(...)`
- `@view.color(...)`
- `@view.comma`
- `@view.country`
- `@view.currency`
- `@view.date(...)`
- `@view.email(...)`
- `@view.fieldset`
- `@view.film(...)`
- `@view.formula(...)`
- `@view.html`
- `@view.image(...)`
- `@view.json`
- `@view.line(...)`
- `@view.link(...)`
- `@view.list`
- `@view.lowercase`
- `@view.markdown`
- `@view.metadata(...)`
- `@view.number`
- `@view.ol`
- `@view.overflow`
- `@view.phone(...)`
- `@view.price`
- `@view.rating(...)`
- `@view.rel`
- `@view.relative`
- `@view.spread`
- `@view.tabular`
- `@view.tags`
- `@view.template(...)`
- `@view.text`
- `@view.time(...)`
- `@view.transform(...)`
- `@view.ul`
- `@view.uppercase`
- `@view.words(...)`
- `@view.yesno`

## Canonical Use

- use `@view.template(...)` for related or multi-field presentation
- use `@view.html` when rich editor content should render as HTML
- use `@view.image(...)` for URL-backed images
- use `@view.code(...)` when code display is intentional and language is known
