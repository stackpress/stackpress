# 525 Props

Define reusable metadata and apply it consistently across fields. That is why this detail appears in the lesson before reference material.

**Previously:** The previous lesson, `524 Types`, gave you the setup this page builds on. Here, the focus shifts to `Props` so you can place the next Stackpress surface in the course path.

## 525.1. Modeling Goal

Repeated metadata is easy to copy and easy to drift. Props give repeated settings a reusable place when the schema supports that pattern.

## 525.2. Prop Example

When several fields need the same generated behavior, identify the repeated metadata:

```idea
@field.string
@list.string
@view.string
```

Then decide whether the schema should keep the repeated attributes explicit or extract a reusable prop pattern supported by the current generator. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 525.3. Generated Effect

You treated repeated metadata as an authoring problem. The right answer depends on whether the repeated behavior improves clarity or hides too much from the next developer.

## 525.4. Authoring Rules

This part of the Props workflow is easier to follow when the smaller pieces are compared together. The subsections cover Prop, Explicit Metadata, Reusable Pattern, so the reader can see how each piece changes the local decision.

### 525.4.1. Prop

A prop is reusable metadata that can be applied to fields or generation behavior. The same idea shows up through inspectable project surfaces.

### 525.4.2. Explicit Metadata

Explicit attributes are easier for new developers to read, especially early in a project. The nearby check shows the project-level consequence.

### 525.4.3. Reusable Pattern

Reusable metadata is useful when repetition becomes a maintenance problem. The example gives the idea a concrete file, command, or code shape.

## 525.5. Inspect Output

This part of the Props workflow is easier to follow when the smaller pieces are compared together. The subsections cover Find Repetition, Keep Examples Readable, Verify Generator Support, so the reader can see how each piece changes the local decision.

### 525.5.1. Find Repetition

Search for repeated attribute groups before introducing a reusable abstraction. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 525.5.2. Keep Examples Readable

Do not extract metadata so aggressively that a model field becomes hard to understand. That context prepares the reader for the more specific form that follows.

### 525.5.3. Verify Generator Support

Only use prop patterns supported by the current Stackpress idea processing and generators. Keep the idea tied to the concrete project surface in this section.

## 525.6. Next Step

Use Props as a guide for choosing which file, command, or generated output to inspect next. The nearby example or check shows the project detail affected by this idea.

Read `526 Attributes` for the common metadata families. Use [Idea Reference](/reference/idea-reference) for supported behavior. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `526 Attributes`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
