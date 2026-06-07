# 522 Fields

Add typed fields with required, default, validation, form, and view behavior. The local example shows why that choice matters in an app.

**Previously:** The previous lesson, `521 Models`, gave you the setup this page builds on. Here, the focus shifts to `Fields` so you can place the next Stackpress surface in the course path.

## 522.1. Modeling Goal

A model without fields is only a name. Fields give the model data, and that data flows into schema classes, SQL output, forms, admin pages, and display behavior.

## 522.2. Field Example

Add fields:

```idea
title   String
        @label("Title")
        @searchable
        @field.string
        @is.required("Title is required")
        @list.string
        @view.string

summary Text?
        @label("Summary")
        @field.textarea
        @view.text Compare the concrete details to see the practical meaning.
```

This example gives the idea something concrete to inspect. Look for the file, helper, or value that changed; that is the part you would adjust first in your own app.

## 522.3. Generated Effect

The field type describes the data shape. Attributes describe validation, generated form behavior, list rendering, and view rendering.

## 522.4. Authoring Rules

This part of the Fields workflow is easier to follow when the smaller pieces are compared together. The subsections cover Type, Optional Marker, Field Metadata, so the reader can see how each piece changes the local decision.

### 522.4.1. Type

Use built-in types such as `String`, `Text`, `Integer`, `Float`, `Boolean`, `Date`, `Datetime`, `Hash`, and `Json`. The nearby example or check shows the project detail affected by this idea.

### 522.4.2. Optional Marker

The `?` marker means the field is optional. Use that purpose as the anchor for the local example or check.

### 522.4.3. Field Metadata

Attributes such as `@field.string`, `@list.string`, and `@view.string` tell generated UI layers how to handle the field. The same idea shows up through inspectable project surfaces.

## 522.5. Inspect Output

This part of the Fields workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add A Default, Add Required Validation, Choose A Component, so the reader can see how each piece changes the local decision.

### 522.5.1. Add A Default

```idea
active Boolean @default(true)
```

In this example, the useful part is the value being passed, returned, or configured. That is usually the first thing a developer changes when adapting the pattern.

### 522.5.2. Add Required Validation

```idea
title String @is.required("Title is required")
```

This example keeps the first version narrow on purpose. Once this shape is clear, the surrounding section can add options without making the first step harder to follow.

### 522.5.3. Choose A Component

Use `@field.*` for generated input behavior and `@view.*` for generated display behavior. Keep the idea tied to the concrete project surface in this section.

## 522.6. Next Step

The important part is the reason behind Fields: it gives the app a clearer way to organize one kind of behavior. The example gives the decision enough context to evaluate it.

Read `526 Attributes` when you need more metadata options. For exhaustive field components, use [Idea Reference](/reference/idea-reference). That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `523 Enums`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
