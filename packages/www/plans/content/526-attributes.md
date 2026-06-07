# 526 Attributes

Use common attributes to describe labels, validation, defaults, generated UI, and database behavior. The local example shows why that choice matters in an app.

**Previously:** The previous lesson, `525 Props`, gave you the setup this page builds on. Here, the focus shifts to `Attributes` so you can place the next Stackpress surface in the course path.

## 526.1. Modeling Goal

Attributes are the notes you attach to schema pieces so generators know more than the raw type. They can shape forms, display output, admin behavior, and other generated details.

## 526.2. Attribute Example

Use common model attributes:

```idea
@labels("Article" "Articles")
@icon("file")
@display("{{title}}")
```

Use common field attributes:

```idea
title String
      @label("Title")
      @searchable
      @field.string
      @is.required("Title is required")
      @list.string
      @view.string
```

This example ties the concept to an actual Stackpress shape. Notice how the file or helper creates behavior the app can later run, inspect, or generate from.

## 526.3. Generated Effect

Attributes gave generated code and UI layers more meaning than the raw field type alone. Compare the concrete details to see the practical meaning.

## 526.4. Authoring Rules

This part of the Attributes workflow is easier to follow when the smaller pieces are compared together. The subsections cover Model Attributes, Column Attributes, Component Attributes, Validation Attributes, so the reader can see how each piece changes the local decision.

### 526.4.1. Model Attributes

Model attributes describe the whole model, including labels, icons, display templates, and default query behavior. The nearby example or check shows the project detail affected by this idea.

### 526.4.2. Column Attributes

Column attributes describe one field, including identity, defaults, uniqueness, searchability, and timestamps. Use that purpose as the anchor for the local example or check.

### 526.4.3. Component Attributes

Component attributes such as `@field.*`, `@list.*`, and `@view.*` tell generated UI how to edit or display values. The same idea shows up through inspectable project surfaces.

### 526.4.4. Validation Attributes

Validation attributes under `@is.*` check values before writes or processing. Keep the idea tied to the concrete project surface in this section.

## 526.5. Inspect Output

This part of the Attributes workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add A Label, Add Required Validation, Add Display Behavior, so the reader can see how each piece changes the local decision.

### 526.5.1. Add A Label

```idea
name String @label("Name")
```

This example keeps the first version narrow on purpose. Once this shape is clear, the surrounding section can add options without making the first step harder to follow.

### 526.5.2. Add Required Validation

```idea
email String @is.required("Email is required") @is.email("Must be a valid email")
```

Use this as the concrete version of the explanation above. The part to copy is the structure; the part to change is the value that matches your app.

### 526.5.3. Add Display Behavior

```idea
price Float @field.price @list.price @view.price
```

This example gives the idea something concrete to inspect. Look for the file, helper, or value that changed; that is the part you would adjust first in your own app.

## 526.6. Next Step

For Attributes, focus first on the problem it solves, then use the syntax as the concrete way Stackpress represents that problem. The example gives the decision enough context to evaluate it.

Read `527 Relations` for relation metadata. For exhaustive attributes and component families, use [Idea Reference](/reference/idea-reference). That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `527 Relations`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
