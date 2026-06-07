# 742 Admin Views

Inspect generated admin view output and trace it to schema labels, fields, validators, and component metadata. That context prepares the reader for the more specific form that follows.

**Previously:** The previous lesson, `741 Admin Pages`, gave you the setup this page builds on. Here, the focus shifts to `Admin Views` so you can place the next Stackpress surface in the course path.

## 742.1. What You Are Looking For

Generated admin screens look the way they do because schema metadata told them how to behave. Inspecting the view helps you trace a visible field back to the source that shaped it.

## 742.2. Where Admin Views Live

Start from schema:

```idea
title String
      @label("Title")
      @field.string
      @list.string
      @view.string
```

Run generation and inspect the generated admin search, create, update, or detail view. Keep the idea tied to the concrete project surface in this section.

## 742.3. Inspect Components

The schema metadata shaped generated admin display and form behavior. The nearby example or check shows the project detail affected by this idea.

## 742.4. Expected Evidence

This part of the Admin Views workflow is easier to follow when the smaller pieces are compared together. The subsections cover Search View, Detail View, Form View, so the reader can see how each piece changes the local decision.

### 742.4.1. Search View

Search views show lists, filters, sorting, pagination, and actions. Compare the concrete details to see the app-level effect.

### 742.4.2. Detail View

Detail views show one record and its display metadata. The following example gives the idea a concrete project shape.

### 742.4.3. Form View

Create and update views use field components and validators. The examples stay practical by tying the idea to something you can run, change, or verify.

## 742.5. Fix The Source

This part of the Admin Views workflow is easier to follow when the smaller pieces are compared together. The subsections cover Fix A Bad Label, Fix A Bad Input, and Fix A Bad Display, so the reader can see how each piece changes the local decision.

### 742.5.1. Fix A Bad Label

Change `@label(...)` in `schema.idea`, regenerate, then inspect the view. Keep that role in mind as the lesson moves into the concrete shape.

### 742.5.2. Fix A Bad Input

Change `@field.*` metadata. The nearby example or check shows the project detail affected by this idea.

### 742.5.3. Fix A Bad Display

Change `@list.*` or `@view.*` metadata. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 742.6. Next Step

You do not need the full reference yet. For Admin Views, focus on recognizing the pattern and knowing where to look next.

Read `743 Admin Client` to inspect generated browser-safe admin code. Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `743 Admin Client`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
