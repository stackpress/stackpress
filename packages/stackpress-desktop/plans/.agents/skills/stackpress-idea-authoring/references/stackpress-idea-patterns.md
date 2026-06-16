# Stackpress Idea Patterns

Use this reference to model new `schema.idea` files after canonical
Stackpress patterns that already exist in the repo.

## Primary Examples

- built-in auth and profile-oriented schemas
- built-in API and application-oriented schemas
- a blog-style content schema
- a larger inventory-style schema split across multiple `use` files

Use these as the first examples to imitate before reaching for generic Idea
patterns.

## Pattern 1: Package Composition With `use`

Stackpress schemas commonly compose built-in package schemas through `use`.

Examples:

- `use "stackpress-session/schema.idea"`
- `use "stackpress/stackpress.idea"`

Use this pattern when the schema should extend an existing Stackpress package
surface instead of restating shared models locally.

## Pattern 2: Model-Level Display Metadata

Canonical Stackpress models often include:

- `@labels("Singular" "Plural")`
- `@display("{{name}}")`
- `@icon("user")`
- `@query("*" "relation.*")` when generated consumers need richer defaults

Use these when admin, search, or generated view output benefits from explicit
display metadata.

These are highly recommended for admin generation:

```idea
@labels("Comment", "Comments")
@icon("comment")
@display("{{comment}}")
```

## Pattern 3: Explicit Identity And Lifecycle Fields

Common recurring fields include:

- `id String @id @default("cuid()")`
- `active Boolean @default(true) @active`
- `created Datetime @default("now()")`
- `updated Datetime @default("now()") @timestamp`

Do not add these mechanically to every model, but treat them as canonical
Stackpress defaults when the model needs identity, soft-delete behavior, or
timestamps.

Recommended default model baseline:

```idea
id        String
          @label("ID")
          @id @default("cuid()")
          @list.clip({ length 10 hellip true })
          @description("Unique generated identifier.")
          @examples("dz7tg8bcf7e2lig3iuej3pjf")

active    Boolean
          @label("Active")
          @default(true) @active
          @filter.switch
          @view.yesno
          @description("Special flag to indicate active rows. Inactive rows are not shown in the list view, but can be viewed in the detail view.")
          @examples(true)

created   Datetime
          @label("Created")
          @default("now()") @sortable
          @list.date("m d, Y h:iA")
          @view.date("m d, Y h:iA")
          @description("Generated timestamp when row was created.")
          @examples("2025-10-01T12:00:00Z")

updated   Datetime
          @label("Updated")
          @default("now()") @timestamp @sortable
          @list.date("m d, Y h:iA")
          @view.date("m d, Y h:iA")
          @description("Generated timestamp that is updated whenever the row has changed.")
          @examples("2025-10-01T12:00:00Z")
```

Treat `id`, `active`, `created`, and `updated` as the default recommended
starter set for most models.

## Pattern 3A: Optional Utility Fields

These are common optional utility fields that are often worth suggesting:

```idea
tags        String[]
            @label("Tags")
            @default([])
            @field.taglist
            @list.taglist({ warning true pill true className "frui-mr-md" })
            @view.taglist({ warning true pill true className "frui-mr-md" })
            @description("Arbitrary tags for general use.")
            @examples(["top buyer" "verified" "moderator"])

references  Hash?
            @label("References")
            @default({})
            @field.metadata({ add "Add Reference" })
            @view.metadata({ className "frui-pt-md frui-pr-md frui-pb-md frui-pl-md"})
            @description("Arbitrary key/value references for general use.")
            @examples({ fbid "abc123" })
```

Suggest these when:

- the model would benefit from generic tagging
- the model needs flexible key/value metadata without a fully fixed shape

## Pattern 4: Relation Pairing

Canonical relation modeling usually pairs:

- a scalar relation key such as `profileId String`
- a relation field such as `profile Profile @relation({ local "profileId" foreign "id" })`

Generated UI metadata often stays on the scalar key field:

- `@field.relation(...)`
- `@filter.relation(...)`
- `@list.template(...)`
- `@view.template(...)`

The relation object field then carries the structural `@relation(...)`.

## Pattern 5: Validation On Input Fields

Use input-oriented assertions on the scalar field that the user edits.

Common patterns:

- `@is.required("...")`
- `@is.cge(...)`
- `@is.slug(...)`
- `@is.email(...)`

Prefer direct, requirement-matching assertions over piling on redundant checks.

## Pattern 6: Search, Sort, And Uniqueness Hints

Canonical Stackpress uses field hints intentionally:

- `@searchable` for search-oriented text fields
- `@sortable` for fields commonly sorted in generated views
- `@unique` for uniqueness constraints with downstream meaning

Use these because the model behavior needs them, not because they look
complete.

## Pattern 7: Field, Filter, List, Span, And View Metadata

Stackpress commonly maps one field into several generated surfaces:

- `@field.*` for editor/input behavior
- `@filter.*` for filter UI behavior
- `@span.*` for inline or compact display behavior
- `@list.*` for tabular/list output
- `@view.*` for detail output

Canonical rule:

- add only the surfaces that the model obviously needs
- avoid decorating every field with every family by default

## Pattern 8: Document The Schema Inline

Stackpress examples regularly include:

- `@description("...")`
- `@examples(...)`

Use these when the schema is a durable contract and the metadata will help
generated docs, admin understanding, or future maintenance.

## Pattern 9: Composite And Join Models

Join-like models often use composite identity through multiple `@id` fields.

Typical shape:

- `categoryId String @id`
- `articleId String @id`
- relation object fields for both ends

This is a strong canonical pattern for many-to-many link tables in Stackpress.

## Pattern 10: Split Large Schemas With `use`

The live inventory example shows a larger schema decomposed into multiple
`use` imports for enums, types, and models.

Use this pattern when the schema grows large enough that:

- models become hard to scan
- enums and reusable types deserve their own files
- domain areas are easier to maintain as separate idea modules

Keep the split organized around domain boundaries, not arbitrary file count.

## Anti-Patterns

- inventing attributes because the parser would preserve them
- using parser-valid syntax that has no Stackpress built-in meaning
- placing relation semantics only in naming instead of `@relation(...)`
- decorating every field with every display family before the model is stable
- assuming generated output should infer intent that the schema never declared

## Recommended Modeling Order

When drafting a model:

1. define the model purpose
2. choose the scalar fields
3. define relation keys and relation object fields
4. add validation
5. add search, sort, and uniqueness hints
6. add field and view metadata that supports generated output
7. add descriptions and examples where the contract benefits

## Formatting Rule

When a field has a long attribute list, format it vertically for readability.

Use tab-friendly column alignment:

- align field types to a shared visual column across the model block
- use at least two spaces between the field name and the type
- if needed, add one more space so the type lands on a more tab-friendly even
  column
- size the spacing against the longest field name in the block so the type
  column stays consistent
- once the type column is aligned, indent attributes underneath so tab and
  shift-tab adjustments stay predictable

Canonical style:

```idea
title   String
        @label("Title")
        @searchable
        @field.string
        @is.required("Title is required")
        @list.string
        @view.string
```

Prefer this over dense one-line attribute chains when the field carries
multiple behaviors.
