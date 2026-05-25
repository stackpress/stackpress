//node
import type { IncomingMessage, ServerResponse } from 'node:http';
//modules
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { fromJSONSchema } from 'zod';
import type { Application, Session } from 'stackpress-api/types';
//client
import type {
  AuthContext,
  NormalizedToolConfig,
  Token,
  ToolConfig,
  ToolResolverServer
} from './types.js';

//this supported method list is shared by normalization and secret checks so
// the package uses one owned definition of read and write verbs.
const METHODS = [ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE' ] as const;

type SupportedMethod = typeof METHODS[number];

//--------------------------------------------------------------------//
// Functions

/**
 * Build the full normalized tool registry from config entries.
 */
export async function buildTools(
  ctx: ToolResolverServer,
  configs: ToolConfig[]
) {
  const tools = await Promise.all(
    configs.map(config => resolveTool(ctx, config))
  );

  return tools.filter(
    (tool): tool is NormalizedToolConfig => tool !== null
  );
}

/**
 * Resolve one tool entry into the normalized runtime shape.
 */
export async function resolveTool(
  ctx: ToolResolverServer,
  config: ToolConfig
): Promise<NormalizedToolConfig | null> {
  //if the config is deferred, first ask the plugin event for its defaults
  const resolved = config.mode === 'plugin'
    ? await resolvePluginTool(ctx, config)
    : config;

  //if the plugin did not give back a usable tool config, then drop it
  if (!resolved) {
    return null;
  }

  //now merge the resolved defaults with the original config so the explicit
  // config remains the final authority.
  const merged = config.mode === 'plugin'
    ? mergePluginTool(resolved, config)
    : mergeTool(config, resolved);

  //if the config did not name the tool, derive a stable machine name
  if (!merged.name) {
    merged.name = inferName(merged.event);
  }

  //if the config did not title the tool, derive a readable label
  if (!merged.title) {
    merged.title = inferTitle(merged.name || merged.event);
  }

  //finally normalize defaults and reject unsupported methods
  return normalizeTool(merged);
}

/**
 * Ask a plugin resolver event for one deferred tool definition.
 */
export async function resolvePluginTool(
  ctx: ToolResolverServer,
  config: ToolConfig
) {
  const response = await ctx.resolve<ToolConfig>(config.event, config);
  const results = response?.results;

  //if the plugin did not return one object-like config, ignore it quietly
  if (!isRecord(results)) {
    return null;
  }

  return results as ToolConfig;
}

/**
 * Merge one plugin result with the original config overrides.
 */
export function mergePluginTool(
  resolved: ToolConfig,
  config: ToolConfig
): ToolConfig {
  const {
    event: _resolverEvent,
    mode: _resolverMode,
    data: configData,
    ...configOverrides
  } = config;

  return {
    ...resolved,
    ...configOverrides,
    //the plugin can seed static data, but the template config wins on overlap
    data: {
      ...(resolved.data || {}),
      ...(configData || {})
    }
  };
}

/**
 * Merge two concrete tool configs into one shallow tool config.
 */
export function mergeTool(
  base: ToolConfig,
  overrides: ToolConfig
): ToolConfig {
  return {
    ...base,
    ...overrides,
    data: {
      ...(base.data || {}),
      ...(overrides.data || {})
    }
  };
}

/**
 * Normalize one tool config into the runtime contract.
 */
export function normalizeTool(
  config: ToolConfig
): NormalizedToolConfig | null {
  //if there is no callable event, this config cannot become a tool
  if (!config.event) {
    return null;
  }

  //normalize the method once so later helpers can treat it as authoritative
  const method = String(config.method || 'GET')
    .toUpperCase() as SupportedMethod;

  //if the method is not one we support, then drop the tool entirely
  if (!METHODS.includes(method)) {
    return null;
  }

  const name = config.name?.trim();

  //if there is still no stable name after inference, stop here
  if (!name) {
    return null;
  }

  const title = (config.title || inferTitle(name)).trim();

  //if the display title still collapsed to nothing, then reject it
  if (!title.length) {
    return null;
  }

  return {
    ...config,
    mode: 'event',
    type: config.type || 'public',
    name,
    title,
    method,
    scopes: config.scopes || [],
    data: config.data || {}
  };
}

/**
 * Parse a bearer token into the id and optional secret pair.
 */
export function parseAuthorization(
  authorization?: string | null
): Token | null {
  //without a header there is nothing to authenticate
  if (!authorization) {
    return null;
  }

  const [ scheme, token ] = authorization.split(' ');

  //if the header is not bearer auth, then it does not belong to this flow
  if (scheme?.toLowerCase() !== 'bearer' || !token?.trim().length) {
    return null;
  }

  const [ id, secret ] = token.split(':');

  //if the token did not even include an id, then it is unusable
  if (!id?.trim().length) {
    return null;
  }

  return {
    token: token.trim(),
    id: id.trim(),
    secret: secret?.trim() || ''
  };
}

/**
 * Resolve the auth context used by tools/list.
 */
export async function resolveListAuth(
  ctx: ToolResolverServer,
  authorization?: string
): Promise<AuthContext> {
  //if there is no usable bearer token, then the caller is public only
  const token = parseAuthorization(authorization);
  if (!token) {
    return { kind: 'public' };
  }

  //first prefer application auth so the listing stays on the broader app view
// when the same id could theoretically resolve in both tables.
  const application = await resolveApplication(ctx, token.id);
  if (application) {
    return { kind: 'app', token, application };
  }

  //only fall back to the user session if no application was found
  const session = await resolveSession(ctx, token.id);
  if (session) {
    return { kind: 'user', token, session };
  }

  return { kind: 'public' };
}

/**
 * Resolve one application by id through Stackpress.
 */
export async function resolveApplication(
  ctx: ToolResolverServer,
  id: string
): Promise<Application | null> {
  const response = await ctx.resolve<Application>(
    'application-detail',
    { id }
  );

  //if the results are not object-like, then treat the lookup as missing
  if (!isRecord(response?.results)) {
    return null;
  }

  return response.results as Application;
}

/**
 * Resolve one user session by id through Stackpress.
 */
export async function resolveSession(
  ctx: ToolResolverServer,
  id: string
): Promise<Session | null> {
  const response = await ctx.resolve<Session>('session-detail', { id });

  //if the results are not object-like, then treat the lookup as missing
  if (!isRecord(response?.results)) {
    return null;
  }

  return response.results as Session;
}

/**
 * Merge static tool data, runtime input, and auth context into one payload.
 */
export function withToolData(
  tool: NormalizedToolConfig,
  input: Record<string, unknown>,
  auth?: AuthContext
) {
  //start with config defaults, then let caller input override those defaults
  const data: Record<string, unknown> = {
    ...tool.data,
    ...input
  };

  //if this is a user-scoped tool, then inject the user context that downstream
// events expect to see.
  if (auth?.kind === 'user') {
    data.profileId = auth.session.profileId;
    data.applicationId = auth.session.applicationId;
    data.sessionId = auth.session.id;
  }

  return data;
}

/**
 * Check whether one tool is visible for the given auth context.
 */
export function toolAllowed(
  tool: NormalizedToolConfig,
  auth: AuthContext
) {
  //public tools are always visible regardless of auth
  if (tool.type === 'public') {
    return true;
  }

  //app tools only show up for apps that own at least one required scope
  if (tool.type === 'app') {
    return auth.kind === 'app'
      && (
        tool.scopes.length === 0
        || auth.application.scopes.some(scope => tool.scopes.includes(scope))
      );
  }

  //user tools only show up for sessions that own at least one required scope
  if (tool.type === 'user') {
    return auth.kind === 'user'
      && (
        tool.scopes.length === 0
        || auth.session.scopes.some(scope => tool.scopes.includes(scope))
      );
  }

  return false;
}

/**
 * Return only the tools visible to one resolved auth context.
 */
export function listToolsForAuth(
  tools: NormalizedToolConfig[],
  auth: AuthContext
) {
  return tools.filter(tool => toolAllowed(tool, auth));
}

/**
 * Decide whether a method should require the secret half of the token pair.
 */
export function requiresSecret(method: string) {
  return String(method).toUpperCase() !== 'GET';
}

/**
 * Validate incoming MCP input against the tool's JSON schema.
 */
export function validateInput(
  tool: NormalizedToolConfig,
  input: Record<string, unknown>
) {
  //if the tool does not declare input, then pass the payload through untouched
  if (!tool.input) {
    return input;
  }

  //otherwise build a zod schema from JSON Schema and enforce it at the edge
  return fromJSONSchema(tool.input).parse(input) as Record<string, unknown>;
}

/**
 * Read and parse a JSON request body from a Node HTTP request.
 */
export async function readJsonBody(req: IncomingMessage) {
  const chunks: Uint8Array[] = [];

  //read the incoming stream into one buffer so JSON parsing has the full body
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  const body = Buffer.concat(chunks).toString('utf8').trim();

  //if the request body is empty, represent that as a null payload
  if (!body.length) {
    return null;
  }

  return JSON.parse(body);
}

/**
 * Send a JSON response with the given status and body.
 */
export function sendJson(
  res: ServerResponse,
  statusCode: number,
  body: Record<string, unknown>
) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

/**
 * Send a plain text response with the given status and body.
 */
export function sendText(
  res: ServerResponse,
  statusCode: number,
  body: string
) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(body);
}

/**
 * Wrap results into the MCP text content format.
 */
export function toMcpText<T>(results: T): CallToolResult {
  return {
    content: [{
      type: 'text',
      text: typeof results === 'string'
        ? results
        : JSON.stringify(results, null, 2)
    }]
  };
}

/**
 * Infer a machine-friendly tool name from an event name.
 */
export function inferName(event: string) {
  return event
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

/**
 * Infer a display-friendly title from a tool name or event.
 */
export function inferTitle(value: string) {
  return value
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Narrow unknown values to plain object-like records.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
