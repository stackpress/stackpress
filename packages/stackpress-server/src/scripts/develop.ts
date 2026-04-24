//node
import type { FSWatcher } from 'chokidar';
import { ChildProcess, spawn } from 'node:child_process';
//stackpress
import type Terminal from '../Terminal.js';

export type Promiser<T = void> = {
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void
};

/**
 * DevelopmentServer class manages a child process that runs the 
 * development server and a file watcher that restarts the server on 
 * changes. 
 */
export class DevelopmentServer {
  //server terminal (gives access to the cli)
  public readonly terminal: Terminal;
  //handler for shutdown signals
  public readonly shutdown: () => Promise<void>;
  //resolvers passed from the main script
  protected _promiser: Promiser<void>;
  //child process for the server
  protected _child: ChildProcess|null = null;
  //file watcher for restarting on changes
  protected _watcher: FSWatcher|null = null;
  //flags to prevent multiple simultaneous restarts or shutdowns
  protected _restarting = false;
  //flag to indicate if the server is exiting
  protected _exiting = false;
  //logging utility to conditionally log based on terminal verbosity
  protected _log: {
    system: (message: string) => void,
    warning: (message: string) => void,
    error: (message: string) => void,
    success: (message: string) => void
  };

  /**
   * Initializes the development server with the given terminal 
   * and promiser.
   */
  public constructor(terminal: Terminal, promiser: Promiser<void>) {
    this.terminal = terminal;
    this._promiser = promiser;
    this._log = {
      system(message: string) {
        terminal.verbose && terminal.control.system(message);
      },
      warning(message: string) {
        terminal.verbose && terminal.control.warning(message);
      },
      error(message: string) {
        terminal.verbose && terminal.control.error(message);
      },
      success(message: string) {
        terminal.verbose && terminal.control.success(message);
      }
    };
    this.shutdown = async () => {
      if (this._exiting) return;
      this._exiting = true;
      this._log.system('Shutting down...');
      //if the watcher is active
      if (this._watcher) {
        //close it first
        await this._watcher.close();
        this._watcher = null;
      }
      //next shutdown the child process
      if (this._child) {
        try {
          await this.close();
        } catch (e) {
          this._log.warning(`⚠️ Failed to shutdown child: ${String(e)}`);
        }
      }
      this._log.success('✅ Server shutdown complete.');
      process.exit(0);
    }
  }

  /**
   * Starts the development server by spawning a child process that 
   * runs the serve command. Listens for errors and exit events to 
   * handle shutdowns gracefully.
   */
  public start() {
    const args = [ 'stackpress', 'serve', ...this.terminal.args ];
    this._child = spawn('npx', args, {
      cwd: this.terminal.cwd,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env }
    });
    this._child.once('error', error => {
      this._log.error(`Failed to start server: ${String(error)}`);
      this._promiser.reject(error);
    });
    this._child.once('exit', () => {
      if (!this._restarting && !this._exiting) {
        this.shutdown().then(() => this._promiser.resolve());
      }
    });

    return this._child;
  }

  /**
   * Watches the current directory for changes to .ts files and restarts 
   * the server when changes are detected. Uses chokidar for efficient 
   * file watching and handles added, changed, and removed files.
   */
  public async watch() {
    //lazy load chokidar to avoid unnecessary dependencies in production
    const chokidar = await import('chokidar').then(m => m.default || m);
    //watch the current directory for changes
    this._watcher = chokidar.watch('.', {
      ignored: [ /node_modules/, /\.build/ ],
      cwd: this.terminal.cwd,
      ignoreInitial: true,
      followSymlinks: true
    });
    this._watcher.on('change', async filepath => {
      if (!filepath.endsWith('.ts')) return;
      this._log.system(`📁 changed: ${filepath}`);
      await this.restart();
      this._log.success('✅ Server restarted...');
    });

    this._watcher.on('add', async filepath => {
      if (!filepath.endsWith('.ts')) return;
      this._log.system(`📁 added: ${filepath}`);
      await this.restart();
      this._log.success('✅ Server restarted...');
    });

    this._watcher.on('unlink', async filepath => {
      if (!filepath.endsWith('.ts')) return;
      this._log.system(`📁 removed: ${filepath}`);
      await this.restart();
      this._log.success('✅ Server restarted...');
    });

    return this._watcher;
  }

  /**
   * Restarts the development server by first shutting down the existing
   * child process (if it exists) and then starting a new one. Uses flags 
   * to prevent multiple simultaneous restarts and ensures that the 
   * server is restarted cleanly on file changes.
   */
  public restart() {
    return new Promise<ChildProcess>((resolve, reject) => {
      if (this._restarting) {
        resolve(this._child as ChildProcess);
        return;
      }

      this._restarting = true;

      const done = () => {
        this._child = this.start();
        this._restarting = false;
        resolve(this._child);
      };

      if (this._child) {
        this.close()
          .then(done)
          .catch(error => {
            this._restarting = false;
            reject(error);
          });
      } else {
        done();
      }
    });
  }

  /**
   * Closes the child process running the development server. Attempts 
   * to gracefully shut down the process by sending a SIGTERM signal and 
   * waiting for it to exit. If the process does not exit within a 
   * reasonable time, it forcefully kills the process with SIGKILL. 
   * Returns a promise that resolves when the process has exited or 
   * rejects if there is an error during shutdown.
   */
  public close() {
    const kill = () => {
      if (!this._child) return;
      this.terminal.verbose && this.terminal.control.warning(
        `⚠️  Process didn't exit gracefully, force killing...`
      );
      this._child.kill('SIGKILL');
    };
    return new Promise<void>((resolve, reject) => {
      if (!this._child) return resolve();
      const timeout = setTimeout(kill, 5000);
      this._child.once('exit', () => {
        clearTimeout(timeout);
        resolve();
      });
      this._child.once('error', error => {
        clearTimeout(timeout);
        kill();
        reject(error);
      });
      this._child.kill('SIGTERM');
    });
  }
};

/**
 * Main function that initializes the development server 
 * and file watcher.
 */
export default async function develop(terminal: Terminal) {
  //return a new promise, so it can purposely hang...
  return new Promise<void>(async (resolve, reject) => {
    //make a new development server
    const server = new DevelopmentServer(terminal, { resolve, reject });
    // Handle graceful shutdown
    process.once('SIGINT', server.shutdown);
    process.once('SIGTERM', server.shutdown);
    //start the server
    server.start();
    //start the watcher
    await server.watch();
  });
}
