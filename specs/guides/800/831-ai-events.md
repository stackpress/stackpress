# 831 AI Events

Inspect the runtime events that Stackpress AI uses to start MCP transports. These events are not a generic AI automation API; they are confirmed entrypoints that connect configured MCP tools through stdio, HTTP, or SSE.

**Previously:** The previous course, `Hooks`, separated confirmed hook behavior from source-limited planning areas. This course focuses on the runtime side that is visible in `packages/stackpress-ai/src/events`.

## 831.1. What The Events Are For

The AI plugin registers transport events during the app's `listen` phase. In `packages/stackpress-ai/src/plugin.ts`, the plugin registers `mcp-stdio`, `mcp-http`, and `mcp-sse` only after the app has `mcp` config.

```ts
ctx.on('mcp-stdio', stdio);
ctx.on('mcp-http', http);
ctx.on('mcp-sse', sse);
```

This example shows that the events are named transport entrypoints. They do not describe every possible AI workflow; they give Stackpress a runtime way to start MCP communication modes.

## 831.2. Where To Inspect

Start with the event folder, then move back to the plugin file that registers those events. Reading the files in that order helps you see both the handler behavior and the lifecycle moment where the handlers become available.

```text
packages/stackpress-ai/src/events/stdio.ts
packages/stackpress-ai/src/events/http.ts
packages/stackpress-ai/src/events/sse.ts
packages/stackpress-ai/src/plugin.ts
```

The event files show the transport-specific action handlers. The plugin file shows the guard that skips registration when `mcp` config is missing, which is often the first thing to check when an event cannot be reached.

## 831.3. The Event Wrapper Shape

Each event file is a small bridge from the Stackpress event system to a transport script. The handler first respects an existing non-200 response code, then starts its transport and marks the response code as `200`.

```ts
export default action(async function HttpScript({ ctx, res }) {
  if (res.code && res.code !== 200) {
    return;
  }

  await http(ctx);
  res.code = 200;
});
```

This example comes from the HTTP event shape, and the stdio and SSE files use
the same pattern with their own transport scripts. The guard matters because
Stackpress events can have more than one listener, so a transport event should
not keep going after another listener has already marked the response as
failed.

## 831.4. What Each Transport Starts

`mcp-stdio` starts a stdio transport by creating an MCP server from the current
Stackpress config. If no tools are resolved, the stdio script throws early with
an empty-registry error instead of opening a useless transport.

```ts
const server = await createMcpServer(ctx as ToolResolverServer);
if (!server) {
  throw new Error('Resolved MCP tool registry is empty.');
}

const transport = new StdioServerTransport();
await server.connect(transport);
```

This example explains why stdio startup depends on the tool registry. The
transport is only useful when there is at least one config-defined or generated
tool to expose through MCP.

HTTP and SSE are different because they can attach request handlers to the main
Stackpress request pipeline. The source checks native Node request and response
resources, filters for the configured endpoint, and then lets the transport
handle the matching MCP request.

```ts
ctx.on('request', async ({ req, res }) => {
  if (!(req.resource instanceof IncomingMessage)
    || !(res.resource instanceof ServerResponse)
  ) {
    return;
  }
});
```

This example shows the attachment boundary. HTTP and SSE transport handling is
not every request in the app; it only proceeds when the request uses the native
Node resource shape and matches the configured MCP endpoint rules.

## 831.5. Runtime And Generation Stay Separate

Runtime events start or attach transports. Generation transforms create client-side tool output that runtime can later load through the generated client plugin.

That separation matters because a missing generated tool should not be fixed by adding more transport event code. The runtime event can only expose tools that config or generated output made available to the MCP registry.

## 831.6. Mistakes To Avoid

AI event mistakes usually come from treating transport startup as the same
thing as tool readiness. The transport event can only expose the registry that
config and generated output made available.

### 831.6.1. Emit Transport Events Without MCP Config

```ts
if (!ctx.config.get('mcp')) return;
```

This guard explains why a missing `mcp-stdio` event may be a config issue, not
an event-file issue. The plugin does not register transport events when MCP
config is absent.

### 831.6.2. Put Model Tool Generation In An Event Handler

```text
Runtime event: start or attach a transport
Transform hook: generate model-derived tool files
```

This example gives the timing boundary. If the work depends on model metadata
and generated output, it belongs on the transform side before the transport
starts.

### 831.6.3. Treat A Started Transport As Complete Tools

```text
mcp-http started
```

This only proves the transport event reached its startup path. Each tool still
depends on registry configuration, generated tool listeners, event resolution,
and input validation.

### 831.6.4. Replace App Routes With MCP Transports

```text
MCP endpoint: handled by attached transport listener
App page route: handled by normal Stackpress route/page code
```

This example keeps the request paths separate. It also helps when debugging a
404 or unexpected response because the first question is whether the request
was meant for MCP transport or for the app itself.

**Learning checkpoint:** Before moving on, make sure you can explain what `mcp-stdio`, `mcp-http`, and `mcp-sse` do. You should also be able to explain why runtime transport events are different from generation transforms.

**Next course:** Continue with `Transform Hooks`. That course covers the source-backed generation side of Stackpress AI tools.
