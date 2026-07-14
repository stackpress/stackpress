//node
import type { ChildProcess, ForkOptions } from 'node:child_process';
import type { FSWatcher } from 'chokidar';
import { EventEmitter } from 'node:events';
//modules
import { expect } from 'chai';
import { describe, it } from 'mocha';
//src
import type Terminal from '../src/Terminal.js';
import { DevelopmentServer } from '../src/scripts/develop.js';
import {
  DEVELOPMENT_ERROR,
  DEVELOPMENT_READY
} from '../src/scripts/development-messages.js';

/**
 * Creates the observable child-process surface needed by supervisor tests.
 */
function makeChild() {
  const child = new EventEmitter() as EventEmitter & {
    connected: boolean,
    kill: (signal?: NodeJS.Signals|number) => boolean,
    send: (
      message: unknown,
      callback?: (error: Error|null) => void
    ) => boolean
  };
  child.connected = true;
  child.kill = () => true;
  child.send = (_message, callback) => {
    callback?.(null);
    return true;
  };
  return child as unknown as ChildProcess;
}

/**
 * Creates a terminal with development configuration overrides.
 */
function makeTerminal(develop: Record<string, unknown> = {}) {
  return {
    args: [ '--b', 'config/develop' ],
    cwd: '/workspace/app',
    verbose: false,
    control: {
      error() {},
      success() {},
      system() {},
      warning() {}
    },
    server: {
      config: {
        path(_key: string, fallback: Record<string, unknown>) {
          return { ...fallback, ...develop };
        }
      }
    }
  } as unknown as Terminal;
}

describe('server/develop', () => {
  it('should start the CLI directly and wait for HTTP readiness', async () => {
    const child = makeChild();
    let spawned: {
      modulePath: string,
      args: string[],
      options: ForkOptions
    }|null = null;
    const server = new DevelopmentServer(
      makeTerminal(),
      { resolve() {}, reject() {} },
      {
        spawn(modulePath, args, options) {
          spawned = { modulePath, args, options };
          return child;
        }
      }
    );

    //the promise must remain pending until the child owns the HTTP port
    let resolved = false;
    const starting = server.start().then(result => {
      resolved = true;
      return result;
    });
    await Promise.resolve();
    expect(resolved).to.equal(false);

    //simulate the listening notification sent by the serve process
    child.emit('message', { type: DEVELOPMENT_READY });
    expect(await starting).to.equal(child);
    expect(spawned).to.not.equal(null);
    expect(spawned!.args).to.deep.equal([
      'serve',
      '--b',
      'config/develop'
    ]);
    expect(spawned!.options.stdio).to.deep.equal([
      'inherit',
      'inherit',
      'inherit',
      'ipc'
    ]);
    expect(spawned!.options).to.not.have.property('shell');
  });

  it('should debounce backend events and ignore frontend extensions', async () => {
    const watcher = new EventEmitter() as EventEmitter & {
      close: () => Promise<void>
    };
    watcher.close = async () => undefined;
    const child = makeChild();
    let restarts = 0;
    const server = new DevelopmentServer(
      makeTerminal({ debounce: 5 }),
      { resolve() {}, reject() {} },
      { watch: () => watcher as unknown as FSWatcher }
    );
    server.restart = async () => {
      restarts++;
      return child;
    };

    await server.watch();
    watcher.emit('all', 'change', 'plugins/app/pages/home.ts');
    watcher.emit('all', 'change', 'plugins/app/pages/account.ts');
    watcher.emit('all', 'change', 'plugins/app/views/home.tsx');
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(restarts).to.equal(1);
    await watcher.close();
  });

  it('should reject immediately when the child reports a bind error', async () => {
    const child = makeChild();
    const server = new DevelopmentServer(
      makeTerminal(),
      { resolve() {}, reject() {} },
      { spawn: () => child }
    );

    const starting = server.start();
    child.emit('message', {
      type: DEVELOPMENT_ERROR,
      message: 'Address already in use'
    });

    try {
      await starting;
      expect.fail('Expected startup to reject.');
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      expect((error as Error).message).to.equal('Address already in use');
    }
  });

  it('should run one queued replacement after an active restart', async () => {
    const firstChild = makeChild();
    const secondChild = makeChild();
    let releaseFirst: ((child: ChildProcess) => void)|null = null;
    let starts = 0;
    let closes = 0;
    const server = new DevelopmentServer(
      makeTerminal(),
      { resolve() {}, reject() {} }
    );
    server.start = () => {
      starts++;
      if (starts === 1) {
        return new Promise(resolve => {
          releaseFirst = resolve;
        });
      }
      return Promise.resolve(secondChild);
    };
    server.close = async () => {
      closes++;
    };

    //the second request lands while the first replacement is starting
    const first = server.restart();
    const second = server.restart();
    expect(first).to.equal(second);
    releaseFirst!(firstChild);

    expect(await first).to.equal(secondChild);
    expect(starts).to.equal(2);
    expect(closes).to.equal(1);
  });
});
