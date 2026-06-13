# `stackpress/schema`

`stackpress/schema` is the interpreted schema layer behind `schema.idea`. It exposes the dictionaries, classes, attribute helpers, and generator-facing utilities that turn idea-file declarations into Stackpress-aware schema objects.

## Import

```ts
import {
  Schema,
  Model,
  Column,
  dictionary,
  generators
} from 'stackpress/schema';
```

## When To Use It

Use this path when you need to inspect, extend, or consume Stackpress schema structures after idea files have been parsed.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `TypeDictionary`, `AttributeDictionary`, `AssertionDictionary`, `ComponentDictionary` | classes | Built-in lookup dictionaries |
| `dictionary` | helper object | Prebuilt dictionary bundle |
| `Schema`, `Model`, `Column`, `Fieldset` | classes | Main schema object model |
| `Attributes`, `Attribute`, `AttributeAssertion`, `AttributeComponent` | classes | Attribute parsing and storage helpers |
| `Columns`, `ColumnStore`, `ModelStore` | classes | Column and model collection/store helpers |
| `generators` | helper object | Generation-facing helper family |
| `defineAttributes`, `defineAssertions`, `defineComponents`, `defineBuiltIn` | functions | Register or extend built-ins |
| string/data helpers | functions | Transform names and values for generated output |

## Detailed Exports

### `TypeDictionary`, `AttributeDictionary`, `AssertionDictionary`, `ComponentDictionary`

- Kind: classes
- Use them to look up the built-in schema type, attribute, assertion, or component definitions that Stackpress understands.
- **Returns** dictionary instances that map idea-file tokens to Stackpress metadata.

```ts
import { TypeDictionary, AttributeDictionary } from 'stackpress/schema';
```

### `dictionary`

- Kind: helper object
- Use it when you want the default dictionary bundle without instantiating each dictionary separately.
- **Returns** a grouped dictionary surface for type, attribute, assertion, and component lookups.

```ts
import { dictionary } from 'stackpress/schema';
```

### `Schema`

- Kind: class
- Use it as the top-level interpreted schema object.
- Common shape:
  - contains models
  - contains enums and definitions
  - drives generation and schema-aware tooling

```ts
import { Schema } from 'stackpress/schema';
```

### `Model`

- Kind: class
- Use it to inspect one model from the schema.
- Common shape:
  - name and labels
  - columns
  - model-level attributes such as display/query/icon metadata

```ts
import { Model } from 'stackpress/schema';
```

### `Column`

- Kind: class
- Use it to inspect one field/column definition.
- Common shape:
  - column name
  - type
  - assertions
  - attributes
  - relation metadata when present

```ts
import { Column } from 'stackpress/schema';
```

### `Fieldset`

- Kind: class
- Use it when a field groups nested or structured column behavior.

```ts
import { Fieldset } from 'stackpress/schema';
```

### `Attributes`, `Attribute`, `AttributeAssertion`, `AttributeComponent`, `AttributeReference`

- Kind: classes
- Use them to work with the metadata attached to models and columns.
- `Attributes` holds grouped attribute data.
- `Attribute` is the base attribute wrapper.
- `AttributeAssertion` represents validation-oriented attribute definitions.
- `AttributeComponent` represents field/view component-oriented attribute definitions.
- `AttributeReference` represents referenced attribute relationships.

```ts
import { Attributes, AttributeAssertion } from 'stackpress/schema';
```

### `Columns`, `ColumnStore`, `ModelStore`

- Kind: classes
- Use them to manage collections of columns or models when building generation or inspection tooling.

```ts
import { Columns, ModelStore } from 'stackpress/schema';
```

### `generators`

- Kind: helper object
- Use it when you need the built-in generation helpers that transform schema objects into other output layers.

```ts
import { generators } from 'stackpress/schema';
```

### `defineAttributes`, `defineAssertions`, `defineComponents`, `defineBuiltIn`

- Kind: functions
- Use them to extend or register schema built-ins.
- **Returns** updated built-in definition structures.

```ts
import { defineAttributes, defineBuiltIn } from 'stackpress/schema';
```

### Naming And Value Helpers

- `camelize`
- `capitalize`
- `dasherize`
- `lowerize`
- `snakerize`
- `removeUndefined`
- `encrypt`
- `decrypt`
- `hash`

Use these helpers when building generation or schema-driven transforms that need Stackpress-compatible naming and value behavior.

```ts
import { camelize, snakerize, removeUndefined } from 'stackpress/schema';
```

## Integration Example

```ts
import { Schema, dictionary } from 'stackpress/schema';
```

## Related

 - [Schema Detail Pages](./schema/README.md)
 - [Schema Class](./schema/Schema.md)
 - [Model Class](./schema/Model.md)
 - [Column Class](./schema/Column.md)
 - [Idea Reference](./idea-reference.md)
 - [Types](./types.md)
 - [Generation](../guides/300/330-generation.md)
