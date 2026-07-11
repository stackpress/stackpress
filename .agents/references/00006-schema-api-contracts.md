# Schema API Contracts

Use this reference for the normalized Stackpress schema object model and its
semantic extension facets. The `.idea` language itself belongs in the Idea
Language Catalog; SQL behavior belongs in the SQL contracts.

## Purpose And Pattern
`@stackpress/schema` converts compiled Idea configuration into runtime objects
used by generators and packages. It does not replace the Idea parser. Its
distinctive pattern is **semantic lenses over open metadata**:

- `Schema`, `Fieldset`, `Model`, `Column`, and `Attribute` retain structure;
- focused extension objects interpret the same structure for assertions,
  components, documentation, names, values, types, numbers, and storage;
- global dictionaries define recognized attribute/type semantics;
- consumers read the lens they own instead of embedding every concern in the
  central classes.

This lets one declaration coordinate validation, UI, storage, documentation,
and types while allowing unknown metadata to remain open.

## Public Surface
Import classes, extensions, dictionaries, definitions, helpers, events, scripts,
and types from `@stackpress/schema`. The package exports
`Schema`, `Model`, `Fieldset`, `Column`, `Attribute`; their collection/facet
classes; `ColumnInterface`, `DefinitionInterface`, `SchemaInterface`; dictionary
classes and `dictionary`; naming/crypto helpers; and definition registration.

## Schema
```ts
Schema.make(config: SchemaConfig): Schema
```

`make()` normalizes compiled config in this order: plugins, props, enums, types
as fieldsets, then models. Compiled columns are converted to `ColumnToken` values
whose type carries `name`, `required`, and `multiple`.

Registries are ordered `DataMap` instances:

```ts
enums: DataMap<string, EnumConfig>
fieldsets: DataMap<string, Fieldset>
models: DataMap<string, Model>
plugins: DataMap<string, PluginConfig>
props: DataMap<string, PropConfig>
```

Mutation factories insert and return their value:

```ts
makeEnum(name, options)
makeFieldset(name, attributes?, columns?)
makeModel(name, attributes?, columns?)
makePlugin(module, config)
makeProp(name, value)
```

Fieldsets/models made through a schema receive that schema, enabling type
resolution. Registry insertion replaces the same key; it is not a duplicate
declaration validator.

## Fieldset And Model
```ts
Fieldset.make(name, attributes?, columns?, schema?): Fieldset
new Fieldset(name, Attributes|Attribute[]?, Columns|Column[]?, schema?)
Model.make(name, attributes?, columns?, schema?): Model
```

Public fieldset facets are `assertion`, `attributes`, `columns`, `component`,
`document`, `name`, `type`, and `value`. `hasSchema` is a non-throwing check;
reading `schema` without assignment throws. Setting `schema` propagates it to
every column type.

Mutation and lookup:

```ts
addAttribute(attribute): this
addAttribute(name, Data[]|boolean): this
addColumn(column): this
addColumn(name, ColumnTypeToken, attributes?): this
attribute(name): Attribute|undefined
column(name, format?): Column|undefined
```

`column()` accepts direct keys or `camel`, `dash`, `snake`, and `title` name
formats. Added columns receive the fieldset as parent. `Model extends Fieldset`
and adds `store: ModelStore`; this marks persistent-model semantics without
duplicating field structure.

## Column

```ts
Column.make(name, type, attributes?, parent?): Column
new Column(name, ColumnType, Attributes?, parent?)
```

`ColumnTypeToken` is `{ name, required, multiple }`; omitted values in `make()`
default to `required: true` and `multiple: false`. Public facets are `assertion`,
`attributes`, `component`, `document`, `name`, `number`, `store`, `type`, and
`value`. `hasParent` safely tests assignment; reading missing `parent` throws;
setting it propagates the parent schema to the type.

`addAttribute()` has object and name/value overloads and returns the column.
`attribute(name)` returns the interpreted attribute when present.

## Attribute And Collections

```ts
new Attribute(name: string, args: Data[]|boolean = [])
Attributes.make(tokens?): Attributes
Columns.make(tokens?, parent?): Columns
```

Attribute names are lowercased. Boolean input creates a flag with that enabled
state and no args; array input creates an enabled method attribute. Public
facets are `assertion`, `component`, and `reference`. `args` returns a copy.
`isFlag`/`isMethod` prefer dictionary definition semantics when defined;
`value` is the first argument for a method or enabled state for a flag.

`Attributes` exposes interpreted `args`, `disabled`, `flags`, `methods`, and
`props`, plus `add`, `enabled`, `filter`, and `value`. `Columns` owns parent
propagation and overloaded `add`; both preserve ordered map behavior.

## Semantic Lens Catalog

| Lens | Interprets |
| --- | --- |
| `AttributeReference` | definition existence, kind, flag/method, schema/column applicability |
| `AttributeAssertion` | registered assertion definition |
| `AttributeComponent` | component definition, role, virtual state, merged props |
| `ColumnAssertion` / `FieldsetAssertion` | validation metadata per column or whole fieldset |
| `ColumnComponent` / `FieldsetComponent` | filter/form/list/span/view roles and participating columns |
| `ColumnDocument` / `FieldsetDocument` | descriptions and examples |
| `ColumnName` / `FieldsetName` | normalized names and code/path/event/table/type patterns |
| `ColumnNumber` | chars, min, max, and step constraints |
| `ColumnStore` / `ModelStore` | active fields, ids, indexes, uniqueness, relationships, query/search/sort, timestamps, restore policy |
| `ColumnType` / `FieldsetType` | built-ins, assertions, nullable/multiple state, enum/fieldset/model resolution |
| `ColumnValue` / `FieldsetValue` | defaults, generators, hashed/encrypted values |

Name lenses provide camel, dash, snake, title, underscore, and string forms.
Fieldset names also provide singular/plural/display/icon/labels and event/table
patterns. These are conventions consumed by generators, not arbitrary display
formatters.

## Dictionaries And Extensibility

The global `dictionary` contains `types`, `attributes`, `assertions`, and
`components` maps. `TypeDictionary.define(type, key, definition)` stores typed
semantics such as serializers/assertions. Other dictionaries expose
`define(...)`, `defined(name)`, and `definition(name)`; attribute/component
definitions also record their owning `kind`.

`defineAttributes`, `defineAssertions`, `defineComponents`, and `defineBuiltIn`
populate these registries. Importing `Attribute` invokes built-in definition
registration. Dictionary state is process-global: extensions should use stable,
namespaced keys and avoid import-order-dependent redefinition.

## Generated Runtime Interfaces

`ClientPlugin` is the generated-client loader plugin. Calling it returns a
`Client` with compiled `config`, `model`, and `fieldset` registries. Each
`ClientFieldset` exposes a generated `Schema` constructor plus its `columns`
definition map. `SchemaInterface` and `DefinitionInterface` carry assertion,
serialization, and unserialization types into generated runtime code.

Built-in generator expressions are `cuid()`, `nano()`, `random()`, and `now()`.
Helpers include name normalization, undefined removal, JSON parsing checks, and
`encrypt`/`decrypt`/`hash`. Encryption derives a deterministic key and IV from
the seed; treat it as current compatibility behavior, not a modern randomized
ciphertext design recommendation.

## Revision History

`Revisions(root, loader)` indexes epoch-named JSON snapshots lazily. `insert()`
writes only when serialized schema differs from the last snapshot. `first`,
`last`, and `index` return revision records through `read(epoch)`; each record
contains date, file, path, raw config, and `Schema.make(config)`. `size()` reports
loaded epochs. Revisions describe generated-schema history, not applied database
migrations.

## Example

```ts
import { Schema } from '@stackpress/schema';

const schema = Schema.make(compiledIdea);
const user = schema.models.get('User');
const email = user?.column('email');
console.log(email?.type.required, email?.store.unique);
```

## Source Anchors And Authority

Anchors: `packages/stackpress-schema/src/{Schema,Model,Fieldset,Column,Attribute,
Revisions,dictionary,helpers,index,types}.ts` and the `attribute/`, `column/`,
`fieldset/`, `model/`, and `interface/` subtrees in the current checkout.

Source-observed behavior outranks this summary. Re-research and update the KB
when code changes. Existing `docs/` pages are parity benchmarks, not authority.
