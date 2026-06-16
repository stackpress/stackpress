# Filter Components

Use this reference for `@filter.*` components.

## Type Affinities

Common type-to-filter patterns:

- `String` -> `@filter.input(...)`, `@filter.string`
- `Boolean` -> `@filter.switch`, `@filter.boolean`
- `Date` or `Datetime` -> `@filter.date`, `@filter.datetime`
- `Integer` or `Float` -> `@filter.number`
- foreign key scalars -> `@filter.relation(...)`

## Derivation Rule

`filter.*` is derived from `field.*`.

That means:

- filter component names mirror field component names
- filter props mirror the corresponding field props
- filter aliases mirror the corresponding field aliases

## Common Filter Components

- `@filter.input(...)`
- `@filter.textarea`
- `@filter.editor(...)`
- `@filter.password`
- `@filter.checkbox`
- `@filter.radio`
- `@filter.switch`
- `@filter.select`
- `@filter.slider`
- `@filter.suggest`
- `@filter.mask(...)`
- `@filter.date`
- `@filter.datetime`
- `@filter.time`
- `@filter.number`
- `@filter.integer`
- `@filter.json`
- `@filter.markdown`
- `@filter.color(...)`
- `@filter.currency(...)`
- `@filter.country(...)`
- `@filter.url`
- `@filter.email`
- `@filter.phone`
- `@filter.price`
- `@filter.code(...)`
- `@filter.file(...)`
- `@filter.filelist(...)`
- `@filter.fieldset`
- `@filter.image(...)`
- `@filter.imagelist(...)`
- `@filter.rating(...)`
- `@filter.relation(...)`
- `@filter.metadata(...)`
- `@filter.slug`
- `@filter.small`
- `@filter.stringlist(...)`
- `@filter.textlist(...)`
- `@filter.datelist(...)`
- `@filter.datetimelist(...)`
- `@filter.timelist(...)`
- `@filter.numberlist(...)`
- `@filter.tags`
- `@filter.string`
- `@filter.text`
- `@filter.float`
- `@filter.boolean`
- `@filter.object`
- `@filter.hash`
- `@filter.taglist`
- `@filter.strings`
- `@filter.texts`
- `@filter.dates`
- `@filter.datetimes`
- `@filter.times`
- `@filter.integers`
- `@filter.integerlist`
- `@filter.floats`
- `@filter.floatlist`
- `@filter.numbers`
- `@filter.numberlist`

## Important Specifics

- `@filter.relation(...)` uses the same required props as `@field.relation(...)`
  : `id`, `search`, and `template`
- `@filter.input(...)` uses the same prop shape as `@field.input(...)`
- `@filter.date`, `@filter.datetime`, and `@filter.number` use the same prop
  shape as their `field.*` counterparts
- for confirmed input-mapped components, the `filter.*` counterpart uses the
  same underlying HTML mapping as the `field.*` counterpart

## Complete Built-In Catalog

`filter.*` mirrors the full `field.*` surface, including aliases, through
Stackpress derivation.

## Canonical Use

- add filter metadata only when a generated filter UI needs explicit behavior
- if you need the full prop definition, look up the corresponding entry in
  `field-components.md`
- for confirmed input-mapped counterparts, standard HTML-style input props are
  reasonable to use
