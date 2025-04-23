//stackpress
import type Engine from '@stackpress/inquire/Engine';
import { terminalControls } from '@stackpress/lib/Terminal';
import { action } from '@stackpress/ingest/Server';
//scripts
import install from '../../scripts/install.js';

export default action(async function InstallScript(req, res, ctx) {
  //cli setup
  const label = ctx.config.path('cli.label', '');
  const verbose = req.data.path('verbose', false) || req.data.path('v', false);
  const control = terminalControls(label);
  //get database
  const database = ctx.plugin<Engine>('database');
  if (!database) {
    verbose && control.error('No database found');
    res.setError('No database found');
    return;
  }
  verbose && control.system('Installing...');
  await install(ctx, database);
  //OK
  verbose && control.success('Installation Complete.');
  res.setStatus(200);
});