//stackpress
import type Engine from '@stackpress/inquire/Engine';
import { terminalControls } from '@stackpress/lib/Terminal';
import { action } from '@stackpress/ingest/Server';
//scripts
import push from '../../scripts/push.js';

export default action(async function PushScript(req, res, ctx) {
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
  verbose && control.system('Updating database...');
  await push(ctx, database);
  //OK
  verbose && control.success('Database Updated.');
  res.setStatus(200);
});