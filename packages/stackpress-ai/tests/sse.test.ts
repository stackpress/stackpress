//node
import { IncomingMessage, ServerResponse } from 'node:http';
//modules
import { expect } from 'chai';
import { describe, it } from 'mocha';
//client
import {
  attachSseToServer,
  McpSseServer,
  resolveSseConfig
} from '../src/scripts/sse.js';
import {
  createMockRequest,
  expectJson,
  MockResponse
} from './helpers.js';

type MessageResponse = {
  jsonrpc: '2.0';
  id: number | null;
  result: {
    ok: boolean;
    method: string | null;
  };
};

//this narrow message body shape keeps the SSE transport test payloads
// explicit without mirroring the full JSON-RPC type tree.
type TestBody = {
  id?: number | null,
  method?: string
};

//this transport shape mirrors the SSE callbacks the base class needs while
// keeping the test replacement intentionally small.
type TestTransport = {
  sessionId: string,
  onclose?: () => Promise<void>,
  close: () => Promise<void>,
  handlePostMessage: (
    req: IncomingMessage,
    reply: ServerResponse,
    body: TestBody | undefined
  ) => Promise<void>
};

//this narrowed session map lets the subclass update protected state without
// leaning on any-casts.
type SessionStore = Record<string, {
  server: { close: () => Promise<void> },
  transport: TestTransport
}>;

/**
 * This test server overrides the SSE session setup so request routing can be
 * verified without a live MCP backend.
 */
class TestSseServer extends McpSseServer {
  //this counter shows how many SSE sessions the test opened
  public created = 0;
  //this counter confirms the transport close hooks were reached
  public oncloseCalls = 0;

  /**
   * Re-expose request dispatch so tests can drive the protected flow directly.
   */
  public override async dispatch(
    req: IncomingMessage,
    res: ServerResponse,
    body?: TestBody | null
  ) {
    await this._handleRequest(req, res, body);
  }

  /**
   * Create one fake SSE session and immediately write a handshake response.
   */
  protected override async _handleSseConnection(res: ServerResponse) {
    this.created++;
    const sessionId = `sse-${this.created}`;
    const server = {
      close: async () => undefined
    };
    const sessions = this._sessions as SessionStore;

    const transport: TestTransport = {
      sessionId,
      close: async () => {
        this.oncloseCalls++;
        delete sessions[sessionId];
        await transport.onclose?.();
      },
      handlePostMessage: async (
        _req: IncomingMessage,
        reply: ServerResponse,
        body: TestBody | undefined
      ) => {
        reply.statusCode = 200;
        reply.setHeader('Content-Type', 'application/json');
        reply.end(JSON.stringify({
          jsonrpc: '2.0',
          id: body?.id ?? null,
          result: {
            ok: true,
            method: body?.method ?? null
          }
        }));
      }
    };

    sessions[sessionId] = { server, transport };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    res.end(`event: endpoint\ndata: ${JSON.stringify({ sessionId })}\n\n`);
  }
}

function makeServer() {
  return new TestSseServer(
    async () => null,
    '127.0.0.1',
    17759,
    '/sse',
    '/messages',
    {
      resolve: () => undefined,
      reject: error => {
        throw error;
      }
    }
  );
}

//this tiny config shape is enough for the transport config helper tests.
type ConfigStub = {
  config: {
    path<T>(key: string, fallback?: T): T
  },
  on?: (event: string, listener: Function) => void,
  plugin?: <T = unknown>(name: string) => T
};

/**
 * Create one minimal config-only server stub for helper tests.
 */
function makeCtx(config: Record<string, unknown> = {}) {
  const ctx: ConfigStub = {
    config: {
      path<T>(key: string, fallback?: T) {
        return (key in config ? config[key] : fallback) as T;
      }
    }
  };

  return ctx;
}

/**
 * Create one minimal attached-server stub that captures the request listener.
 */
function makeAttachCtx(config: Record<string, unknown> = {}) {
  let listener: Function | undefined;
  const ctx: ConfigStub & {
    listener: () => Function | undefined
  } = {
    config: {
      path<T>(key: string, fallback?: T) {
        return (key in config ? config[key] : fallback) as T;
      }
    },
    on(event: string, callback: Function) {
      if (event === 'request') {
        listener = callback;
      }
    },
    plugin<T = unknown>() {
      return (async () => null) as T;
    },
    listener() {
      return listener;
    }
  };

  return ctx;
}

/**
 * Create one Node-shaped request object that passes the attach-mode guards.
 */
function makeAttachedRequest(options: {
  method: string,
  url: string,
  headers?: Record<string, string>
}) {
  return Object.assign(
    Object.create(IncomingMessage.prototype),
    {
      method: options.method,
      url: options.url,
      headers: options.headers || {}
    }
  ) as IncomingMessage;
}

/**
 * Create one Node-shaped response object that passes the attach-mode guards.
 */
function makeAttachedResponse() {
  const headers = new Map<string, string>();
  const response = Object.create(ServerResponse.prototype) as ServerResponse & {
    body: string,
    headers: Map<string, string>
  };

  Object.defineProperty(response, 'statusCode', {
    value: 200,
    writable: true,
    configurable: true
  });
  Object.defineProperty(response, 'headersSent', {
    value: false,
    writable: true,
    configurable: true
  });
  Object.defineProperty(response, 'body', {
    value: '',
    writable: true,
    configurable: true
  });
  Object.defineProperty(response, 'headers', {
    value: headers,
    writable: true,
    configurable: true
  });

  response.setHeader = (name: string, value: string) => {
    headers.set(name.toLowerCase(), value);
    return response;
  };

  response.end = (body = '') => {
    response.headersSent = true;
    response.body += body;
    return response;
  };

  return response as MockResponse as ServerResponse;
}

describe('ai/sse', () => {
  it('should fall back to the main server host and port', () => {
    const resolved = resolveSseConfig(makeCtx({
      'server.host': '0.0.0.0',
      'server.port': 4000
    }));

    expect(resolved.host).to.equal('0.0.0.0');
    expect(resolved.port).to.equal(4000);
  });

  it('should default to localhost and port 3000 when no host and port exist', () => {
    const resolved = resolveSseConfig(makeCtx());

    expect(resolved.host).to.equal('127.0.0.1');
    expect(resolved.port).to.equal(3000);
  });

  it('should open an SSE session and accept message posts', async () => {
    const server = makeServer();

    const connectRes = new MockResponse();
    await server.dispatch(
      createMockRequest({ method: 'GET', url: '/sse', headers: { host: 'localhost' } }),
      connectRes
    );

    expect(connectRes.statusCode).to.equal(200);
    expect(connectRes.body).to.contain('"sessionId":"sse-1"');
    expect(server.created).to.equal(1);

    const messageRes = new MockResponse();
    await server.dispatch(
      createMockRequest({
        method: 'POST',
        url: '/messages?sessionId=sse-1',
        headers: { host: 'localhost', 'content-type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
          params: {}
        })
      }),
      messageRes
    );

    expect(messageRes.statusCode).to.equal(200);
    expect(expectJson<MessageResponse>(messageRes.body).result).to.deep.equal({
      ok: true,
      method: 'tools/list'
    });
  });

  it('should prefer explicit sse and mcp host and port over server config', () => {
    const resolved = resolveSseConfig(makeCtx({
      'mcp.host': '192.168.1.10',
      'mcp.port': 17759,
      'mcp.sse.host': '10.0.0.5',
      'mcp.sse.port': 18888,
      'server.host': '0.0.0.0',
      'server.port': 4000
    }));

    expect(resolved.host).to.equal('10.0.0.5');
    expect(resolved.port).to.equal(18888);
  });

  it('should stop and abort the queue after an attached message request is handled', async () => {
    const ctx = makeAttachCtx({
      'mcp.sse.route': '/sse',
      'mcp.messages': '/messages'
    });
    const originalDispatch = McpSseServer.prototype.dispatch;
    const payload = { method: 'tools/list' };
    let stopped = false;

    McpSseServer.prototype.dispatch = async function (
      _req: IncomingMessage,
      res: ServerResponse,
      body?: unknown
    ) {
      expect(body).to.equal(payload);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end('{}');
    };

    try {
      attachSseToServer(ctx as never);
      const listener = ctx.listener();
      expect(listener).to.be.a('function');

      const result = await listener!({
        req: {
          body: payload,
          data() {
            return payload;
          },
          resource: makeAttachedRequest({
            method: 'POST',
            url: '/messages?sessionId=sse-1',
            headers: { host: 'localhost' }
          })
        },
        res: {
          resource: makeAttachedResponse(),
          stop() {
            stopped = true;
          }
        }
      });

      expect(stopped).to.equal(true);
      expect(result).to.equal(false);
    } finally {
      McpSseServer.prototype.dispatch = originalDispatch;
    }
  });
});
