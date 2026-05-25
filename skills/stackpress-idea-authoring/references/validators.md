# Validators

Use this reference for the built-in `@is.*` validator family.

## Presence And Equality

- `@is.required`
- `@is.ne`
- `@is.unique`
- `@is.eq(...)`
- `@is.neq(...)`
- `@is.option(...)`
- `@is.regex(...)`

Use these for required values, non-empty strings, uniqueness, fixed-value
comparison, option sets, and regex format constraints.

## Date And Time

- `@is.date`
- `@is.future`
- `@is.past`
- `@is.present`

Use these for date correctness and date-relative rules.

## Numeric Comparison

- `@is.gt(...)`
- `@is.ge(...)`
- `@is.lt(...)`
- `@is.le(...)`

Use these when the field value itself must compare against a numeric boundary.

## Character Count

- `@is.ceq(...)`
- `@is.cgt(...)`
- `@is.cge(...)`
- `@is.clt(...)`
- `@is.cle(...)`

Use these when string character length must match or compare against a number.

## Word Count

- `@is.weq(...)`
- `@is.wgt(...)`
- `@is.wge(...)`
- `@is.wlt(...)`
- `@is.wle(...)`

Use these when word count is the constraint.

## Format And Casing

- `@is.lowercase`
- `@is.uppercase`
- `@is.slug`
- `@is.cc`
- `@is.color`
- `@is.email`
- `@is.hex`
- `@is.price`
- `@is.url`

Use these for conventional casing, format, and value-shape rules.

## Type Checks

- `@is.string`
- `@is.boolean`
- `@is.number`
- `@is.float`
- `@is.integer`
- `@is.object`

Use these when the field must explicitly validate against a type-oriented
constraint.

## Message Rule

All built-in validators can accept a custom error message string.

- if the validator already takes one or more arguments, the message goes last
- if the validator is normally used as a flag, it may also be used as a method
  when a custom message needs to be supplied

## Canonical Example

```idea
title String
  @is.required("Title is required")
  @is.cge(3, "Title must be at least 3 characters")
```
