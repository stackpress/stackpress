import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Formats the given object to what MCP wants to return from tools
 */
export function toMcpText<T>(results: T): CallToolResult {
  return {
    content: [{ 
      type: 'text', 
      text: typeof results !== 'string' 
        ? JSON.stringify(results, null, 2)
        : results
    }]
  };
};