//node
import { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
//modules
import type Server from '@stackpress/ingest/Server';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
//client
import type {
  McpHttpSession,
  McpPlugin,
  McpServer,
  McpSessionMode,
  Promiser
} from '../types.js';
import {
  readJsonBody,
  sendJson,
  sendText
} from '../helpers.js';

const HTTP_ATTACH_KEY = '__stackpress_ai_http_attached__';
const HTTP_BODY_UNSET = Symbol('HTTP_BODY_UNSET');

/**
 * Resolve the main server host and port from Stackpress config.
 */
export function resolveServerConfig(ctx: Server) {
  return {
    host: ctx.config.path('server.host', '127.0.0.1'),
    port: ctx.config.path('server.port', 3000)
  };
}

/**
 * Resolve the HTTP MCP transport config from MCP and server settings.
 */
export function resolveHttpConfig(ctx: Server) {
  return {
    endpoint: ctx.config.path('mcp.route', '/mcp'),
    host: ctx.config.path(
      'mcp.host',
      ctx.config.path('server.host', '127.0.0.1')
    ),
    mode: ctx.config.path('mcp.mode', 'stateful') as McpSessionMode,
    port: ctx.config.path(
      'mcp.port',
      ctx.config.path('server.port', 3000)
    )
  };
}

/**
 * Determine whether the MCP HTTP route should attach to the main server.
 */
export function shouldAttachHttpToServer(ctx: Server) {
  const http = resolveHttpConfig(ctx);
  const server = resolveServerConfig(ctx);
  return http.host === server.host && http.port === server.port;
}

/**
 * This transport owns the Streamable HTTP server lifecycle and maps inbound
 * HTTP requests into one MCP session strategy.
 */
export class McpHttpServer {
  //this shutdown handle is exposed so the caller can stop the server cleanly
  public readonly shutdown: () => Promise<void>;
  //this endpoint is the one HTTP path that accepts MCP requests
  protected _endpoint: string;
  //this flag prevents the shutdown path from running more than once
  protected _exiting = false;
  //this factory creates one MCP tool server whenever a session is needed
  protected _factory: McpPlugin;
  //this host binds the HTTP listener to the configured interface
  protected _host: string;
  //this mode decides whether requests reuse sessions or rebuild them
  protected _mode: McpSessionMode;
  //this port binds the HTTP listener to the configured port
  protected _port: number;
  //this promise bridge keeps the CLI event open until the server exits
  protected _promiser: Promiser<void>;
  //this Node server accepts the HTTP requests for the MCP endpoint
  protected _service = createServer(this._handleRequest.bind(this));
  //this live session map lets stateful requests route back to the right
  // transport instance.
  protected _sessions: Record<string, McpHttpSession> = {};

  /**
   * Store the transport configuration and prepare one shutdown callback.
   */
  public constructor(
    factory: McpPlugin,
    host: string,
    port: number,
    endpoint: string,
    mode: McpSessionMode,
    promiser: Promiser<void>
  ) {
    this._factory = factory;
    this._host = host;
    this._port = port;
    this._endpoint = endpoint;
    this._mode = mode;
    this._promiser = promiser;
    this.shutdown = async () => {
      if (this._exiting) return;
      this._exiting = true;
      await this._closeSessions();
      await this._closeService();
    };
  }

  /**
   * Handle one raw Node request without creating a dedicated listener.
   */
  public async dispatch(
    req: IncomingMessage,
    res: ServerResponse,
    body: unknown = HTTP_BODY_UNSET
  ) {
    await this._handleRequest(req, res, body);
  }

  /**
   * Start listening for HTTP MCP requests.
   */
  public async start() {
    //when the process is interrupted, close the transport cleanly
    process.once('SIGINT', this.shutdown);

    //these events settle the outer CLI promise when the server stops
    this._service.on('close', () => this._promiser.resolve());
    this._service.on('error', error => this._promiser.reject(error));

    //now listen on the configured address and surface startup errors
    await new Promise<void>((resolve, reject) => {
      const onError = (error: Error) => reject(error);
      this._service.once('error', onError);
      this._service.listen(this._port, this._host, () => {
        this._service.off('error', onError);
        resolve();
      });
    });
  }

  /**
   * Close the underlying Node HTTP service.
   */
  protected async _closeService() {
    await new Promise<void>((resolve, reject) => {
      this._service.close(error => error ? reject(error) : resolve());
    });
  }

  /**
   * Close every live HTTP session transport.
   */
  protected async _closeSessions() {
    await Promise.all(
      Object.values(this._sessions).map(session => session.transport.close())
    );
  }

  /**
   * Resolve one MCP server instance from the registered factory.
   */
  protected async _createServer(): Promise<McpServer> {
    const server = await this._factory();

    //if config produced no tools, fail loudly so the CLI does not hang
    if (!server) {
      throw new Error('Resolved MCP tool registry is empty.');
    }

    return server;
  }

  /**
   * Create one MCP session and attach it to the HTTP transport.
   */
  protected async _createSession(): Promise<McpHttpSession> {
    //first build one MCP tool server from the registered factory
    const server = await this._createServer();
    let transport!: StreamableHTTPServerTransport;

    //then create the HTTP transport and record new session ids as they appear
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: this._mode === 'stateless'
        ? undefined
        : () => randomUUID(),
      onsessioninitialized: sessionId => {
        this._sessions[sessionId] = { server, transport };
      }
    });

    //when the transport closes, remove its session from the lookup table
    transport.onclose = async () => {
      const sessionId = transport.sessionId;
      if (sessionId) {
        delete this._sessions[sessionId];
      }
    };

    await server.connect(transport);
    return { server, transport };
  }

  /**
   * Route one inbound HTTP request into the correct MCP flow.
   */
  protected async _handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
    body: unknown = HTTP_BODY_UNSET
  ) {
    try {
      //build one URL object so path matching works even on raw Node requests
      const url = new URL(
        req.url || '/',
        `http://${req.headers.host || `${this._host}:${this._port}`}`
      );

      //if the request missed the configured endpoint, then stop early
      if (url.pathname !== this._endpoint) {
        sendText(res, 404, 'Not Found');
        return;
      }

      //only POST requests carry JSON-RPC bodies, so read them conditionally
      const payload = req.method === 'POST'
        ? body === HTTP_BODY_UNSET
          ? await readJsonBody(req)
          : body
        : undefined;

      //stateless mode creates a fresh session per request and exits early
      if (this._mode === 'stateless') {
        await this._handleStatelessRequest(req, res, payload);
        return;
      }

      //otherwise route the request through the long-lived session flow
      await this._handleStatefulRequest(req, res, payload);
    } catch (error) {
      //if the response is still writable, translate the failure to JSON-RPC
      if (!res.headersSent) {
        sendJson(res, 500, {
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: (error as Error).message
          },
          id: null
        });
      } else {
        //if headers already left the server, then just close the socket
        res.end();
      }
    }
  }

  /**
   * Handle one request in stateful session mode.
   */
  protected async _handleStatefulRequest(
    req: IncomingMessage,
    res: ServerResponse,
    body: unknown
  ) {
    //pull the MCP session id header into one stable string key
    const sessionId = req.headers['mcp-session-id'];
    const key = Array.isArray(sessionId) ? sessionId[0] : sessionId;

    //if the caller already has a session, let that transport own the request
    if (typeof key === 'string' && this._sessions[key]) {
      await this._sessions[key].transport.handleRequest(req, res, body);
      return;
    }

    //without a session id, only initialize requests may create a new session
    if (!key && req.method === 'POST' && isInitializeRequest(body)) {
      const session = await this._createSession();
      await session.transport.handleRequest(req, res, body);
      return;
    }

    //everything else is a bad request because the session could not be found
    sendJson(res, 400, {
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: No valid session ID provided'
      },
      id: null
    });
  }

  /**
   * Handle one request in stateless session mode.
   */
  protected async _handleStatelessRequest(
    req: IncomingMessage,
    res: ServerResponse,
    body: unknown
  ) {
    //stateless transport only supports POST JSON-RPC requests
    if (req.method !== 'POST') {
      sendJson(res, 405, {
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Method not allowed.'
        },
        id: null
      });
      return;
    }

    //create one throwaway session and close it once the response finishes
    const session = await this._createSession();
    res.on('close', async () => {
      await session.transport.close();
    });

    //now let the per-request transport answer the JSON-RPC payload
    await session.transport.handleRequest(req, res, body);
  }
}

/**
 * Start the MCP Streamable HTTP transport from Stackpress config.
 */
export default async function http(ctx: Server) {
  //start by loading the registered MCP server factory and transport config
  if (shouldAttachHttpToServer(ctx)) {
    attachHttpToServer(ctx);
    return;
  }

  const factory = ctx.plugin<McpPlugin>('mcp');
  const { endpoint, host, mode, port } = resolveHttpConfig(ctx);

  //then keep the event open until the underlying HTTP service closes
  return new Promise<void>(async (resolve, reject) => {
    const transport = new McpHttpServer(
      factory,
      host,
      port,
      endpoint,
      mode,
      { resolve, reject }
    );

    //finally start listening on the configured interface
    await transport.start();
  });
}

/**
 * Attach the MCP HTTP handler to the main Stackpress server request pipeline.
 */
export function attachHttpToServer(ctx: Server) {
  //cast once so the attach marker can live on the request pipeline host
  const attachable = ctx as Server & Record<string, unknown>;

  if (attachable[HTTP_ATTACH_KEY]) {
    return;
  }

  attachable[HTTP_ATTACH_KEY] = true;
  const factory = ctx.plugin<McpPlugin>('mcp');
  const { endpoint, host, mode, port } = resolveHttpConfig(ctx);
  const transport = new McpHttpServer(
    factory,
    host,
    port,
    endpoint,
    mode,
    { resolve: () => undefined, reject: error => { throw error; } }
  );

  ctx.on('request', async ({ req, res }) => {
    if (!(req.resource instanceof IncomingMessage)
      || !(res.resource instanceof ServerResponse)
    ) {
      return;
    }

    const im = req.resource;
    const sr = res.resource;
    const url = new URL(
      im.url || '/',
      `http://${im.headers.host || `${host}:${port}`}`
    );

    if (im.method !== 'POST' || url.pathname !== endpoint) {
      return;
    }

    //pass through the parsed Stackpress request data so initialize works even
    // after the main server has already consumed the raw stream.
    await transport.dispatch(im, sr, req.data());
    if (sr.headersSent) {
      res.stop();
      return false;
    }
  });
}
