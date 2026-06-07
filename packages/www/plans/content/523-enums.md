# 523 Enums

Create a fixed value set and use it as a field type. The following example gives the idea a concrete project shape.

**Previously:** The previous lesson, `522 Fields`, gave you the setup this page builds on. Here, the focus shifts to `Enums` so you can place the next Stackpress surface in the course path.

## 523.1. Modeling Goal

Some values should come from a known list. Enums keep choices like status, role, or account type from becoming random strings scattered through the app.

## 523.2. Enum Example

Declare an enum:

```idea
enum PublishStatus {
  DRAFT "DRAFT"
  REVIEW "REVIEW"
  PUBLISHED "PUBLISHED"
  ARCHIVED "ARCHIVED"
}
```

Use it in a model:

```idea
status PublishStatus
       @label("Status")
       @default("DRAFT")
       @field.select({ options [ "DRAFT" "REVIEW" "PUBLISHED" "ARCHIVED" ] })
       @view.string
```

This is the smallest useful version of the idea. Once you can name the moving parts here, the larger version is easier to inspect and debug.

## 523.3. Generated Effect

The enum defined allowed named values. The field uses that enum as its type and adds generated form/display metadata.

## 523.4. Authoring Rules

This part of the Enums workflow is easier to follow when the smaller pieces are compared together. The subsections cover Enum, Default Value, Select Component, so the reader can see how each piece changes the local decision.

### 523.4.1. Enum

An enum is a fixed set of values. Use it when open-ended strings would allow invalid states.

### 523.4.2. Default Value

A default value gives new records a starting state. Keep the idea tied to the concrete project surface in this section.

### 523.4.3. Select Component

Generated forms often use a select-like field for enum values. That is why this detail appears in the lesson before reference material.

## 523.5. Inspect Output

This part of the Enums workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add A New Option, Avoid Duplicates, Regenerate, so the reader can see how each piece changes the local decision.

### 523.5.1. Add A New Option

Add the enum member first, then update field component options if the generated UI needs the list. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 523.5.2. Avoid Duplicates

Do not use both a free-form `String` and an enum for the same state. The same idea shows up through inspectable project surfaces.

### 523.5.3. Regenerate

Run generation after changing enum values. The nearby check shows the project-level consequence.

## 523.6. Next Step

You do not need the full reference yet. For Enums, focus on recognizing the pattern and knowing where to look next.

Read `527 Relations` when a value points to another model instead of a fixed option set. It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `524 Types`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
