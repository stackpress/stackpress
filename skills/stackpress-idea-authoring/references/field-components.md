# Field Components

Use this reference for `@field.*` components that shape generated form inputs.

## Type Affinities

Common type-to-field patterns:

- `String` -> `@field.input(...)`, `@field.string`, `@field.email`,
  `@field.url`, `@field.phone`, `@field.password`, `@field.mask(...)`
- `Text` -> `@field.textarea`, `@field.editor(...)`, `@field.markdown`
- `Integer` or `Float` -> `@field.integer`, `@field.number`, `@field.price`
- `Date` or `Datetime` -> `@field.date`, `@field.datetime`, `@field.time`
- `Hash` or `Json` -> `@field.metadata(...)`, `@field.json`
- foreign key scalars -> `@field.relation(...)`

These are canonical pairings, not rigid rules.

## Common Input Components

- `@field.input(...)`
- `@field.textarea`
- `@field.editor(...)`
- `@field.password`
- `@field.checkbox`
- `@field.radio`
- `@field.switch`
- `@field.select`
- `@field.slider`
- `@field.suggest`
- `@field.mask(...)`
- `@field.slug`
- `@field.small`
- `@field.rating(...)`

## Confirmed HTML Mappings

- `@field.input` -> `<input>`
- `@field.textarea` -> `<textarea>`
- `@field.password` -> `<input type="password">`
- `@field.checkbox` -> `<input type="checkbox">`
- `@field.radio` -> `<input type="radio">`
- `@field.switch` -> `<input type="checkbox">`
- `@field.suggest` -> `<input type="text">`
- `@field.mask` -> `<input type="text">`
- `@field.date` -> `<input type="date">`
- `@field.datetime` -> `<input type="datetime-local">`
- `@field.time` -> `<input type="time">`
- `@field.number` -> `<input type="number">`
- `@field.integer` -> `<input type="number" step="0">`
- `@field.phone` -> `<input type="tel">`
- `@field.price` -> `<input type="number" step="0.01">`
- `@field.email` -> `<input type="email">`
- `@field.url` -> `<input type="url">`

These mappings mean familiar HTML-style props such as `placeholder`,
`required`, `disabled`, `name`, `min`, `max`, and `step` may be meaningful for
these built-ins in addition to their documented component props.

## Type-Oriented Components

- `@field.date`
- `@field.datetime`
- `@field.time`
- `@field.number`
- `@field.integer`
- `@field.json`
- `@field.markdown`
- `@field.color(...)`
- `@field.currency(...)`
- `@field.country(...)`
- `@field.phone`
- `@field.price`
- `@field.email`
- `@field.url`
- `@field.code(...)`
- `@field.file(...)`
- `@field.image(...)`

## Collection Components

- `@field.datelist(...)`
- `@field.datetimelist(...)`
- `@field.numberlist(...)`
- `@field.stringlist(...)`
- `@field.textlist(...)`
- `@field.timelist(...)`
- `@field.filelist(...)`
- `@field.imagelist(...)`
- `@field.tags`

## Relation And Structure Components

- `@field.fieldset`
- `@field.relation(...)`
- `@field.metadata(...)`

## Important Aliases

- `@field.string`
- `@field.text`
- `@field.float`
- `@field.boolean`
- `@field.object`
- `@field.hash`
- `@field.taglist`
- `@field.strings`
- `@field.texts`
- `@field.dates`
- `@field.datetimes`
- `@field.times`
- `@field.integers`
- `@field.integerlist`
- `@field.floats`
- `@field.floatlist`
- `@field.numbers`
- `@field.numberlist`

## Prop-Heavy Definitions

### `@field.input(...)`

Common props:

- `className`
- `placeholder`
- `style`

### `@field.integer`

Common props:

- `absolute`
- `className`
- `min`
- `max`
- `separator`
- `style`

### `@field.number`

Common props:

- `absolute`
- `className`
- `decimal`
- `min`
- `max`
- `separator`
- `step`
- `style`

### `@field.editor(...)`

Purpose:

- rich HTML-oriented content editing

Common props:

- `history`
- `font`
- `size`
- `format`
- `paragraph`
- `blockquote`
- `color`
- `highlight`
- `text`
- `textStyle`
- `align`
- `list`
- `code`
- `link`
- `indent`
- `rule`
- `table`
- `preview`
- `fullscreen`
- `audio`
- `video`
- `math`
- `style`
- `className`

Canonical example:

```idea
contents Text?
  @field.editor({
    history true
    font true
    size true
    format true
    paragraph true
    blockquote true
    color true
    highlight true
    text true
    textStyle true
    align true
    list true
    code true
  })
```

### `@field.relation(...)`

Required props:

- `id`
- `search`
- `template`

Canonical example:

```idea
profileId String
  @field.relation({
    id "id"
    search "/admin/profile/search?json&q={{query}}"
    template "{{name}}"
  })
```

### `@field.metadata(...)`

Common props:

- `add`
- `placeholder`
- `min`
- `max`
- `step`
- `className`
- `style`

### `@field.mask(...)`

Required props:

- `mask`

### `@field.code(...)`

Common props:

- `language`
- `setup`
- `extensions`
- `numbers`
- `className`

### `@field.select`

Common props:

- `className`
- `display`
- `dropdown`
- `option`
- `options`
- `placeholder`

### `@field.slider`

Common props:

- `asc`
- `className`
- `min`
- `max`
- `step`
- `connect`
- `handles`
- `inputs`
- `range`
- `track`
- `style`
- color flags such as `primary`, `secondary`, `success`, `warning`, `info`,
  `muted`, `black`, `white`
- background flags such as `bgprimary`, `bgsecondary`, `bgsuccess`,
  `bgwarning`, `bginfo`, `bgmuted`, `bgblack`, `bgwhite`, or `bgcolor`

### `@field.suggest`

Common props:

- `className`
- `options`
- `remote`
- `style`

### `@field.tags`

Common props:

- `className`
- `placeholder`
- `style`
- `color`
- `danger`
- `info`
- `muted`
- `success`
- `warning`

### `@field.file(...)`

Common props:

- `className`
- `style`
- `uploading`

### `@field.filelist(...)`

Common props:

- `className`
- `style`
- `uploading`

### `@field.image(...)`

Common props:

- `className`
- `style`

### `@field.imagelist(...)`

Common props:

- `className`
- `style`

### `@field.markdown`

Common props:

- `className`
- `rows`
- `style`

### `@field.json`

Common props:

- `className`
- `extensions`
- `numbers`

### `@field.color(...)`

Common props:

- `className`
- `input`
- `picker`
- `style`

### `@field.country(...)`

Common props:

- `className`
- `display`
- `dropdown`
- `option`
- `placeholder`
- `searchable`
- `style`

### `@field.currency(...)`

Common props:

- `className`
- `display`
- `dropdown`
- `option`
- `placeholder`
- `searchable`
- `style`

### `@field.phone`

Common props:

- `className`
- `defaultCountry`
- `searchable`
- `dropdown`
- `option`
- `control`
- `top`
- `right`
- `bottom`
- `left`
- `style`

### `@field.rating(...)`

Common props:

- `className`
- `max`
- `size`
- `style`

### `@field.checkbox`, `@field.radio`, `@field.switch`

Shared common props:

- `className`
- `label`
- `style`
- `checked`
- `defaultChecked`
- `blue`
- `orange`
- `rounded`
- `square`
- `circle`
- `check`

### `@field.stringlist(...)`, `@field.textlist(...)`, `@field.datelist(...)`,
### `@field.datetimelist(...)`, `@field.timelist(...)`, `@field.numberlist(...)`

Shared common props:

- `add`
- `className`
- `placeholder`
- `style`

`@field.textlist(...)` and `@field.metadata(...)` may also carry type-oriented
configuration internally.

## Complete Built-In Catalog

Source field names mirrored from Stackpress:

- `@field.checkbox`
- `@field.code(...)`
- `@field.color(...)`
- `@field.country(...)`
- `@field.currency(...)`
- `@field.date`
- `@field.datelist(...)`
- `@field.datetime`
- `@field.datetimelist(...)`
- `@field.editor(...)`
- `@field.email`
- `@field.fieldset`
- `@field.file(...)`
- `@field.filelist(...)`
- `@field.image(...)`
- `@field.imagelist(...)`
- `@field.input(...)`
- `@field.integer`
- `@field.json`
- `@field.markdown`
- `@field.mask(...)`
- `@field.metadata(...)`
- `@field.number`
- `@field.numberlist(...)`
- `@field.password`
- `@field.phone`
- `@field.price`
- `@field.radio`
- `@field.rating(...)`
- `@field.relation(...)`
- `@field.select`
- `@field.slider`
- `@field.slug`
- `@field.small`
- `@field.stringlist(...)`
- `@field.suggest`
- `@field.switch`
- `@field.tags`
- `@field.textarea`
- `@field.textlist(...)`
- `@field.time`
- `@field.timelist(...)`
- `@field.url`

## Canonical Use

- use `@field.input(...)` or aliases like `@field.string` for simple scalar
  input
- use `@field.editor(...)` only for true rich text fields
- use `@field.relation(...)` on scalar foreign key fields
- use `@field.metadata(...)` for flexible key/value object editing
- for the built-ins listed in `Confirmed HTML Mappings`, standard HTML-style
  input props are reasonable to use
