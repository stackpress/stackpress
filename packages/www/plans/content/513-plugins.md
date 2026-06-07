# 513 Plugins

Use plugin declarations in `.idea` files to select generator output and configure where generated artifacts should go. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

**Previously:** The previous lesson, `512 Use`, gave you the setup this page builds on. Here, the focus shifts to `Plugins` so you can place the next Stackpress surface in the course path.

## 513.1. Modeling Goal

Plugin declarations inside idea files are generation input, not runtime route code. They tell the generator which kinds of output to prepare from the schema.

## 513.2. Plugin Example

When a generator plugin uses idea declarations, read the declaration as output selection:

```idea
plugin admin {
  output "./client-source/admin"
}
```

The exact supported plugin fields depend on the generator. Check the plugin's documentation before adding fields.

## 513.3. Generated Effect

The idea plugin declaration gave generation-time instructions. It did not register a server route by itself.

## 513.4. Authoring Rules

This part of the Plugins workflow is easier to follow when the smaller pieces are compared together. The subsections cover Generation Plugin, Runtime Plugin, Output Path, so the reader can see how each piece changes the local decision.

### 513.4.1. Generation Plugin

A generation plugin participates in `stackpress generate` and writes output from schema input. The local example shows why that choice matters in an app.

### 513.4.2. Runtime Plugin

A runtime plugin registers behavior during `config`, `listen`, or `route`. It lives in TypeScript plugin files, not in `.idea` declarations.

### 513.4.3. Output Path

Generation plugins often need an output location. Use configured output paths rather than ad hoc folders.

## 513.5. Inspect Output

This part of the Plugins workflow is easier to follow when the smaller pieces are compared together. The subsections cover Check Whether A Plugin Supports Idea Input, Keep Runtime Behavior Out, Regenerate After Changes, so the reader can see how each piece changes the local decision.

### 513.5.1. Check Whether A Plugin Supports Idea Input

Inspect the plugin docs or source before adding a declaration. Compare the concrete details to see the practical meaning.

### 513.5.2. Keep Runtime Behavior Out

Do not try to express route handlers or integration logic directly in `.idea`. The examples stay practical by tying the idea to something you can run, change, or verify.

### 513.5.3. Regenerate After Changes

```bash
stackpress generate --b config -v
```

This example keeps the first version narrow on purpose. Once this shape is clear, the surrounding section can add options without making the first step harder to follow.

## 513.6. Next Step

Before moving on, connect Plugins to the files, commands, generated output, or runtime behavior around it. That is why this detail appears in the lesson before reference material.

Read `540 Idea Plugin Authoring` and its leaf pages when you need to build a custom generator. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `521 Models`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
