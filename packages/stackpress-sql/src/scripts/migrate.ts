//node
import path from 'node:path';
//modules
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
import Migrations from '../Migrations.js';

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
  const history = new Migrations(
    new Revisions(root, server.loader),
    database
  );
  const plans = await history.all();
  if (!plans.length) {
    terminal?.verbose && terminal.control.error('No revisions found.');
    return;
  }
  const fs = server.loader.fs;

  //migrate writes every plan as raw SQL and does not enforce warning policy
  for (const migration of plans) {
    if (migration.queries.length) {
      if (!await fs.exists(migrations)) {
        terminal?.verbose && terminal.control.system(
          'Creating migrations directory...'
        );
        await fs.mkdir(migrations, { recursive: true });
      }
      const migrationFile = path.join(
        migrations,
        `${migration.to.date.getTime()}.sql`
      );
      //add migration file
      await fs.writeFile(
        migrationFile,
        migration.queries.map(query => query.query).join(';\n')
      );
      terminal?.verbose && terminal.control.success(
        'Migration file created: %s',
        [ migrationFile ]
      );
    }
  }
};
