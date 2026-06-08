# 324 Types

Use types when the same structured value shape should appear in more than one place. A type is not a full model with its own store and admin pages; it is a reusable fieldset that can be generated into schema, TypeScript, and view helper output.

**Previously:** The previous course, `Enums`, covered fixed value sets. This course explains when a field should stay a built-in scalar and when a reusable structured type makes the schema clearer.

## 324.1. Built-In Types Come First

The confirmed built-in type families include `String`, `Text`, `Number`, `Integer`, `Float`, `Boolean`, `Date`, `Datetime`, `Time`, `Object`, `Hash`, and `Json`. These names carry Stackpress schema meaning and are the right starting point for normal fields.

```idea
title     String
contents  Text?
active    Boolean
created   Datetime
metadata  Hash?
```

This example uses confirmed built-in field types. `String` and `Text` both describe text-like values, `Boolean` describes true-or-false state, `Datetime` describes a date plus time, and `Hash` describes object-like keyed data.

## 324.2. Define A Reusable Structure

The Idea parser confirms `type` declarations, and `stackpress-schema` turns `config.type` entries into fieldsets. A fieldset is a reusable group of columns that generation can inspect separately from top-level models.

```idea
type Address {
  street  String
  city    String
  country String
}

model User {
  id      String @id
  address Address
}
```

This example defines `Address` once and then uses it as the type of the `address` field. `Address` is the reusable structure, while `User` is still the top-level model with identity.

## 324.3. Generated Effect

Stackpress schema generation loops through `schema.fieldsets` and writes fieldset output for each reusable type. The exact files depend on the configured output directory, but the generator source shows fieldset schema, columns, type output, tests, index output, and package exports.

```text
Address/columns/index.ts
Address/AddressSchema.ts
Address/tests
Address/types.ts
Address/index.ts
```

These paths show the important difference between a `type` and loose metadata. A reusable type gives generation named structure to work with, while `Hash` and `Json` keep the value flexible.

## 324.4. Flexible Data Still Has A Place

When a model needs flexible structured data, use confirmed built-in object-like types such as `Hash` or `Json` and pair them with supported field and view components when appropriate. The local built-ins reference lists `@field.metadata(...)`, `@field.json`, `@view.metadata(...)`, and `@view.json` as common pairings.

```idea
references Hash?
           @label("References")
           @default({})
           @field.metadata({ add "Add Reference" })
           @view.metadata({ className "frui-pt-md frui-pr-md frui-pb-md frui-pl-md" })
```

This example comes from the schema metadata pattern. It stores flexible key/value data without pretending that the value is a separate record or a confirmed reusable custom type.

## 324.5. Model Versus Structured Value

Use a model when the app needs identity, relations, generated stores, admin pages, or independent querying. A value that needs its own lifecycle usually deserves a model.

Use an object-like field when the data is supporting metadata for the current record. That keeps the structure attached to the owning model and avoids creating a top-level entity where the app does not need one.

Use a reusable type when the data has a known shape but does not need its own lifecycle. That gives the structure a name without turning it into a top-level entity.

## 324.6. Mistakes To Avoid

The main type mistake is using a reusable structure to avoid making a product
decision. A `type`, `Hash`, or `Json` field is useful only when it matches the
lifecycle of the value.

### 324.6.1. Hide An Important Record Inside A Type

```idea
type OrderLine {
  productId String
  quantity  Integer
}
```

This example can describe a line-shaped value, but it should not replace a model if order lines need their own queries, permissions, imports, or admin management. The more independent the record becomes, the more likely it belongs as a model.

### 324.6.2. Use `Json` To Avoid Naming Fields

```idea
details Json?
```

This example is acceptable for open-ended data, but it hides the shape from generated field-specific output. If the same keys matter across the app, a named `type` or a full `model` gives future readers more structure.

### 324.6.3. Turn Every Object Into A Model

```idea
model SeoSettings {
  title       String
  description Text?
}
```

This might be too much if SEO settings are only supporting metadata for one
owning record. Use a model when the value needs identity and lifecycle; use a
structured value when the shape is known but does not need independent
querying or administration.

**Learning checkpoint:** Before moving on, make sure you can name the confirmed built-in types, explain what a reusable `type` becomes in Stackpress schema generation, and decide when a value should become a full model instead.

**Next course:** Continue with `Props`. That course applies the same caution to reusable metadata patterns.
