# 846 Plugin Skills

Choose whether a feature belongs in schema, runtime plugin code, page/view code, or generator code. The nearby example or check shows the project detail affected by this idea.

**Previously:** The previous lesson, `845 Idea Authoring Skill`, gave you the setup this page builds on. Here, the focus shifts to `Plugin Skills` so you can place the next Stackpress surface in the course path.

## 846.1. Skill Purpose

Not every feature belongs in schema. Plugin skills help decide whether behavior should live in route handlers, page views, events, generated code, or integration plugins.

## 846.2. Use It When

Use:

 - `stackpress-plugin-router` to decide where the feature belongs
 - `stackpress-plugin-scaffold` to create or extend a plugin shell
 - `stackpress-plugin-pages-events` for page and event handlers
 - `stackpress-plugin-views` for TSX views
 - `stackpress-plugin-idea-generator` for generator transforms

## 846.3. Inputs

The plugin work split by responsibility. That prevents runtime code, views, and generation transforms from being mixed together.

## 846.4. What It Produces

This part of the Plugin Skills workflow is easier to follow when the smaller pieces are compared together. The subsections cover Runtime Plugin, Page/View Plugin Work, Idea Generator Plugin, so the reader can see how each piece changes the local decision.

### 846.4.1. Runtime Plugin

Runtime plugins register config, listen, route, or event behavior. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 846.4.2. Page/View Plugin Work

Page handlers prepare request/response behavior. Views render browser-facing UI.

### 846.4.3. Idea Generator Plugin

Generator plugins emit files during `stackpress generate`. The local example shows why that choice matters in an app.

## 846.5. Handoff

This part of the Plugin Skills workflow is easier to follow when the smaller pieces are compared together. The subsections cover Route A Feature, Build A Page Flow, Build A Generator, so the reader can see how each piece changes the local decision.

### 846.5.1. Route A Feature

Use the router skill when it is unclear whether the feature belongs in schema, pages, events, views, or generation. Compare the concrete details to see the practical meaning.

### 846.5.2. Build A Page Flow

Use pages/events and views skills together for route behavior plus TSX rendering. The nearby example or check shows the project detail affected by this idea.

### 846.5.3. Build A Generator

Use the idea generator skill only when output is model-driven and should be emitted during generation. Use that purpose as the anchor for the local example or check.

## 846.6. Verification

Use Plugin Skills as a guide for choosing which file, command, or generated output to inspect next. The same idea shows up through inspectable project surfaces.

**Next step:** Read `847 Verification Skill` before considering a phase complete. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `847 Verification Skill`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
