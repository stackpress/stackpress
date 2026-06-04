//modules
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type Server from '@stackpress/ingest/Server';
import type { Application, Session } from 'stackpress-api/types';

//this exported schema alias keeps config serializable while still letting the
// package treat tool input and output contracts as JSON Schema documents.
export type JsonSchema = Record<string, unknown>;

//this token shape is shared by auth helpers once a bearer header is parsed and
// split into its public id and optional secret.
export type Token = {
  token: string,
  id: string,
  secret: string
};

//this small promise wrapper keeps the long-running transport scripts attached
// to the CLI command until the underlying network server closes.
export type Promiser<T = void> = {
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: unknown) => void
};

//this mode tells the HTTP transport whether MCP sessions are persisted across
// requests or rebuilt for each request.
export type McpSessionMode = 'stateful' | 'stateless';

//this config shape describes the top-level MCP settings that Stackpress reads
// when it builds transport servers and registers tools from config.
export type McpConfig = {
  description?: string,
  host?: string,
  mode?: McpSessionMode,
  messages?: string,
  name?: string,
  port?: number,
  route?: string,
  sse?: {
    host?: string,
    key?: string,
    port?: number,
    route?: string
  },
  title?: string,
  tools?: ToolConfig[],
  version?: string
};

//this is the serializable tool config contract that template configs and
// plugin-resolved tool definitions must satisfy.
export type ToolConfig = {
  mode?: 'event' | 'plugin',
  type?: 'public' | 'app' | 'user',
  name?: string,
  title?: string,
  description?: string,
  method?: string,
  input?: JsonSchema,
  output?: JsonSchema,
  event: string,
  scopes?: string[],
  data?: Record<string, unknown>
};

//this normalized tool shape is what the runtime keeps after defaults,
// inference, and validation have already been applied.
export type NormalizedToolConfig = ToolConfig & {
  mode: 'event',
  type: 'public' | 'app' | 'user',
  name: string,
  title: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  scopes: string[],
  data: Record<string, unknown>
};

//this auth union keeps the live caller context attached to either an
// application session, a user session, or no identity at all.
export type AuthContext
  = { kind: 'public' }
  | { kind: 'app', token: Token, application: Application }
  | { kind: 'user', token: Token, session: Session };

//this factory contract is what Stackpress stores under ctx.register('mcp')
// so transports can request a fresh MCP server on demand for one resolved
// caller auth context.
export type McpPlugin = (auth?: AuthContext) => Promise<McpServer | null>;

//this HTTP session shape keeps one MCP server paired with one transport so
// later requests can route back to the same live session.
export type McpHttpSession = {
  auth: AuthContext,
  server: McpServer,
  transport: StreamableHTTPServerTransport
};

//this SSE session shape mirrors the HTTP session pairing but uses the older
// SSE transport contract.
export type McpSseSession = {
  auth: AuthContext,
  server: McpServer,
  transport: SSEServerTransport
};

//this resolve response keeps the helper boundary aligned with Stackpress
// resolve() calls that may or may not return results.
export type ResolvedResponse<T> = {
  results?: T
};

export type { McpServer };

//this server contract narrows Stackpress with the resolve() shape that the
// ai package depends on when it builds tools and serves calls.
export type ToolResolverServer = Server & {
  resolve<T = unknown>(
    event: string,
    payload: Record<string, unknown>
  ): Promise<ResolvedResponse<T> | null>
};

//this generated client tools shape is what the ai runtime looks for after the
// client package has been produced by the idea pipeline.
export type ClientTools = {
  listen: (server: Server) => void
};

//this generated client contract extends the normal client plugin surface with
// the optional top-level tools registry emitted by the ai transform.
export type Client = {
  tools?: ClientTools
};

//this plugin shape is what ctx.plugin('client') returns once the generated
// client package can be imported.
export type ClientPlugin = (nullable?: boolean) => Promise<Client | null>;
