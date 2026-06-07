# 311 Generated Artifacts

Understand which Stackpress outputs are disposable, inspectable, and regenerated from source. Keep the idea tied to the concrete project surface in this section.

**Previously:** The previous lesson, `234 Schema Changes`, gave you the setup this page builds on. Here, the focus shifts to `Generated Artifacts` so you can place the next Stackpress surface in the course path.

## 311.1. What You Are Looking For

Generated files can look tempting to edit because they are real code. The safer habit is to treat them as evidence: inspect them to understand what happened, then fix the source that created them.

## 311.2. Where Artifacts Live

After changing schema or generation-facing config, run:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
```

Then inspect:

```text
.build
client_source
```

This example ties the concept to an actual Stackpress shape. Notice how the file or helper creates behavior the app can later run, inspect, or generate from.

## 311.3. Read Generated Files

Stackpress regenerated output from source files. If the generated output looks wrong, fix the source input and generate again.

## 311.4. Expected Evidence

This part of the Generated Artifacts workflow is easier to follow when the smaller pieces are compared together. The subsections cover Source Of Truth, Generated Artifact, Disposable Output, so the reader can see how each piece changes the local decision.

### 311.4.1. Source Of Truth

Source files include `schema.idea`, config files, local plugins, views, and public assets. The nearby example or check shows the project detail affected by this idea.

### 311.4.2. Generated Artifact

A generated artifact is output created by Stackpress from source input. It is meant to be inspected and rebuilt.

### 311.4.3. Disposable Output

Generated folders such as `.build` and `client_source` can usually be rebuilt. Do not treat them as the primary place to make product changes.

## 311.5. Fix The Source

This part of the Generated Artifacts workflow is easier to follow when the smaller pieces are compared together. The subsections cover Regenerate After A Field Change, Inspect Before Debugging Routes, and Avoid Hand Editing, so the reader can see how each piece changes the local decision.

### 311.5.1. Regenerate After A Field Change

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress push --b config -v
```

This example keeps the first version narrow on purpose. Once this shape is clear, the surrounding section can add options without making the first step harder to follow.

### 311.5.2. Inspect Before Debugging Routes

Check generated output before blaming route code when generated stores, actions, or view pieces are missing. Compare the concrete details to see the app-level effect.

### 311.5.3. Avoid Hand Editing

If generated output needs a change, update `schema.idea`, config, or the generator plugin that produced it. The following example gives the idea a concrete project shape.

## 311.6. Next Step

The checkpoint is simple: you can point to where Generated Artifacts shows up and explain why it matters. Keep the idea tied to the concrete project surface in this section.

Read `312 Client Source` to inspect readable generated TypeScript. For the mental model, use [Generated Artifacts](/concepts/generated-artifacts). It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `312 Client Source`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
