//stackpress
import type { QueryObject } from '@stackpress/inquire/types';
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//root
import type { ClientPlugin } from '../types';
//sql
import { sequence } from '../sql/helpers';

export default async function purge(server: Server<any, any, any>, database: Engine) {
  //get client
  const client = server.plugin<ClientPlugin>('client') || {};
  //get models
  const models = Object.values(client.model);
  //repo of all the queries for the transaction
  const queries: QueryObject[] = [];
  //there's an order to creating and dropping tables
  const order = sequence(models.map(model => model.config));
  //add truncate queries
  for (const model of order) {
    const exists = models.find(map => map.config.name === model.name);
    if (exists) {
      queries.push(database.dialect.truncate(model.snake, true));
    }
  }

  if (queries.length) {
    await database.transaction(async connection => {
      for (const query of queries) {
        await connection.query(query);
      }
    });
  }
};