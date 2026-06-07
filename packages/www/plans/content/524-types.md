# 524 Types

Extract repeated structured values into a reusable type. Use the check to make the idea visible before moving to the next topic.

**Previously:** The previous lesson, `523 Enums`, gave you the setup this page builds on. Here, the focus shifts to `Types` so you can place the next Stackpress surface in the course path.

## 524.1. Modeling Goal

Sometimes several models need the same nested shape without becoming a separate model. Types let you name that structure once and reuse it where the app needs consistent embedded data.

## 524.2. Type Example

Create a type:

```idea
type Address {
  line1 String
  city  String
  state String?
  zip   String
} The examples stay practical by tying the idea to something you can run, change, or verify.
```

Use it:

```idea
shipping Address?
```

Read the example by finding the helper first, then the value or file it acts on. That habit makes the code easier to scan when the same pattern appears in a larger app.

## 524.3. Generated Effect

The type named a reusable structure. A model can use it as a field type without making the structure a separate top-level entity.

## 524.4. Authoring Rules

This part of the Types workflow is easier to follow when the smaller pieces are compared together. The subsections cover Type, Model Versus Type, Reuse, so the reader can see how each piece changes the local decision.

### 524.4.1. Type

A type describes a reusable value shape. That context prepares the reader for the more specific form that follows.

### 524.4.2. Model Versus Type

Use a model when records need identity, relations, generated stores, or admin pages. Use a type when the value is embedded structure.

### 524.4.3. Reuse

Types reduce repeated field groups and make shared shape changes easier. Keep the idea tied to the concrete project surface in this section.

## 524.5. Inspect Output

This part of the Types workflow is easier to follow when the smaller pieces are compared together. The subsections cover Extract Repetition, Keep Entities As Models, Regenerate After Changes, so the reader can see how each piece changes the local decision.

### 524.5.1. Extract Repetition

When the same group of fields appears in several places, consider a type. The nearby example or check shows the project detail affected by this idea.

### 524.5.2. Keep Entities As Models

Do not hide important records inside a type if the app needs to query them separately. Compare the concrete details to see the app-level effect.

### 524.5.3. Regenerate After Changes

Changing a shared type can affect every model that uses it. The following example gives the idea a concrete project shape.

## 524.6. Next Step

What changed in this lesson is your map: Types now has a place in the Stackpress system. The examples below turn the concept into concrete Stackpress project surfaces.

Read `525 Props` for reusable metadata and `527 Relations` for model-to-model links. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `525 Props`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
