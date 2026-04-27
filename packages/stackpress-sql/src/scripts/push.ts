//modules
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//stackpress-server
import Terminal from 'stackpress-server/Terminal';
//stackpress-schema
import type { ClientConfig } from 'stackpress-schema/types';
import Revisions from 'stackpress-schema/Revisions';
//stackpress-sql
import install from './install.js';
import upgrade from './upgrade.js';

export default async function push(
  server: Server<any, any, any>, 
  database: Engine,
  terminal?: Terminal
) {
  //get config
  const config = server.config<ClientConfig>('client') || {}; 
  //if there is no revisions folder
  if (!config.revisions) {
    terminal?.verbose && terminal.control.warning(
      'No revisions folder found. Skipping push.'
    );
    return;
  }
  
  const revisions = new Revisions(config.revisions, server.loader);
  //get the last last revision
  const from = await revisions.last(-1);
  //get the last revision
  const to = await revisions.last();
  //if no previous revision
  if (!from || !to) {
    await install(server, database, terminal);
  } else if (from && to) {
    await upgrade(server, database, terminal);
  }
};