//node
import { EventEmitter } from 'node:events';
import type { IncomingHttpHeaders } from 'node:http';
//modules
import { expect } from 'chai';
//client
import type { ToolResolverServer } from '../src/types.js';

//this test-local stub type extends the runtime server with assertion helpers
// that tests use to inspect registrations and emitted events.
type CtxStub = ToolResolverServer & {
  events: string[],
  registered: Record<string, unknown>
};

//this option shape keeps each stub focused on the config and resolve data one
// test actually needs.
type StubOptions = {
  config?: Record<string, unknown>;
  resolves?: Record<string, { results?: unknown }>;
  application?: Record<string, unknown>;
  session?: Record<string, unknown>;
};

/**
 * Create one lightweight ToolResolverServer test double.
 */
export function createCtxStub(options: StubOptions = {}) {
  const {
    config = {},
    resolves = {},
    application,
    session
  } = options;

  const stub = {
    config: {
      //mirror the plugin guard API so tests can enable or disable mcp cleanly
      has(key: string) {
        return key in config;
      },
      get<T = unknown>(key: string) {
        return (key in config ? config[key] : undefined) as T;
      },
      path<T>(key: string, fallback?: T) {
        if (key in config) {
          return config[key] as T;
        }
        return fallback as T;
      }
    },
    events: [] as string[],
    registered: {} as Record<string, unknown>,
    on(event: string) {
      stub.events.push(event);
    },
    plugin<T = unknown>(name: string) {
      return stub.registered[name] as T;
    },
    register(name: string, value: unknown) {
      stub.registered[name] = value;
    },
    async resolve<T = unknown>(event: string) {
      if (event === 'application-detail' && application) {
        return { results: application } as { results: T };
      }

      if (event === 'session-detail' && session) {
        return { results: session } as { results: T };
      }

      return (resolves[event] || null) as { results: T } | null;
    }
  };

  return stub as unknown as CtxStub;
}

/**
 * Parse one JSON response body and assert that it was not empty.
 */
export function expectJson<T>(body: string) {
  expect(body).to.not.equal('');
  return JSON.parse(body) as T;
}

/**
 * Read one header value from either Fetch or Node-style header containers.
 */
export function header(
  headers: Headers | IncomingHttpHeaders | Record<string, string>,
  name: string
) {
  const key = name.toLowerCase();
  if (headers instanceof Headers) {
    return headers.get(name);
  }
  const value = headers[key] ?? headers[name];
  return Array.isArray(value) ? value[0] : value ?? null;
}

/**
 * Create one minimal async-iterable request object for transport tests.
 */
export function createMockRequest(options: {
  method?: string;
  url?: string;
  headers?: IncomingHttpHeaders;
  body?: string;
} = {}) {
  const {
    method = 'GET',
    url = '/',
    headers = {},
    body = ''
  } = options;

  return {
    method,
    url,
    headers,
    async *[Symbol.asyncIterator]() {
      if (body.length) {
        yield Buffer.from(body);
      }
    }
  };
}

/**
 * This response double captures status, headers, and body for transport tests.
 */
export class MockResponse extends EventEmitter {
  //this body buffer stores the final response payload for assertions
  public statusCode = 200;
  //this flag mirrors the Node response state after end() is called
  public headersSent = false;
  //this string buffer accumulates every body chunk written by tests
  public body = '';
  //this header map lets tests inspect normalized response headers
  public readonly headers = new Map<string, string>();

  /**
   * Store one response header using a lowercased lookup key.
   */
  public setHeader(name: string, value: string) {
    this.headers.set(name.toLowerCase(), value);
  }

  /**
   * Finish the response and emit the close event for cleanup hooks.
   */
  public end(body = '') {
    this.headersSent = true;
    this.body += body;
    this.emit('close');
    return this;
  }
}
