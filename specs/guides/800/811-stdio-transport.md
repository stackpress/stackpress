# 811 stdio Transport

Learn the local stdio transport path used by Stackpress AI. Stdio is useful for local agent tools because the agent process can start Stackpress and communicate through standard input and output instead of opening a browser route first.

**Previously:** The previous course, `MCP`, explained how Stackpress builds a tool registry. This course follows the local transport that asks for that registry and connects it to an MCP stdio session.

## 811.1. What Stdio Starts

The stdio script lives in `packages/stackpress-ai/src/scripts/stdio.ts`. It calls `createMcpServer(ctx)`, throws when the registry is empty, creates `StdioServerTransport`, and connects the MCP server to that transport.

```ts
const server = await createMcpServer(ctx as ToolResolverServer);
if (!server) {
  throw new Error('Resolved MCP tool registry is empty.');
}
const transport = new StdioServerTransport();
await server.connect(transport);
```

This example shows the important startup gate. Stdio does not create useful tools by itself; it only connects a transport after the MCP registry exists.

## 811.2. How The Event Reaches It

The matching event lives in `packages/stackpress-ai/src/events/stdio.ts`. The event handler skips work if the response already has a non-`200` status, then calls the stdio script and marks the response as successful.

```ts
export default action(async function StdioScript({ ctx, res }) {
  if (res.code && res.code !== 200) return;
  await stdio(ctx);
  res.code = 200;
});
```

This example keeps the transport behind a normal Stackpress action. That means the runtime event model can start the transport, but the real connection still depends on MCP config and a non-empty tool registry.

## 811.3. What To Check Before Launching

Before launching stdio, confirm the app has active `mcp` config and that the AI plugin is registered. Without `mcp`, `packages/stackpress-ai/src/plugin.ts` returns early and never registers the MCP factory or transport events.

Also confirm the tool registry is not empty. Config-defined tools can come from `mcp.tools`, while generated plugin-mode tools depend on generated client output being available and loaded during the plugin's `listen` phase.

A scaffolded app gives this lesson a concrete command shape. Its
`package.json` registers `stackpress-ai`, defines an `emit` script, and
`config/develop.ts` includes `mcp: common.mcp`, so the stdio event can be
started through the development bootstrap. That combination matters because
the command needs both the AI package registration and the bootstrap file that
turns MCP config on:

```bash
yarn emit mcp-stdio --b config/develop -v
```

This command emits the confirmed `mcp-stdio` event through the scaffolded
app's Stackpress CLI wrapper. The `--b config/develop` part matters because that
bootstrap includes the MCP config; without that config, the AI plugin does not
register the transport events.

## 811.4. Common Failures

Stdio failures are easiest to debug when you separate tool registration from
transport startup. A broken registry and a broken stdio process can both stop
the connection, but they point to different source surfaces.

### 811.4.1. Empty Registry

```text
Resolved MCP tool registry is empty.
```

This message means the stdio transport reached the MCP factory, but no
configured or generated tools were available to expose. Fix the registry source
before changing the transport code.

### 811.4.2. Missing Transport Event

```bash
yarn emit mcp-stdio --b config/develop -v
```

If the app never registers `mcp-stdio`, the transport event cannot start. That
usually points back to missing `mcp` config or missing Stackpress AI plugin
registration.

### 811.4.3. Noisy Stdio Output

```ts
console.log('debugging stdio startup');
```

The agent talks over standard input and output, so extra logs in the transport
process can interfere with protocol messages. Debugging output should be
intentional and kept out of the stdio stream when possible.

## 811.5. Mistakes To Avoid

The mistakes here repeat the same boundary in a different way: stdio is the
pipe, while MCP tools are the useful work behind the pipe. Check the tool
registry before treating every failure as transport behavior.

### 811.5.1. Debug Stdio Before The Registry

```ts
const server = await createMcpServer(ctx as ToolResolverServer);
if (!server) {
  throw new Error('Resolved MCP tool registry is empty.');
}
```

This example shows a registry failure, not a stdio protocol failure. The next
check should be MCP config, generated tools, and plugin registration before
changing the transport.

### 811.5.2. Reuse The Scaffold Command Blindly

```text
yarn emit mcp-stdio --b config/develop -v
```

This command is confirmed for the scaffolded app shape. For another
project, use the project's actual Stackpress script and bootstrap module when
launching the event.

### 811.5.3. Assume Generated Tools Are Always Present

```ts
const generated = await client(true);
```

The AI plugin tries to load the generated client plugin during `listen`, but it
tolerates missing client output. A project can start while plugin-mode tools
remain unavailable, so check generated output before blaming stdio.

**Learning checkpoint:** Before moving on, make sure you can explain the difference between MCP tool registration and stdio transport connection. You should also know why an empty registry is a tool/config problem, not a transport success case.

**Next course:** Continue with `Artifacts`. That course explains how to review AI-produced output after the tool connection can run.
