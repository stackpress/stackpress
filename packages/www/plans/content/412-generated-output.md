# 412 Generated Output

Trace generated output back to source input and regenerate it safely. The same idea shows up through inspectable project surfaces.

**Previously:** The previous lesson, `411 Source Of Truth`, gave you the setup this page builds on. Here, the focus shifts to `Generated Output` so you can place the next Stackpress surface in the course path.

## 412.1. What You Are Looking For

Generated output is a mirror, not the original face. When the mirror looks wrong, it helps you find the source problem, but the lasting fix belongs in schema, config, plugins, or views.

## 412.2. Where Output Lives

If generated output looks wrong:

 1. Find the related source input.
 2. Change the source input.
 3. Run generation.
 4. Inspect output again.

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
```

This example keeps the first version narrow on purpose. Once this shape is clear, the surrounding section can add options without making the first step harder to follow.

## 412.3. Inspect Output

You used generated output as evidence, not as the source of truth. The nearby check shows the project-level consequence.

## 412.4. Expected Evidence

This section names the generated output surfaces you are most likely to inspect. `.build`, `client_source`, and generated package targets are evidence of generation, but they are still outputs rather than the source of truth.

### 412.4.1. `.build`

`.build` stores generated working state such as revisions, migrations, and view output. The example gives the idea a concrete file, command, or code shape.

### 412.4.2. `client_source`

`client_source` stores readable generated TypeScript for inspection. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 412.4.3. Generated Package Target

Config can point generated client output at a package-like folder used by runtime imports. That context prepares the reader for the more specific form that follows.

## 412.5. Fix The Source

This part of the Generated Output workflow is easier to follow when the smaller pieces are compared together. The subsections cover Trace A Missing Field, Trace A Missing Event, and Clean Bad Local State, so the reader can see how each piece changes the local decision.

### 412.5.1. Trace A Missing Field

Check `schema.idea`, rerun generation, then inspect `client_source`. Keep the idea tied to the concrete project surface in this section.

### 412.5.2. Trace A Missing Event

Check schema and generator output before changing route code that emits the event. The nearby example or check shows the project detail affected by this idea.

### 412.5.3. Clean Bad Local State

Delete disposable generated folders only when you know they can be rebuilt from current source. Compare the concrete details to see the app-level effect.

## 412.6. Next Step

What changed in this lesson is your map: Generated Output now has a place in the Stackpress system. The following example gives the idea a concrete project shape.

Read `421 Config Splitting` to understand why generation and runtime often use different config files. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `421 Config Splitting`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
