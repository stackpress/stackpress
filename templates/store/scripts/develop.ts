//node
import path from 'node:path';
import { ChildProcess, spawn } from 'node:child_process';
//stackpress
import { Terminal } from 'stackpress/terminal';
//config
import bootstrap from '../config/develop.js';

export type Control = {
  brand: string;
  error(message: string, variables?: string[]): void;
  info(message: string, variables?: string[]): void;
  input(question: string, answer?: string): Promise<string>;
  output(message: string, variables?: string[], color?: string): void;
  success(message: string, variables?: string[]): void;
  system(message: string, variables?: string[]): void;
  warning(message: string, variables?: string[]): void;
};

const project = path.dirname(import.meta.dirname);
let child: ChildProcess|null = null;
let restarting = false;

export async function develop() {
  const server = await bootstrap();
  const cli = new Terminal([], server);
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    if (child) {
      cli.control.system('Shutting down server...');
      child.kill('SIGTERM');
      child = null;
    }
    cli.control.success('Server shutdown complete.');
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    if (child) {
      cli.control.system('Shutting down server...');
      child.kill('SIGTERM');
      child = null;
    }
    cli.control.success('Server shutdown complete.');
    process.exit(0);
  });
  //start the server
  child = start(cli.control);
  //start the watcher
  watch(cli.control);
}

export async function watch(control: Control) {
  //lazy load chokidar to avoid unnecessary dependencies in production
  const chokidar = await import('chokidar').then(m => m.default || m);
  //watch the current directory for changes
  const watcher = chokidar.watch('.', {
    ignored: [/node_modules/, /\.build/],
    cwd: project,
    ignoreInitial: true,
    followSymlinks: true
  });
  watcher.on('change', async filepath => {
    if (!filepath.endsWith('.ts')) return;
    control.system(`📁 changed: ${filepath}`);
    await restart(control);
    control.success('✅ Server restarted...');
  });

  watcher.on('add', async filepath => {
    if (!filepath.endsWith('.ts')) return;
    control.system(`📁 added: ${filepath}`);
    await restart(control);
    control.success('✅ Server restarted...');
  });

  watcher.on('unlink', async filepath => {
    if (!filepath.endsWith('.ts')) return;
    control.system(`📁 removed: ${filepath}`);
    await restart(control);
    control.success('✅ Server restarted...');
  });
}

export function start(control: Control) {
  //get dotenv and stackpress binaries
  const dotenv = path.join(project, 'node_modules', '.bin', 'dotenv');
  const stackpress = path.join(project, 'node_modules', '.bin', 'stackpress');
  //spawn the stackpress serve command with the develop config
  const child = spawn(
    dotenv,
    ['-e', '.env', '--', stackpress, 'serve', '--b', 'config/develop', '-v'],
    {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env },
      cwd: project
    }
  );

  child.on('error', (error) => {
    console.error(error);
  });

  child.on('exit', (code) => {
    if (!restarting) {
      control.success(`Exited with code ${code}`);
    }
  });
  return child;
}

export function restart(control: Control) {
  return new Promise<ChildProcess>((resolve, reject) => {
    if (restarting) return child as any;
    restarting = true;
    if (child) {
      shutdown(child, control).then(() => {
        child = start(control);
        restarting = false;
        resolve(child);
      }).catch(reject);
    } else {
      child = start(control);
      restarting = false;
      resolve(child);
    }
  });
}

export function shutdown(current: ChildProcess, control: Control) {
  const kill = () => {
    control.warning(`⚠️  Process didn't exit gracefully, force killing...`);
    current.kill('SIGKILL');
  };
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(kill, 5000);
    current.once('exit', () => {
      clearTimeout(timeout);
      resolve();
    });
    current.once('error', error => {
      clearTimeout(timeout);
      kill();
      reject(error);
    });
    current.kill('SIGTERM');
  });
}

develop().catch(e => {
  console.error(e);
  process.exit(1);
});
