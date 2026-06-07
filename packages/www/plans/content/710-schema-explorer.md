# 710 Schema Explorer

Inspect models, fields, relations, and generated artifacts visually in a future Studio-style schema workbench. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

**Previously:** The previous lesson, `680 API / OAuth`, gave you the setup this page builds on. Here, the focus shifts to `Schema Explorer` so you can place the next Stackpress surface in the course path.

## 710.1. Current Status

A visual schema explorer is useful only if it keeps pointing back to the real source. The important lesson is how to inspect structure without forgetting that `schema.idea` still owns the truth.

This page is future-facing. The current repository has Studio plans, not a stable Studio package. Use this page to understand the intended workflow and how it relates to today's code-first workflow.

## 710.2. Intended Explorer Workflow

Start from the current source:

```text
schema.idea
```

A Studio schema explorer should read that file, resolve `use` imports, parse resources, and display:

 - models
 - fields
 - enums
 - fieldsets or types
 - relations
 - source diagnostics

## 710.3. What Exists Today

Studio inspection is a visual layer over idea files. It should help you understand and edit schema, but it should not replace the idea source file as the canonical artifact.

## 710.4. What To Verify

This part of the Schema Explorer workflow is easier to follow when the smaller pieces are compared together. The subsections cover Schema Explorer, Source Preview, Diagnostics, so the reader can see how each piece changes the local decision.

### 710.4.1. Schema Explorer

A schema explorer is a UI for navigating parsed idea resources. The same idea shows up through inspectable project surfaces.

### 710.4.2. Source Preview

Source preview keeps the visual editor connected to the actual `.idea` text. The nearby check shows the project-level consequence.

### 710.4.3. Diagnostics

Diagnostics show parse, import, or validation problems before generation. The example gives the idea a concrete file, command, or code shape.

## 710.5. Open Questions

This part of the Schema Explorer workflow is easier to follow when the smaller pieces are compared together. The subsections cover Find A Model, Trace An Import, Compare To Generated Output, so the reader can see how each piece changes the local decision.

### 710.5.1. Find A Model

Use the model list to select an entity and inspect its fields, relations, and metadata. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 710.5.2. Trace An Import

Use the import graph to see which idea files contribute declarations. That context prepares the reader for the more specific form that follows.

### 710.5.3. Compare To Generated Output

After editing source, run generation and inspect generated artifacts. Keep the idea tied to the concrete project surface in this section.

## 710.6. Next Step

The useful shift is recognizing Schema Explorer as a pattern in files, commands, and runtime behavior. The nearby example or check shows the project detail affected by this idea.

Read `721 Field Validation` and `730 Relations` for specific Studio inspection flows. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `721 Field Validation`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
