//modules
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//stackpress-server
import Terminal from 'stackpress-server/Terminal';
//stackpress-sql
import type { ClientPlugin } from '../types';

export default async function uninstall(
  server: Server<any, any, any>, 
  database: Engine,
  terminal?: Terminal
) {
  //get client
  const client = server.plugin<ClientPlugin>('client');
  //extract scripts from client
  //NOTE: could throw error if client doesn't exist. this is intentional
  const { scripts } = await client();
  terminal?.verbose && terminal.control.system('Dropping database...');
  await database.transaction(async () => {
    await scripts.uninstall(database);
  });
  terminal?.verbose && terminal.control.success('Database Dropped.');
};