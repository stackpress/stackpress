# 321 Models

Model one application entity with a name, display metadata, identity, and fields. A model is where product language becomes a source contract that Stackpress can generate from.

**Previously:** The previous course, `Modeling`, introduced the idea of turning product nouns into schema. This course focuses on one model at a time so the shape is easy to read before fields, enums, attributes, and relations add more detail.

## 321.1. Why Models Come First

Most app conversations start with nouns: articles, categories, comments, profiles, products, orders, or subscriptions. A model gives one of those nouns a durable place in `schema.idea`.

Without a model, the app has no source-level contract for records of that kind. Routes and views can still be handwritten, but generation cannot understand the entity as a reusable schema surface.

## 321.2. A Model From A Scaffolded App

A scaffolded app models `Article` as one record type. The opening lines show the model name and the metadata generated UI can use.

```idea
model Article
  @labels("Article" "Articles")
  @icon("file")
  @display("{{title}}")
  @query("*" "profile.*")
{
  id    String
        @label("ID")
        @id @default("cuid()")

  title String
        @label("Title")
        @searchable
        @field.string
        @is.required("Title is required")
        @list.string
        @view.string
}
```

`Article` names the entity. `@labels(...)`, `@icon(...)`, and `@display(...)` help generated admin and display surfaces use human language, while `@query("*" "profile.*")` asks generated consumers to include the article fields and related profile data by default.

## 321.3. Identity And Display

The `id` field uses `@id` to mark the record identifier and `@default("cuid()")` to give new records an generated ID value. This is the stable handle other behavior can use when one record must be updated, related, or displayed.

The `title` field gives the article a user-facing value. Because the model display template uses `{{title}}`, generated surfaces can show the title instead of only showing a raw ID.

## 321.4. Authoring Rules

Use singular model names such as `Article`, `Category`, or `Comment`. One model describes the shape of one record, even when the app stores many records.

Add display metadata when generated admin or view output should read like product UI. The local idea-authoring guidance treats `@labels(...)`, `@icon(...)`, and `@display(...)` as strong defaults for models that appear in generated admin surfaces.

Keep each model focused on one entity. If one model starts carrying fields for two different product nouns, split the concept before generated output and relations become confusing.

## 321.5. Mistakes To Avoid

Model mistakes usually come from naming a noun without deciding whether the
app actually stores records for that noun. A model should represent a record
the app stores, displays, relates, validates, or generates behavior around.

### 321.5.1. Create A Model For Every Noun

```idea
model Homepage {
  headline String
}
```

This might be a real model in a CMS, but it might also be simple config or a
handwritten view concern. Before creating a model, ask whether the app needs
stored records, generated admin behavior, relations, validation, or reusable
query output for that concept.

### 321.5.2. Skip The Identifier

```idea
model Article {
  title String
}
```

This is not enough for records that need updates, relations, or generated
admin behavior. Add a stable identity field when other generated surfaces need
to find, update, relate, or display one specific record.

### 321.5.3. Leave Display Metadata For Later

```idea
model Article {
  id    String @id
  title String
}
```

The model has data, but generated UI now has less guidance about how to label
or display the record. Metadata such as `@labels(...)`, `@icon(...)`, and
`@display(...)` makes generated pages easier for a junior developer to inspect
and verify.

**Learning checkpoint:** Before moving on, make sure you can explain what a model represents, why singular names are used, and how identity plus display metadata help generated Stackpress surfaces.

**Next course:** Continue with `Fields`. That course adds typed data inside the model.
