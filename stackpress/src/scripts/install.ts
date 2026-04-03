//modules
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//stackpress/client
import type { ClientPlugin, ClientConfig } from '../client/types.js';
import Revisions from '../client/Revisions.js';
//stackpress/terminal
import Terminal from '../terminal/Terminal.js';

export default async function install(
  server: Server<any, any, any>, 
  database: Engine,
  terminal?: Terminal
) {
  //get config and client
  const config = server.config<ClientConfig>('client') || {};
  const client = server.plugin<ClientPlugin>('client') || {};

  terminal?.verbose && terminal.control.system('Installing...');
  await database.transaction(async () => {
    terminal?.verbose && terminal.control.system('Dropping tables...');
    //uninstall first to drop tables and such
    await client.scripts.uninstall(database);
    terminal?.verbose && terminal.control.system('Creating tables...');
    //then install to create tables and such
    await client.scripts.install(database);
  });
  terminal?.verbose && terminal.control.success('Installation Complete.');

  //if there is a revisions folder
  if (config.revisions) {
    //insert a new revision
    const revisions = new Revisions(config.revisions, server.loader);
    if (revisions.size() === 0) {
      revisions.insert(client.config);
      terminal?.verbose && terminal.control.success('Revision inserted.');
    }
  }
};

