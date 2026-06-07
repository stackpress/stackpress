# 430 Plugin Layout

Place routes, events, views, store wiring, and integrations in predictable local plugin folders. The nearby example or check shows the project detail affected by this idea.

**Previously:** The previous lesson, `421 Config Splitting`, gave you the setup this page builds on. Here, the focus shifts to `Plugin Layout` so you can place the next Stackpress surface in the course path.

## 430.1. When To Create A Plugin

A plugin folder is a small neighborhood for related behavior. Good layout helps a developer find pages, events, views, helpers, and registration code without reading the whole project first.

## 430.2. Folder Layout

Use a shape like:

```text
plugins/app/plugin.ts
plugins/app/pages/home.ts
plugins/app/views/home.tsx
plugins/store/plugin.ts
plugins/store/connect.ts
plugins/product/plugin.ts
plugins/product/pages/index.ts
plugins/product/views/index.tsx
```

Register plugin entrypoints in `package.json`:

```json
{
  "plugins": [
    "./plugins/app/plugin",
    "./plugins/store/plugin",
    "./plugins/product/plugin",
    "stackpress"
  ]
}
```

Read the example by finding the helper first, then the value or file it acts on. That habit makes the code easier to scan when the same pattern appears in a larger app.

## 430.3. Register Entrypoints

The plugin list names the app responsibilities. Each plugin folder holds the handlers, views, and helpers for that responsibility.

## 430.4. Verify Loading

This part of the Plugin Layout workflow is easier to follow when the smaller pieces are compared together. The subsections cover App Plugin, Store Plugin, Feature Plugin, so the reader can see how each piece changes the local decision.

### 430.4.1. App Plugin

Use an app plugin for shared public routes, app shell behavior, and cross-feature events. Compare the concrete details to see the app-level effect.

### 430.4.2. Store Plugin

Use a store plugin for database connection registration or data-adjacent setup. The following example gives the idea a concrete project shape.

### 430.4.3. Feature Plugin

Use a feature plugin when a route group has its own pages, views, events, and helpers. Keep the idea tied to the concrete project surface in this section.

## 430.5. Common Failures

This part of the Plugin Layout workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add A Page Route, Add Store Wiring, Add Integration Code, so the reader can see how each piece changes the local decision.

### 430.5.1. Add A Page Route

Put route registration in `plugin.ts`, handler code in `pages/*`, and React markup in `views/*`. That is why this detail appears in the lesson before reference material.

### 430.5.2. Add Store Wiring

Keep connection setup in `plugins/store` so database code is not mixed into page handlers. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 430.5.3. Add Integration Code

Create a named plugin folder for integrations such as email, payment, webhook, or sync behavior. The same idea shows up through inspectable project surfaces.

## 430.6. Next Step

For Plugin Layout, focus first on the problem it solves, then use the syntax as the concrete way Stackpress represents that problem. The nearby check shows the project-level consequence.

Read `440 Public Assets` to place images, styles, scripts, and icons. It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `440 Public Assets`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
