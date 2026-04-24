//modules
import { action } from '@stackpress/ingest/Server';
//stackpress-server
import type { TerminalPlugin } from '../types.js';
import emit from '../scripts/emit.js';

export default action(async function EmitScript(_req, res, ctx) {
  //get terminal
  const terminal = ctx.plugin<TerminalPlugin>('terminal');
  if (process.argv.length < 4) {
    terminal?.verbose && terminal.control.error('Missing event name');
    res.setError('Missing event name');
    return;
  }
  //emit event
  terminal?.verbose && terminal.control.system(`Emitting "${process.argv[3]}"...`);
  await emit(ctx, 3);
  res.setStatus(200);
});