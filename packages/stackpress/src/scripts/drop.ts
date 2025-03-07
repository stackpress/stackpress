//stackpress
import type { QueryObject } from '@stackpress/inquire/dist/types';
import type Server from '@stackpress/ingest/dist/Server';
import type Engine from '@stackpress/inquire/dist/Engine';
//incept
import type { ClientPlugin } from '@stackpress/incept/dist/types';
import type { ClientWithDatabasePlugin } from '../types';
//common
import { sequence } from '../helpers';

type Client = ClientPlugin<ClientWithDatabasePlugin>;

export default async function drop(
  server: Server<any, any, any>, 
  database: Engine
) {
  //get client
  const client = server.plugin<Client>('client') || {};
  //get models
  const models = Object.values(client.model);
  //repo of all the queries for the transaction
  const queries: QueryObject[] = [];
  //there's an order to truncating tables
  const order = sequence(models.map(model => model.config));
  //add truncate queries
  for (const model of order) {
    queries.push(database.dialect.drop(model.snake));
  }
  if (queries.length) {
    await database.transaction(async connection => {
      for (const query of queries) {
        await connection.query(query);
      }
    });
  }
};