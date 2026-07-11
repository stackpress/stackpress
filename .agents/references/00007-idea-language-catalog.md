# Idea Language Catalog

Use this reference for the `.idea` declaration language, compiler output, `use`
composition, and Stackpress metadata semantics. Component names and derived role
families are in [Idea Component Catalog](./00016-idea-component-catalog.md).

## Intent And Ownership

Idea is a declarative interchange language. It records domain shape and open
metadata without owning a database, UI, API, or runtime. The Idea parser owns
syntax and normalized config. The transformer owns file composition and plugin
execution. Stackpress packages interpret selected attributes during generation.

This separation is intentional: a declaration can be reused by multiple
consumers, while each consumer owns the meaning of its metadata namespace.
Unknown attributes are syntactically valid but inert until a dictionary or
transform recognizes them.

## Complete Declaration Shape

```idea
use "./shared.idea"

enum Role {
  ADMIN "admin"
  MEMBER "member"
}

prop Defaults { role Role.ADMIN }

type Address @labels("Address" "Addresses") {
  city String @is.required
}

model User @display("{{name}}") @query("*") {
  id String @id @default("cuid()")
  name String @field.text @view.text
  role Role @default("member")
  address Address?
  tags String[]
}

plugin "./transform.ts" { output "./generated" }
```

Top-level declarations may appear in any parsed sequence:

| Form | Name rule | Compiled purpose |
| --- | --- | --- |
| `use "path"` | quoted path | records another schema for transformer composition |
| `enum Name { KEY value }` | capital declaration, uppercase keys | scalar option map |
| `prop Name { key value }` | capital name | reusable data object/reference |
| `type Name { ... }` | capital name | reusable non-store fieldset |
| `model Name { ... }` | capital name | persistent model candidate |
| `plugin "module" { ... }` | quoted module | transformer module and config |

`//` comments, block notes, whitespace, arrays, objects, quoted strings,
integers, floats, booleans, `null`, identifiers, and `env("NAME")` are lexical
data forms. Object entries and array items are whitespace-separated, not comma
syntax. Identifiers compile to `${Name}` placeholders in non-final parsing and
resolve against prior declarations during final parsing.

## Types And Modifiers

Columns use `camelName CapitalType` followed by zero or more attributes.

- `Type` is required and singular;
- `Type?` is optional/nullable;
- `Type[]` is required and multiple at the declaration level;
- custom enums, fieldsets, and models are valid type names;
- `type Name!` and `model Name!` set `mutable: false` for `use` composition.

The Stackpress generated type set recognizes:

| Idea type | Runtime/generated value |
| --- | --- |
| `String`, `Text` | `string` |
| `Number`, `Integer`, `Float` | `number` |
| `Boolean` | `boolean` |
| `Date`, `Datetime`, `Time` | `Date` after unserialization |
| `Json`, `Object`, `Hash` | scalar-input record |
| enum | one declared scalar option |
| fieldset/model | nested generated schema value |
| any `[]` form | array of the corresponding value |

The language parser accepts any capital type identifier. The table is the
current Stackpress generator contract, not a parser whitelist.

## Attributes

Attributes are `@lowercase.namespace` flags or methods with whitespace-separated
arguments: `@flag`, `@method("value" 2 true)`. They can decorate a type/model or
a column. Definitions determine whether an attribute is meaningful for schema,
column, assertion, or component interpretation.

### Schema Attributes

| Attribute | Signature | Meaning |
| --- | --- | --- |
| `@display` | `(template: string)` | row display template using row variables |
| `@icon` | `(name: string)` | model icon name |
| `@labels` | `(singular: string plural: string)` | explicit model labels |
| `@query` | `(...columns: string[])` | default selected/query relationship paths |

### Column Attributes

| Attribute | Signature | Meaning |
| --- | --- | --- |
| `@active` | flag | soft-delete/restore active field |
| `@default` | `(scalar)` | create-time default or recognized generator expression |
| `@description` | `(string)` | documentation description |
| `@examples` | `(...Data[])` | documentation examples |
| `@encrypted` | flag | reversible seeded transformation |
| `@generated` | flag | generated value; bypass ordinary input requirement |
| `@hashed` | flag | one-way stored transformation |
| `@id` | flag | identifier; multiple IDs form a compound identity |
| `@searchable` | flag | search participation and storage optimization signal |
| `@sortable` | flag | sort participation and storage optimization signal |
| `@label` | `(string)` | explicit display label |
| `@min`, `@max`, `@step` | `(number)` | numeric/input and storage sizing constraints |
| `@relation` | `({ local string foreign string name? string })` | local/foreign relationship mapping |
| `@timestamp` | flag | update-on-change timestamp field |
| `@unique` | flag | storage uniqueness signal |

Current default generator expressions include `cuid()`, length-bearing CUID
handling, `nanoid(length)` in generation code, `random()`, and `now()`. Treat
generator spellings as compatibility-sensitive and verify when adding one.

## Assertions

Assertions use `@is.*`. Most flag-capable assertions accept an optional custom
message; comparison assertions accept their comparison value plus an optional
message.

| Family | Canonical names |
| --- | --- |
| presence/equality | `required`, `ne`, `unique`, `eq`, `neq`, `option`, `regex` |
| date/time | `date`, `future`, `past`, `present` |
| numeric | `gt`, `ge`, `lt`, `le` |
| character count | `ceq`, `cgt`, `cge`, `clt`, `cle` |
| word count | `weq`, `wgt`, `wge`, `wlt`, `wle` |
| format/casing | `lowercase`, `uppercase`, `slug`, `cc`, `color`, `email`, `hex`, `price`, `url` |
| type | `string`, `boolean`, `number`, `float`, `integer`, `object` |

Aliases are `notempty -> ne`, `pattern -> regex`, `gte -> ge`, `lte -> le`,
`cgte -> cge`, `clte -> cle`, `wgte -> wge`, and `wlte -> wle`. Type-driven
assertions are automatically registered for the built-in Stackpress types.
Generated validation combines type and explicit assertions; storage constraints
and UI hints do not independently prove runtime validation.

## `use` Composition

The transformer resolves each `use` path relative to the loading context and
recursively loads its schema. Child props/enums are soft-merged with the current
file taking precedence. For types/models:

- a missing current declaration adopts the child declaration;
- an immutable current declaration is not extended;
- a mutable current declaration receives child attributes beneath its own;
- missing child columns are prepended in child order;
- same-named columns remain the current declaration and their attributes are
  not merged.

After composition `use` is removed. Composition mutates normalized config; it
does not preserve source-level provenance in the final schema.

## Plugin Transformation

Transformer plugins resolve `.js`, `.cjs`, `.mjs`, `.ts`, or `.mts` modules in
declaration order. A callable default receives `{ transformer, config, schema,
cwd, ...extras }`. No plugin declaration causes `transform()` to fail. A module
that resolves but is not callable is skipped.

Stackpress discovers its package transforms through the `idea` lifecycle event,
then cooperatively updates generated files. Plugin order and repeatability are
therefore compatibility concerns.

## Compiler Output And Boundaries

Normalized `SchemaConfig` contains optional `enum`, `type`, `model`, `plugin`,
`prop`, and `use` maps/lists. Columns become ordered arrays with `name`, `type`,
`required`, `multiple`, and `attributes`. `Compiler.final()` removes `prop` and
`use`; Transformer composition removes `use` but retains props.

Duplicate declaration names in one schema throw during compilation. The parser
does not validate Stackpress attribute names, component props, relationship
integrity, generator support, or downstream database/UI compatibility.

## Source Anchors And Authority

Checkout anchors: Idea parser `definitions.ts`, `Compiler.ts`, `types.ts`, and
all declaration trees; Idea transformer `Transformer.ts`; Stackpress schema
`config/{attributes,definitions,types}.ts`, `column/ColumnType.ts`, and generated
column/type transforms. This is source-promoted knowledge. Existing docs are a
coverage benchmark only; update this KB from source when behavior changes.
