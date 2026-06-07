# 672 frui Form Components

Use or inspect form input components tied to schema metadata. The local example shows why that choice matters in an app.

**Previously:** The previous lesson, `671 frui Base Components`, gave you the setup this page builds on. Here, the focus shifts to `frui Form Components` so you can place the next Stackpress surface in the course path.

## 672.1. Use Case

Forms are where schema metadata becomes user input. Form components connect field attributes to inputs, labels, validation messages, and submission behavior.

## 672.2. Minimal Form

Start from schema:

```idea
email String
      @label("Email")
      @field.email
      @is.email("Must be a valid email")
```

After generation, inspect the generated form output for the email input behavior. Compare the concrete details to see the practical meaning.

## 672.3. Validation And Submission

The field metadata told generated form code how to render and validate an input. The nearby example or check shows the project detail affected by this idea.

## 672.4. Common Patterns

This part of the frui Form Components workflow is easier to follow when the smaller pieces are compared together. The subsections cover Field Component, Validation, Generated Form, so the reader can see how each piece changes the local decision.

### 672.4.1. Field Component

`@field.*` chooses generated input behavior. Use that purpose as the anchor for the local example or check.

### 672.4.2. Validation

`@is.*` attributes describe rules that should match the user's input. The same idea shows up through inspectable project surfaces.

### 672.4.3. Generated Form

Generated forms combine schema labels, field components, and validators. Keep the idea tied to the concrete project surface in this section.

## 672.5. Mistakes To Avoid

Form component mistakes usually come from choosing a field by appearance instead of data shape. Pick the component that matches what the user is entering and how the app should validate it.

### 672.5.1. Use A Short Text Input For Long Copy

```idea
field bio string
```

A string field works for short text, but long copy needs a larger editing surface. Use `@field.string` for short text and `@field.textarea` for longer text.

### 672.5.2. Use A Generic Input For Structured Values

```idea
field email string
```

A generic string loses the chance to communicate expected shape. Use specialized components such as `@field.email`, `@field.url`, `@field.price`, or `@field.datetime` when the data shape benefits from it.

### 672.5.3. Ignore Relation Metadata

```idea
field categoryId string
```

This treats a relationship like ordinary text. Use relation field metadata when a form needs to search and select another model, so the UI can guide the user instead of asking for a raw ID.

## 672.6. Reference Pointers

For frui Form Components, focus first on the problem it solves, then use the syntax as the concrete way Stackpress represents that problem. That is why this detail appears in the lesson before reference material.

**Next step:** Read `526 Attributes` for the broader attribute model. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `673 frui View Components`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
