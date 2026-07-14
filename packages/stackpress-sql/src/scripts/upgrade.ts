//modules
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//stackpress-server
import Terminal from 'stackpress-server/Terminal';
//stackpress-schema
import type { ClientConfig } from 'stackpress-schema/types';
import Revisions from 'stackpress-schema/Revisions';
//stackpress-sql
import Migrations from '../Migrations.js';

export default async function upgrade(
  server: Server<any, any, any>, 
  database: Engine,
  terminal?: Terminal
) {
  //get config
  const config = server.config<ClientConfig>('client') || {}; 
  //if there is no revisions folder
  if (!config.revisions) {
    terminal?.verbose && terminal.control.error(
      'No client.revisions folder path found in config.'
    );
    return;
  }
  const migrations = new Migrations(
    new Revisions(config.revisions, server.loader),
    database
  );
  const migration = await migrations.latest();
  if (!migration) {
    terminal?.verbose && terminal.control.error(
      'Not enough revision history to perform upgrade.'
    );
    return;
  }
  const forced = Boolean((terminal as Terminal & { force?: boolean })?.force);
  //the migration owns warning detection while upgrade owns refusal policy
  if (!forced && migration.warning) {
    terminal?.control.error(migration.warning);
    throw new Error(migration.warning);
  }
  //if there are queries to be made...
  if (migration.queries.length) {
    //start a new transaction
    await database.transaction(async connection => {
      //loop through all the queries
      for (const query of migration.queries) {
        //execute the query
        terminal?.verbose && terminal.control.info(query.query);
        await connection.query(query);
      }
    });
  }
};
