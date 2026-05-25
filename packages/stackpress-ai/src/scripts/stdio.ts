//modules
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type Server from '@stackpress/ingest/Server';
//client
import type { ToolResolverServer } from '../types.js';
import { createMcpServer } from '../plugin.js';

/**
 * Start the stdio transport from Stackpress config.
 */
export default async function stdio(ctx: Server) {
  //create one MCP server from the current Stackpress runtime
  const server = await createMcpServer(ctx as ToolResolverServer);

  //if there are no tools, then the transport should fail loudly and early
  if (!server) {
    throw new Error('Resolved MCP tool registry is empty.');
  }

  //once the server exists, bind it directly to stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
