//modules
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

/**
 * Formats an MCP error result.
 */
export function toMcpError(
  message: string,
  details?: Record<string, unknown>
): CallToolResult {
  return {
    isError: true,
    content: [{
      type: 'text',
      text: JSON.stringify({
        error: message,
        ...details
      }, null, 2)
    }]
  };
};
