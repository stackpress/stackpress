import { describe, it } from 'mocha';
import { expect } from 'chai';
import http from 'node:http';

import { normalizeDesktopConfig } from '../src/config.js';
import { startDesktopRuntime } from '../src/runtime.js';

function request(port: number, path: string, method = 'GET') {
  return new Promise<{ statusCode?: number, body: string }>((resolve, reject) => {
    const req = http.request({
      host: '127.0.0.1',
      port,
      path,
      method
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

  it('should dispatch desktop menu events through the private runtime route', async () => {
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

    const actual = await request(
      runtime.port,
      '/__stackpress_desktop_event?event=blog%3Adesktop-latest',
      'POST'
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
