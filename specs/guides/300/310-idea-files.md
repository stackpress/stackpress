# 310 Idea Files

Learn how `.idea` files act as structured app modeling input. This group introduces the readable file shape, file composition through `use`, and plugin-facing declarations that decide which generators can participate.

**Previously:** The previous course, `Idea`, introduced `schema.idea` as the blueprint for generated output. Here, the focus shifts to the file surface itself so later modeling pages can talk about product concepts without stopping for file vocabulary every time.

## 310.1. Why File Shape Comes First

Before modeling a product, you need to read the authoring surface without guessing. Syntax, imports through `use`, and plugin declarations are the basics that let the rest of the idea level make sense.

This group does not try to be the full idea reference. It teaches the subset a junior developer needs to understand normal app files before looking up exhaustive details.

## 310.2. Start With `use`

The first idea-file pattern in the scaffold and scaffolded app is `use`. It tells the idea file to include definitions from another idea file before continuing with local declarations.

```idea
use "stackpress/stackpress.idea"
```

This example includes Stackpress' built-in idea definitions. The line is short, but it explains why an app can use Stackpress model and generation features without redefining every base concept locally.

## 310.3. Then Read Local Declarations

After the `use` line, a scaffolded app adds project declarations such as enums and models. The child pages now use parser, idea-authoring, and plugin sources for their focused lessons, while this page keeps the first file-shape anchor small.

```idea
enum PublishStatus {
  DRAFT "DRAFT"
  REVIEW "REVIEW"
  PUBLISHED "PUBLISHED"
  ARCHIVED "ARCHIVED"
}
```

This example defines a named set of allowed publishing states. Later modeling pages can explain enums more deeply, but the useful first point is that idea files can name domain concepts in a way generators can read.

## 310.4. What The Child Pages Need To Teach

`311 Syntax` explains declarations, blocks, literals, comments, and attributes with parser-backed examples. `312 Use` explains file composition and resolution rules, while `313 Plugins` explains the boundary between Idea plugin declarations and Stackpress runtime plugins.

Those pages stay source-sensitive because small syntax details matter. This parent page gives the reader only the safe orientation needed to continue, and the child pages carry the exact references where the details are taught.

## 310.5. How This Supports Modeling

The file lessons are a doorway into modeling, not the destination. Once the syntax is familiar, the next group can focus on models, fields, relations, and metadata instead of stopping to explain the file grammar every time.

That order keeps the learning path humane. You learn enough language shape to read examples, then you immediately use that language to describe product concepts.

**Learning checkpoint:** Before moving on, make sure you can name the three basic idea-file concerns: syntax, file composition, and plugin declarations. You should also know that `use "stackpress/stackpress.idea"` is a composition line, not a generated output file.

**Next course:** Continue with `Syntax`. That course starts with parser-backed idea syntax so the rest of the modeling pages have a reliable vocabulary.
