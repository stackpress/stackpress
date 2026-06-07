# 743 Admin Client

Inspect generated admin client code and understand how it supports admin views. The nearby check shows the project-level consequence.

**Previously:** The previous lesson, `742 Admin Views`, gave you the setup this page builds on. Here, the focus shifts to `Admin Client` so you can place the next Stackpress surface in the course path.

## 743.1. What You Are Looking For

Admin client output is browser-facing generated code. It helps you understand what was emitted for a model without treating generated files as the long-term fix.

## 743.2. Where Admin Client Output Lives

Run:

```bash
stackpress generate --b config/client -v
```

Inspect:

```text
client_source
```

Look for admin routes, views, exports, and model-specific admin folders. The example gives the idea a concrete file, command, or code shape.

## 743.3. Inspect Client Code

The client generation pass made generated admin output readable for inspection. The examples below turn the concept into concrete Stackpress project surfaces.

## 743.4. Expected Evidence

This part of the Admin Client workflow is easier to follow when the smaller pieces are compared together. The subsections cover Browser-Safe Export, Generated Package Export, Helper Functions, so the reader can see how each piece changes the local decision.

### 743.4.1. Browser-Safe Export

Admin client code must avoid server-only imports when it runs in the browser. Use that purpose as the anchor for the local example or check.

### 743.4.2. Generated Package Export

Generation patches package exports so runtime or client code can import generated admin modules. The same idea shows up through inspectable project surfaces.

### 743.4.3. Helper Functions

Admin client helpers can support filtering, ordering, pagination, import, and layout behavior. Keep the idea tied to the concrete project surface in this section.

## 743.5. Fix The Source

This part of the Admin Client workflow is easier to follow when the smaller pieces are compared together. The subsections cover Check A Missing Export, Check A Client Error, and Regenerate Before Debugging, so the reader can see how each piece changes the local decision.

### 743.5.1. Check A Missing Export

Inspect generated package exports when an admin module cannot be imported. The example gives the decision enough context to evaluate it.

### 743.5.2. Check A Client Error

Look for server-only imports in browser-facing generated code. Use the check to make the idea visible before moving to the next topic.

### 743.5.3. Regenerate Before Debugging

Refresh generated client output before tracing stale admin files. The same idea shows up through inspectable project surfaces.

## 743.6. Next Step

What changed in this lesson is your map: Admin Client now has a place in the Stackpress system. Keep that role in mind as the lesson moves into the concrete shape.

Read `750 Import / Export` for data movement in admin-style workflows. It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `750 Import / Export`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
