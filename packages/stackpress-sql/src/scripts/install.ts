//modules
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//stackpress-server
import Terminal from 'stackpress-server/Terminal';
//stackpress-schema
import type { ClientConfig } from 'stackpress-schema/types';
import Revisions from 'stackpress-schema/Revisions';
//stackpress-sql
import type { ClientPlugin } from '../types';

export default async function install(
  server: Server<any, any, any>, 
  database: Engine,
  terminal?: Terminal
) {
  //get config and client
  const config = server.config<ClientConfig>('client') || {};
  const client = server.plugin<ClientPlugin>('client');
  //extract scripts and schema from client
  //NOTE: could throw error if client doesn't exist. this is intentional
  const { scripts, config: schema } = await client();
  terminal?.verbose && terminal.control.system('Installing...');
  await database.transaction(async () => {
    terminal?.verbose && terminal.control.system('Dropping tables...');
    //uninstall first to drop tables and such
    await scripts.uninstall(database);
    terminal?.verbose && terminal.control.system('Creating tables...');
    //then install to create tables and such
    await scripts.install(database);
  });
  terminal?.verbose && terminal.control.success('Installation Complete.');

  //if there is a revisions folder
  if (config.revisions) {
    //insert a new revision
    const revisions = new Revisions(config.revisions, server.loader);
    if (revisions.size() === 0) {
      revisions.insert(schema);
      terminal?.verbose && terminal.control.success('Revision inserted.');
    }
  }
};

