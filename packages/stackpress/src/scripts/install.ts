//stackpress
import type { QueryObject } from '@stackpress/inquire/dist/types';
import type { 
  ClientPlugin, 
  ServerConfig 
} from '@stackpress/incept/dist/types';
import type Server from '@stackpress/ingest/dist/Server';
import type Engine from '@stackpress/inquire/dist/Engine';
import Revisions from '@stackpress/incept/dist/Revisions';
//common
import type { ClientWithDatabasePlugin } from '../types';
import { sequence } from '../helpers';

type Client = ClientPlugin<ClientWithDatabasePlugin>;

export default async function install(server: Server<any, any, any>, database: Engine) {
  //get config and client
  const config = server.config<ServerConfig['client']>('client') || {};
  const client = server.plugin<Client>('client') || {};
  //get models
  const models = Object.values(client.model);
  //repo of all the queries for the transaction
  const queries: QueryObject[] = [];
  //there's an order to creating and dropping tables
  const order = sequence(models.map(model => model.config));
  //add drop queries
  for (const model of order) {
    queries.push(database.dialect.drop(model.snake));
  }
  //add create queries
  for (const model of order.reverse()) {
    const exists = models.find(map => map.config.name === model.name);
    if (exists) {
      const create = exists.schema;
      //set the engine to the database (to set the dialect)
      create.engine = database;
      queries.push(...create.query());
    }
  }
  //if there is a revisions folder
  if (config.revisions) {
    const revisions = new Revisions(config.revisions, server.loader);
    if (revisions.size() === 0) {
      revisions.insert(client.config);
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
};

