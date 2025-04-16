#!/usr/bin/env node
import Server from '@stackpress/ingest/Server';
import Terminal from './Terminal.js';

async function main() {
  const server = new Server();
  const terminal = new Terminal(process.argv.slice(2), server);
  await terminal.bootstrap();
  await terminal.run();
}

main().then(() => process.exit(0)).catch(console.error);
