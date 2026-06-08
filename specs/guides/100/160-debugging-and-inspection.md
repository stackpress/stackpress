# 160 Debugging And Inspection

Debugging gets easier when you stop treating the app as one large mystery.
Stackpress has source files, generated output, runtime behavior, and local data;
the first debugging skill is knowing which layer to inspect.

**Previously:** `Notifier` closed the first view-support group. Here, the focus
shifts to the inspection habits that keep the runtime loop understandable.

## 160.1. What You Are Looking For

When an app breaks, trying every fix at once usually creates more confusion.
Ask which layer is failing: source of truth, generation, runtime behavior, or
data.

The local debugging guide uses a small command set to answer those questions.
These commands do not replace careful reading, but they tell you where to look
next.

## 160.2. Where To Look

Use these commands as the first inspection set. They are not fixes by
themselves, but each one gives you evidence from a different part of the app.

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress emit article-search --b config -v
stackpress query --b config -v
stackpress purge --b config -v
```

Each command asks a different question. `generate` checks source-to-output
generation, `generate:client` checks client-facing output, `emit` checks an
event or terminal entrypoint, `query` inspects database state, and `purge`
resets local data when you need a clean dataset.

## 160.3. Separate The Problem By Layer

Use the layer map before changing files. It keeps you from editing a route when
the real issue is stale generated output, or editing schema when the real issue
is local data.

 - source-of-truth problem: inspect `schema.idea`, config, or local plugins
 - generation problem: inspect `.build` or `client-source`
 - runtime problem: inspect route, event, or plugin behavior
 - data problem: inspect local database contents

This is a decision tool, not a checklist to run blindly. Pick the layer that
matches the symptom, then gather evidence from that layer.

## 160.4. Inspect Logs And Output

A useful debugging trace starts with one visible symptom and follows the app
one layer at a time. Imagine the home page loads, but the article list is
empty even though you expected published articles to appear.

First, inspect the route that prepares the page:

```ts
export default action(async function HomePage({ req, res, ctx }) {
  req.data.set('status', 'PUBLISHED');
  if (!req.data.has('sort')) {
    req.data.set('sort', 'published', 'desc');
  }
  await ctx.emit('article-search', req, res);
  setViewProps(req, res, ctx);
});
```

This route sets the search filters before it asks Stackpress to run
`article-search`. That means the route is not loading articles directly; it is
passing a request, response, and context into an event that owns the search
work.

Next, inspect the generated event listener:

```ts
export default function listen(
  emitter: Record<string, any> & {
    on: (event: string, listener: Function) => any;
  }
) {
  emitter.on('article-search', search);
}
```

This listener connects the event name to the generated `search` handler. If the
route emits `article-search`, this generated file is the evidence that the name
has a matching listener.

Then inspect the generated event handler:

```ts
async function ArticleSearchEvent({ req, res, ctx }: RouteProps) {
  if (res.body || (res.code && res.code !== 200)) return;

  const engine = ctx.plugin<DatabasePlugin>('database');
  if (!engine) return;

  const seed = ctx.config.path('database.seed', '');
  const actions = new ArticleActions(engine, seed);
  const results = await actions.findAll(req.data());
  const total = await actions.count(req.data());
  res.rows(results, total);
}
```

This handler shows the next dependency in the chain. The search event needs the
database plugin, builds `ArticleActions`, runs a query from `req.data()`, and
stores the result rows on the response.

Now run the event from the terminal:

```bash
stackpress emit article-search --b config -v
```

This command removes the browser page from the question. If the event fails
here, the problem is in the event path, generated action, plugin setup, or
data layer before it is a view problem.

## 160.5. Expected Evidence

Good debugging evidence should tell you which layer is still alive and which
layer stopped the flow. The goal is not to prove your first guess correct; the
goal is to narrow the next file you should inspect.

If `article-search` emits successfully, inspect the database next:

```bash
stackpress query "SELECT * FROM article" --b config -v
```

This checks whether the configured database has article rows at all. If the
query returns no relevant rows, the empty page may be a data problem rather
than a route or view problem.

If a generated event file is missing or stale, regenerate before editing
generated output by hand:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
```

These commands refresh generated server and client-facing output from the app
source. If the regenerated files still do not contain the expected listener or
handler, return to the source-of-truth files that generation reads.

## 160.6. Fix The Source

If a schema change did not show up, regenerate server and client output before
assuming the source change failed. This checks whether the source was ignored
or whether the generated files simply need to be refreshed.

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress push --b config -v
```

The first two commands refresh generated output. `push` applies schema changes
to the local database, so use it when the generated schema and database need to
line up.

If an event behaves strangely, emit it directly:

```bash
stackpress emit <event-name> --b config -v
```

This narrows the problem to the event path. If the event fails here, you can
debug the event without also debugging a browser route.

If you need to inspect raw data, use:

```bash
stackpress query --b config -v
```

This tells you what the database actually contains. Use it when the route and
view look correct but the rendered records are missing or unexpected.

If the local dataset is in a bad state, reset and rebuild it:

```bash
stackpress purge --b config -v
stackpress push --b config -v
stackpress populate --b config -v
```

This sequence clears local data, applies schema, and repopulates records. Use
it only when resetting local state is acceptable.

## 160.7. Mistakes To Avoid

Debugging mistakes usually come from changing code before identifying the
failing layer. The examples below show common cases where the first instinct
can point you at the wrong file.

### 160.7.1. Edit Generated Output First

```text
client-source/Article/ArticleStore.ts
```

Generated output is evidence, not usually the source of truth. Inspect it to
understand what generation produced, then change the source file that generated
it.

### 160.7.2. Debug A Route When The Event Fails Alone

```bash
stackpress emit article-search --b config -v
```

If the event fails when emitted directly, the browser route is not the first
place to fix. Debug the event payload, event handler, and source data first.

### 160.7.3. Reset Local Data Without Knowing The Cost

```bash
stackpress purge --b config -v
```

`purge` is useful for local development, but it is still a reset operation.
Use it when a clean dataset is the goal, not when you only needed to inspect
the current records.

## 160.8. Next Step

The first runtime level ends with an inspection map because later courses add
more layers. Data, generation, built-ins, and AI workflows are easier to learn
when you already know how to ask which layer is failing.

**Learning checkpoint:** Before moving on, make sure you can choose an
inspection command based on the symptom. You do not need every command
memorized, but you should know whether you are checking source, generation,
runtime behavior, or local data.

**Next course:** Continue with `Data`. That course adds database behavior to
the runtime loop.
