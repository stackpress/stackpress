# 234 Schema Changes

Add a field, regenerate output, push database changes, and verify existing data remains readable. Compare the concrete details to see the practical meaning.

**Previously:** The previous lesson, `233 JSON Fields`, gave you the setup this page builds on. Here, the focus shifts to `Schema Changes` so you can place the next Stackpress surface in the course path.

## 234.1. When Schema Changes

Apps change after data already exists, and the database has to change with them. Schema changes are safest when you edit the source, regenerate, inspect, and push instead of hand-editing output.

## 234.2. Edit The Source

Edit `schema.idea`:

```text
summary Text?
        @label("Summary")
        @field.textarea
        @view.text The examples below turn the concept into concrete Stackpress project surfaces.
```

Run:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress push --b config -v
```

Verify:

```bash
stackpress query --b config -v
```

Read the example by finding the helper first, then the value or file it acts on. That habit makes the code easier to scan when the same pattern appears in a larger app.

## 234.3. Generate Or Push

The schema changed first. Generation updated the app artifacts. `push` applied the structure change to the database. Inspection confirmed the database still behaves as expected.

## 234.4. Inspect The Diff

This part of the Schema Changes workflow is easier to follow when the smaller pieces are compared together. The subsections cover Source Of Truth, Generated Output, and Database Push, so the reader can see how each piece changes the local decision.

### 234.4.1. Source Of Truth

`schema.idea` is the source of truth for model and field changes. That is why this detail appears in the lesson before reference material.

### 234.4.2. Generated Output

Generated files reflect the schema. Do not patch them as the primary fix for a schema mistake.

### 234.4.3. Database Push

`push` updates database structure from the current generated schema state. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 234.5. Common Failures

This part of the Schema Changes workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add Optional Fields First, Add Required Fields Carefully, Check Generated Client Output, so the reader can see how each piece changes the local decision.

### 234.5.1. Add Optional Fields First

Optional fields are usually safer because existing rows do not need an immediate value. The same idea shows up through inspectable project surfaces.

### 234.5.2. Add Required Fields Carefully

If a new required field has no default, existing rows may need data before the app can use the field safely. The nearby check shows the project-level consequence.

### 234.5.3. Check Generated Client Output

Inspect `client_source` after generation to confirm the field appears the way you expect. The example gives the idea a concrete file, command, or code shape.

## 234.6. Next Step

For Schema Changes, focus first on the problem it solves, then use the syntax as the concrete way Stackpress represents that problem. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

Move to `300 Build And Deploy` after you understand the local data workflow. That context prepares the reader for the more specific form that follows.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `311 Generated Artifacts`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
