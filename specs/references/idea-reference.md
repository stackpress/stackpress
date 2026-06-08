# Idea Reference

This page documents the built-in idea-file behavior that Stackpress schema processing understands today. It explains the supported type families, schema attributes, column attributes, assertion families, component families, and derived aliases that feed the Stackpress schema, SQL, and view layers.

## Table Of Contents

 - [Built-In Types](#built-in-types)
 - [Schema Attributes](#schema-attributes)
 - [Column Attributes](#column-attributes)
 - [Assertions](#assertions)
 - [Field Components](#field-components)
 - [View Components](#view-components)
 - [Derived Families And Aliases](#derived-families-and-aliases)

## Built-In Types

These are the built-in type families Stackpress maps into schema assertions, generated classes, and SQL behavior:

- `String`: free-form short text
- `Text`: longer text content
- `Number`: generic numeric value
- `Integer`: whole-number numeric value
- `Float`: decimal numeric value
- `Boolean`: true/false value
- `Date`: date-like value
- `Datetime`: date plus time value
- `Time`: time-only value
- `Object`: structured object value
- `Hash`: object-like keyed data
- `Json`: JSON-like object value

Each built-in type also implies a base assertion family. For example, `Integer` implies integer validation and `Date` implies date validation.

## Schema Attributes

Schema attributes apply at the model level. They shape how Stackpress describes, displays, queries, or labels a model.

### `@display(...)`

- Scope: schema/model
- Kind: method
- Purpose: defines a display template for a row using row variables.
- Arguments:
  - required template string
- Example:

```idea
@display("{{first_name}} {{last_name}}")
```

- Downstream effects:
  - display metadata for generated UI layers
  - model-level human-readable representation

### `@icon(...)`

- Scope: schema/model
- Kind: method
- Purpose: defines an icon name for a model.
- Arguments:
  - required icon string such as `user`, `cog`, or `database`
- Example:

```idea
@icon("user")
```

- Downstream effects:
  - display metadata for admin or generated UI layers

### `@labels(...)`

- Scope: schema/model
- Kind: method
- Purpose: defines the singular and plural labels for a model.
- Arguments:
  - required singular label
  - required plural label
- Example:

```idea
@labels("Article", "Articles")
```

- Downstream effects:
  - generated labels in admin, views, and display-oriented output

### `@query(...)`

- Scope: schema/model
- Kind: method
- Purpose: defines the default query columns returned for the model.
- Arguments:
  - one or more column/query selector strings
- Example:

```idea
@query("*", "author.*")
```

- Downstream effects:
  - default query behavior
  - generated SQL/search behavior

## Column Attributes

Column attributes apply at the field level. They influence validation, generation, SQL behavior, and display metadata.

### `@active`

- Scope: column/field
- Kind: flag
- Purpose: marks the active field used for soft-delete or restore-style flows instead of physically deleting rows.
- Example:

```idea
active Boolean @active
```

- Affects:
  - delete/restore behavior
  - generated store/admin workflows

### `@default(...)`

- Scope: column/field
- Kind: method
- Purpose: supplies a default value when no value is provided during create flows.
- Arguments:
  - required string, number, or boolean default value
- Example:

```idea
active Boolean @default(true)
```

- Affects:
  - create behavior
  - SQL defaults and generated behavior

### `@description(...)`

- Scope: column/field
- Kind: method
- Purpose: stores internal documentation for the column.
- Arguments:
  - required description string
- Affects:
  - generated docs or metadata-aware tooling

### `@examples(...)`

- Scope: column/field
- Kind: method
- Purpose: stores one or more example values for the column.
- Arguments:
  - one or more example values
- Affects:
  - generated docs or metadata-aware tooling

### `@encrypted`

- Scope: column/field
- Kind: flag
- Purpose: marks the field as reversibly encrypted.
- Affects:
  - storage behavior
  - generated create/update handling

### `@generated`

- Scope: column/field
- Kind: flag
- Purpose: marks the field as generated so validation can be bypassed for user input.
- Affects:
  - validation flow
  - generated form/action behavior

### `@hashed`

- Scope: column/field
- Kind: flag
- Purpose: marks the field as one-way hashed.
- Affects:
  - storage behavior
  - generated create/update handling

### `@id`

- Scope: column/field
- Kind: flag
- Purpose: marks the identifier field for the model. More than one `@id` creates a composite identifier.
- Affects:
  - uniqueness and model identity
  - generated store/detail/update/remove behavior

### `@searchable`

- Scope: column/field
- Kind: flag
- Purpose: marks the field as participating in search behavior and optimization decisions.
- Affects:
  - generated search flows
  - SQL optimization/indexing intent

### `@sortable`

- Scope: column/field
- Kind: flag
- Purpose: marks the field as participating in sorting behavior and optimization decisions.
- Affects:
  - generated sort flows
  - SQL optimization/indexing intent

### `@label(...)`

- Scope: column/field
- Kind: method
- Purpose: gives the field a display label different from its raw field name.
- Arguments:
  - required display label string
- Affects:
  - forms
  - generated UI
  - admin/search/filter labels

### `@min(...)`

- Scope: column/field
- Kind: method
- Purpose: defines the minimum accepted numeric value.
- Arguments:
  - required number
- Affects:
  - validation
  - database type decisions

### `@max(...)`

- Scope: column/field
- Kind: method
- Purpose: defines the maximum accepted numeric value.
- Arguments:
  - required number
- Affects:
  - validation
  - database type decisions

### `@step(...)`

- Scope: column/field
- Kind: method
- Purpose: defines the numeric increment amount used for the field.
- Arguments:
  - required number
- Affects:
  - UI control behavior
  - database type decisions

### `@relation(...)`

- Scope: column/field
- Kind: method
- Purpose: maps a local column to a related model column.
- Arguments:
  - required relation object with:
    - `local`
    - `foreign`
    - optional `name`
- Example:

```idea
profileId String @relation({ local: "profileId", foreign: "id", name: "profile" })
```

- Affects:
  - generated relation metadata
  - SQL joins
  - generated form/filter/view relation behavior

### `@timestamp`

- Scope: column/field
- Kind: flag
- Purpose: updates the field automatically whenever a row changes.
- Affects:
  - generated update behavior
  - timestamp maintenance

### `@unique`

- Scope: column/field
- Kind: flag
- Purpose: prevents duplicate values for the field.
- Affects:
  - validation
  - SQL uniqueness behavior

## Assertions

Assertions live under the `@is.*` family. They validate values before Stackpress writes or processes them.

### Presence And Equality

- `@is.required`
- `@is.ne`
- `@is.unique`
- `@is.eq(...)`
- `@is.neq(...)`
- `@is.option(...)`
- `@is.regex(...)`

Use these to require a value, disallow empty values, enforce uniqueness, compare against a fixed value, restrict values to a set of options, or require a specific format.

```idea
title String @is.required("Title is required") @is.regex("^[a-zA-Z0-9\\s]+$")
```

### Date And Time

- `@is.date`
- `@is.future`
- `@is.past`
- `@is.present`

Use these for date correctness and date-relative rules.

```idea
published Date @is.future("Published date must be in the future")
```

### Numeric Comparison

- `@is.gt(...)`
- `@is.ge(...)`
- `@is.lt(...)`
- `@is.le(...)`

Use these when the field value itself must compare against a numeric boundary.

```idea
price Float @is.gt(0, "Price must be greater than zero")
```

### Character Count

- `@is.ceq(...)`
- `@is.cgt(...)`
- `@is.cge(...)`
- `@is.clt(...)`
- `@is.cle(...)`

Use these when the character length of a string must match or compare against a number.

```idea
title String @is.cge(3) @is.cle(120)
```

### Word Count

- `@is.weq(...)`
- `@is.wgt(...)`
- `@is.wge(...)`
- `@is.wlt(...)`
- `@is.wle(...)`

Use these when the word count of a string must match or compare against a number.

```idea
summary Text @is.wle(30)
```

### Format And Casing

- `@is.lowercase`
- `@is.uppercase`
- `@is.slug`
- `@is.cc`
- `@is.color`
- `@is.email`
- `@is.hex`
- `@is.price`
- `@is.url`

Use these to enforce conventional formats and casing rules.

```idea
slug String @is.slug("Slug must be URL-friendly")
email String @is.email("Must be a valid email address")
```

### Type Checks

- `@is.string`
- `@is.boolean`
- `@is.number`
- `@is.float`
- `@is.integer`
- `@is.object`

Use these when a field must explicitly validate against a type-oriented constraint.

```idea
metadata Json @is.object("Metadata must be an object")
```

## Field Components

Field components influence how generated forms and field widgets are represented.

### Common Input Components

- `input`
- `textarea`
- `editor`
- `password`
- `checkbox`
- `radio`
- `switch`
- `select`
- `slider`
- `suggest`
- `mask`

Use these to choose the input style for generated field UI.

```idea
password String @field.password
status String @field.select
```

### Type-Oriented Components

- `date`
- `datetime`
- `time`
- `number`
- `integer`
- `json`
- `markdown`
- `color`
- `currency`
- `country`
- `phone`
- `price`
- `email`
- `url`

Use these when a field should render with a more specialized input or formatter.

```idea
published Date @field.date
price Float @field.price
```

### Collection Components

- `datelist`
- `datetimelist`
- `numberlist`
- `stringlist`
- `textlist`
- `timelist`
- `filelist`
- `imagelist`
- `tags`

Use these when a field represents repeated values instead of one scalar value.

```idea
tags String[] @field.tags
```

### Relation And Structure Components

- `fieldset`
- `relation`
- `metadata`

Use these for structured, nested, or relation-aware generated fields.

```idea
profileId String @field.relation
```

## View Components

View components influence how values are rendered in generated display layers.

### Formatting Components

- `capitalize`
- `lowercase`
- `uppercase`
- `comma`
- `number`
- `price`
- `currency`
- `relative`
- `date`
- `time`

Use these when a value should render with a formatting rule.

```idea
price Float @view.price
published Date @view.relative
```

### Rich Content Components

- `html`
- `markdown`
- `json`
- `metadata`
- `code`
- `image`
- `carousel`

Use these when a value should render as richer content than plain text.

```idea
body Text @view.markdown
```

### Structural Components

- `list`
- `ol`
- `ul`
- `tabular`
- `spread`
- `overflow`
- `template`

Use these when the output should render as a collection, table, overflow view, or reusable template pattern.

```idea
tags String[] @view.list
```

### Relation And Link Components

- `rel`
- `link`
- `email`
- `phone`

Use these when the value should render as a navigable or related output.

```idea
website String @view.link
```

## Derived Families And Aliases

Stackpress derives some component families automatically:

- `filter` and `span` families derive from field components
- `list` families derive from view components

Stackpress also exposes aliases so common conceptual names map to built-in components. Examples include:

- field aliases such as `string`, `text`, `boolean`, `taglist`
- view aliases such as `table`, `clip`, `string`, `taglist`

These aliases let idea files express intent using names closer to the final UI or display behavior.

## Related

 - [Schema](./schema.md)
 - [Types](./types.md)
 - [Idea Files](../guides/300/310-idea-files.md)
