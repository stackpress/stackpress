//modules
import { 
  StdioServerTransport 
} from '@modelcontextprotocol/sdk/server/stdio.js';
//stackpress-server
import type { TerminalPlugin } from 'stackpress-server/types';
import type Server from '@stackpress/ingest/Server';
//stackpress-mcp
import { McpPlugin } from '../types';

export default async function serve(
  terminal: TerminalPlugin, 
  ctx: Server<any, any, any>,
  port: number
) {
  const server = ctx.plugin<McpPlugin>('mcp');
  const transport = new StdioServerTransport();

  // Add error handling for the transport
  let isShuttingDown = false;
  
  transport.onclose = async () => {
    if (!isShuttingDown) {
      await terminal.resolve('log', {
        type: 'error',
        message: 'MCP transport connection closed unexpectedly',
      });
      process.exit(1);
    } else {
      await terminal.resolve('log', {
        type: 'error',
        message: 'MCP transport connection closed during shutdown',
      });
    }
  };

  transport.onerror = async (error: any) => {
    await terminal.resolve('log', {
      type: 'error',
      message: `MCP transport connection error: ${error.message}`,
    });
    if (!isShuttingDown) {
      process.exit(1);
    }
  };

  // Handle process termination gracefully
  process.on('SIGINT', async () => {
    await terminal.resolve('log', {
      type: 'info',
      message: 'Received SIGINT, shutting down gracefully...',
    });
    isShuttingDown = true;
    try {
      await server.close();
      process.exit(0);
    } catch (error) {
      const e = error as Error;
      await terminal.resolve('log', {
        type: 'error',
        message: `Error during shutdown: ${e.message || e.toString()}`,
      });
      process.exit(1);
    }
  });

  process.on('SIGTERM', async () => {
    await terminal.resolve('log', {
      type: 'info',
      message: 'Received SIGTERM, shutting down gracefully...',
    });
    isShuttingDown = true;
    try {
      await server.close();
      process.exit(0);
    } catch (error) {
      const e = error as Error;
      await terminal.resolve('log', {
        type: 'error',
        message: `Error during shutdown: ${e.message || e.toString()}`,
      });
      process.exit(1);
    }
  });

  //start the server
  terminal?.verbose && terminal.control.system(`MCP Server is running on port ${port}`);
  terminal?.verbose && terminal.control.system('------------------------------');

  await server.connect(transport);
};