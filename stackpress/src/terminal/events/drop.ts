//stackpress
import type Engine from '@stackpress/inquire/Engine';
import { action } from '@stackpress/ingest/Server';
//scripts
import drop from '../../scripts/drop.js';
//terminal
import type { CLIPlugin } from '../types.js';

export default action(async function DropScript(_req, res, ctx) {
  //get terminal
  const cli = ctx.plugin<CLIPlugin>('cli');
  //get database
  const database = ctx.plugin<Engine>('database');
  if (!database) {
    cli?.verbose && cli.control.error('No database found');
    res.setError('No database found');
    return;
  }
  cli?.verbose && cli.control.system('Dropping database...');
  await drop(ctx, database);
  //OK
  cli?.verbose && cli.control.success('Database Dropped.');
  res.setStatus(200);
});