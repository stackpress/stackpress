#!/usr/bin/env tsx
import path from 'node:path';
import { objectFromArgs, isObject } from 'stackpress/lib';
import { server as http } from 'stackpress/http';
import { Terminal } from 'stackpress/terminal';
import events from 'stackpress/terminal/events';

/**
 * Determines the bootstrap pathname
 */
function getPathname(args: string[]) {
  //get the current working directory
  const cwd = process.cwd();
  //get data from args
  const data = objectFromArgs(args.join(' '));
  //check if -b or --bootstrap is set
  const bootstrap = data?.bootstrap || data?.b;
  //if we have a bootstrap
  if (typeof bootstrap === 'string' && bootstrap.length > 0) {
    //return the resolved path
    return path.resolve(cwd, bootstrap);
  }
  //check if process.env.BOOTSTRAP is set
  if (typeof process.env.BOOTSTRAP === 'string' 
    && process.env.BOOTSTRAP.length > 0
  ) {
    return path.resolve(cwd, process.env.BOOTSTRAP);
  }
  //anything else?
  return null;
}

/**
 * Imports the bootstrap file
 */
async function getBootstrap(args: string[]) {
  //determine bootstrap pathname
  const bootstrap = getPathname(args);
  //import bootstrap file
  const imports = bootstrap ? await import(bootstrap) : {};
  //we just need the default export...
  return imports.default || {};
}

/**
 * Configures and returns the terminal interface
 */
async function getTerminal(args: string[]) {
  //determine bootstrap pathname
  const bootstrap = await getBootstrap(args);
  //if bootstrap is a function
  if (typeof bootstrap === 'function') {
    //bootstrap and get the server
    //(the bootstrap should already set the config)
    const server = await bootstrap();
    //add terminal events
    server.use(events());
    //now create a new terminal interface
    return new Terminal(args, server);
  }
  //bootstrap is an object...
  //create a new server
  const server = http();
  //set the configuration
  server.config.set(isObject(bootstrap) ? bootstrap : {});
  //now create a new terminal interface
  const terminal = new Terminal(args, server);
  //add terminal events
  server.use(events());
  //do the default bootstrap
  return await terminal.bootstrap();
}

/**
 * Driver
 */
async function main() {
  //[ 'node', 'stackpress', [event] ]
  if (process.argv.length < 3) {
    console.error('Usage: npx stackpress <event>');
    process.exit(1);
  }
  //get args
  const args = process.argv.slice(2);
  //get terminal
  const terminal = await getTerminal(args);
  //run the command
  await terminal.run();
}

//initializer
main().then(() => {
  if (process.argv[2] !== 'serve') {
    process.exit(0);
  }
}).catch(console.error);
