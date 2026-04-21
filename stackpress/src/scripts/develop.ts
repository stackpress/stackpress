//modules
import type Server from '@stackpress/ingest/Server';
//node
import path from 'node:path';
import { ChildProcess, spawn } from 'node:child_process';
//terminal
import Terminal from '@stackpress/lib/Terminal';

const project = process.cwd();
const CHILD_ENV = 'STACKPRESS_CHILD';
const isChild = process.env[CHILD_ENV] === '1';
let child: ChildProcess | null = null;
let restarting = false;

export default async function develop(
  server: Server<any, any, any>,
  port = 3000,
  terminal: Terminal
) {
  const service = server.create();

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

  //handle graceful shutdown
  process.once('SIGINT', shutdownAndExit);
  process.once('SIGTERM', shutdownAndExit);

  //only the parent spawns the child and watches for restarts
  if (!isChild) {
    child = start(terminal);
    watch(terminal);
    return service;
  }

  //only the child listens on the port
  service.listen(port);

  return service;
};

export function start(terminal: Terminal) {
  const command = path.join(project, 'node_modules', '.bin', 'stackpress');
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
  //lazy load chokidar
  const chokidar = await import('chokidar').then(module => module.default);
  //watch the current directory for changes
  const watcher = chokidar.watch(project, {
    ignored: [  /node_modules/, /\.build/ ],
    cwd: project,
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
