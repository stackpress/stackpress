//stackpress
import type Engine from '@stackpress/inquire/Engine';
import { action } from '@stackpress/ingest/Server';
//scripts
import migrate from '../../scripts/migrate.js';
//terminal
import type { CLIPlugin } from '../types.js';

export default action(async function MigrateScript(_req, res, ctx) {
  //get terminal
  const cli = ctx.plugin<CLIPlugin>('cli');
  //get database
  const database = ctx.plugin<Engine>('database');
  if (!database) {
    cli?.verbose && cli.control.error('No database found');
    res.setError('No database found');
    return;
  }
  cli?.verbose && cli.control.system('Creating migration file...');
  await migrate(ctx, database);
  //OK
  cli?.verbose && cli.control.success('Migration file created.');
  res.setStatus(200);
});