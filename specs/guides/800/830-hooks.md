# 830 Hooks

Learn how to think about AI-related extension points without pretending every planned hook is already documented. Hooks are powerful because they run at a specific moment in the workflow, so the first job is to know which moments are confirmed by source and which still need owner clarification.

**Previously:** The previous course, `Artifacts`, focused on reviewing AI-produced output. This course shifts to the places where AI-related behavior can attach to Stackpress runtime or generation work.

## 830.1. Why Hook Timing Matters

A hook is useful only when the developer knows when it runs. Runtime events happen while the app or tool process is active, while transform hooks happen during generation and affect emitted output.

Mixing those timing models makes debugging confusing. If generated tools are missing, looking at a runtime event handler first may waste time, because the missing piece may belong in the generation transform.

## 830.2. What Is Confirmed

The Stackpress AI package confirms runtime transport events and generation transform behavior. The runtime side registers events such as `mcp-stdio`, `mcp-http`, and `mcp-sse`, while the generation side injects the AI transform into the idea plugin map.

The confirmed lifecycle is small enough to name directly:

```ts
ctx.on('listen', async ({ ctx }) => {
  const client = ctx.plugin<ClientPlugin>('client');
  if (typeof client === 'function') {
    const generated = await client(true) || {};
    generated.tools?.listen(ctx);
  }

  ctx.register('mcp', async () => createMcpServer(ctx as ToolResolverServer));
  ctx.on('mcp-stdio', stdio);
  ctx.on('mcp-http', http);
  ctx.on('mcp-sse', sse);
});
```

This example shows the runtime moment. When the app reaches `listen`, the AI
plugin reconnects generated tool listeners, registers the MCP factory, and
adds the transport events that later start stdio, HTTP, or SSE transport work.

The generation moment is separate:

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

This example adds the AI transform to the schema plugin map during the idea
pipeline. The transform then generates model-derived tool files and exports,
which is why tool creation belongs to generation instead of a runtime transport
event.

That does not prove a broader AI hook API exists. The current source confirms
these two moments and the child pages should teach only the source-backed
behavior unless a new owner-confirmed hook source appears.

## 830.3. How To Verify Hook Behavior

Hook verification needs trigger evidence and output evidence. Trigger evidence proves the hook ran, while output evidence proves what changed because it ran.

For runtime events, evidence might be a registered event and a successful transport startup. For transform hooks, evidence might be a generation command and inspected generated files or package exports.

The package tests give a useful verification model. One test calls the
registered `listen` handler and expects generated tool events plus the MCP
transport events to be registered.

```text
article-detail-tool
mcp-stdio
mcp-http
mcp-sse
request
```

This expected event list proves the runtime hook did more than start a
transport. It also reconnected generated tool listeners before the transport
events became available.

Another test calls the registered `idea` handler and checks that the transform
path was added to `schema.plugin`. That is the generation-side evidence: the
hook changed schema plugin configuration so the normal transform pipeline can
emit files.

## 830.4. Mistakes To Avoid

Hook documentation can become misleading quickly if it describes desired
extension points as shipped behavior. Keep confirmed runtime events,
generation transforms, and future hook ideas in separate categories.

### 830.4.1. Present Planned Hooks As Implemented

```text
Confirmed: mcp-stdio, mcp-http, mcp-sse runtime events
Unconfirmed: broad AI hook API for every workflow phase
```

This example separates evidence from expectation. A confirmed transport event
does not prove that every AI workflow has a named runtime hook.

### 830.4.2. Put Generation Work In Runtime Events

```text
Wrong lane: create model-derived tools during mcp-http
Better lane: emit model-derived tools in the AI transform path
```

This example shows a timing mistake. Runtime events should connect transports,
while generation transforms should create schema-derived output before runtime
starts.

### 830.4.3. Treat One Hook Moment As The Whole Lifecycle

```text
listen hook: runtime registration
idea hook: generation transform registration
```

These hook moments do different jobs. The `listen` moment wires runtime events
and transports, while the `idea` moment adds transform configuration for
generation.

**Learning checkpoint:** Before moving on, make sure you can explain the difference between runtime event timing and generation transform timing. You should also know why this hook group stays careful where source is incomplete.

**Next course:** Continue with `AI Events`. That course covers the confirmed runtime transport events in the Stackpress AI package.
