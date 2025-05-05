//stackpress
import { action } from '@stackpress/ingest/Server';
//scripts
import emit from '../../scripts/emit.js';
//terminal
import type { CLIPlugin } from '../types.js';

export default action(async function EmitScript(_req, res, ctx) {
  //get terminal
  const cli = ctx.plugin<CLIPlugin>('cli');
  if (process.argv.length < 4) {
    cli?.verbose && cli.control.error('Missing event name');
    res.setError('Missing event name');
    return;
  }
  //emit event
  cli?.verbose && cli.control.system(`Emitting "${process.argv[3]}"...`);
  await emit(ctx, 3);
  res.setStatus(200);
});