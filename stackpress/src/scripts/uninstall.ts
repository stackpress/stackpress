//modules
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//stackpress/client
import type { ClientPlugin } from '../client/types.js';
//stackpress/terminal
import Terminal from '../terminal/Terminal.js';

export default async function uninstall(
  server: Server<any, any, any>, 
  database: Engine,
  terminal?: Terminal
) {
  //get client
  const client = server.plugin<ClientPlugin>('client') || {};
  terminal?.verbose && terminal.control.system('Dropping database...');
  await database.transaction(async () => {
    await client.scripts.uninstall(database);
  });
  terminal?.verbose && terminal.control.success('Database Dropped.');
};