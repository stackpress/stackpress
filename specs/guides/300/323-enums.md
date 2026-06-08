# 323 Enums

Use enums when a field should accept one value from a known set. Enums matter because they turn open-ended strings into named states that the schema, generated UI, and future developers can recognize.

**Previously:** The previous course, `Fields`, covered typed values inside a model. This course focuses on fields whose value should come from a fixed list.

## 323.1. Why Enums Are Safer Than Random Strings

Some values should not be invented at runtime. A publish status, account role, inventory state, or workflow step usually has a limited set of allowed choices.

If those choices are stored as plain strings without a shared definition, one part of the app might write `published`, another might expect `PUBLISHED`, and a third might allow a typo. An enum gives the choices one source-level home.

## 323.2. The Article Publish Status

A scaffolded app declares `PublishStatus` near the top of `schema.idea`. Each member has a name and the stored string value.

```idea
enum PublishStatus {
  DRAFT "DRAFT"
  REVIEW "REVIEW"
  PUBLISHED "PUBLISHED"
  ARCHIVED "ARCHIVED"
}
```

This example defines the allowed article lifecycle states. The values are uppercase strings, which makes the stored states easy to compare and easy to recognize in generated output.

## 323.3. Using An Enum Field

The `Article` model uses `PublishStatus` as the type for its `status` field. The field then adds a default value and generated form/display metadata.

```idea
status PublishStatus
       @label("Status")
       @default("DRAFT")
       @field.select({ options [ "DRAFT" "REVIEW" "PUBLISHED" "ARCHIVED" ] })
       @is.required("Status is required")
       @list.string
       @view.string
```

`PublishStatus` tells the schema which value family the field belongs to. `@default("DRAFT")` gives new articles a starting state, while `@field.select(...)` gives generated forms a fixed set of options instead of a free-form text box.

## 323.4. Updating Enum Choices

When adding a new status, update the enum first. Then update any generated field component options that should present the new value to users.

This two-step habit keeps the source contract and generated UI aligned. If the enum has `SCHEDULED` but the select options do not, the schema and form are no longer teaching the same set of choices.

## 323.5. Mistakes To Avoid

Enum mistakes usually create two competing stories about the same value. Keep
the allowed values, defaults, and generated input options aligned so the reader
can tell which states are real.

### 323.5.1. Use A Free-Form String For A Fixed State

```idea
status String @default("DRAFT")
```

This stores a status, but it does not give the allowed choices a shared source
home. If the value should be one of `DRAFT`, `REVIEW`, `PUBLISHED`, or
`ARCHIVED`, an enum makes that rule visible.

### 323.5.2. Rename Stored Values Casually

```idea
enum PublishStatus {
  LIVE "LIVE"
}
```

Changing `PUBLISHED` to `LIVE` may be a product decision, but it is not only a
label change. Existing rows, generated filters, admin lists, and route/event
logic may still compare against the old stored value.

### 323.5.3. Let Form Options Drift

```idea
status PublishStatus
       @field.select({ options [ "DRAFT" "PUBLISHED" ] })
```

This field uses the enum, but the generated select options only show two
values. Keep the component metadata aligned with the enum so users and junior
developers see the same choices the schema declares.

**Learning checkpoint:** Before moving on, make sure you can explain where enum choices are declared, how a model field uses the enum, and why the select options should stay aligned with the enum values.

**Next course:** Continue with `Types`. That course discusses reusable value shapes, while staying careful about what is confirmed by current source.
