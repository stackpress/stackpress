//node
import { IncomingMessage, ServerResponse } from 'node:http';
import { createServer } from 'node:http';
//modules
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import type Server from '@stackpress/ingest/Server';
//client
import type {
  McpPlugin,
  McpServer,
  McpSseSession,
  Promiser
} from '../types.js';
import {
  readJsonBody,
  sendText
} from '../helpers.js';

const SSE_ATTACH_KEY = '__stackpress_ai_sse_attached__';
const SSE_BODY_UNSET = Symbol('SSE_BODY_UNSET');

/**
 * Resolve the SSE MCP transport config from SSE, MCP, and server settings.
 */
export function resolveSseConfig(ctx: Server) {
  return {
    endpoint: ctx.config.path(
      'mcp.sse.route',
      ctx.config.path('mcp.route', '/mcp')
    ),
    host: ctx.config.path(
      'mcp.sse.host',
      ctx.config.path(
        'mcp.host',
        ctx.config.path('server.host', '127.0.0.1')
      )
    ),
    key: ctx.config.path('mcp.sse.key', SSE_ATTACH_KEY),
    messages: ctx.config.path('mcp.messages', '/messages'),
    port: ctx.config.path(
      'mcp.sse.port',
      ctx.config.path(
        'mcp.port',
        ctx.config.path('server.port', 3000)
      )
    )
  };
}

/**
 * Determine whether the MCP SSE routes should attach to the main server.
 */
export function shouldAttachSseToServer(ctx: Server) {
  const sse = resolveSseConfig(ctx);
  return sse.host === ctx.config.path('server.host', '127.0.0.1')
    && sse.port === ctx.config.path('server.port', 3000);
}

/**
 * This transport owns the legacy SSE MCP server lifecycle and keeps each SSE
 * session paired with its message endpoint handler.
 */
export class McpSseServer {
  //this shutdown handle is exposed so the caller can stop the server cleanly
  public readonly shutdown: () => Promise<void>;
  //this endpoint accepts the initial SSE connection request
  protected _endpoint: string;
  //this flag prevents the shutdown path from running more than once
  protected _exiting = false;
  //this factory creates one MCP tool server whenever a session is needed
  protected _factory: McpPlugin;
  //this host binds the HTTP listener to the configured interface
  protected _host: string;
  //this endpoint accepts follow-up POST messages for an SSE session
  protected _messages: string;
  //this port binds the HTTP listener to the configured port
  protected _port: number;
  //this promise bridge keeps the CLI event open until the server exits
  protected _promiser: Promiser<void>;
  //this Node server accepts the SSE handshake and message requests
  protected _service = createServer(this._handleRequest.bind(this));
  //this session map lets message requests route back to one live SSE session
  protected _sessions: Record<string, McpSseSession> = {};

  /**
   * Store the transport configuration and prepare one shutdown callback.
   */
  public constructor(
    factory: McpPlugin,
    host: string,
    port: number,
    endpoint: string,
    messages: string,
    promiser: Promiser<void>
  ) {
    this._factory = factory;
    this._host = host;
    this._port = port;
    this._endpoint = endpoint;
    this._messages = messages;
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
    body: unknown = SSE_BODY_UNSET
  ) {
    await this._handleRequest(req, res, body);
  }

  /**
   * Start listening for SSE MCP requests.
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
   * Close every live SSE session transport.
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
   * Route one POST message into an existing SSE session.
   */
  protected async _handleMessageRequest(
    req: IncomingMessage,
    res: ServerResponse,
    url: URL,
    body: unknown = SSE_BODY_UNSET
  ) {
    //the session id lives in the query string for the SSE message endpoint
    const sessionId = url.searchParams.get('sessionId');

    //if the session is missing, then the message cannot be routed anywhere
    if (!sessionId || !this._sessions[sessionId]) {
      sendText(res, 404, 'Session not found');
      return;
    }

    //read the JSON body and hand it back to the active SSE transport
    const payload = body === SSE_BODY_UNSET
      ? await readJsonBody(req)
      : body;
    await this._sessions[sessionId].transport.handlePostMessage(req, res, payload);
  }

  /**
   * Route one inbound request into the SSE handshake or message flow.
   */
  protected async _handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
    body: unknown = SSE_BODY_UNSET
  ) {
    try {
      //build one URL object so path matching works even on raw Node requests
      const url = new URL(
        req.url || '/',
        `http://${req.headers.host || `${this._host}:${this._port}`}`
      );

      //for GET on the SSE endpoint, start one long-lived event stream session
      if (req.method === 'GET' && url.pathname === this._endpoint) {
        await this._handleSseConnection(res);
        return;
      }

      //for POST on the message endpoint, route JSON-RPC messages to a session
      if (req.method === 'POST' && url.pathname === this._messages) {
        await this._handleMessageRequest(req, res, url, body);
        return;
      }

      //any other path or method misses the SSE transport contract
      sendText(res, 404, 'Not Found');
    } catch (error) {
      //if the response is still writable, send back one plain-text error
      if (!res.headersSent) {
        sendText(res, 500, (error as Error).message);
      } else {
        //if headers already left the server, then just close the socket
        res.end();
      }
    }
  }

  /**
   * Open one SSE session and register it in the live session map.
   */
  protected async _handleSseConnection(res: ServerResponse) {
    //first build one MCP tool server from the registered factory
    const server = await this._createServer();

    //then pair it with one SSE transport bound to the response stream
    const transport = new SSEServerTransport(this._messages, res);
    const sessionId = transport.sessionId;
    this._sessions[sessionId] = { server, transport };

    //when the transport closes, remove its session from the lookup table
    transport.onclose = async () => {
      delete this._sessions[sessionId];
    };

    //finally connect the MCP server to the SSE transport
    await server.connect(transport);
  }
}

/**
 * Start the MCP SSE transport from Stackpress config.
 */
export default async function sse(ctx: Server) {
  //start by loading the registered MCP server factory and transport config
  if (shouldAttachSseToServer(ctx)) {
    attachSseToServer(ctx);
    return;
  }

  const factory = ctx.plugin<McpPlugin>('mcp');
  const { endpoint, host, messages, port } = resolveSseConfig(ctx);

  //then keep the event open until the underlying HTTP service closes
  return new Promise<void>(async (resolve, reject) => {
    const transport = new McpSseServer(
      factory,
      host,
      port,
      endpoint,
      messages,
      { resolve, reject }
    );

    //finally start listening on the configured interface
    await transport.start();
  });
}

/**
 * Attach the MCP SSE handlers to the main Stackpress server request pipeline.
 */
export function attachSseToServer(ctx: Server) {
  const { endpoint, host, key, messages, port } = resolveSseConfig(ctx);
  //cast once so the configurable attach marker can live on the server context
  const attachable = ctx as Server & Record<string, unknown>;

  if (attachable[key]) {
    return;
  }

  attachable[key] = true;
  const factory = ctx.plugin<McpPlugin>('mcp');
  const transport = new McpSseServer(
    factory,
    host,
    port,
    endpoint,
    messages,
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

    if (
      (im.method !== 'GET' || url.pathname !== endpoint)
      && (im.method !== 'POST' || url.pathname !== messages)
    ) {
      return;
    }

    //pass through the parsed Stackpress request data so attached POST
    // message requests do not try to reread an already-consumed stream.
    await transport.dispatch(im, sr, req.data());
    if (sr.headersSent) {
      res.stop();
      return false;
    }
  });
}
