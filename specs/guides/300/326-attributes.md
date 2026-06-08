# 326 Attributes

Use attributes to tell Stackpress what a model or field means beyond its raw type. Attributes matter because generated admin, forms, filters, lists, and detail views need more information than `String`, `Boolean`, or `Datetime` can provide by themselves.

**Previously:** The previous course, `Props`, explained why reusable metadata should not hide meaning too early. This course focuses on the confirmed built-in attribute families Stackpress uses today.

## 326.1. Model Attributes Describe The Whole Model

A model can carry metadata that helps generated surfaces name, display, and query records. A scaffolded app uses this pattern on `Article`, `Category`, `Catalog`, and `Comment`.

```idea
model Article
  @labels("Article" "Articles")
  @icon("file")
  @display("{{title}}")
  @query("*" "profile.*")
{
  // fields go here
}
```

This example gives the model a singular and plural label, an icon name, a display template, and a default query shape. The model is still `Article`, but generated UI and default loading behavior now have better instructions.

## 326.2. Field Attributes Describe One Value

Field attributes explain how one column should be edited, validated, searched, listed, or viewed. The `title` field from a scaffolded app shows several families working together.

```idea
title String
      @label("Title")
      @searchable
      @field.string
      @is.required("Title is required")
      @list.string
      @view.string
      @description("Title of the article.")
      @examples("Introduction to Stackpress")
```

The type says `title` stores a string. The attributes say it has a human label, participates in search, renders as a string input, is required, appears as a string in list and detail surfaces, and carries documentation metadata for future readers.

## 326.3. Component Families Map To Generated UI

Stackpress uses built-in component families such as `@field.*`, `@filter.*`, `@span.*`, `@list.*`, and `@view.*`. These families describe how generated React surfaces should edit, filter, display inline values, show list cells, or show detail values.

```idea
published Datetime?
          @label("Published Date")
          @field.datetime
          @list.date("m d, Y h:iA")
          @view.date("m d, Y h:iA")
```

This example keeps the data type and generated UI behavior aligned. The field stores an optional datetime, the editor uses a datetime input, and generated list/detail views format the date in a readable way.

## 326.4. Validation And Behavior Attributes

Some attributes describe rules or behavior rather than display. Common examples include identity, defaults, active flags, timestamps, uniqueness, searchability, sortability, and assertions under `@is.*`.

```idea
slug String
     @label("URL Slug")
     @unique
     @field.slug
     @is.required("URL Slug is required")
     @list.string
     @view.string
```

This example says the slug is not just another string. It should be unique, edited with slug-oriented input behavior, required before writing, and shown as a normal string in generated list and detail surfaces.

## 326.5. Mistakes To Avoid

Attribute mistakes usually come from treating metadata as decoration. Each
attribute should tell Stackpress something specific about display, validation,
querying, or generated UI behavior.

### 326.5.1. Add Every Attribute Family

```idea
summary Text?
        @field.text
        @filter.search
        @span.string
        @list.string
        @view.html
```

This may be too much if the field only needs to appear on a detail page. Add
the generated surfaces the model obviously needs, because over-decorated fields
become harder to maintain and harder to explain.

### 326.5.2. Invent Attribute Namespaces

```idea
title String @admin.featured @ui.big
```

The syntax looks flexible, but Stackpress only gives built-in meaning to known
types, attributes, assertions, and component families. Unsupported names should
not be taught as normal patterns unless a confirmed plugin source defines
them.

### 326.5.3. Confuse Display With Validation

```idea
title String @view.string
```

This tells generated detail output how to display the value, but it does not
say the title is required. Use `@is.required(...)` or another supported
validator when the app needs an input rule.

**Learning checkpoint:** Before moving on, make sure you can explain the difference between model attributes, column attributes, validation attributes, and generated UI component families. You should also be able to explain what each line in the `title` example adds beyond `String`.

**Next course:** Continue with `Relations`. That course shows how attributes and relation metadata work together when one model points at another.
