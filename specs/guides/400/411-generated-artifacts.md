# 411 Generated Artifacts

Generated artifacts are files and runtime state that Stackpress creates from
source input. They matter because they are useful to inspect, but they are not
usually the place where you fix product behavior.

**Previously:** `Generate And Build` explained the command and runtime shape.
Here, the focus shifts to the output those commands create and how to inspect
it without treating generated files as hand-authored source.

## 411.1. What You Are Looking For

When generation feels confusing, look for the boundary between source and
output. Source files explain what the app asked for, while generated artifacts
show what Stackpress produced from that request.

The main generated areas called out by the Stackpress guides are package build
output, `.build`, `client-source`, generated package targets referenced by
config, and local database state. Each area can answer a different debugging
question.

## 411.2. Where Artifacts Live

The normal regeneration flow is:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress push --b config -v
```

The first command runs the main generation pass, the second writes
client-facing output when client config points to it, and `push` applies the
generated schema state to the database. Run these before assuming a generated
file is permanently wrong.

In a scaffolded app, generated working state appears under `.build`:

```text
.build/database
.build/revisions
```

The database folder is local runtime state, while the revisions folder stores
generated schema history used by schema upgrade flows. Both are inspectable,
but they are not the source files you edit to change a model.

## 411.3. Read Generated Files

A scaffolded app also writes readable generated TypeScript to `client-source`:

```text
client-source/Article/ArticleSchema.ts
client-source/Article/ArticleStore.ts
client-source/Article/ArticleActions.ts
client-source/Article/events/search.ts
client-source/Article/admin/routes.ts
```

These files are useful because they show what Stackpress inferred from
`schema.idea`, config, and generation plugins. If the Article search event is
missing or a field type looks wrong, this folder gives you evidence before you
change source.

For example, the generated Article model entrypoint exports its schema, store,
actions, columns, events, and admin routes:

```ts
export {
  ArticleSchema,
  ArticleActions,
  ArticleStore,
  columns,
  events,
  listen,
  admin
};
```

This tells you the model output exists and which generated surfaces are
available. If one of these exports is wrong, the next step is to inspect the
source model or generator, not patch this file first.

## 411.4. Expected Evidence

Generated artifacts should answer concrete questions. If a route emits
`article-search`, the generated event listener should register that event. If a
field was added to `schema.idea`, generated types and stores should show that
field after regeneration.

Use generated files as evidence in this order:

 - inspect source such as `schema.idea`, config, or plugin code
 - regenerate the relevant output
 - inspect `.build`, `client-source`, or database state
 - fix the source and rerun generation if the output is wrong

This order keeps debugging grounded. You avoid editing output as if it were the
authoritative code, but you still use output to understand exactly what
Stackpress produced.

## 411.5. Fix The Source

When generated artifacts look stale, rerun generation before changing route or
view code:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
```

These commands refresh output from the source files. If the regenerated output
still does not contain the expected model, field, event, or route, then the
source input or generator behavior needs attention.

If local data is the problem, use database commands instead of deleting random
generated files:

```bash
stackpress purge --b config -v
stackpress push --b config -v
stackpress populate --b config -v
```

This sequence resets local data, reapplies schema, and repopulates starter
content. Use it when a clean dataset is the goal, not when you only needed to
refresh generated TypeScript.

## 411.6. Next Step

Generated artifacts are safe to inspect because they make Stackpress behavior
visible. The key habit is knowing when an artifact is evidence and when a file
is the real source of truth.

**Learning checkpoint:** Before moving on, make sure you can point to one
source file, one generated TypeScript file, one `.build` area, and the command
that refreshes each generated output.

**Next course:** Continue with `Client Source`. That page zooms into the
readable generated TypeScript folder used for inspection.
