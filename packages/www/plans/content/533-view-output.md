# 533 View Output

Inspect generated view-facing pieces and connect them back to schema metadata. That is why this detail appears in the lesson before reference material.

**Previously:** The previous lesson, `532 SQL Output`, gave you the setup this page builds on. Here, the focus shifts to `View Output` so you can place the next Stackpress surface in the course path.

## 533.1. What You Are Looking For

View output is how schema metadata starts affecting what users see. Field and model attributes can shape forms, lists, detail screens, and generated admin surfaces.

## 533.2. Where View Output Lives

Start from a field:

```idea
price Float
      @label("Price")
      @field.price
      @list.price
      @view.price
```

After generation, inspect the generated client or admin output for price field, list, and view behavior. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 533.3. Inspect Components

The field did more than define a number. It gave generated form, list, and view layers presentation metadata.

## 533.4. Expected Evidence

This part of the View Output workflow is easier to follow when the smaller pieces are compared together. The subsections cover Field Component, List Component, View Component, so the reader can see how each piece changes the local decision.

### 533.4.1. Field Component

`@field.*` influences generated input behavior. The same idea shows up through inspectable project surfaces.

### 533.4.2. List Component

`@list.*` influences generated list/search display behavior. The nearby check shows the project-level consequence.

### 533.4.3. View Component

`@view.*` influences generated detail or display behavior. The example gives the idea a concrete file, command, or code shape.

## 533.5. Fix The Source

This part of the View Output workflow is easier to follow when the smaller pieces are compared together. The subsections cover Trace A Bad Form Input, Trace A Bad List Cell, and Trace A Bad Detail Display, so the reader can see how each piece changes the local decision.

### 533.5.1. Trace A Bad Form Input

Check the field's `@field.*` metadata first. The examples below turn the concept into concrete Stackpress project surfaces.

### 533.5.2. Trace A Bad List Cell

Check the field's `@list.*` metadata. Use that purpose as the anchor for the local example or check.

### 533.5.3. Trace A Bad Detail Display

Check the field's `@view.*` metadata. The same idea shows up through inspectable project surfaces.

## 533.6. Next Step

Before moving on, connect View Output to the files, commands, generated output, or runtime behavior around it. Keep the idea tied to the concrete project surface in this section.

Read `534 Client Output` for the generated TypeScript inspection workflow. It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `534 Client Output`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
