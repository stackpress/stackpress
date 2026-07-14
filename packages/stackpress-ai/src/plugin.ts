//node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
//modules
import type { CLIProps } from '@stackpress/idea-transformer/types';
import type Transformer from '@stackpress/idea-transformer/Transformer';
import type Server from '@stackpress/ingest/Server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AnySchema } from '@modelcontextprotocol/sdk/server/zod-compat.js';
import { fromJSONSchema } from 'zod';
//client
import type {
  AuthContext,
  ClientPlugin,
  NormalizedToolConfig,
  ToolConfig,
  ToolResolverServer
} from './types.js';
import {
  buildTools,
  listToolsForAuth,
  toMcpText,
  toolAllowed,
  validateInput,
  withToolData
} from './helpers.js';
import { http, sse, stdio } from './events/index.js';
import { attachHttpToServer, shouldAttachHttpToServer } from './scripts/http.js';
import { attachSseToServer, shouldAttachSseToServer } from './scripts/sse.js';

/**
 * Create one MCP server instance from the current Stackpress config.
 */
export async function createMcpServer(
  ctx: ToolResolverServer,
  auth?: AuthContext
) {
  //start by normalizing every configured tool into the runtime registry
  const registry = await buildTools(
    ctx,
    ctx.config.path<ToolConfig[]>('mcp.tools', [])
  );

  //when a live transport resolved caller auth, only expose the visible slice
  // of the registry to that one connected caller.
  const visible = auth ? listToolsForAuth(registry, auth) : registry;

  //if the registry is empty, then there is nothing useful to expose
  if (!visible.length) {
    return null;
  }

  //now create the MCP server shell that transports will attach to later
  const server = new McpServer({
    name: ctx.config.path('mcp.name', 'Stackpress AI Server'),
    version: ctx.config.path('mcp.version', '0.10.7'),
    title: ctx.config.path('mcp.title', 'Stackpress AI Server'),
    description: ctx.config.path<string | undefined>('mcp.description')
  });

  registerCallTools(server, ctx, visible, auth);
  return server;
}

/**
 * Register the callable tool handlers on one MCP server instance.
 */
export function registerCallTools(
  server: McpServer,
  ctx: ToolResolverServer,
  tools: NormalizedToolConfig[],
  auth?: AuthContext
) {
  //for each normalized tool, register one callable MCP handler
  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        //convert the serializable JSON Schema config into live zod schemas
        // because the MCP SDK validates tool contracts during registration.
        inputSchema: tool.input
          ? fromJSONSchema(tool.input) as unknown as AnySchema
          : undefined,
        outputSchema: tool.output
          ? fromJSONSchema(tool.output) as unknown as AnySchema
          : undefined
      },
      async (input: unknown) => {
        //if this server was built for one caller, enforce that same auth at
        // call time too so stale or manually-crafted calls cannot bypass it.
        if (auth && !toolAllowed(tool, auth)) {
          throw new Error(`Unauthorized MCP tool call: ${tool.name}`);
        }

        //validate the caller payload at the MCP edge before it reaches events
        const payload = validateInput(
          tool,
          (input || {}) as Record<string, unknown>
        );

        //now merge the payload into the event call and let Stackpress do the
        // real work behind the tool.
        const response = await ctx.resolve(tool.event, withToolData(
          tool,
          payload,
          auth
        ));

        //finally convert Stackpress results into the MCP text result shape
        return toMcpText(response?.results ?? null);
      }
    );
  }
}

/**
 * Register the MCP factory and transport events with Stackpress.
 */
export default function plugin(ctx: Server) {
  //if no MCP config, skip registering the plugin
  if (!ctx.config.has('mcp')) return;

  ctx.on('listen', async ({ ctx }) => {
    //load the generated client tools if the client package already exists
    // and let that registry attach its plugin-mode resolver events first.
    const client = ctx.plugin<ClientPlugin>('client');
    if (typeof client === 'function') {
      const generated = await client(true) || {};
      generated.tools?.listen(ctx);
    }

    //expose the MCP factory so transport scripts can request a fresh server
    // that is already filtered to one resolved caller auth context.
    ctx.register('mcp', async (auth?: AuthContext) => createMcpServer(
      ctx as ToolResolverServer,
      auth
    ));

    //then register the transport entry events that the CLI can emit later
    ctx.on('mcp-stdio', stdio);
    ctx.on('mcp-http', http);
    ctx.on('mcp-sse', sse);

    if (shouldAttachHttpToServer(ctx)) {
      attachHttpToServer(ctx);
    }

    if (ctx.config.has('mcp.sse') && shouldAttachSseToServer(ctx)) {
      attachSseToServer(ctx);
    }
  });

  //generate MCP tool code into the client package through the standard idea
  // plugin pipeline instead of reparsing schema files at runtime.
  ctx.on('idea', async ({ req }) => {
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    const schema = await transformer.schema();
    if (!schema.plugin) {
      schema.plugin = {};
    }
    const dirname = typeof __dirname === 'undefined'
      //@ts-ignore - import.meta only exists in esm builds
      ? path.dirname(fileURLToPath(import.meta.url))
      : __dirname;
    schema.plugin[`${dirname}/transform`] = {};
  });
}
