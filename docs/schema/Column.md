# `Column`

`Column` represents one field inside a model or fieldset. It owns helpers for
name formatting, type metadata, assertions, components, value conversion, and
store behavior.

## Import

```ts
import { Column } from 'stackpress/schema';
```

## Instantiation

Use `Column.make(...)` when creating a column from Idea-style tokens.

```ts
const title = Column.make('title', 'String');
title.addAttribute('label', [ 'Title' ]);
```

This example creates a string column and adds a label attribute. In most
generator code, columns are read from `model.columns` or `model.column(...)`.

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `assertion` | `ColumnAssertion` | Validation/assertion helper. |
| `attributes` | `Attributes` | Attribute collection. |
| `component` | `ColumnComponent` | Field/list/view component metadata helper. |
| `document` | `ColumnDocument` | Documentation metadata helper. |
| `name` | `ColumnName` | Name formatting helper. |
| `number` | `ColumnNumber` | Numeric metadata helper. |
| `store` | `ColumnStore` | Store/query metadata helper. |
| `type` | `ColumnType` | Type metadata helper. |
| `value` | `ColumnValue` | Default/value metadata helper. |
| `hasParent` | `boolean` | Whether the column is attached to a fieldset/model. |
| `parent` | `Fieldset` | Parent fieldset or model. Throws if read before one is set. |

## Static Methods

### `Column.make(name, type, attributes?, parent?)`

Builds a column from Idea-style tokens.

**Returns** a `Column`.

## Instance Methods

### `addAttribute(attribute)`

Adds an existing `Attribute` object.

**Returns** the column instance for chaining.

### `addAttribute(name, value)`

Creates and adds an attribute.

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Attribute name. |
| `value` | `Data[] \| boolean` | Attribute args or boolean flag. |

**Returns** the column instance for chaining.

### `attribute(name)`

Finds an attribute by name.

**Returns** an `Attribute` when found, otherwise `undefined`.

```ts
const field = model.column('title');
const label = field?.attribute('label')?.value;
```

This example reads one column and then reads one attribute value from it.

## Related

 - [Fieldset](./Fieldset.md)
 - [Model](./Model.md)
 - [Attribute](./Attribute.md)
