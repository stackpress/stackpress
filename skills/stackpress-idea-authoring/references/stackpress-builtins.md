# Stackpress Built-Ins

Use this reference to confirm what Stackpress gives built-in meaning to by
default when reading `schema.idea`.

## Boundary

Idea itself defines syntax, declarations, literals, arrays, objects, comments,
and `use` composition.

Stackpress defines the default semantics for:

- built-in types
- schema attributes
- column attributes
- assertion families
- component families
- derived alias families

If a pattern is valid Idea syntax but is not in the Stackpress built-in set,
do not recommend it as a normal Stackpress authoring convention.

## Reference Map

Use these files as the portable local contract for Stackpress built-ins:

- `types.md`
- `model-attributes.md`
- `column-attributes.md`
- `validators.md`
- `field-components.md`
- `filter-components.md`
- `span-components.md`
- `list-components.md`
- `view-components.md`

## Family Rules

- `filter.*` derives from `field.*`
- `span.*` derives from `field.*`
- `list.*` derives from `view.*`

When a derived family entry needs exact props, use the corresponding source
family file:

- `@filter.relation(...)` -> `field-components.md`
- `@span.date` -> `field-components.md`
- `@list.code(...)` -> `view-components.md`
- `@list.template(...)` -> `view-components.md`

## How Built-Ins Relate

Stackpress built-ins work across three layers:

- column types express the data meaning
- attribute families express author intent for validation, input, filtering, or
  display
- generated component families resolve that intent into React component usage

Typical relationship examples:

- `Text` often pairs with `@field.textarea`, `@field.editor(...)`,
  `@view.markdown`, or `@view.html`
- `Datetime` often pairs with `@field.datetime`, `@list.date(...)`, and
  `@view.date(...)`
- `Hash` or `Json` often pairs with `@field.metadata(...)`, `@view.metadata(...)`,
  or `@view.json`
- scalar foreign key fields often pair with `@field.relation(...)`,
  `@filter.relation(...)`, `@list.template(...)`, and `@view.template(...)`

These are affinities, not hard requirements. The type gives the field its data
meaning. The family gives the field its generated behavior.

## React Translation

`field.*`, `filter.*`, `span.*`, `list.*`, and `view.*` ultimately translate to
React component usage in the generated Stackpress surfaces.

Important rule:

- when the first argument is an object, Stackpress treats that object as
  component props

Examples:

- `@field.editor({ history true list true })`
- `@field.relation({ id "id" search "/admin/profile/search?json" template "{{name}}" })`
- `@view.template({ template "{{profile.name}}" })`
- `@list.code({ language "typescript" })`

This is why prop-heavy built-ins should be reasoned about as component prop
contracts rather than as arbitrary metadata blobs.

## Input HTML Mapping

Some `field.*` built-ins map directly to HTML input elements. When they do,
familiar HTML-style props such as `placeholder`, `required`, `min`, `max`,
`step`, `name`, `disabled`, and similar input attributes are reasonable to
expect in addition to documented component props.

Confirmed mappings:

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

Inheritance rule:

- if one of these fields has a `filter.*` counterpart, it uses the same HTML
  mapping
- if one of these fields has a `span.*` counterpart, it uses the same HTML
  mapping

Do not assume this rule for components that are not in the confirmed mapping
list.

## Canonical Use Guidance

- Prefer Stackpress built-ins even when generic Idea would allow looser
  metadata.
- Use aliases only when they are part of the local built-in reference set.
- Do not invent new attribute namespaces or component names unless the user
  explicitly asks to extend Stackpress.
- When a built-in is unclear, resolve it through the category files above before
  suggesting syntax.
