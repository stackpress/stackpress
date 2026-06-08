# 340 Idea Plugin Authoring

Learn when a requirement belongs in a custom idea generator instead of ordinary
schema, route, or view code. Generator authoring is where a Stackpress plugin
joins `stackpress generate`, reads the idea schema, and emits files into the
generated client package.

**Previously:** The previous course, `Client Output`, showed the generated
client package surface and export map. This page focuses on the confirmed
generator skill references and treats generator authoring as an advanced
extension topic.

## 340.1. Why Generator Authoring Is Advanced

Generator work changes how source input becomes files. That is more powerful
than adding one route because it can affect repeated output across the project
every time generation runs.

The course waits until now because the reader needs to understand idea input
and generated output first. Without that foundation, a custom generator can
look like magic instead of a controlled transformation.

## 340.2. When To Consider A Generator

Consider a generator when a repeated output pattern should come from the idea
source. If the requirement is one handwritten page, route, or integration, a
local runtime plugin may be the clearer home.

The decision is about repeatability and ownership. A generator is useful when
the same source pattern should produce consistent files every time
`stackpress generate` runs.

```text
Requirement: every model needs a generated tool registry
Likely home: idea generator

Requirement: one page needs a custom message
Likely home: route or view plugin
```

This example shows the first decision a generator author makes. Model-driven
and repeated output belongs in the generation lane, while one-off behavior
should stay in normal runtime source.

## 340.3. Plugin Registration

Before `transform/index.ts` can run, the plugin entrypoint has to register the
transform folder during the `idea` lifecycle. This is the bridge between a
normal Stackpress plugin and the idea transformation pipeline.

```ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CLIProps } from 'stackpress/lib';
import type { Transformer } from 'stackpress/lib';
import type { Server } from 'stackpress/server';

export default function plugin(ctx: Server) {
  ctx.on('idea', async ({ req }) => {
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    const schema = await transformer.schema();
    if (!schema.plugin) {
      schema.plugin = {};
    }
    const dirname = typeof __dirname === 'undefined'
      //@ts-ignore - The import.meta only allowed in ESM
      ? path.dirname(fileURLToPath(import.meta.url))
      : __dirname;
    schema.plugin[`${dirname}/transform`] = {};
  });
}
```

This example waits for the `idea` event, reads the transformer from
`req.data`, loads the schema, and makes sure `schema.plugin` exists. The final
assignment tells Stackpress that this plugin has a transform folder that should
join the generation run.

The important line is the schema plugin entry:

```ts
schema.plugin[`${dirname}/transform`] = {};
```

Without that line, `transform/index.ts` can exist on disk and still never run.
Stackpress includes custom generators by reading the schema plugin map, so
registration is the first thing to inspect when a generator produces nothing.

## 340.4. The Transform Boundary

The generator skill keeps generation and runtime separate. Generation belongs
in the `idea` hook and the `transform/` folder, while runtime behavior belongs
in `config`, `listen`, or `route`.

```txt
plugin.ts
transform/
  index.ts
```

This example is the small shape to remember. `plugin.ts` registers the
generator with the idea lifecycle, and `transform/index.ts` does the file
generation work that runs during `stackpress generate`.

The transform entrypoint starts by rebuilding the schema helper and reading the
generated client directory from the props Stackpress passes in:

```ts
import type { ClientPluginProps } from 'stackpress/schema/types';
import { Schema } from 'stackpress/schema';

export default async function generate(props: ClientPluginProps) {
  const schema = Schema.make(props.schema);
  const directory = props.directory;
}
```

`Schema.make(props.schema)` turns the raw generation payload back into a
helper that can inspect models and metadata. `props.directory` is the generated
client package directory, so generated files should be created or patched from
there instead of writing to an unrelated folder.

## 340.5. What The Transform Usually Does

`transform/index.ts` should coordinate generation work instead of becoming a
large pile of unrelated code. A useful transform normally reads schema models,
calls helper generators, and patches the generated package surface when new
entrypoints need to be importable.

```txt
transform/
  index.ts
  feature.ts
  package.ts
```

This example shows a practical split. `index.ts` coordinates the transform,
`feature.ts` can create per-model files or root registries, and `package.ts`
can patch generated exports so runtime code can import the new surface.

The core model loop usually starts from the rebuilt schema helper:

```ts
for (const model of schema.models.values()) {
  // generate per-model files
}
```

This example is intentionally small because the important idea is the source of
truth. The generator should inspect the schema helper, derive repeatable output
from models or metadata, and write that output into the generated client
directory Stackpress already resolved.

## 340.6. How TypeScript Output Is Patched

When generated output is TypeScript, use `ts-morph` as the normal editing tool.
The common pattern is to load or create a source file, inspect whether imports
or exports already exist, add missing declarations, and only patch text
directly when the structured API is not enough.

```ts
const hasImport = source.getImportDeclaration(
  declaration => declaration.getModuleSpecifierValue() === './tools.js'
);

if (!hasImport) {
  source.addImportDeclaration({
    defaultImport: 'tools',
    moduleSpecifier: './tools.js'
  });
}
```

This example patches a file idempotently. The generator checks what already
exists before adding a new import, which matters because generation can run
many times during development.

Generated package files need the same discipline. If runtime code should load
the generated artifact later, the transform must expose it through the
generated client package instead of leaving it as a private file.

## 340.7. Runtime Reconnection

Generation and runtime meet through the generated client package. If generation
created the artifact, runtime should load that generated artifact instead of
rebuilding the same structure from schema again.

```ts
ctx.on('listen', action(async ({ ctx }) => {
  const client = ctx.plugin('client');
  const generated = await client(true);
  if (!generated) return;

  // register generated listeners or consume generated registries
}));
```

This example keeps runtime thin. `client(true)` lets the app tolerate missing
generated output, and the runtime plugin only consumes the generated surface
after the client plugin can load it.

## 340.8. What This Group Covers

`341 ts-morph Plugins` introduces the TypeScript editing tool used by common
generator patterns. `342 Custom Generators` then shows the broader structure
for registering a transform, using schema input, writing output, patching
exports, and reconnecting runtime behavior.

Read these pages as extension lessons, not first-day authoring material. They
assume you already know what the idea source says and what generated output
should look like.

## 340.9. How To Verify Generator Work

A generator is not done when the code compiles. It is done when generation
produces the expected files, the output is syntactically valid, and the
source-to-output rule is still clear.

```bash
npx stackpress generate --b [config/file] -v
```

This command runs the normal Stackpress idea pipeline. The config behind `--b`
must include client generation settings and a valid output location, otherwise
the transform may run without writing the client artifacts you expected.

Inspect the generated file, root `index.ts`, package exports, and runtime
loading path together. If future regeneration would erase or hide the result
unexpectedly, the generator boundary still needs work.

**Learning checkpoint:** Before moving on, make sure you can explain the
difference between writing one handwritten feature and writing a generator that
creates repeatable output. You should also know why
``schema.plugin[`${dirname}/transform`] = {}`` is required before
`transform/index.ts` can participate in generation.

**Next course:** Continue with `ts-morph Plugins`. That course explains how generator code can create and patch TypeScript output safely.
