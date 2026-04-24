//modules
import type Engine from '@stackpress/inquire/Engine';
import { action } from '@stackpress/ingest/Server';
//stackpress-server
import type { TerminalPlugin } from 'stackpress-server/types';
//stackpress-sql
import push from '../scripts/push.js';

export default action.props(async function PushScript({ res, ctx }) {
  //get terminal
  const terminal = ctx.plugin<TerminalPlugin>('terminal');
  //get database
  const database = ctx.plugin<Engine>('database');
  if (!database) {
    terminal?.verbose && terminal.control.error('No database found');
    res.setError('No database found');
    return;
  }
  await push(ctx, database, terminal);
  //OK
  res.setStatus(200);
});