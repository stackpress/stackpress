# `Model`

`Model` represents one app record type from `schema.idea`. It extends
`Fieldset` and adds model-store metadata used by generated SQL, admin, and
view output.

## Import

```ts
import { Model } from 'stackpress/schema';
```

## Instantiation

Use `Model.make(...)` when building from Idea tokens.

```ts
const model = Model.make('Article');
model.addColumn('title', 'String');
```

This example creates a model helper for an `Article` record and adds a string
column. In normal generator code, models usually come from `schema.models`
instead of being created by hand.

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `store` | `ModelStore` | Store metadata helper used by generated SQL and action output. |

`Model` also inherits `assertion`, `attributes`, `columns`, `component`,
`document`, `name`, `type`, `value`, `schema`, and fieldset methods from
`Fieldset`.

## Static Methods

### `Model.make(name, attributes?, columns?, schema?)`

Builds a model from Idea-style tokens.

**Returns** a `Model`.

## Instance Methods

Model-specific public methods are inherited from `Fieldset`. Use
`addColumn(...)`, `addAttribute(...)`, `column(...)`, and `attribute(...)` to
work with the model's source shape.

```ts
const article = schema.models.get('Article');
const title = article?.column('title');
```

This example reads a generated model from a `Schema` instance and looks up a
column safely.

## Related

 - [Schema](./Schema.md)
 - [Fieldset](./Fieldset.md)
 - [Column](./Column.md)
