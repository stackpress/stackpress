# `Schema`

`Schema` is the generated-schema helper used by transforms and schema-aware
code. It stores enums, fieldsets, models, plugins, and props in map-like
collections.

## Import

```ts
import { Schema } from 'stackpress/schema';
```

## Instantiation

Use `Schema.make(config)` when you are inside a generator and already have a
raw `SchemaConfig` from Idea parsing. Use `new Schema()` only when building a
schema object manually for tests or helper code.

```ts
const schema = Schema.make(props.schema);

for (const model of schema.models.values()) {
  console.log(model.name.singular);
}
```

This example is the normal transform pattern. `props.schema` is the raw
generation payload, and `Schema.make(...)` rebuilds the class helpers used by
Stackpress generators.

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `enums` | `DataMap<string, EnumConfig>` | Enum declarations keyed by name. |
| `fieldsets` | `DataMap<string, Fieldset>` | Fieldset declarations keyed by name. |
| `models` | `DataMap<string, Model>` | Model declarations keyed by name. |
| `plugins` | `DataMap<string, PluginConfig>` | Idea plugin declarations keyed by module/path. |
| `props` | `DataMap<string, PropConfig>` | Top-level idea props keyed by name. |

## Static Methods

### `Schema.make(config)`

Creates a `Schema` instance from a raw `SchemaConfig`.

| Parameter | Type | Description |
| --- | --- | --- |
| `config` | `SchemaConfig` | Parsed Idea schema payload. |

**Returns** a `Schema` instance with helper collections populated.

```ts
const schema = Schema.make(props.schema);
const article = schema.models.get('Article');
```

This example creates a helper and reads one model by name. If the model does
not exist, the map lookup returns no value.

## Instance Methods

### `makeEnum(name, options)`

Adds an enum declaration to `schema.enums`.

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Enum name. |
| `options` | `EnumConfig` | Enum option config from Idea parsing. |

**Returns** the enum config that was stored.

### `makeFieldset(name, attributes?, columns?)`

Creates and stores a `Fieldset`.

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Fieldset name. |
| `attributes` | `AttributesToken` | Optional fieldset attributes. |
| `columns` | `ColumnToken[]` | Optional fieldset columns. |

**Returns** the created `Fieldset`.

### `makeModel(name, attributes?, columns?)`

Creates and stores a `Model`.

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Model name. |
| `attributes` | `AttributesToken` | Optional model attributes. |
| `columns` | `ColumnToken[]` | Optional model columns. |

**Returns** the created `Model`.

### `makePlugin(module, config)`

Adds an Idea plugin declaration to `schema.plugins`.

| Parameter | Type | Description |
| --- | --- | --- |
| `module` | `string` | Plugin module or transform path. |
| `config` | `PluginConfig` | Plugin config object. |

**Returns** the plugin config that was stored.

### `makeProp(name, value)`

Adds a top-level prop to `schema.props`.

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Prop name. |
| `value` | `PropConfig` | Prop value. |

**Returns** the prop value that was stored.

## Related

 - [Schema Module](../schema.md)
 - [Model](./Model.md)
 - [Fieldset](./Fieldset.md)
