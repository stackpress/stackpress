//modules
import type { QueryObject } from '@stackpress/inquire/types';
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//stackpress-server
import Terminal from 'stackpress-server/Terminal';
//stackpress-schema
import type { ClientConfig } from 'stackpress-schema/types';
import Revisions from 'stackpress-schema/Revisions';
//stackpress-sql
import { makeCreateQuery } from '../transform/helpers';

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
  //create a registry from the history
  const previous = Array.from(from.schema.models.values()).map(
    model => makeCreateQuery(model)
  );
  //create a registry from the new generated schema
  const current = Array.from(to.schema.models.values()).map(
    model => makeCreateQuery(model)
  );
  //this is where we are going to store all the queries
  const queries: QueryObject[] = [];
  //loop through all 'current' the models
  for (const schema of current) {
    const name = schema.build().table;
    const before = previous.find(from => from.build().table === name);
    //if the schema wasn't there before
    if (!before) {
      //set the engine to determine the dialect
      schema.engine = database;
      //add to the queries
      queries.push(...schema.query());
      continue;
    }
    //the model was there before...
    try {
      //this could error if there were no differences found.
      //push all the alter statements
      queries.push(...database.diff(before, schema).query());
    } catch(e) {}
  }
  //loop through all 'previous' the models
  for (const schema of previous) {
    const name = schema.build().table;
    const after = current.find(to => to.build().table === name);
    //if the model is not there now
    if (!after) {
      //we need to drop this table
      queries.push(database.dialect.drop(name));
      continue;
    }
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