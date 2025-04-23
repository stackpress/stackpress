//stackpress
import type Engine from '@stackpress/inquire/Engine';
import { terminalControls } from '@stackpress/lib/Terminal';
import { action } from '@stackpress/ingest/Server';

export default action(async function QueryScript(req, res, ctx) {
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
  const query = process.argv.slice(2).pop();
  if (query) {
    console.log(await database.query(query.replace(/\\/g, "'")));
  }
  //OK
  res.setStatus(200);
});