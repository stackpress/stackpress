# 700 Studio

Understand Studio as a planned browser workbench for authoring Stackpress idea files. The current repository contains Studio plans and wireframes, not a finished package, so this level teaches the intended direction while keeping the source-first rule visible.

**Previously:** The previous course, `API / OAuth`, covered the current API config, OAuth route, token, and scope surfaces. This course moves into Studio as a future-facing product area that should help developers inspect and edit schema structure without hiding `schema.idea`.

## 700.1. Current Status

Studio is planned as a first-party package named `stackpress-studio`. The plan describes a browser-based single-page application that opens a configured idea file, resolves `use` imports, parses schema resources, and presents models, fieldsets, enums, and source files.

That means this level should not over-promise a finished workflow. Read these pages as product-direction lessons that explain how Studio should support the code-first workflow, not as instructions for a shipped command.

## 700.2. Why Studio Exists

Idea files can become dense once an app has many models, fields, relations, enums, and imported files. Studio is meant to make that structure easier to inspect, edit, validate, and organize while preserving the idea source file as the canonical artifact.

Think of Studio as a workbench beside the blueprint. The workbench can help you find parts, check measurements, and prepare changes, but the blueprint still defines what gets built.

## 700.3. The Planned Workbench Shape

The Studio plan describes a dense admin workbench instead of a marketing-style interface. The proposed layout has a top bar, left rail, secondary explorer, main editor area, and a right task drawer for create, update, picker, relation, source, and diagnostics tasks.

```txt
Topbar
Left rail: Files, Models, Fieldsets, Enums, Source, Diagnostics
Main area: active index or editor
Right drawer: focused task stack
```

This example shows the planned mental model. The main page orients the developer, while the right drawer performs the task without losing the current list or active idea file.

## 700.4. What This Level Covers

`710 Schema Explorer`, `720 Fields`, `721 Field Validation`, and `730 Relations` focus on planned schema inspection and editing flows. They should teach how Studio keeps visual editing tied to idea source and diagnostics.

`740 Generated Admin` stays careful because Studio is explicitly not meant to rebuild all Stackpress admin behavior. `750 Import / Export` is treated as a planned source/file workflow, not as a completed data-management feature.

## 700.5. How To Read Future-Facing Pages

When a page says the workflow is intended or planned, treat that as a status marker. Use the page to understand the direction, then verify current behavior through files, packages, specs, or generated output before relying on it.

That caution protects junior developers from building on a promise instead of an implemented surface. It also keeps the course honest while the product area matures.

**Learning checkpoint:** Before moving on, make sure you can explain Studio as a planned assisted layer around idea files, schema resources, diagnostics, and safe source editing. You should also know why these pages distinguish current behavior from intended workflow.

**Next course:** Continue with `Schema Explorer`. That course explains the planned read-and-inspect surface before editing flows.
