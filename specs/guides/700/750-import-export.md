# 750 Import / Export

Understand import and export as planned Studio-adjacent workflows for moving source files or structured data across boundaries. The current Studio plans discuss source files, import graphs, source save behavior, and safe patches, but they do not define a finished production data import/export feature.

**Previously:** The previous course, `Admin Client`, inspected the generated admin client helpers and browser-safe exports. This page stays future-facing and focuses on the confirmed Studio planning material.

## 750.1. Current Status

The Studio plan treats idea files and imports as first-class workspace resources. It describes creating new importable idea files, adding `use` statements explicitly, resolving import graphs, showing diagnostics, and saving source changes safely.

That is different from promising a completed data import/export tool for production records. Until a source-backed implementation exists, this page should be read as planning guidance around source import graphs and safe save behavior.

## 750.2. Idea File Import Workflow

The plan says creating a new idea file should be explicit. Studio should create the file under the configured imports directory, open it as an unlinked file, and let the user choose when to import it into the main idea file.

```txt
New idea file
  -> create under studio.imports.defaultDirectory
  -> open as unlinked file
  -> user chooses "Import into main idea"
  -> Studio adds a use statement to the main file
```

This example shows the planned workflow as a source operation. Studio should not silently change the main idea file just because a developer created another file.

## 750.3. Source Save Workflow

The plan says source must remain canonical and that the first implementation can support source saves before more advanced structured patches. `POST /studio/api/save` is planned to accept source changes and structured patches only when they can be applied safely.

```txt
Edit source
Parse source
Show diagnostics
Save when safe
Refresh models, fieldsets, enums, and source state
```

This example is the planned safe-save loop. The important lesson is that saving is not just writing text; Studio should parse, diagnose, and refresh visible schema state after the change.

## 750.4. Structured Patch Boundaries

The plan recommends conservative structured operations first, such as appending a new model, enum, fieldset, field, or enum option. Higher-risk operations such as renaming resources, reordering fields, removing fields, or moving resources between files need stronger parser location support.

This distinction protects the source file. If Studio cannot safely apply a structured operation, the plan says it can switch the user to Source mode with a generated snippet instead of pretending it can patch every case.

## 750.5. What To Verify

For idea-file imports, verify that the new file exists inside the workspace, that the main file contains the expected `use` statement only after the user requested it, and that the import graph refreshes. Also check diagnostics for missing, unreadable, duplicate, or outside-workspace imports.

For source saves, verify that the source remains parseable, the changed resources appear in the UI state, and unsafe operations are blocked with clear diagnostics. Those checks are the planned evidence that Studio changed source safely.

## 750.6. What Is Not Covered Yet

This page does not teach production data import/export. It also does not define admin CSV routes, batch database writes, or downloaded model records because the current report does not confirm those sources for this course.

Keeping that boundary explicit matters. A junior developer should leave this page understanding planned Studio source import/export behavior, not assuming a data migration tool exists.

**Learning checkpoint:** Before moving on, make sure you can explain the difference between importing idea files into a schema graph and importing production records. You should also know why Studio source saves must parse, diagnose, and refresh state before they are trusted.

**Next course:** Continue with `AI`. That course moves from planned Studio workflows into AI and skill-assisted Stackpress work.
