# Span Components

Use this reference for `@span.*` components.

## Type Affinities

Common type-to-span patterns:

- `Date` or `Datetime` -> `@span.date`, `@span.datetime`
- numeric scalar values -> `@span.number`, `@span.integer`
- simple strings -> `@span.string`, `@span.text`

## Derivation Rule

`span.*` is derived from `field.*`.

That means:

- span component names mirror field component names
- span props mirror the corresponding field props
- span aliases mirror the corresponding field aliases

## Common Span Components

- `@span.input(...)`
- `@span.textarea`
- `@span.editor(...)`
- `@span.password`
- `@span.checkbox`
- `@span.radio`
- `@span.switch`
- `@span.select`
- `@span.slider`
- `@span.suggest`
- `@span.mask(...)`
- `@span.date`
- `@span.datetime`
- `@span.time`
- `@span.number`
- `@span.integer`
- `@span.json`
- `@span.markdown`
- `@span.color(...)`
- `@span.currency(...)`
- `@span.country(...)`
- `@span.phone`
- `@span.price`
- `@span.email`
- `@span.url`
- `@span.code(...)`
- `@span.file(...)`
- `@span.filelist(...)`
- `@span.fieldset`
- `@span.image(...)`
- `@span.imagelist(...)`
- `@span.rating(...)`
- `@span.relation(...)`
- `@span.metadata(...)`
- `@span.slug`
- `@span.small`
- `@span.datelist(...)`
- `@span.datetimelist(...)`
- `@span.stringlist(...)`
- `@span.textlist(...)`
- `@span.timelist(...)`
- `@span.tags`
- `@span.string`
- `@span.boolean`
- `@span.text`
- `@span.float`
- `@span.object`
- `@span.hash`
- `@span.taglist`
- `@span.strings`
- `@span.texts`
- `@span.dates`
- `@span.datetimes`
- `@span.times`
- `@span.integers`
- `@span.integerlist`
- `@span.floats`
- `@span.floatlist`
- `@span.numbers`
- `@span.numberlist`

## HTML Mapping Rule

When a `span.*` component is the counterpart of one of the confirmed
input-mapped `field.*` components, it uses the same underlying HTML mapping.

## Complete Built-In Catalog

`span.*` mirrors the full `field.*` surface, including aliases, through
Stackpress derivation.

## Canonical Use

- use `@span.*` only when generated compact or inline display needs explicit
  component behavior
- for full prop definitions, use the corresponding entry in
  `field-components.md`
- for confirmed input-mapped counterparts, standard HTML-style input props are
  reasonable to use
