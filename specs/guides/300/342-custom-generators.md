# 342 Custom Generators

Build a small generator that reads schema input and writes output through the normal idea transform pipeline. The goal is not to create a full plugin in one page; it is to understand the moving parts that make generator output predictable.

**Previously:** The previous course, `ts-morph Plugins`, showed how a transform can create and patch TypeScript safely. This page connects that editing technique to the larger Stackpress generator workflow.

## 342.1. When To Write A Generator

A custom generator is worth writing when runtime code would repeat the same model-driven structure over and over. The generator moves that repetition into a predictable source-to-output pipeline.

If the feature is one handwritten page, one route, or one integration, keep it in runtime code. Generation fits best when the output is repeated, schema-driven, and stable enough to recreate every time `stackpress generate` runs.

## 342.2. The Generator Boundary

The generator skill separates registration from transformation. The plugin's `idea` hook registers the transform path, while `transform/index.ts` does the generation work.

```txt
plugin.ts
transform/
  index.ts
```

This example is the minimum shape to remember. `plugin.ts` connects the plugin to generation, and `transform/index.ts` becomes the entrypoint Stackpress calls during the idea pipeline.

## 342.3. The Transform Entry

Inside `transform/index.ts`, the standard pattern is to rebuild the schema helper and read the generated client directory from the transform props. Those two values give the generator both the model information and the output location.

```ts
import type { ClientPluginProps } from 'stackpress-schema/types';
import Schema from 'stackpress-schema/Schema';

export default async function generate(props: ClientPluginProps) {
  const schema = Schema.make(props.schema);
  const directory = props.directory;
}
```

This example is small, but it is the core transform boundary. `Schema.make(props.schema)` turns the raw payload into a helper that can iterate models, and `props.directory` points at the generated client package directory for the current run.

## 342.4. Generate One File First

The first version of a generator should create one clear output before it grows into registries, per-model folders, or package patching. That keeps the mental model simple while you prove the transform is connected.

```ts
import { loadProjectFile } from 'stackpress-schema/transform/helpers';

// inside generate(...) after schema and directory exist
for (const model of schema.models.values()) {
  const filepath = model.name.toPathName('%s/tools/index.ts');
  const source = loadProjectFile(directory, filepath);
  source.replaceWithText('');
}
```

This example loops over models and opens a generated file path for each model. The body is intentionally small; the lesson is that schema metadata drives output paths inside the generated client directory.

## 342.5. Export Generated Artifacts

Generated files should behave like a real package surface. If runtime or debugging code needs to import a generated entrypoint, the generator must patch the generated package exports intentionally.

```ts
import {
  loadPackageJsonNest,
  savePackageJsonNest
} from 'stackpress-schema/transform/helpers';

const packageJson = loadPackageJsonNest(directory.getPath());
packageJson.set('exports', './tools', './tools.js');
packageJson.set('typesVersions', '*', './tools', [ './tools.d.ts' ]);
savePackageJsonNest(directory.getPath(), packageJson);
```

This example exposes a generated `tools.ts` file as `./tools`. Without this step, generation could create the file correctly while runtime code still cannot import it through the generated client package.

## 342.6. Reconnect Runtime Later

Runtime should consume generated artifacts instead of rebuilding schema-driven output live. The runtime reconnection reference describes the normal pattern as loading the generated client plugin, tolerating missing generated output during early setup, and calling generated registries or listeners when they exist.

```ts
import { action } from 'stackpress-server';

// inside a runtime plugin after ctx exists
ctx.on('listen', action(async ({ ctx }) => {
  const client = ctx.plugin('client');
  const generated = await client(true);
  if (!generated) return;

  generated.tools?.listen(ctx);
}));
```

This example keeps runtime thin. Generation creates `tools`, package exports make `tools` importable, and runtime only loads the generated surface and calls its listener hook.

## 342.7. Mistakes To Avoid

Custom generator mistakes usually come from mixing phases. Generation should
write predictable artifacts, package exports should make those artifacts
importable, and runtime should consume the generated surface later.

### 342.7.1. Generate During Runtime

```ts
ctx.on('listen', async () => {
  const schema = await transformer.schema();
  // write files here
});
```

This puts generation work into a runtime phase. A route, transport, or listener
should not rebuild schema-driven output while the app is serving requests;
that work belongs in the idea transform pipeline.

### 342.7.2. Generate Files Without Package Exports

```text
client-source/tools.ts
```

Creating the file is not enough if runtime code imports through the generated
client package. Patch and inspect the generated `package.json` so the new
entrypoint is exposed through `exports` and type output.

### 342.7.3. Treat Generation Success As Runtime Success

```ts
const generated = await client(true);
generated.tools.listen(ctx);
```

This runtime call still depends on the right client package, exported
entrypoint, and generated listener shape. If runtime behavior is missing after
generation succeeds, inspect which client package was written, which package
runtime imports, and whether the listener is actually called.

## 342.8. Verify The Pipeline

Run the normal generation command for the project and config you are testing. The generator skill uses the following command shape, and the `--b` value should point at the bootstrap or config module that has valid client generation settings.

```bash
npx stackpress generate --b [config/file] -v
```

This command runs the idea pipeline through a specific bootstrap or config module. After it finishes, inspect the generated file, generated `index.ts`, generated `package.json`, and any runtime import path that should consume the output.

**Learning checkpoint:** Before moving on, make sure you can explain the generator pipeline: idea hook, `transform/index.ts`, `Schema.make(props.schema)`, `props.directory`, generated files, package exports, and runtime reconnection. You should also know why each step needs verification.

**Next course:** Continue with `Build And Deploy`. That course moves from idea
generation into schema changes, generated output inspection, production builds,
and deployment targets.
