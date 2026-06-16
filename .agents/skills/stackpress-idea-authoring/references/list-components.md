# List Components

Use this reference for `@list.*` components that shape list and tabular output.

## Type Affinities

Common type-to-list patterns:

- `String` -> `@list.string`, `@list.clip`
- `Text` -> `@list.text`, `@list.markdown`
- `Integer` or `Float` -> `@list.number`, `@list.price`
- `Date` or `Datetime` -> `@list.date(...)`, `@list.relative`
- `Hash` or `Json` -> `@list.metadata(...)`, `@list.json`
- image URLs -> `@list.image(...)`
- related scalar keys -> `@list.template(...)`

## Derivation Rule

`list.*` is derived from `view.*`.

That means:

- list component names mirror view component names
- list props mirror the corresponding view props
- list aliases mirror the corresponding view aliases

## Common List Components

- `@list.capitalize`
- `@list.lowercase`
- `@list.uppercase`
- `@list.comma`
- `@list.string`
- `@list.text`
- `@list.number`
- `@list.price`
- `@list.currency`
- `@list.country`
- `@list.color(...)`
- `@list.rel`
- `@list.date(...)`
- `@list.time(...)`
- `@list.relative`
- `@list.line(...)`
- `@list.chars(...)`
- `@list.words(...)`
- `@list.html`
- `@list.markdown`
- `@list.json`
- `@list.metadata(...)`
- `@list.code(...)`
- `@list.image(...)`
- `@list.carousel(...)`
- `@list.film(...)`
- `@list.formula(...)`
- `@list.rating(...)`
- `@list.link(...)`
- `@list.email(...)`
- `@list.phone(...)`
- `@list.rel(...)`
- `@list.fieldset`
- `@list.list`
- `@list.ol`
- `@list.ul`
- `@list.tabular`
- `@list.spread`
- `@list.overflow`
- `@list.tags`
- `@list.template(...)`
- `@list.yesno`
- `@list.table`
- `@list.taglist`
- `@list.clip`
- `@list.float`
- `@list.integer`
- `@list.boolean`
- `@list.datetime`
- `@list.object`
- `@list.hash`
- `@list.strings`
- `@list.texts`
- `@list.dates`
- `@list.datetimes`
- `@list.times`
- `@list.integers`
- `@list.floats`
- `@list.numbers`
- `@list.stringlist`
- `@list.textlist`
- `@list.datelist`
- `@list.datetimelist`
- `@list.timelist`
- `@list.integerlist`
- `@list.floatlist`
- `@list.numberlist`
- `@list.transform(...)`

## Important Specifics

### `@list.code(...)`

Uses the same prop shape as `@view.code(...)`:

- required `language`
- optional `addDefaultStyles`
- optional `className`
- optional `langClassName`
- optional `langStyle`
- optional `numbers`
- optional `showLanguage`
- optional `showLineNumbers`
- optional `startingLineNumber`
- optional `style`

### `@list.image(...)`

Uses the same prop shape as `@view.image(...)`:

- optional `alt`
- optional `className`
- optional `style`

### `@list.template(...)`

Uses the same prop shape as `@view.template(...)`:

- required `template`

## Complete Built-In Catalog

`list.*` mirrors the full `view.*` surface, including aliases, through
Stackpress derivation.

## Canonical Use

- use list components for tabular or collection-oriented output
- if you need the full prop definition, look up the corresponding entry in
  `view-components.md`
