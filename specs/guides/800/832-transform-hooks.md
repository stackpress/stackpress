# 832 Transform Hooks

Inspect the generation-time transform path that Stackpress AI uses to emit tool output. Transform hooks matter because some AI-facing behavior should be generated from schema before runtime starts, not reconstructed during a request.

**Previously:** The previous course, `AI Events`, covered runtime transport entrypoints. This course moves to the generation side, where Stackpress AI connects to the idea pipeline and writes generated tool surfaces.

## 832.1. Where The Hook Is Registered

In `packages/stackpress-ai/src/plugin.ts`, the AI plugin listens to the `idea` phase and adds its transform directory to `schema.plugin`. That tells the generation pipeline to run the AI transform.

```ts
ctx.on('idea', async ({ req }) => {
  const transformer = req.data<Transformer<CLIProps>>('transformer');
  const schema = await transformer.schema();
  if (!schema.plugin) {
    schema.plugin = {};
  }
  schema.plugin[`${dirname}/transform`] = {};
});
```

This example shows the registration point, not the generated output itself. The important idea is that Stackpress AI joins the normal idea-transform pipeline instead of reparsing schema files at runtime.

## 832.2. Where The Transform Lives

The transform implementation lives under `packages/stackpress-ai/src/transform`. The important files are the entrypoint, the tool generator, and the package export patching logic.

```text
packages/stackpress-ai/src/transform/index.ts
packages/stackpress-ai/src/transform/tools.ts
packages/stackpress-ai/src/transform/package.ts
```

These files are the confirmed source for generation-time AI tool output. If generated tools or exports are wrong, inspect these files and the generated client output before changing runtime transport events.

## 832.3. What The Transform Writes

The transform rebuilds the schema helper, walks each model, and writes model
tool files beside the generated model files. Each generated operation file
exports a `ToolConfig` and an event handler that returns that config.

```ts
const filepath = model.name.toPathName(`%s/tools/${operation}.ts`);
const source = loadProjectFile(directory, filepath);
source.replaceWithText('');
```

This example shows the generated file target. For a model such as `Article`,
operations are written under `Article/tools/`, which keeps AI tool output near
the model output it was derived from.

Each model also gets a generated tool registry:

```ts
source.addFunction({
  isExported: true,
  name: 'listen',
  parameters: [{
    name: 'emitter',
    type: [
      'Record<string, any>',
      '& { on: (event: string, listener: Function) => any }'
    ].join(' ')
  }],
  statements: OPERATIONS.map(operation => {
    return `emitter.on(
  '${model.name.toEventName(`%s-${operation}-tool`)}',
  ${operation}
);`;
  }).join('\n\n')
});
```

This example explains how generated tools reconnect to runtime later. The
generated `listen()` function registers named tool events such as
`article-detail-tool` and `article-update-tool` on whatever emitter Stackpress
passes in.

## 832.4. How Runtime Uses The Output

During `listen`, the AI plugin tries to load the generated client plugin. If the generated client exposes `tools.listen(ctx)`, Stackpress lets that generated registry attach its resolver events before the MCP registry is created.

This explains why generation and runtime both appear in the AI package. Generation emits tool support, while runtime loads that support and exposes it through MCP transports.

## 832.5. Package Exports Matter

The transform also patches the generated client package so tools can be
imported later. It adds a root `./tools` export plus per-model tool exports for
direct inspection and runtime loading.

```ts
packageJson.set('exports', './tools', './tools.js');
packageJson.set('typesVersions', '*', './tools', [ './tools.d.ts' ]);
```

This example shows why a generated file is not enough by itself. If the package
manifest does not export the tool surface, runtime code may not be able to load
what generation wrote.

The transform test gives a concrete evidence checklist:

```text
index.ts imports ./tools.js
index.ts exports tools
tools.ts calls ArticleTools.listen(emitter)
Article/tools/index.ts registers article-detail-tool
Article/tools/create.ts points at article-create
package.json exports ./tools and ./Article/tools
```

This checklist is useful because it ties generation to runtime. The generated
tool config points at a model event, the generated registry registers the tool
listener, and the package export makes the registry importable.

## 832.6. Mistakes To Avoid

Transform mistakes usually come from forgetting when the code runs. A transform
is generation-time code, so it should write files and package surfaces instead
of handling live requests.

### 832.6.1. Treat The Transform As A Request Handler

```ts
export default async function generate(props: ClientPluginProps) {
  const schema = Schema.make(props.schema);
  const directory = props.directory;
}
```

This shape belongs to generation because it receives schema and a destination
directory. It should not read a live browser request or send a runtime
response.

### 832.6.2. Fix Missing Exports Only At Runtime

```text
Check generated tool files
Check generated tools.ts registry
Check package exports
Then check runtime loading
```

This order keeps the debugging path aligned with the source. Runtime can load
only what generation emitted and exported correctly.

### 832.6.3. Overstate The Broader Hook Story

```text
Confirmed here: AI transform registration and generated tool output
Still source-limited: broad AI hook API for every workflow phase
```

The current source confirms this AI transform path, but the report still marks
the wider `830 Hooks` group as needing source owner confirmation before
becoming a complete hook API lesson. Keep the lesson scoped to transform
registration and generated tool output until broader hook behavior has its own
implementation source.

**Learning checkpoint:** Before moving on, make sure you can explain how the AI plugin registers a generation transform and how runtime later loads generated tools. You should also know why missing generated output should be debugged in the transform path before the transport path.

**Next course:** Continue with `Skills`. That course turns from package implementation to the portable workflows agents use while building Stackpress apps.
