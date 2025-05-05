//stackpress
import type Engine from '@stackpress/inquire/Engine';
import { action } from '@stackpress/ingest/Server';
//terminal
import type { CLIPlugin } from '../types.js';

export default action(async function QueryScript(_req, res, ctx) {
  //cli setup
  const cli = ctx.plugin<CLIPlugin>('cli');
  //get database
  const database = ctx.plugin<Engine>('database');
  if (!database) {
    cli?.verbose && cli.control.error('No database found');
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