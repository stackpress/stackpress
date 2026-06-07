# 534 Client Output

Use generated client-facing TypeScript for inspection and troubleshooting. Compare the concrete details to see the app-level effect.

**Previously:** The previous lesson, `533 View Output`, gave you the setup this page builds on. Here, the focus shifts to `Client Output` so you can place the next Stackpress surface in the course path.

## 534.1. What You Are Looking For

Client output gives you browser-safe TypeScript to inspect when generated behavior is unclear. It is a map of what Stackpress emitted, not a place to patch by hand.

## 534.2. Where Client Output Lives

Run:

```bash
stackpress generate --b config/client -v
```

Open:

```text
client_source
```

Inspect generated types, scripts, tools, and model folders. The following example gives the idea a concrete project shape.

## 534.3. Inspect Client Types

The client generation pass wrote a readable copy of generated output. You can use it to debug schema meaning and generated event names.

## 534.4. Expected Evidence

This part of the Client Output workflow is easier to follow when the smaller pieces are compared together. The subsections cover Client-Facing Output, Inspect, Then Fix Source, Package Surface, so the reader can see how each piece changes the local decision.

### 534.4.1. Client-Facing Output

Client-facing output is generated TypeScript that can include types, admin structures, tools, scripts, and model-specific artifacts. Keep the idea tied to the concrete project surface in this section.

### 534.4.2. Inspect, Then Fix Source

If output is wrong, fix `schema.idea`, config, or generator code. That is why this detail appears in the lesson before reference material.

### 534.4.3. Package Surface

Runtime code may import generated artifacts through a generated client package path. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 534.5. Fix The Source

This part of the Client Output workflow is easier to follow when the smaller pieces are compared together. The subsections cover Find A Type, Find An Event Name, and Refresh Stale Output, so the reader can see how each piece changes the local decision.

### 534.5.1. Find A Type

Open the generated `types` output and compare it with the model. The same idea shows up through inspectable project surfaces.

### 534.5.2. Find An Event Name

Inspect generated scripts or model output when a route cannot resolve an event. The nearby check shows the project-level consequence.

### 534.5.3. Refresh Stale Output

Run both main generation and client generation before trusting the folder. The example gives the idea a concrete file, command, or code shape.

## 534.6. Next Step

This gives you the first mental handle for Client Output; later pages can add more detail without starting from zero. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

Read `541 ts-morph Plugins` if you need to generate TypeScript yourself. Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `541 ts-morph Plugins`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
