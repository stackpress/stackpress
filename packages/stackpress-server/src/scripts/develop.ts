//node
import type { ChildProcess, ForkOptions } from 'node:child_process';
import type { ChokidarOptions, FSWatcher } from 'chokidar';
import { fork } from 'node:child_process';
import path from 'node:path';
//modules
import { watch as watchFiles } from 'chokidar';
//stackpress
import type Terminal from '../Terminal.js';
import type { DevelopmentConfig } from '../types.js';
import {
  DEVELOPMENT_ERROR,
  DEVELOPMENT_READY,
  DEVELOPMENT_SHUTDOWN
} from './development-messages.js';

export type Promiser<T = void> = {
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: unknown) => void
};

//child-process factory used by the supervisor and its unit tests
export type DevelopmentSpawner = (
  modulePath: string,
  args: string[],
  options: ForkOptions
) => ChildProcess;

//watcher factory used by the supervisor and its unit tests
export type DevelopmentWatcher = (
  paths: string|string[],
  options: ChokidarOptions
) => FSWatcher;

//replaceable boundaries and timing used by the development supervisor
export type DevelopmentOptions = {
  spawn: DevelopmentSpawner,
  watch: DevelopmentWatcher
};

//backend paths that should never trigger application restarts
const DEFAULT_IGNORES = [
  /(^|[/\\])\.build([/\\]|$)/,
  /(^|[/\\])\.git([/\\]|$)/,
  /(^|[/\\])\.reactus([/\\]|$)/,
  /(^|[/\\])client_source([/\\]|$)/,
  /(^|[/\\])coverage([/\\]|$)/,
  /(^|[/\\])node_modules([/\\]|$)/
];

/**
 * Manages the replaceable backend process and its filesystem watcher.
 */
export class DevelopmentServer {
  //server terminal that provides CLI arguments, config, and output
  public readonly terminal: Terminal;
  //handler shared by terminal shutdown signals
  public readonly shutdown: () => Promise<void>;
  //child process factory
  protected _spawn: DevelopmentSpawner;
  //watcher factory
  protected _watch: DevelopmentWatcher;
  //resolvers passed from the main development command
  protected _promiser: Promiser<void>;
  //active backend child process
  protected _child: ChildProcess|null = null;
  //active application file watcher
  protected _watcher: FSWatcher|null = null;
  //timer that coalesces related filesystem events
  protected _restartTimer: ReturnType<typeof setTimeout>|null = null;
  //current restart operation shared by concurrent callers
  protected _restartPromise: Promise<ChildProcess>|null = null;
  //records a change that arrived while a restart was running
  protected _restartQueued = false;
  //prevents duplicate shutdown work
  protected _exiting = false;
  //logging utility controlled by terminal verbosity
  protected _log: {
    system: (message: string) => void,
    warning: (message: string) => void,
    error: (message: string) => void,
    success: (message: string) => void
  };

  /**
   * Initializes the development supervisor and its replaceable boundaries.
   */
  public constructor(
    terminal: Terminal,
    promiser: Promiser<void>,
    options: Partial<DevelopmentOptions> = {}
  ) {
    this.terminal = terminal;
    this._promiser = promiser;
    this._spawn = options.spawn || fork;
    this._watch = options.watch || watchFiles;
    this._log = {
      system: message => {
        terminal.verbose && terminal.control.system(message);
      },
      warning: message => {
        terminal.verbose && terminal.control.warning(message);
      },
      error: message => {
        terminal.verbose && terminal.control.error(message);
      },
      success: message => {
        terminal.verbose && terminal.control.success(message);
      }
    };
    this.shutdown = async () => {
      if (this._exiting) return;
      this._exiting = true;
      this._log.system('Shutting down...');
      //stop a pending restart before it launches another child
      if (this._restartTimer) {
        clearTimeout(this._restartTimer);
        this._restartTimer = null;
      }
      //stop receiving new filesystem events
      if (this._watcher) {
        await this._watcher.close();
        this._watcher = null;
      }
      //ask the active child to release HTTP and Vite resources
      if (this._child) {
        try {
          await this.close();
        } catch (error) {
          this._log.warning(
            `⚠️ Failed to shutdown child: ${String(error)}`
          );
        }
      }
      this._log.success('✅ Server shutdown complete.');
      this._promiser.resolve();
    };
  }

  /**
   * Gracefully closes the active backend child with a forced fallback.
   */
  public close() {
    const child = this._child;
    if (!child) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      //force the exact child process down if graceful cleanup stalls
      const force = () => {
        this._log.warning(
          `⚠️ Process didn't exit gracefully, force killing...`
        );
        child.kill('SIGKILL');
      };
      const timeout = setTimeout(force, 5000);
      child.once('exit', () => {
        clearTimeout(timeout);
        if (this._child === child) this._child = null;
        resolve();
      });
      child.once('error', error => {
        clearTimeout(timeout);
        force();
        reject(error);
      });
      //use IPC first so the child can close Vite and HTTP deliberately
      if (child.connected) {
        child.send({ type: DEVELOPMENT_SHUTDOWN }, error => {
          if (error) child.kill('SIGTERM');
        });
      } else {
        child.kill('SIGTERM');
      }
    });
  }

  /**
   * Restarts the backend and preserves changes received during replacement.
   */
  public restart(): Promise<ChildProcess> {
    //queue one more pass when a restart is already underway
    if (this._restartPromise) {
      this._restartQueued = true;
      return this._restartPromise;
    }
    this._restartPromise = this._restart().finally(() => {
      this._restartPromise = null;
    });
    return this._restartPromise;
  }

  /**
   * Starts the backend directly and waits for its listening notification.
   */
  public start() {
    const entrypoint = process.argv[1];
    if (!entrypoint) {
      return Promise.reject(new Error('Stackpress CLI entrypoint is missing.'));
    }
    const config = this._config();
    const child = this._spawn(
      entrypoint,
      [ 'serve', ...this.terminal.args ],
      {
        cwd: this.terminal.cwd,
        env: { ...process.env },
        execArgv: process.execArgv,
        execPath: process.execPath,
        stdio: [ 'inherit', 'inherit', 'inherit', 'ipc' ]
      }
    );
    this._child = child;
    return new Promise<ChildProcess>((resolve, reject) => {
      let ready = false;
      //clear startup listeners without removing the lifecycle exit listener
      const cleanup = () => {
        clearTimeout(timeout);
        child.off('message', onMessage);
      };
      const onError = (error: Error) => {
        if (!ready) {
          cleanup();
          reject(error);
        } else if (!this._restartPromise && !this._exiting) {
          this._abort(error);
        }
      };
      const onMessage = (message: unknown) => {
        if (!message
          || typeof message !== 'object'
          || !('type' in message)
        ) return;
        if (message.type === DEVELOPMENT_ERROR) {
          cleanup();
          child.kill('SIGTERM');
          const detail = 'message' in message
            ? String(message.message)
            : 'Stackpress server failed to start.';
          reject(new Error(detail));
          return;
        }
        if (message.type !== DEVELOPMENT_READY) return;
        ready = true;
        cleanup();
        resolve(child);
      };
      const timeout = setTimeout(() => {
        cleanup();
        child.kill('SIGTERM');
        reject(new Error(
          `Stackpress server was not ready within ${config.timeout}ms.`
        ));
      }, config.timeout);
      child.once('error', onError);
      child.on('message', onMessage);
      child.once('exit', code => {
        if (this._child === child) this._child = null;
        if (!ready) {
          cleanup();
          reject(new Error(
            `Stackpress server exited before ready with code ${code}.`
          ));
        } else if (!this._restartPromise && !this._exiting) {
          this._abort(new Error(
            `Stackpress server exited unexpectedly with code ${code}.`
          ));
        }
      });
    });
  }

  /**
   * Watches configured backend files and schedules coalesced restarts.
   */
  public async watch() {
    const config = this._config();
    this._watcher = this._watch(config.watch, {
      cwd: this.terminal.cwd,
      followSymlinks: true,
      ignored: [ ...DEFAULT_IGNORES, ...config.ignore ],
      ignoreInitial: true
    });
    this._watcher.on('all', (event, filepath) => {
      if (![ 'add', 'change', 'unlink' ].includes(event)) return;
      if (!config.extensions.includes(path.extname(filepath))) return;
      this._log.system(`📁 ${event}: ${filepath}`);
      this._scheduleRestart(config.debounce);
    });
    return this._watcher;
  }

  /**
   * Resolves development defaults against application configuration.
   */
  protected _config(): Required<DevelopmentConfig> {
    const configured = this.terminal.server.config
      .path<DevelopmentConfig>('server.develop', {});
    return {
      debounce: configured.debounce ?? 100,
      extensions: configured.extensions ?? [ '.ts' ],
      ignore: configured.ignore ?? [],
      timeout: configured.timeout ?? 10000,
      watch: configured.watch ?? [ '.' ]
    };
  }

  /**
   * Stops supervision after an unrecoverable child or replacement failure.
   */
  protected async _abort(error: unknown) {
    if (this._exiting) return;
    this._exiting = true;
    if (this._restartTimer) {
      clearTimeout(this._restartTimer);
      this._restartTimer = null;
    }
    if (this._watcher) {
      await this._watcher.close();
      this._watcher = null;
    }
    this._promiser.reject(error);
  }

  /**
   * Performs one or more backend replacements until queued changes settle.
   */
  protected async _restart() {
    let child: ChildProcess|null = this._child;
    do {
      this._restartQueued = false;
      if (child) await this.close();
      child = await this.start();
      this._log.success('✅ Server restarted.');
    } while (this._restartQueued && !this._exiting);
    return child;
  }

  /**
   * Debounces related filesystem events into one backend replacement.
   */
  protected _scheduleRestart(debounce: number) {
    if (this._restartTimer) clearTimeout(this._restartTimer);
    this._restartTimer = setTimeout(() => {
      this._restartTimer = null;
      this.restart().catch(error => {
        this._log.error(`Failed to restart server: ${String(error)}`);
        this._abort(error);
      });
    }, debounce);
  }
};

/**
 * Starts the development supervisor and keeps the command active.
 */
export default function develop(terminal: Terminal) {
  return new Promise<void>((resolve, reject) => {
    const server = new DevelopmentServer(terminal, { resolve, reject });
    process.once('SIGINT', server.shutdown);
    process.once('SIGTERM', server.shutdown);
    server.start()
      .then(() => server.watch())
      .catch(error => {
        server.close().finally(() => reject(error));
      });
  });
}
