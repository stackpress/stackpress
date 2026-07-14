//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
//src
import serve from '../src/events/serve.js';

describe('serve event', () => {
  it('should default to 127.0.0.1 and log host:port', async () => {
    const messages: string[] = [];
    const listens: Array<[number, string]> = [];
    const handlers: Record<string, (() => void) | undefined> = {};
    const terminal = {
      verbose: true,
      control: {
        system: (message: string) => messages.push(message),
        error: (_message: string) => undefined,
        success: (_message: string) => undefined
      }
    };
    const service = {
      listen: (port: number, host: string, ready: () => void) => {
        listens.push([ port, host ]);
        ready();
      },
      on: (event: string, handler: () => void) => {
        handlers[event] = handler;
        return service;
      }
    };
    const ctx = {
      plugin: (name: string) => {
        expect(name).to.equal('terminal');
        return terminal;
      },
      config: {
        path: (key: string, fallback: string|number) => {
          if (key === 'server.port') return 3000;
          return fallback;
        }
      },
      create: () => service
    };
    const res = {
      code: 0,
      statusCode: (_code: number) => undefined
    };

    await serve({ res, ctx } as any);

    expect(listens).to.deep.equal([[ 3000, '127.0.0.1' ]]);
    expect(messages).to.include('Server is running on 127.0.0.1:3000');
    expect(messages).to.include('------------------------------');
    expect(handlers.error).to.be.a('function');
    expect(handlers.close).to.be.a('function');
  });

  it('should use server.host when configured', async () => {
    const listens: Array<[number, string]> = [];
    const terminal = {
      verbose: false,
      control: {
        system: (_message: string) => undefined,
        error: (_message: string) => undefined,
        success: (_message: string) => undefined
      }
    };
    const service = {
      listen: (port: number, host: string, ready: () => void) => {
        listens.push([ port, host ]);
        ready();
      },
      on: (_event: string, _handler: () => void) => service
    };
    const ctx = {
      plugin: () => terminal,
      config: {
        path: (key: string, fallback: string|number) => {
          if (key === 'server.port') return 4321;
          if (key === 'server.host') return '0.0.0.0';
          return fallback;
        }
      },
      create: () => service
    };
    const res = {
      code: 0,
      statusCode: (_code: number) => undefined
    };

    await serve({ res, ctx } as any);

    expect(listens).to.deep.equal([[ 4321, '0.0.0.0' ]]);
  });
});
