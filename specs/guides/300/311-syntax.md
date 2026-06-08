# 311 Syntax

Read the small part of `.idea` syntax needed for normal Stackpress schema authoring. The goal is not parser theory; it is recognizing declarations, values, attributes, and blocks well enough to understand the rest of the Idea lessons.

**Previously:** The previous course, `Idea Files`, introduced `schema.idea` as the source file that feeds generation. This course teaches the reading skills you need before writing models and fields.

## 311.1. The Core Idea

An `.idea` file is made of declarations and nested data values. The parser defines the structure of the file, while Stackpress and its plugins define what many attributes mean.

That separation matters because the parser can preserve `@field.string`, but Stackpress decides how `@field.string` affects generated UI. When reading syntax, first ask what shape the parser sees, then ask which Stackpress layer gives that shape meaning.

## 311.2. A Small Model

Start with one model declaration. It is small enough to read line by line, but it shows the syntax pieces that appear throughout the rest of the course.

```idea
model Article
  @labels("Article" "Articles")
  @display("{{title}}")
{
  id    String @id @default("cuid()")
  title String @label("Title") @is.required("Title is required")
  body  Text?
}
```

`model Article` declares a named model. The `@labels(...)` and `@display(...)` lines attach metadata to the model, while the block between `{` and `}` contains fields.

## 311.3. Fields And Attributes

Each field line has a name and a type. In the example, `title String` means the field is named `title` and uses the built-in `String` type.

Attributes start with `@` and attach metadata or behavior. `@id` marks an identifier, `@default("cuid()")` supplies a default value, and `@is.required("Title is required")` gives Stackpress validation metadata to process later.

## 311.4. Values, Arrays, Objects, And Comments

The Idea format supports simple values such as strings, numbers, booleans, and null. Strings use double quotes, arrays are space-separated, and objects use nested key-value pairs.

```idea
enabled true
roles ["ADMIN" "USER"]
field {
  type "text"
  placeholder "Name"
}
```

This example is parser-level syntax. Whether `field` means anything useful depends on the declaration or plugin reading that data.

## 311.5. Mistakes To Avoid

Syntax mistakes are tricky because a line can look like valid `.idea` text while
still not mean what the developer thinks it means. Read the file in two passes:
first as parser shape, then as Stackpress meaning.

### 311.5.1. Treat Any Attribute As Built In

```idea
title String @unique @sortable
```

This may be readable parser syntax, but readability is not the same as
Stackpress behavior. Unless the Stackpress built-ins or a confirmed plugin
defines `@unique` or `@sortable`, the safe lesson is that the parser can carry
the metadata but Stackpress may not generate anything from it.

### 311.5.2. Memorize Grammar Before Modeling

```idea
model Article {
  title String
}
```

This small model is enough to keep learning. A junior developer does not need
the full grammar before writing the first model; they need to recognize
declarations, blocks, fields, types, optional markers, values, and attributes.

### 311.5.3. Copy Syntax From Another Ecosystem

```idea
model Article {
  title String @db.VarChar(255)
}
```

This example borrows a familiar-looking database attribute from another schema
language. Stackpress should not teach that as valid behavior unless a confirmed
Stackpress source defines it, because otherwise the doc turns a guess into a
contract.

**Learning checkpoint:** Before moving on, make sure you can identify declarations, blocks, fields, types, optional markers, arrays, objects, comments, and attributes in a `.idea` file. You should also know that parser support and Stackpress meaning are separate layers.

**Next course:** Continue with `Use`. That course shows how one idea file can include another.
