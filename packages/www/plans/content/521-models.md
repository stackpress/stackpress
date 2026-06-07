# 521 Models

Model one application entity with an ID, labels, display metadata, and a few fields. A model is where product language becomes a shape Stackpress can generate from.

**Previously:** The previous lesson, `513 Plugins`, gave you the setup this page builds on. Here, the focus shifts to `Models` so you can place the next Stackpress surface in the course path.

## 521.1. Modeling Goal

Models are where product language becomes something the app can generate from. If the product has articles, orders, products, or profiles, each one needs a model-shaped place in the schema.

## 521.2. Model Example

Add a model:

```idea
model Product
  @labels("Product" "Products")
  @icon("box-open")
  @display("{{title}}")
{
  id    String @id @default("cuid()")
  title String @label("Title") @is.required("Title is required")
}
```

Run:

```bash
stackpress generate --b config -v
```

The model gives Stackpress a name, an identifier, display metadata, and one user-facing field. Change `Product` and `title` to match your product domain, but keep the same idea: one model should describe one thing the app tracks.

## 521.3. Generated Effect

The model declared an entity. Attributes gave generated UI and store layers enough metadata to name, identify, and display records.

## 521.4. Authoring Rules

This section separates the parts of a model declaration so the syntax has a purpose. The entity names the thing, the identifier gives each record a stable handle, and display metadata helps generated UI show the record clearly.

### 521.4.1. Entity

An entity is a thing the app tracks, stores, or displays. If the product team can talk about it as a noun, it may deserve a model.

### 521.4.2. Identifier

Use `@id` to mark the field that identifies a record. Without a stable identifier, updates, deletes, relations, and generated routes have no reliable way to point at one record.

### 521.4.3. Display Metadata

Use `@labels(...)`, `@icon(...)`, and `@display(...)` to help generated admin and view output represent the model. These attributes are small, but they make generated screens read like product UI instead of raw schema output.

## 521.5. Inspect Output

This section gives you a quick review pass for model authoring. Clear names, human labels, and focused model boundaries make generated output easier to read before you add more fields or relations.

### 521.5.1. Name Models Clearly

Use singular names for model declarations, such as `Article` rather than `Articles`. One model describes the shape of one record, even when the app stores many records.

### 521.5.2. Add Human Labels

Use labels when generated UI should show better words than raw code names. The schema can stay precise while the generated interface uses language that feels natural to users.

### 521.5.3. Keep Models Focused

If a model starts describing two separate entities, split it. A focused model is easier to query, validate, relate, and explain in generated output.

## 521.6. Next Step

This gives you the first mental handle for models: name one product thing, give it an identifier, and add the metadata generated output needs. Later pages add field types, enums, props, attributes, and relations on top of that base.

Read `522 Fields` to add typed data to the model. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `522 Fields`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
