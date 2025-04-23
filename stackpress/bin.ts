#!/usr/bin/env tsx
import path from 'node:path';
import { server as http } from 'stackpress/http';
import Terminal from 'stackpress/Terminal';

async function main() {
  //[ 'node', 'stackpress', [config], [event] ]
  if (process.argv.length < 4) {
    console.error('Usage: npx stackpress <config-path> <event>');
    process.exit(1);
  }

  //create a new server
  const server = http();

  //inject the config
  const cwd = process.cwd();
  const filepath = process.argv[2];
  const config = await import(path.resolve(cwd, filepath));

  if (typeof config.config !== 'object') {
    console.error('Invalid config file. Need to `export const config = {}`');
    process.exit(1);
  } else {
    server.config.set(config.config);
  }
  
  const terminal = new Terminal(process.argv.slice(3), server);
  await terminal.bootstrap();
  await terminal.run();

  return terminal;
}

main().then(() => {
  if (process.argv[3] !== 'serve') {
    process.exit(0);
  }
}).catch(console.error);
