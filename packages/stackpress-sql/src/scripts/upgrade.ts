//modules
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//stackpress-server
import Terminal from 'stackpress-server/Terminal';
//stackpress-schema
import type { ClientConfig } from 'stackpress-schema/types';
import Revisions from 'stackpress-schema/Revisions';
import {
  formatDestructiveSchemaMessage,
  hasDestructiveSchemaChanges,
  inspectSchemaChanges
} from './helpers.js';
import { makeCreateQuery } from '../transform/helpers.js';

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
  const revisions = new Revisions(config.revisions, server.loader);
  //get the last last revision
  const from = await revisions.last(-1);
  //get the last revision
  const to = await revisions.last();
  if (!from || !to) {
    terminal?.verbose && terminal.control.error(
      'Not enough revision history to perform upgrade.'
    );
    return;
  }
  const forced = Boolean((terminal as Terminal & { force?: boolean })?.force);
  //create a registry from the history
  const previous = Array.from(from.schema.models.values()).map(
    model => makeCreateQuery(model)
  );
  //create a registry from the new generated schema
  const current = Array.from(to.schema.models.values()).map(
    model => makeCreateQuery(model)
  );
  const { queries, destructive } = inspectSchemaChanges(
    database,
    previous,
    current,
    forced
  );
  //block once all destructive changes are known
  if (!forced && hasDestructiveSchemaChanges(destructive)) {
    const message = formatDestructiveSchemaMessage(destructive);
    terminal?.control.error(message);
    throw new Error(message);
  }
  //if there are queries to be made...
  if (queries.length) {
    //start a new transaction
    await database.transaction(async connection => {
      //loop through all the queries
      for (const query of queries) {
        //execute the query
        terminal?.verbose && terminal.control.info(query.query);
        await connection.query(query);
      }
    });
  }
};
