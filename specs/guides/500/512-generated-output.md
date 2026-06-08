# 512 Generated Output

Generated output is how Stackpress shows its work. After the app reads schema,
config, plugins, and generation rules, it writes files you can inspect to prove
what it understood. Those files are valuable, but they are still the result of
the source files you maintain.

Think of generated output as a workshop tool made from a blueprint. If the tool
comes out with the wrong shape, you study it to understand the mistake, then
you update the blueprint and make the tool again. Editing the tool by hand may
work for a moment, but the next generation pass can replace that hand edit.

**Previously:** `Source Of Truth` taught where product changes belong. This
lesson teaches how to inspect the output side of that same decision without
turning generated files into hidden source files.

## 512.1. What You Are Looking For

When you inspect generated output, you are looking for evidence. A field should
show up in generated types, stores, actions, admin components, or package
exports depending on what the source file asked Stackpress to create.

The main question is not "Which generated file should I edit?" The better
question is "What did generation produce, and which source input explains that
result?" That question keeps debugging connected to the files that survive the
next generation run. It also stops generated output from becoming a hidden
second place where product behavior is maintained.

## 512.2. Where Output Lives

The exact output paths depend on config, but a scaffolded app gives a concrete
starting map. `config/common.ts` points normal generated client package output
at a package-style folder under `node_modules`, while `config/client.ts`
overrides that target for inspection and writes readable TypeScript into
`client-source`.

| Output area | What to inspect | Why it exists |
| --- | --- | --- |
| `.build/revisions` | serialized idea revisions | Tracks schema history used with push and migrate behavior |
| `.build/migrations` | migration files when produced | Records database change output from schema changes |
| `.build/database` | local PGlite database state | Stores local database files for a scaffolded app workflow |
| `client-source` | generated TypeScript, stores, actions, admin files, exports | Makes generated client output readable during development |
| `node_modules/<app-client>` | generated package target from common config | Provides the package-like runtime target used by the app config |

This map shows why output paths are helpful but still source-dependent. If the
wrong files are generated, the fix usually belongs in `schema.idea`,
`config/client.ts`, a plugin, or the generation source that produced the files.

## 512.3. Inspect Step By Step

Start with one source change and trace one generated effect. A scaffolded app
is useful because the `Article` model has fields that appear clearly in
`client-source/Article/types.ts`.

First, look at the `Article` source field:

```idea
references  Hash?
            @label("References")
            @default({})
            @field.metadata({ add "Add Reference" })
            @view.metadata({ className "frui-pt-md frui-pr-md frui-pb-md frui-pl-md"})
```

This example says an article can store optional key/value metadata. The
`@field.metadata` and `@view.metadata` attributes also tell generated admin UI
surfaces how this field should be edited and displayed.

Now inspect the generated type:

```ts
export type Article = {
  references: Record<string, ScalarInput> | null;
};
```

This generated example shows the TypeScript effect of the `Hash?` field. The
field became a nullable record, which gives you evidence that Stackpress
understood the field as structured metadata rather than plain text.

Run the generation commands when the output needs to be refreshed:

```bash
yarn generate
yarn generate:client
```

In a scaffolded app, these scripts run `stackpress generate --b config/develop
-v` and `stackpress generate --b config/client -v`. The first command refreshes
the main development generation pass, and the second command refreshes the
readable `client-source` output used for inspection.

## 512.4. Expected Evidence

Expected evidence depends on the source change. A schema field usually appears
in generated model types, schema classes, stores, actions, admin components,
and sometimes package exports. A config change usually appears through output
paths, runtime behavior, or changed build artifacts.

For an `Article` field, check these files first:

```text
client-source/Article/types.ts
client-source/Article/ArticleSchema.ts
client-source/Article/ArticleStore.ts
client-source/Article/ArticleActions.ts
client-source/Article/index.ts
```

These paths show different slices of the same generated model. The type file
shows the TypeScript shape, the schema file shows validation and column shape,
the store and actions show database-facing helpers, and the index file shows
what the model package exports.

For generated working state, check `.build`:

```text
.build/revisions
.build/migrations
.build/database
```

These folders are evidence of local generation and database workflow. The
revision and migration paths are configured in `config/common.ts`, while the
database folder is the local PGlite state used by a scaffolded app.

## 512.5. Fix The Source

When output is wrong, work backward from the generated file to the source that
could have produced it. Do not treat this as a search for the nearest editable
file. Treat it as a source trace.

### 512.5.1. Trace A Missing Field

If `client-source/Article/types.ts` does not show a field you expected, inspect
`schema.idea` first. The generated type only reports what generation received
from the schema and generator pipeline.

```idea
published   Datetime?
            @label("Published Date")
            @field.datetime
            @list.date("m d, Y h:iA")
            @view.date("m d, Y h:iA")
```

This example should lead to a nullable generated date field for articles. If
the generated output does not show it, fix the source field or rerun generation
before changing generated TypeScript by hand.

### 512.5.2. Trace A Wrong Output Folder

If generated client output appears in the wrong folder, inspect client config
before moving files around. In a scaffolded app, `config/client.ts` overrides
the common client package target.

```ts
build: path.join(common.cwd, 'client-source')
```

This example chooses the readable local folder for the client generation pass.
If output lands somewhere unexpected, the durable fix is to correct the client
config or command bootstrap, then run generation again.

### 512.5.3. Clean Bad Local State

Generated folders are disposable only when the current source can rebuild them.
That means cleanup is safest after you know the schema, config, plugin files,
and commands are correct.

```bash
yarn purge
yarn push
yarn populate
```

In a scaffolded app, these scripts reset local state, apply schema/database
changes, and insert starter content through the configured development
bootstrap. Use this kind of reset for local data problems, not as the first
answer to a generated TypeScript mismatch.

## 512.6. Next Step

The important habit is to inspect generated output as evidence, then fix the
source that produced it. That keeps generated folders useful without letting
them become a second place where product behavior secretly lives.

Read `521 Config Splitting` next. That lesson explains why a scaffolded app
uses different config files for development, build, and client inspection
instead of forcing every command through one large config file.

**Learning checkpoint:** You should be able to trace a missing `Article` field
from `client-source/Article/types.ts` back to `schema.idea`. You should also be
able to explain why `config/client.ts` controls the readable `client-source`
folder used during client generation.
