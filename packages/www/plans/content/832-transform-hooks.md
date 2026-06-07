# 832 Transform Hooks

Inspect a generation-time AI transform hook that writes generated tool output. The same idea shows up through inspectable project surfaces.

**Previously:** The previous lesson, `831 AI Events`, gave you the setup this page builds on. Here, the focus shifts to `Transform Hooks` so you can place the next Stackpress surface in the course path.

## 832.1. When To Use Transform Hooks

Generation-time AI work belongs in transform hooks, not request handlers. Hooks let the idea pipeline produce tool registries and client output before runtime starts.

## 832.2. Hook Workflow

Inspect:

```text
packages/stackpress-ai/src/transform/index.ts
packages/stackpress-ai/src/transform/tools.ts
packages/stackpress-ai/src/transform/package.ts
```

Then run generation for an app with the AI plugin configured:

```bash
stackpress generate --b config/client -v
```

Use this as the concrete version of the explanation above. The part to copy is the structure; the part to change is the value that matches your app.

## 832.3. Register The Hook

The transform reads schema models and writes tool modules and registries into generated client output. The nearby check shows the project-level consequence.

## 832.4. Inspect Output

This part of the Transform Hooks workflow is easier to follow when the smaller pieces are compared together. The subsections cover Transform Hook, Tool Module, Package Export, so the reader can see how each piece changes the local decision.

### 832.4.1. Transform Hook

A transform hook runs during generation, not during normal request handling. The example gives the idea a concrete file, command, or code shape.

### 832.4.2. Tool Module

A tool module describes one AI-facing operation. The examples below turn the concept into concrete Stackpress project surfaces.

### 832.4.3. Package Export

The transform patches package exports so generated tools can be imported later. Use that purpose as the anchor for the local example or check.

## 832.5. Common Failures

This part of the Transform Hooks workflow is easier to follow when the smaller pieces are compared together. The subsections cover Check Root Tools, Check Model Tools, Check Package Exports, so the reader can see how each piece changes the local decision.

### 832.5.1. Check Root Tools

Inspect generated `tools.ts` or the root tools registry. The same idea shows up through inspectable project surfaces.

### 832.5.2. Check Model Tools

Inspect per-model tool folders when a specific model operation is missing. Keep the idea tied to the concrete project surface in this section.

### 832.5.3. Check Package Exports

If runtime cannot import generated tools, inspect generated package exports. The example gives the decision enough context to evaluate it.

## 832.6. Next Step

The useful shift is recognizing Transform Hooks as a pattern in files, commands, and runtime behavior. Use the check to make the idea visible before moving to the next topic.

Read `847 Verification Skill` for phase-gate checks around generated AI output. Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `841 Skill Workflow`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
