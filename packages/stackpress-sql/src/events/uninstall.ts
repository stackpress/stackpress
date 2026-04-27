//modules
import type Engine from '@stackpress/inquire/Engine';
import { action } from '@stackpress/ingest/Server';
//stackpress-server
import type { TerminalPlugin } from 'stackpress-server/types';
//stackpress-sql
import uninstall from '../scripts/uninstall.js';

export default action.props(async function UninstallScript({ res, ctx }) {
  //if error, dont continue
  if (res.code && res.code !== 200) return;
  //get terminal
  const terminal = ctx.plugin<TerminalPlugin>('terminal');
  //get database
  const database = ctx.plugin<Engine>('database');
  if (!database) {
    terminal?.verbose && terminal.control.error('No database found');
    res.setError('No database found');
    return;
  }
  await uninstall(ctx, database, terminal);
  //OK
  res.setStatus(200);
});