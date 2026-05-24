//client
//these public types describe the config and auth contracts that downstream
// callers use when they configure the MCP package.
export type {
  AuthContext,
  JsonSchema,
  McpConfig,
  NormalizedToolConfig,
  Token,
  ToolConfig
} from './types.js';

//these exports expose the plugin entrypoint and MCP factory at the package
// boundary so Stackpress and tests can load them from one place.
export { createMcpServer } from './plugin.js';
export { default } from './plugin.js';
