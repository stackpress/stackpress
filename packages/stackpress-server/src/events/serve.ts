//modules
import { action } from '@stackpress/ingest/Server';
//stackpress-server
import type { TerminalPlugin } from '../types.js';
import serve from '../scripts/serve.js';

export default action(async function ServeScript({ res, ctx }) {
  //if error, dont continue
  if (res.code && res.code !== 200) return;
  //get terminal
  const terminal = ctx.plugin<TerminalPlugin>('terminal');
  //get server host
  const host = ctx.config.path('server.host', '127.0.0.1');
  //get server port
  const port = ctx.config.path('server.port', 3000);
  serve(terminal, ctx, host, port);
  res.statusCode(200);
});
