import { describe, it } from 'mocha';
import { expect } from 'chai';
import http from 'node:http';

import { normalizeDesktopConfig } from '../src/config.js';
import { startDesktopRuntime } from '../src/runtime.js';

type RequestOptions = {
  headers?: Record<string, string>;
  method?: string;
};

function request(
  port: number,
  path: string,
  options: RequestOptions = {}
) {
  return new Promise<{ statusCode?: number, body: string }>((resolve, reject) => {
    const req = http.request({
      host: '127.0.0.1',
      port,
      path,
      method: options.method || 'GET',
      headers: options.headers
    }, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

describe('desktop/runtime route guard', () => {
  it('should return a clear safe result for direct blocked-route access', async () => {
    const service = http.createServer((_req, res) => {
      res.statusCode = 200;
      res.end('app route');
    });
    const runtime = await startDesktopRuntime({
      create: () => service
    }, normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      routes: [{ route: '/' }]
    }));

    const actual = await request(runtime.port, '/admin');

    expect(actual.statusCode).to.equal(404);
    expect(JSON.parse(actual.body)).to.deep.equal({
      code: 404,
      status: 'Not Found',
      error: 'Desktop route unavailable: GET /admin'
    });
    await runtime.close();
  });

  it('should pass allowed direct access through to the Stackpress service', async () => {
    const service = http.createServer((_req, res) => {
      res.statusCode = 200;
      res.end('app route');
    });
    const runtime = await startDesktopRuntime({
      create: () => service
    }, normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      routes: [{ route: '/' }]
    }));

    const actual = await request(runtime.port, '/');

    expect(actual).to.deep.equal({
      statusCode: 200,
      body: 'app route'
    });
    await runtime.close();
  });

  it('should reject desktop menu event requests with the wrong method', async () => {
    const service = http.createServer((_req, res) => {
      res.statusCode = 200;
      res.end('app route');
    });
    const dispatched: string[] = [];
    const runtime = await startDesktopRuntime({
      create: () => service,
      async resolve(event: string) {
        dispatched.push(event);
        return { code: 200, status: 'OK' };
      }
    }, normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      routes: [{ route: '/' }]
    }));
    runtime.allowDesktopEvents([ 'blog:desktop-latest' ]);

    const actual = await request(
      runtime.port,
      '/__stackpress_desktop_event?event=blog%3Adesktop-latest',
      {
        headers: {
          'X-Stackpress-Desktop-Event-Token': runtime.desktopEventToken
        }
      }
    );

    expect(actual.statusCode).to.equal(405);
    expect(JSON.parse(actual.body)).to.deep.equal({
      code: 405,
      status: 'Method Not Allowed',
      error: 'Desktop menu events require POST.'
    });
    expect(dispatched).to.deep.equal([]);
    await runtime.close();
  });

  it('should reject desktop menu events with an unauthorized token', async () => {
    const service = http.createServer((_req, res) => {
      res.statusCode = 200;
      res.end('app route');
    });
    const dispatched: string[] = [];
    const runtime = await startDesktopRuntime({
      create: () => service,
      async resolve(event: string) {
        dispatched.push(event);
        return { code: 200, status: 'OK' };
      }
    }, normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      routes: [{ route: '/' }]
    }));
    runtime.allowDesktopEvents([ 'blog:desktop-latest' ]);

    const actual = await request(
      runtime.port,
      '/__stackpress_desktop_event?event=blog%3Adesktop-latest',
      {
        method: 'POST',
        headers: { 'X-Stackpress-Desktop-Event-Token': 'wrong-token' }
      }
    );

    expect(actual.statusCode).to.equal(401);
    expect(JSON.parse(actual.body)).to.deep.equal({
      code: 401,
      status: 'Unauthorized',
      error: 'Desktop menu event authorization failed.'
    });
    expect(dispatched).to.deep.equal([]);
    await runtime.close();
  });

  it('should reject desktop menu events outside the session allowlist', async () => {
    const service = http.createServer((_req, res) => {
      res.statusCode = 200;
      res.end('app route');
    });
    const dispatched: string[] = [];
    const runtime = await startDesktopRuntime({
      create: () => service,
      async resolve(event: string) {
        dispatched.push(event);
        return { code: 200, status: 'OK' };
      }
    }, normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      routes: [{ route: '/' }]
    }));
    runtime.allowDesktopEvents([ 'blog:desktop-latest' ]);

    const actual = await request(
      runtime.port,
      '/__stackpress_desktop_event?event=blog%3Adelete-all',
      {
        method: 'POST',
        headers: {
          'X-Stackpress-Desktop-Event-Token': runtime.desktopEventToken
        }
      }
    );

    expect(actual.statusCode).to.equal(403);
    expect(JSON.parse(actual.body)).to.deep.equal({
      code: 403,
      status: 'Forbidden',
      error: 'Desktop menu event is not registered for this session.'
    });
    expect(dispatched).to.deep.equal([]);
    await runtime.close();
  });

  it('should dispatch authorized desktop menu events from the allowlist', async () => {
    const service = http.createServer((_req, res) => {
      res.statusCode = 200;
      res.end('app route');
    });
    const dispatched: string[] = [];
    const runtime = await startDesktopRuntime({
      create: () => service,
      async resolve(event: string) {
        dispatched.push(event);
        return {
          code: 200,
          status: 'OK',
          results: { handled: true }
        };
      }
    }, normalizeDesktopConfig({
      app: { id: 'io.stackpress.blog', name: 'Blog', version: '1.0.0' },
      routes: [{ route: '/' }]
    }));
    runtime.allowDesktopEvents([ 'blog:desktop-latest' ]);

    const actual = await request(
      runtime.port,
      '/__stackpress_desktop_event?event=blog%3Adesktop-latest',
      {
        method: 'POST',
        headers: {
          'X-Stackpress-Desktop-Event-Token': runtime.desktopEventToken
        }
      }
    );

    expect(actual.statusCode).to.equal(200);
    expect(JSON.parse(actual.body)).to.deep.equal({
      code: 200,
      status: 'OK',
      results: { handled: true }
    });
    expect(dispatched).to.deep.equal([ 'blog:desktop-latest' ]);
    await runtime.close();
  });
});
