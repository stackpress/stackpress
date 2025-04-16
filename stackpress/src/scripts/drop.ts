//stackpress
import type { QueryObject } from '@stackpress/inquire/types';
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//client
import type { ClientPlugin } from '../client/types.js';
//sql
import { sequence } from '../sql/helpers.js';

export default async function drop(
  server: Server<any, any, any>, 
  database: Engine
) {
  //get client
  const client = server.plugin<ClientPlugin>('client') || {};
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