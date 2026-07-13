//node
import path from 'node:path';
//modules
import type { QueryObject } from '@stackpress/inquire/types';
import type Engine from '@stackpress/inquire/Engine';
import type Server from '@stackpress/ingest/Server';
//stackpress-server
import Terminal from 'stackpress-server/Terminal';
//stackpress-schema
import Revisions from 'stackpress-schema/Revisions';
//stackpress-sql
import type {
  DatabaseConfig,
} from '../types.js';
import {
  formatDestructiveSchemaMessage,
  hasDestructiveSchemaChanges,
  inspectSchemaChanges
} from './helpers.js';
import {
  arrangeModelSequence,
  makeCreateQuery
} from '../transform/helpers.js';

export default async function migrate(
  server: Server<any, any, any>,
  database: Engine,
  terminal?: Terminal
) {
  //get config
  const root = server.config.path<string>('client.revisions');
  const { migrations } = server.config<DatabaseConfig>('database') || {};
  //if there is not a migrations or revisions folder
  if (!migrations || !root) {
    terminal?.verbose && terminal.control.error(
      'Missing database.migrations or client.revisions in config.'
    );
    return;
  }
  //collect all the revisions
  const revisions = new Revisions(root, server.loader);
  //if there are no revisions
  if (!await revisions.last()) {
    terminal?.verbose && terminal.control.error('No revisions found.');
    return;
  }
  const forced = Boolean((terminal as Terminal & { force?: boolean })?.force);
  const fs = server.loader.fs;
  const first = await revisions.first();
  if (first) {
    //this is where we are going to store all the queries
    const queries: QueryObject[] = [];
    //get models
    const models = first.schema.models.toArray();
    //there's an order to creating and dropping tables
    const order = arrangeModelSequence(models);
    //add drop queries
    for (const model of order) {
      queries.push(database.dialect.drop(model.name.snakeCase));
    }
    //add create queries
    for (const model of order.reverse()) {
      const exists = models.find(map => map.name === model.name);
      if (exists) {
        const schema = makeCreateQuery(exists);
        schema.engine = database;
        queries.push(...schema.query());
      }
    }
    if (queries.length) {
      if (!await fs.exists(migrations)) {
        terminal?.verbose && terminal.control.system(
          'Creating migrations directory...'
        );
        await fs.mkdir(migrations, { recursive: true });
      }
      const migrationFile = path.join(migrations, `${first.date.getTime()}.sql`);
      //add migration file
      await fs.writeFile(
        migrationFile,
        queries.map(query => query.query).join(';\n')
      );
      terminal?.verbose && terminal.control.success(
        'Migration file created: %s',
        [ migrationFile ]
      );
    }
  }

  for (let i = 1; i < revisions.size(); i++) {
    const from = await revisions.index(i - 1);
    const to = await revisions.index(i);
    if (!from || !to) break;
    //create a registry from the history
    const previous = from.schema.models.toArray().map(
      model => makeCreateQuery(model)
    );
    //create a registry from the new generated schema
    const current = to.schema.models.toArray().map(
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
      if (!await fs.exists(migrations)) {
        terminal?.verbose && terminal.control.system(
          'Creating migrations directory...'
        );
        await fs.mkdir(migrations, { recursive: true });
      }
      const migrationFile = path.join(migrations, `${to.date.getTime()}.sql`);
      //add migration file
      await fs.writeFile(
        migrationFile,
        queries.map(query => query.query).join(';\n')
      );
      terminal?.verbose && terminal.control.success(
        'Migration file created: %s',
        [ migrationFile ]
      );
    }
  }
};
