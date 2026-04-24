//modules
import type Engine from '@stackpress/inquire/Engine';
import { action } from '@stackpress/ingest/Server';
//stackpress-server
import type { TerminalPlugin } from 'stackpress-server/types';
//stackpress-sql
import migrate from '../scripts/migrate.js';

export default action.props(async function MigrateScript({ res, ctx }) {
  //get terminal
  const terminal = ctx.plugin<TerminalPlugin>('terminal');
  //get database
  const database = ctx.plugin<Engine>('database');
  if (!database) {
    terminal?.verbose && terminal.control.error('No database found');
    res.setError('No database found');
    return;
  }
  terminal?.verbose && terminal.control.system('Creating migration file...');
  await migrate(ctx, database, terminal);
  //OK
  terminal?.verbose && terminal.control.success('Migration file created.');
  res.setStatus(200);
});