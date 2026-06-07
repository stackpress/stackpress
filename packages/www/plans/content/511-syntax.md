# 511 Syntax

Read the small part of `.idea` syntax you need for normal Stackpress app authoring. The goal is recognition, not language theory, so you can understand later schema examples without stopping on every symbol.

**Previously:** The previous lesson, `440 Public Assets`, gave you the setup this page builds on. Here, the focus shifts to `Syntax` so you can place the next Stackpress surface in the course path.

## 511.1. Modeling Goal

Before schema can generate anything, you need to read the language it is written in. The goal here is not parser theory; it is recognizing the few shapes you will see constantly in `schema.idea`.

## 511.2. Idea Example

Read this model:

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

It declares one model, three fields, and several attributes. The shape is small enough to read line by line, but it already shows the syntax pieces that appear throughout Stackpress schema lessons.

## 511.3. Syntax Rules

The `.idea` file describes app intent. Stackpress later interprets that intent into schema, SQL, admin, view, and client output.

## 511.4. Generated Effect

This section names the syntax pieces in the example before the course adds more schema concepts. Declarations, blocks, fields, and attributes are the basic shapes you need to recognize in `schema.idea`.

### 511.4.1. Declaration

A declaration introduces something named, such as `model Article` or `enum PublishStatus`. Once you can spot declarations, you can tell what kind of thing a block is defining.

### 511.4.2. Block

A block groups fields or members between `{` and `}`. In a model, the block is where the model's fields live.

### 511.4.3. Field

A field has a name, type, optional marker, and attributes. It is the smallest schema line that usually turns into stored data, generated UI, or validation behavior.

### 511.4.4. Attribute

An attribute starts with `@` and adds metadata or behavior. Attributes are how a field gets labels, validation, generated input behavior, and display behavior.

## 511.5. Inspect Output

This section shows how to read common syntax marks without memorizing the whole language. Optional fields, repeated fields, and attributes are small details, but they change generated output in visible ways.

### 511.5.1. Read Optional Fields

`Text?` means the field can be absent or empty. That matters when generated validation and storage rules decide whether a value is required.

### 511.5.2. Read Repeated Fields

`String[]` means the field stores a list of strings. Repeated values should be used when the product really needs many values, not as a shortcut for unclear data.

### 511.5.3. Read Attributes

Start with common attributes such as `@id`, `@default(...)`, `@label(...)`, `@is.required(...)`, `@field.*`, and `@view.*`. Each one adds meaning that later generators can use.

## 511.6. Next Step

Syntax is the reading skill behind every later `schema.idea` lesson. You do not need to know every rule yet; you only need to recognize the shapes that models, fields, and attributes reuse.

Read `521 Models` and `522 Fields` to start authoring. For exhaustive syntax and built-ins, use [Idea Reference](/reference/idea-reference). Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `512 Use`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
