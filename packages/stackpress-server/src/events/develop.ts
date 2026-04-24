//modules
import { action } from '@stackpress/ingest/Server';
//stackpress-server
import type { TerminalPlugin } from '../types.js';
import develop from '../scripts/develop.js';

export default action.props(async function DevelopScript({ res, ctx }) {
  //cli setup
  const terminal = ctx.plugin<TerminalPlugin>('terminal');
  //get server port
  const port = ctx.config.path('server.port', 3000);
  //get process name
  const CHILD_ENV = ctx.config.path('server.process', 'STACKPRESS_CHILD');
  //run the script
  develop(terminal, ctx, port, CHILD_ENV);
  
  res.setStatus(200);
});
