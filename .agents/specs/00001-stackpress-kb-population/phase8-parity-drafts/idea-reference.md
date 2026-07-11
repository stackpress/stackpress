# Idea Language Reference

An Idea file is Stackpress's declarative domain source. It describes reusable
types, persistent models, enumerations, properties, and generation plugins. The
compiler preserves declaration order, resolves imports and `use` declarations,
and produces the normalized shape consumed by Schema and generation plugins.

```idea
enum Role = ADMIN | MEMBER

type Address {
  street String required
  city String required
}

model User {
  id String primary
  name String required searchable
  email String required unique
  role Role default(MEMBER)
  address Address?
  tags String[]
}
```

`?` marks an optional value, `[]` marks a list, and `!` expresses a required
value where that form is accepted. Built-in scalar names supply the initial
type vocabulary; declared enums and types extend it. Models are fieldsets with
persistence metadata, while types remain reusable structured values.

## Attributes And Assertions

Attributes follow a column or declaration. Flags such as `required`, `unique`,
`searchable`, and `primary` carry boolean intent. Method-shaped attributes such
as `default(...)` and assertion attributes carry arguments. Assertions describe
validation intent and can have aliases, but their effect belongs to the consumer
that interprets them.

Field and view components are also metadata. They select generated editor,
display, filtering, or input behavior from the component catalog. Derived roles
such as identifiers, labels, search fields, and relationships come from the
combined type and attribute declarations rather than a separate model language.

## Properties And Plugins

Properties attach project-level values to the compiled Idea. Plugins allow an
Idea transform to participate in generation. Imports and `use` declarations can
compose declarations from multiple files; merge and transform order therefore
matter when names overlap.

```idea
plugin admin {
  module "@stackpress/admin/transform"
}
```

The parser is intentionally open to metadata. Recognition by the parser does
not guarantee behavior: an unknown attribute can survive compilation but remain
inert until a schema lens, generator, runtime plugin, or interface consumes it.
Treat the generated revision as reproducible evidence of the declaration, not
as proof that a migration has been applied to a database.

