# 322 Fields

Add typed fields to describe the data each model stores. Fields matter because a model name alone does not tell Stackpress what values exist, how those values should be edited, or how generated surfaces should display them.

**Previously:** The previous course, `Models`, named one product entity. This course adds the typed values that make the model useful.

## 322.1. Field Types Give Data Meaning

Stackpress has built-in type families such as `String`, `Text`, `Integer`, `Float`, `Boolean`, `Date`, `Datetime`, `Time`, `Hash`, and `Json`. These types are not only parser names; the local built-in reference says Stackpress maps them into default schema and assertion meaning.

Use the type that matches the value. For example, use `String` for short names or slugs, `Text` for long content, `Boolean` for true-or-false flags, `Datetime` for date-plus-time values, and `Hash` or `Json` for flexible object-like data.

## 322.2. A Field Example

A scaffolded app uses `String` and `Text` fields with different generated behavior. The type describes the value, while the attributes describe labels, input behavior, validation, list behavior, and detail behavior.

```idea
title   String
        @label("Title")
        @searchable
        @field.string
        @is.required("Title is required")
        @list.string
        @view.string

contents Text?
        @label("Contents")
        @field.editor({
          history true
          font true
          size true
          format true
          paragraph true
          list true
          code true
        })
        @view.html
```

`title` is a required short text value that can be searched and shown as a normal string. `contents` is optional because of the `?`, uses a richer editor for input, and renders as HTML in generated detail output.

## 322.3. Optional Fields And Defaults

The `?` marker makes a field optional. Use it when the app can have a meaningful record without that value, such as an article that has no banner image yet.

Defaults give new records a starting value. A scaffolded app uses this pattern for active flags and timestamps so new rows can start with predictable state.

```idea
active Boolean
       @label("Active")
       @default(true)
       @active
       @filter.switch
       @view.yesno
```

This field stores a boolean, defaults to `true`, marks itself as the active flag, and gives generated filter/detail surfaces appropriate behavior. Each attribute adds a different meaning, so the field is more than a raw boolean column.

## 322.4. Validation And Components

Use validation attributes when the value itself must follow a rule. The built-in validator family includes required values, format checks such as `@is.email` and `@is.slug`, numeric comparisons, character counts, date checks, and type checks.

Use component attributes when generated UI needs a specific editing or display shape. `@field.*` affects generated input behavior, `@list.*` affects list output, and `@view.*` affects detail output.

## 322.5. Mistakes To Avoid

Field mistakes usually come from making the schema easier to type instead of
easier to understand. Choose the type, optional marker, validator, and
component metadata that explain the product value clearly.

### 322.5.1. Use `String` For Every Value

```idea
model Article {
  status    String
  published String
  contents  String
}
```

This hides useful meaning from generated output and future readers. A status
may deserve an enum, a published timestamp may deserve `Datetime?`, and long
body content may deserve `Text?` with a richer field/view component.

### 322.5.2. Make Every Field Required

```idea
banner String @is.required("Banner is required")
```

This is only correct if every article truly needs a banner before it can be
saved. Required validators become app behavior, so they should follow product
rules rather than the desire to make every form field look complete.

### 322.5.3. Use Components As Validation

```idea
email String @field.email
```

This gives generated UI an email-oriented input, but it does not explain the
validation rule by itself. If the value must be present or formatted a certain
way, use supported validators such as `@is.required(...)` or `@is.email(...)`
where the rule belongs.

**Learning checkpoint:** Before moving on, make sure you can explain the difference between a field type, an optional marker, a default value, a validator, and a generated UI component attribute.

**Next course:** Continue with `Enums`. That course covers fixed value sets for fields such as status or role.
