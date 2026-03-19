//modules
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//stackpress/client
import type { ClientPlugin } from '../client/types.js';
//stackpress/terminal
import Terminal from '../terminal/Terminal.js';

export default async function purge(
  server: Server<any, any, any>, 
  database: Engine,
  terminal?: Terminal
) {
  //get client
  const client = server.plugin<ClientPlugin>('client') || {};

  terminal?.verbose && terminal.control.system('Purging database...');
  await database.transaction(async () => {
    //uninstall first to drop tables and such
    await client.scripts.purge(database);
  });
  terminal?.verbose && terminal.control.success('Database Purged.');
};