//modules
import { action } from '@stackpress/ingest/Server';
//stackpress-server
import type { TerminalPlugin } from '../types.js';
import serve from '../scripts/serve.js';

export default action.props(async function ServeScript({ res, ctx }) {
  //get terminal
  const terminal = ctx.plugin<TerminalPlugin>('terminal');
  //get server port
  const port = ctx.config.path('server.port', 3000);
  serve(terminal, ctx, port);
  res.setStatus(200);
});