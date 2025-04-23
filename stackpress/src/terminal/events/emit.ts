//stackpress
import { action } from '@stackpress/ingest/Server';
import { terminalControls } from '@stackpress/lib/Terminal';
//scripts
import emit from '../../scripts/emit.js';

export default action(async function EmitScript(req, res, ctx) {
  //cli setup
  const label = ctx.config.path('cli.label', '');
  const verbose = req.data.path('verbose', false) || req.data.path('v', false);
  const control = terminalControls(label);
  if (process.argv.length < 5) {
    verbose && control.error('Missing event name');
    res.setError('Missing event name');
    return;
  }
  //emit event
  verbose && control.system(`Emitting "${process.argv[4]}"...`);
  await emit(ctx, 4);
  res.setStatus(200);
});