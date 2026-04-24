//modules
import { action } from '@stackpress/ingest/Server';
//stackpress-server
import type { TerminalPlugin } from 'stackpress-server/types';
//stackpress-sql
import type { SerializedEvent } from '../types.js';
import populate from '../scripts/populate.js';

export default action.props(async function PopulateScript({ res, ctx }) {
  //get terminal
  const terminal = ctx.plugin<TerminalPlugin>('terminal');
  //get events
  const events = ctx.config.path<SerializedEvent[]>('database.populate', []);
  await populate(ctx, events, terminal);
  //OK
  res.setStatus(200);
});