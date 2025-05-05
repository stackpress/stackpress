//stackpress
import type Engine from '@stackpress/inquire/Engine';
import { action } from '@stackpress/ingest/Server';
//scripts
import purge from '../../scripts/purge.js';
//terminal
import type { CLIPlugin } from '../types.js';

export default action(async function PurgeScript(_req, res, ctx) {
  //get terminal
  const cli = ctx.plugin<CLIPlugin>('cli');
  //get database
  const database = ctx.plugin<Engine>('database');
  if (!database) {
    cli?.verbose && cli.control.error('No database found');
    res.setError('No database found');
    return;
  }
  await purge(ctx, database, cli);
  //OK
  res.setStatus(200);
});