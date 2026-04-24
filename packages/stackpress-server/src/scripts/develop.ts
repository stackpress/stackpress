//node
import path from 'node:path';
import { ChildProcess, spawn } from 'node:child_process';
//modules
import type Server from '@stackpress/ingest/Server';
//stackpress-server
import type { TerminalPlugin } from '../types.js';
import type Terminal from '../Terminal.js';

let child: ChildProcess | null = null;
let restarting = false;

export default function develop(
  terminal: TerminalPlugin, 
  server: Server<any, any, any>,
  port: number,
  CHILD_ENV: string
) {
  const isChild = process.env[CHILD_ENV] === '1';
  const shutdownAndExit = async () => {
    //shutdown the child process first
    if (!isChild && child) {
      try {
        await shutdown(child, terminal);
      } catch (err) {
        terminal.control.warning(`⚠️ Failed to shutdown child: ${String(err)}`);
      }
    }
    terminal.control.success('Server shutdown complete.');
    process.exit(0);
  };
  
  const service = server.create();
  service.on('error', err => {
    terminal?.verbose && terminal.control.error((err as Error).message);
  });
  service.on('close', () => {
    terminal?.verbose && terminal.control.success('Server Exited.');
  });

  //handle graceful shutdown
  process.once('SIGINT', shutdownAndExit);
  process.once('SIGTERM', shutdownAndExit);

  //only the parent spawns the child and watches for restarts
  if (!isChild) {
    terminal?.verbose && terminal.control.system(`Server is running on port ${port}`);
    terminal?.verbose && terminal.control.system('------------------------------');
    child = start(terminal);
    watch(terminal);
  } else {
    //only the child listens on the port
    service.listen(port);
  }
}

export function start(terminal: Terminal) {
  const { server } = terminal;
  const cwd = server.config.path('server.cwd', process.cwd());
  const CHILD_ENV = server.config.path('server.process', 'STACKPRESS_CHILD');
  const command = path.join(cwd, 'node_modules', '.bin', 'stackpress');
  //pass through CLI args, e.g. `develop --b config/develop -v`
  const args = process.argv.slice(2);
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      [CHILD_ENV]: '1'
    }
  });
  
  child.on('error', err => {
    console.error(err);
  });

  child.on('exit', code => {
    if (!restarting) {
      terminal.control.success(`Exited with code ${code}`);
    }
  });

  return child;
};

export async function watch(terminal: Terminal) {
  const cwd = terminal.server.config.path('server.cwd', process.cwd());
  //lazy load chokidar
  const chokidar = await import('chokidar').then(module => module.default);
  //watch the current directory for changes
  const watcher = chokidar.watch(cwd, {
    ignored: [  /node_modules/, /\.build/ ],
    cwd,
    ignoreInitial: true,
    followSymlinks: true
  });

  watcher.on('change', async filepath => {
    if (!filepath.endsWith('.ts')) return;
    terminal.control.system(`📁 changed: ${filepath}`);
    await restart(terminal);
    terminal.control.success(`✅ Server restarted...`);
  });

  watcher.on('add', async filepath => {
    if (!filepath.endsWith('.ts')) return;
    terminal.control.system(`📁 added: ${filepath}`);
    await restart(terminal);
    terminal.control.success('✅ Server restarted...');
  });

  watcher.on('unlink', async filepath => {
    if (!filepath.endsWith('.ts')) return;
    terminal.control.system(`📁 removed: ${filepath}`);
    await restart(terminal);
    terminal.control.success('✅ Server restarted...');
  });
}

export function restart(terminal: Terminal) {
  if (restarting) return Promise.resolve(child as ChildProcess);
  restarting = true;

  return new Promise<ChildProcess>((resolve, reject) => {
    const startNew = () => {
      child = start(terminal);
      restarting = false;
      resolve(child);
    };

    if (child) {
      shutdown(child, terminal)
        .then(startNew)
        .catch(err => {
          restarting = false;
          reject(err);
        });
    } else {
      startNew();
    }
  });
};

export function shutdown(current: ChildProcess, terminal: Terminal) {
  const forceKill = () => {
    terminal.control.warning(`⚠️ Process didn't exit gracefully, force killing...`);
    current.kill('SIGKILL');
  };

  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(forceKill, 5000);

    current.once('exit', () => {
      clearTimeout(timeout);
      resolve();
    });

    current.once('error', err => {
      clearTimeout(timeout);
      forceKill();
      reject(err);
    });

    // Try graceful shutdown first
    current.kill('SIGTERM');
  });
};