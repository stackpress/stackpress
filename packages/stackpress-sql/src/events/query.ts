//modules
import type Engine from '@stackpress/inquire/Engine';
import { action } from '@stackpress/ingest/Server';
//stackpress-server
import type { TerminalPlugin } from 'stackpress-server/types';

export default action.props(async function QueryScript({ res, ctx }) {
  //cli setup
  const terminal = ctx.plugin<TerminalPlugin>('terminal');
  //get database
  const database = ctx.plugin<Engine>('database');
  if (!database) {
    terminal?.verbose && terminal.control.error('No database found');
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