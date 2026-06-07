# 312 Client Source

Use `client_source` as readable generated TypeScript for inspection, not as hand-authored application code. Use that purpose as the anchor for the local example or check.

**Previously:** The previous lesson, `311 Generated Artifacts`, gave you the setup this page builds on. Here, the focus shifts to `Client Source` so you can place the next Stackpress surface in the course path.

## 312.1. What You Are Looking For

Generated TypeScript is useful because it makes Stackpress output readable. When something is missing from a route, view, store, or admin surface, client source can show what the generator actually produced.

## 312.2. Where Client Source Lives

Run:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
```

Open:

```text
client_source
```

Look for generated types, scripts, tools, admin output, and model-specific files. The same idea shows up through inspectable project surfaces.

## 312.3. Inspect Generated Types

The client-focused generation pass wrote readable TypeScript into `client_source`. That folder lets you inspect what Stackpress inferred and emitted.

## 312.4. Expected Evidence

This part of the Client Source workflow is easier to follow when the smaller pieces are compared together. The subsections cover Inspection Output, Trace Back, Client Config, so the reader can see how each piece changes the local decision.

### 312.4.1. Inspection Output

`client_source` is a readable view of generated output. It is not the main app source.

### 312.4.2. Trace Back

When output is wrong, trace it back to `schema.idea`, config, or the generator plugin. Keep the idea tied to the concrete project surface in this section.

### 312.4.3. Client Config

`config/client.ts` can point generated client output to a readable folder for debugging. The example gives the decision enough context to evaluate it.

## 312.5. Fix The Source

This part of the Client Source workflow is easier to follow when the smaller pieces are compared together. The subsections cover Check A Generated Type, Check A Generated Action, and Refresh Output, so the reader can see how each piece changes the local decision.

### 312.5.1. Check A Generated Type

Open the model type in `client_source` and compare it with the matching `schema.idea` model. Use the check to make the idea visible before moving to the next topic.

### 312.5.2. Check A Generated Action

Find the generated action or script and confirm the event name matches the route code using it. The examples stay practical by tying the idea to something you can run, change, or verify.

### 312.5.3. Refresh Output

Regenerate before debugging stale client output. That context prepares the reader for the more specific form that follows.

## 312.6. Next Step

The important checkpoint is knowing where Client Source belongs in the Stackpress workflow. Keep the idea tied to the concrete project surface in this section.

Read `412 Generated Output` when you want the broader project-structure view. For exact client config fields, use [Config Reference](/reference/config-reference). It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `320 Local Production`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
