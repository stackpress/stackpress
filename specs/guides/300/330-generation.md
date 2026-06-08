# 330 Generation

Inspect how idea input becomes Stackpress output. This group connects `schema.idea` declarations to generated schema classes, SQL stores and actions, admin/view pieces, and client-facing TypeScript.

**Previously:** The previous course, `Relations`, used a scaffolded app and idea-authoring references to explain Stackpress relation modeling. This page moves from modeling source to generated evidence by using a scaffolded app's idea file and generated client output.

## 330.1. Why Generation Needs Inspection

Generation can feel automatic, but automatic output still needs review. A generated file is evidence that Stackpress understood the source in a specific way.

That evidence helps you debug without guessing. If the output does not match the model, you can trace the mismatch back to the idea source, generator configuration, or plugin behavior.

## 330.2. The Source Side

A scaffolded app uses `schema.idea` as the source input. It starts by using Stackpress' built-in idea definitions, then defines domain concepts such as `PublishStatus`, `Category`, `Catalog`, and `Article`.

```idea
use "stackpress/stackpress.idea"

enum PublishStatus {
  DRAFT "DRAFT"
  REVIEW "REVIEW"
  PUBLISHED "PUBLISHED"
  ARCHIVED "ARCHIVED"
}
```

This example shows the beginning of the source file that generation reads. The `use` line composes built-in definitions, and the enum gives generators a named set of allowed values they can carry into output.

## 330.3. The Command Path

A scaffolded app exposes generation through its package scripts. The relevant script points Stackpress at the development bootstrap config and enables verbose output.

```json
{
  "scripts": {
    "generate": "stackpress generate --b config/develop -v"
  }
}
```

This example matters because generation needs a bootstrap context. The `--b config/develop` part tells Stackpress which config module to use, and `-v` makes the run easier to inspect while learning or debugging.

## 330.4. The Output Side

After generation, a scaffolded app has a `client-source` package. That output includes per-model folders, root exports, generated schema classes, generated stores, generated actions, generated events, admin routes, tools, and package metadata.

```txt
client-source/
  Article/
    ArticleSchema.ts
    ArticleStore.ts
    ArticleActions.ts
    columns/
    events/
    tools/
  index.ts
  package.json
```

This example is a small slice of the generated output. It shows why generated files are useful for inspection: if the `Article` model exists in the idea source, you can look for the corresponding generated schema, store, action, event, and tool surfaces.

## 330.5. Source First, Output Second

The generated output pages do not teach you to hand-edit generated files. They teach you to read the files so you can verify what the source produced.

That distinction matters because regeneration can replace output. Treat generated files as a report from Stackpress, then change the source input that caused the report.

## 330.6. How The Output Pages Work

`331 Schema Output`, `332 SQL Output`, `333 View Output`, and `334 Client Output` each inspect one generated output family. They use concrete example-app files so the reader can compare the idea source with the generated schema, SQL, view, and client surfaces.

The safe habit is already clear. Open the generated output, confirm whether the expected file or export exists, then trace any mismatch back to `schema.idea`, generator configuration, plugin declarations, or command output.

**Learning checkpoint:** Before moving on, make sure you can explain generated output as inspectable evidence rather than the primary editing surface. You should also know that a scaffolded app connects `schema.idea`, `stackpress generate --b config/develop -v`, and `client-source`.

**Next course:** Continue with `Schema Output`. That course starts the output inspection path with generated schema and column files.
