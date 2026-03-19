//modules
import type Engine from '@stackpress/inquire/Engine';
import { action } from '@stackpress/ingest/Server';
//stackpress/scripts
import upgrade from '../../scripts/upgrade.js';
//stackpress/terminal
import type { CLIPlugin } from '../types.js';

export default action(async function UpgradeScript(_req, res, ctx) {
  //get terminal
  const cli = ctx.plugin<CLIPlugin>('cli');
  //get database
  const database = ctx.plugin<Engine>('database');
  if (!database) {
    cli?.verbose && cli.control.error('No database found');
    res.setError('No database found');
    return;
  }
  await upgrade(ctx, database, cli);
  //OK
  res.setStatus(200);
});