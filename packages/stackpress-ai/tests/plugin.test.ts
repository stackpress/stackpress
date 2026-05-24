//node
import { IncomingMessage, ServerResponse } from 'node:http';
//modules
import { expect } from 'chai';
import { describe, it } from 'mocha';
//client
import plugin, { createMcpServer } from '../src/plugin.js';
import type { ToolResolverServer } from '../src/types.js';
import { createCtxStub } from './helpers.js';

//this local server slice is enough to exercise plugin registration behavior
// without rebuilding the full ingest server surface in tests.
type PluginServerStub = {
  config: {
    get<T = unknown>(key: string): T | undefined,
    has?(key: string): boolean
  },
  on(event: string, listener: Function): void
};

describe('ai/package', () => {
  it('should export the package entrypoints', async () => {
    const mod = await import('../src/index.js');
    expect(mod).to.have.property('default');
  });

  it('should not activate when no mcp config exists', () => {
    const handlers = new Map<string, Function>();
    const server: PluginServerStub = {
      config: {
        get() {
          return undefined;
        },
        has() {
          return false;
        }
      },
      on(event: string, listener: Function) {
        handlers.set(event, listener);
      }
    };

    plugin(server as never);

    expect(handlers.has('listen')).to.equal(false);
  });

  it('should register mcp factory and transport events on listen', async () => {
    const handlers = new Map<string, Function>();
    const server: PluginServerStub = {
      config: {
        get() {
          return {};
        },
        has(key: string) {
          return key === 'mcp';
        }
      },
      on(event: string, listener: Function) {
        handlers.set(event, listener);
      }
    };

    plugin(server as never);

    const listen = handlers.get('listen');
    expect(listen).to.be.a('function');

    const ctx = createCtxStub({
      config: { mcp: {} }
    });
    await listen!({ ctx });

    expect(ctx.registered.mcp).to.be.a('function');
    expect(ctx.events).to.deep.equal([
      'mcp-stdio',
      'mcp-http',
      'mcp-sse',
      'request'
    ]);
  });

  it('should attach the http request handler when mcp matches the main server', async () => {
    const handlers = new Map<string, Function[]>();
    const server: PluginServerStub = {
      config: {
        get() {
          return {};
        },
        has(key: string) {
          return key === 'mcp';
        }
      },
      on(event: string, listener: Function) {
        const list = handlers.get(event) || [];
        list.push(listener);
        handlers.set(event, list);
      }
    };

    plugin(server as never);

    const listen = handlers.get('listen')?.[0];
    const ctx = createCtxStub({
      config: {
        mcp: {},
        'mcp.tools': [{
          name: 'ping',
          title: 'Ping',
          event: 'ping',
          method: 'GET'
        }]
      },
      resolves: {
        ping: { results: { ok: true } }
      }
    });

    await listen!({ ctx });

    expect(ctx.events).to.deep.equal([
      'mcp-stdio',
      'mcp-http',
      'mcp-sse',
      'request'
    ]);
  });

  it('should attach the sse request handler when sse matches the main server', async () => {
    const handlers = new Map<string, Function[]>();
    const server: PluginServerStub = {
      config: {
        get() {
          return {};
        },
        has(key: string) {
          return key === 'mcp';
        }
      },
      on(event: string, listener: Function) {
        const list = handlers.get(event) || [];
        list.push(listener);
        handlers.set(event, list);
      }
    };

    plugin(server as never);

    const listen = handlers.get('listen')?.[0];
    const ctx = createCtxStub({
      config: {
        mcp: {},
        'mcp.tools': [{
          name: 'ping',
          title: 'Ping',
          event: 'ping',
          method: 'GET'
        }],
        'mcp.sse': {},
        'mcp.sse.route': '/sse'
      },
      resolves: {
        ping: { results: { ok: true } }
      }
    });

    await listen!({ ctx });

    expect(ctx.events).to.deep.equal([
      'mcp-stdio',
      'mcp-http',
      'mcp-sse',
      'request',
      'request'
    ]);
  });

  it('should return null when no tools are configured', async () => {
    const ctx = createCtxStub({
      config: { 'mcp.tools': [] }
    });
    const server = await createMcpServer(ctx as unknown as ToolResolverServer);

    expect(server).to.equal(null);
  });

  it('should register JSON-schema tools without throwing', async () => {
    const ctx = createCtxStub({
      config: {
        'mcp.tools': [{
          name: 'article_search',
          title: 'Search Articles',
          event: 'article-search',
          method: 'GET',
          input: {
            type: 'object',
            properties: {
              q: { type: 'string' }
            }
          },
          output: {
            type: 'array'
          }
        }]
      },
      resolves: {
        'article-search': { results: [] }
      }
    });

    const server = await createMcpServer(ctx as unknown as ToolResolverServer);
    expect(server).to.not.equal(null);
  });
});
