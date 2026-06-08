# 846 Plugin Skills

Use Stackpress plugin skills to decide where handwritten or generated feature work belongs. This matters because a feature can be schema work, runtime plugin work, page/view work, or generation work, and the wrong lane creates fragile code.

**Previously:** The previous course, `Idea Authoring Skill`, covered schema contracts. This course explains the skill boundaries for behavior that goes beyond, or depends on, that schema.

## 846.1. Start With Routing

`stackpress-plugin-router` classifies the feature before implementation. It checks schema first, then generation, runtime, and route/view needs, because many runtime patches are really missing schema or generation behavior.

```text
Request: Add searchable catalog helpers for every publishable model.
Lane: generation plugin work
Next skill: stackpress-plugin-scaffold, then stackpress-plugin-idea-generator
Evidence: transform registration, generated files, package exports, runtime import path
```

This example belongs in generation because the output is repeated per model and derived from schema metadata. A one-off runtime listener would be the wrong lane because it would rebuild model-driven structure by hand.

## 846.2. Plugin Scaffold Owns Shape

`stackpress-plugin-scaffold` creates or extends the plugin shell. It starts with `plugins/<plugin-name>/plugin.ts`, adds only the folders the role needs, and registers the plugin in `package.json.plugins` only after the entry file exists.

The default plugin folders have specific meanings: `events/` for handlers, `pages/` for route handlers, `views/` for browser-facing TSX pages, `transform/` for generation-time output, and `client.ts` for browser-safe exports. Creating every folder by default makes the plugin look more complete than it is.

## 846.3. Pages, Events, And Views

`stackpress-plugin-pages-events` owns server handlers under `pages/` and `events/`. It keeps the normal action contract, request/session access, `ctx.resolve`, `ctx.emit`, `res.results`, redirects, status codes, and reusable event boundaries consistent.

`stackpress-plugin-views` owns handwritten TSX views and route/view pairing. A route handler prepares data, `server.view.get(...)` points at the view module, and the view uses the Stackpress view client contract instead of acting like generic React.

## 846.4. Handoff Map

Use the plugin skills as a handoff map, not as interchangeable helpers. Each
skill exists because a different kind of mistake happens when a feature is
placed in the wrong layer.

| Situation | Owning skill | Evidence to look for |
| --- | --- | --- |
| The request changes models, fields, relations, or metadata | `stackpress-idea-authoring` | Updated `schema.idea`, generated output, schema-aware checks |
| The implementation lane is unclear | `stackpress-plugin-router` | Chosen lane, reason, artifact, next skill |
| A plugin shell or lifecycle wiring is missing | `stackpress-plugin-scaffold` | `plugins/<name>/plugin.ts`, justified folders, `package.json.plugins` |
| A route or reusable server event needs implementation | `stackpress-plugin-pages-events` | Action contract, guards, `ctx.resolve`, `ctx.emit`, response shape |
| A handwritten TSX page or route/view pair needs implementation | `stackpress-plugin-views` | View module, route data, provider-safe client usage |
| Schema-derived output should be generated repeatedly | `stackpress-plugin-idea-generator` | `idea` hook, `transform/index.ts`, generated files, package exports |

This table is useful because it makes the next action inspectable. A junior
developer should be able to point at the file, generated output, or runtime
registration that proves the chosen skill was the right one.

## 846.5. Split Multi-Lane Features

Some requests are not one lane. A feature can start in schema, generate client
helpers, and still need a runtime page or event to expose the behavior.

```text
Feature: Add model-derived moderation tools and a custom review page.
Lane 1: schema metadata through stackpress-idea-authoring
Lane 2: generated tools through stackpress-plugin-idea-generator
Lane 3: review route/view through stackpress-plugin-pages-events and stackpress-plugin-views
```

This example should not be forced into one plugin skill. The router skill
should split the work so each phase has the right owner and the right evidence
for completion.

## 846.6. Generator Plugins

`stackpress-plugin-idea-generator` owns plugins that participate in `stackpress generate`. It focuses on the `idea` hook, `transform/index.ts`, `Schema.make(props.schema)`, `props.directory`, generated files, package exports, and runtime reconnection through the generated client path.

Use this lane only when the feature should be emitted from schema or repeated across models. If the behavior is one-off request-time logic, route it back to runtime plugin work instead of forcing it into generation.

## 846.7. Mistakes To Avoid

Plugin skill mistakes come from putting behavior in the nearest file instead
of the correct lane. Route the feature first, then use the skill that owns that
kind of source work.

### 846.7.1. Implement Before The Lane Is Clear

```text
Feature: every model needs an exported search tool.
Likely lane: generation, because the output repeats per model.
```

This example should not start in a one-off runtime event. If every model needs
the same schema-derived output, the plugin router should steer the work toward
a generation plugin.

### 846.7.2. Put Generation Logic In Runtime Hooks

```text
Wrong lane: build generated model files inside a route handler.
Better lane: write files in transform/index.ts during generation.
```

This example keeps request-time behavior separate from generation-time output.
A route handler should answer a request, while a transform should emit files.

### 846.7.3. Import Server Code Into Browser Views

```tsx
import { readFileSync } from 'node:fs';
```

This belongs in server-side code, not browser-facing views or client exports.
The plugin view skill keeps browser code inside the Stackpress view layer and
leaves request-time logic in page handlers.

### 846.7.4. Use One Plugin As A Dumping Ground

```text
Weak ownership: put every new feature in plugins/app
Clear ownership: create or extend the feature plugin that owns the behavior
```

This example is about maintainability, not folder aesthetics. When ownership is
clear, future developers know which plugin should change when a feature breaks
or needs a generated companion.

**Learning checkpoint:** Before moving on, make sure you can route a feature to schema, generation, runtime, or route/view work before editing files. You should also be able to name which plugin skill owns each lane.

**Next course:** Continue with `Verification Skill`. That course closes the workflow by checking whether the chosen lane actually produced working evidence.
