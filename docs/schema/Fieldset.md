# `Fieldset`

`Fieldset` represents a reusable group of columns and attributes. `Model`
extends this class, so fieldset behavior also applies to models.

## Import

```ts
import { Fieldset } from 'stackpress/schema';
```

## Instantiation

Use `Fieldset.make(...)` when building from Idea tokens. The constructor accepts
already-built `Attributes` and `Columns` instances or arrays of `Attribute` and
`Column`.

```ts
const fieldset = Fieldset.make('Address');
fieldset.addColumn('street', 'String');
fieldset.addAttribute('label', [ 'Address' ]);
```

This example creates a fieldset and adds one column plus one attribute. The
methods return the fieldset, so they can also be chained.

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `assertion` | `FieldsetAssertion` | Assertion metadata helper. |
| `attributes` | `Attributes` | Attribute collection. |
| `columns` | `Columns` | Column collection. |
| `component` | `FieldsetComponent` | Component metadata helper. |
| `document` | `FieldsetDocument` | Documentation metadata helper. |
| `name` | `FieldsetName` | Name formatting helper. |
| `type` | `FieldsetType` | Type metadata helper. |
| `value` | `FieldsetValue` | Value metadata helper. |
| `hasSchema` | `boolean` | Whether this fieldset is attached to a schema. |
| `schema` | `Schema` | Parent schema. Throws if read before one is set. |

## Static Methods

### `Fieldset.make(name, attributes?, columns?, schema?)`

Builds a fieldset from Idea-style tokens.

**Returns** a `Fieldset`.

## Instance Methods

### `addAttribute(attribute)`

Adds an existing `Attribute` object.

**Returns** the fieldset instance for chaining.

### `addAttribute(name, value)`

Creates and adds an attribute.

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Attribute name. |
| `value` | `Data[] \| boolean` | Attribute args or boolean flag. |

**Returns** the fieldset instance for chaining.

### `addColumn(column)`

Adds an existing `Column` object.

**Returns** the fieldset instance for chaining.

### `addColumn(name, type, attributes?)`

Creates and adds a column.

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Column name. |
| `type` | `ColumnTypeToken` | Idea column type token. |
| `attributes` | `AttributesToken` | Optional column attributes. |

**Returns** the fieldset instance for chaining.

### `attribute(name)`

Finds an attribute by name.

**Returns** an `Attribute` when found, otherwise `undefined`.

### `column(name, format?)`

Finds a column by name. The optional `format` argument supports name formatting
used by Stackpress schema helpers.

**Returns** a `Column` when found, otherwise `undefined`.

## Related

 - [Schema](./Schema.md)
 - [Model](./Model.md)
 - [Column](./Column.md)
