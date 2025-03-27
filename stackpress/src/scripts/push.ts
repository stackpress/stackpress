//stackpress
import type { QueryObject } from '@stackpress/inquire/types';
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//client
import type { ClientConfig } from '../client/types';
//schema
import Revisions from '../schema/Revisions';
//sql
import { sequence } from '../sql/helpers';
//plugins
import create from '../sql/schema';

export default async function push(server: Server<any, any, any>, database: Engine) {
  //get config
  const config = server.config<ClientConfig>('client') || {}; 
  //if there is a revisions folder
  if (!config.revisions) {
    return;
  }
  //this is where we are going to store all the queries
  const queries: QueryObject[] = [];
  const revisions = new Revisions(config.revisions, server.loader);
  //get the last last revision
  const from = await revisions.last(-1);
  //get the last revision
  const to = await revisions.last();
  //if no previous revision
  if (!from && to) {
    //get models
    const models = Array.from(to.registry.model.values());
    //there's an order to creating and dropping tables
    const order = sequence(models);
    //add drop queries
    for (const model of order) {
      queries.push(database.dialect.drop(model.snake));
    }
    //add create queries
    for (const model of order.reverse()) {
      const exists = models.find(map => map.name === model.name);
      if (exists) {
        const schema = create(exists);
        //set the engine to determine the dialect
        schema.engine = database;
        queries.push(...schema.query());
      }
    }
    if (queries.length) {
      //start a new transaction
      await database.transaction(async connection => {
        //loop through all the queries
        for (const query of queries) {
          //execute the query
          await connection.query(query);
        }
      });
    }
  } else if (from && to) {
    //create a registry from the history
    const previous = Array.from(from.registry.model.values()).map(
      model => create(model)
    );
    //create a registry from the new generated schema
    const current = Array.from(to.registry.model.values()).map(
      model => create(model)
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
          await connection.query(query);
        }
      });
    }
  }
};