//stackpress
import type Engine from '@stackpress/inquire/Engine';
import { action } from '@stackpress/ingest/Server';
//scripts
import install from '../../scripts/install.js';
//terminal
import type { CLIPlugin } from '../types.js';

export default action(async function InstallScript(_req, res, ctx) {
  //get terminal
  const cli = ctx.plugin<CLIPlugin>('cli');
  //get database
  const database = ctx.plugin<Engine>('database');
  if (!database) {
    cli?.verbose && cli.control.error('No database found');
    res.setError('No database found');
    return;
  }
  await install(ctx, database, cli);
  //OK
  res.setStatus(200);
});