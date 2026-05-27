//tests
import { expect } from 'chai';
import { describe, it } from 'mocha';
//src
import Terminal from '../src/Terminal.js';

describe('server/Terminal', () => {
  it('should register itself and read terminal config from the server', () => {
    let registered: { name: string, plugin: Terminal }|null = null;
    const server = {
      loader: { cwd: '/workspace/app' },
      config: {
        path(key: string, fallback: string) {
          return key === 'terminal.label' ? 'Stackpress' : fallback;
        }
      },
      register(name: string, plugin: Terminal) {
        registered = { name, plugin };
      }
    };

    const terminal = new Terminal(
      [ 'emit', '-v' ],
      server as any
    );

    expect(terminal.server).to.equal(server);
    expect(terminal.verbose).to.equal(true);
    expect(terminal.config).to.equal(null);
    expect(terminal.brand).to.equal('Stackpress');
    expect(terminal.cwd).to.equal('/workspace/app');
    expect(registered).to.deep.equal({
      name: 'terminal',
      plugin: terminal
    });
  });

  it('should bootstrap the server in the expected order', async () => {
    const calls: string[] = [];
    const server = {
      loader: { cwd: '/workspace/app' },
      config: {
        path(_key: string, fallback: string) {
          return fallback;
        }
      },
      register() {},
      async bootstrap() {
        calls.push('bootstrap');
      },
      async resolve(event: string) {
        calls.push(event);
      }
    };

    const terminal = new Terminal([ 'serve' ], server as any);
    const result = await terminal.bootstrap();

    expect(result).to.equal(terminal);
    expect(calls).to.deep.equal([ 'bootstrap', 'config', 'listen', 'route' ]);
  });

  it('should emit the terminal command with a terminal mimetype', async () => {
    const requests: Array<Record<string, unknown>> = [];
    const emits: Array<{ event: string, request: unknown, response: unknown }> = [];
    const response = { id: 'response' };
    const status = { code: 200 };
    const server = {
      loader: { cwd: '/workspace/app' },
      config: {
        path(_key: string, fallback: string) {
          return fallback;
        }
      },
      register() {},
      request(payload: Record<string, unknown>) {
        requests.push(payload);
        return { payload };
      },
      response() {
        return response;
      },
      async emit(event: string, request: unknown, res: unknown) {
        emits.push({ event, request, response: res });
        return status;
      }
    };

    const terminal = new Terminal([ 'emit', '--foo', 'bar' ], server as any);
    const result = await terminal.run();

    expect(result).to.equal(status);
    expect(requests).to.have.length(1);
    expect(requests[0]).to.include({ mimetype: 'terminal/arguments' });
    expect(requests[0].data).to.deep.equal({ foo: 'bar' });
    expect(emits).to.deep.equal([{
      event: 'emit',
      request: { payload: requests[0] },
      response
    }]);
  });

  it('should send handled command errors through the error event', async () => {
    const messages: string[] = [];
    const emitted: string[] = [];
    const originalError = new Error('Boom');
    let savedError: unknown = null;
    const response = {
      setError(error: unknown) {
        savedError = error;
      }
    };
    const server = {
      loader: { cwd: '/workspace/app' },
      config: {
        path(key: string, fallback: string) {
          return key === 'terminal.label' ? 'Stackpress' : fallback;
        }
      },
      register() {},
      request(payload: Record<string, unknown>) {
        return { payload };
      },
      response() {
        return response;
      },
      async emit(event: string) {
        emitted.push(event);
        if (event === 'emit') {
          throw originalError;
        }
        return { code: 200 };
      }
    };

    const terminal = new Terminal([ 'emit', '-v' ], server as any);
    (terminal as any)._control.error = (message: string) => messages.push(message);
    const status = await terminal.run();

    expect(status).to.deep.equal({ code: 200 });
    expect(emitted).to.deep.equal([ 'emit', 'error' ]);
    expect(savedError).to.be.an('object');
    expect((savedError as { error?: string }).error).to.equal('Boom');
    expect(messages).to.deep.equal([]);
  });

  it('should show missing command errors for verbose unknown commands', async () => {
    const messages: string[] = [];
    const server = {
      loader: { cwd: '/workspace/app' },
      config: {
        path(_key: string, fallback: string) {
          return fallback;
        }
      },
      register() {},
      request(payload: Record<string, unknown>) {
        return { payload };
      },
      response() {
        return {};
      },
      async emit() {
        return { code: 404 };
      }
    };

    const terminal = new Terminal([ 'unknown', '-v' ], server as any);
    (terminal as any)._control.error = (message: string) => messages.push(message);
    const status = await terminal.run();

    expect(status).to.deep.equal({ code: 404 });
    expect(messages).to.deep.equal([ 'Command "unknown" not found.' ]);
  });
});
