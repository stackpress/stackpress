# 710 Schema Explorer

Inspect models, fieldsets, enums, source files, imports, and diagnostics in a planned Studio workbench. This page is future-facing, so it focuses on how the explorer should help a developer read source-backed schema structure instead of promising a finished UI.

**Previously:** The previous course, `Studio`, explained why the planned product must preserve idea files as the canonical source. Here, the focus shifts to the first Studio job: making the current schema easier to inspect.

## 710.1. Current Status

The current repository has Studio plans and wireframes, not a stable Studio package. The plan proposes a single-page app served through a Stackpress route, with JSON APIs for schema state, models, fieldsets, enums, parsing, saving, and presets.

That status matters because a junior developer should not expect a finished explorer command yet. The stable fallback today is still reading `schema.idea`, imported idea files, generated output, and diagnostics from source-backed tooling.

## 710.2. What The Explorer Should Open

The Studio plan says the app should open the configured idea file, resolve `use` imports, parse resources, and present the result as editable models, fieldsets, enums, and source files. It should also keep source editing as an escape hatch when structured editing is not safe.

```txt
schema.idea
  -> imported idea files
  -> parsed models
  -> parsed fieldsets
  -> parsed enums
  -> diagnostics
```

This example shows the planned inspection path. Studio starts from source text, follows imports, then shows parsed resources and diagnostics without replacing the source file as the truth.

## 710.3. Active File Scope

The admin UI plan treats idea files as first-class workspace resources. Clicking an idea file should set the active file, open the Models view for that file, update section counts, and scope Models, Fieldsets, Enums, and Source to that file.

This matters because imported idea files can contribute declarations. A schema explorer that hides the active file would make it harder to know where a model or enum should be edited.

## 710.4. Diagnostics

Studio diagnostics should combine parser errors with Studio-level checks. The plan names diagnostics such as missing imports, unreadable imports, duplicate resource names, unknown field types, enum references that do not exist, and unsafe deletions that would leave references behind.

```txt
Parser diagnostics
File diagnostics
Schema diagnostics
Reference diagnostics
```

This example is not a shipped output format. It is the planned evidence categories the explorer should show so a developer can fix source problems before running generation.

## 710.5. Safe Fallback Today

Until Studio is implemented, use the code-first path. Open `schema.idea`, inspect any files pulled in with `use`, run generation when appropriate, and compare generated output to the source.

That fallback keeps the lesson practical. Studio may make inspection easier later, but the source-to-output discipline already applies today.

**Learning checkpoint:** Before moving on, make sure you can explain the planned explorer as a source-backed schema reader, not a separate schema database. You should also know that active file scope and diagnostics are central to the Studio plan.

**Next course:** Continue with `Fields`. That course narrows the planned explorer idea to the field editing surface.
