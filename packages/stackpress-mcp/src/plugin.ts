//node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
//modules
import type { CLIProps } from '@stackpress/idea-transformer/types';
import type Transformer from '@stackpress/idea-transformer/Transformer';
import type Server from '@stackpress/ingest/Server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { action } from '@stackpress/ingest/Server';
//stackpress-mcp
import type { ClientPlugin } from './types.js';
import serve from './events/serve.js';

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server) {
  //on listen
  ctx.on('listen', action.props(async ({ ctx }) => {
    //it's possible that the client isnt generated yet...
    //config, registry, model, fieldset
    const client = ctx.plugin<ClientPlugin>('client');
    const { tools } = await client(true) || {};
    //if no client or modules, return
    if (!tools) return;
    //get MCP config
    const name = ctx.config.path('mcp.name', 'Stackpress MCP Server');
    const version = ctx.config.path('mcp.version', '0.0.1');
    //make MCP server
    const server = new McpServer({ name, version });
    //register all tools
    tools(server, ctx);
    //set plugin
    ctx.register('mcp', server);
    //add mcp server events
    ctx.on('mcp', serve);
  }));
  //generate some code in the client folder
  ctx.on('idea', async req => {
    //get the transformer from the request
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    const schema = await transformer.schema();
    //if no plugin object exists, create one
    if (!schema.plugin) {
      schema.plugin = {};
    }
    const dirname = typeof __dirname === 'undefined' 
      //@ts-ignore - The import.meta only allowed in ESM
      ? path.dirname(fileURLToPath(import.meta.url))
      : __dirname;
    //add this plugin generator to the schema
    //so it can be part of the transformation
    schema.plugin[`${dirname}/transform`] = {};
  });
};