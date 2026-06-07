# 160 Debugging And Inspection

Diagnose a broken route or generation mismatch by separating source files, generated output, runtime behavior, view data, and database state. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

**Previously:** The previous lesson, `156 Notifier`, gave you the setup this page builds on. Here, the focus shifts to `Debugging And Inspection` so you can place the next Stackpress surface in the course path.

## 160.1. What You Are Looking For

When an app breaks, trying every fix at once usually creates more confusion. Stackpress is easier to debug when you ask which layer is lying: config, plugins, generated output, routes, views, or data.

## 160.2. Where To Look

Use these commands as the first inspection set:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress emit article-search --b config -v
stackpress query --b config -v
```

This example keeps the first version narrow on purpose. Once this shape is clear, the surrounding section can add options without making the first step harder to follow.

## 160.3. Inspect Logs And Output

Each command answers a different question:

 - `generate` asks whether source inputs produced expected generated output
 - `generate:client` asks whether readable client output is current
 - `emit` asks whether an event behaves correctly
 - `query` asks what is actually in the database

## 160.4. Expected Evidence

This part of the Debugging And Inspection workflow is easier to follow when the smaller pieces are compared together. The subsections cover Source Problem, Generation Problem, Runtime Problem, Data Problem, so the reader can see how each piece changes the local decision.

### 160.4.1. Source Problem

Look at `schema.idea`, config, and local plugins when the intended behavior is wrong before generation or runtime starts. That context prepares the reader for the more specific form that follows.

### 160.4.2. Generation Problem

Look at `.build` and `client_source` when source input is right but generated output looks stale or incorrect. Keep the idea tied to the concrete project surface in this section.

### 160.4.3. Runtime Problem

Look at routes, events, plugin registration, and terminal output when the app boots but a request behaves incorrectly. The nearby example or check shows the project detail affected by this idea.

### 160.4.4. Data Problem

Look at database state when the route and generated output are correct but records are missing or unexpected. Compare the concrete details to see the app-level effect.

## 160.5. Fix The Source

This part of the Debugging And Inspection workflow is easier to follow when the smaller pieces are compared together. The subsections cover Schema Change Did Not Show Up, Event Behaves Strangely, and Local Data Is Stale, so the reader can see how each piece changes the local decision.

### 160.5.1. Schema Change Did Not Show Up

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress push --b config -v
```

This is the smallest useful version of the idea. Once you can name the moving parts here, the larger version is easier to inspect and debug.

### 160.5.2. Event Behaves Strangely

```bash
stackpress emit <event-name> --b config -v
```

Read the example by finding the helper first, then the value or file it acts on. That habit makes the code easier to scan when the same pattern appears in a larger app.

### 160.5.3. Local Data Is Stale

```bash
stackpress purge --b config -v
stackpress push --b config -v
stackpress populate --b config -v
```

This example ties the concept to an actual Stackpress shape. Notice how the file or helper creates behavior the app can later run, inspect, or generate from.

## 160.6. Next Step

What changed in this lesson is your map: Debugging And Inspection now has a place in the Stackpress system. The following example gives the idea a concrete project shape.

Move to `200 Data` when the runtime development loop is clear. For command details, use [CLI command details](/reference/cli-reference).

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `211 Dialects`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
