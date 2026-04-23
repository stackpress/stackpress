//modules
import { action } from '@stackpress/ingest/Server';
//stackpress-server
import type { TerminalPlugin } from '../types.js';

export default action.props(async function ServeScript({ res, ctx }) {
  //get terminal
  const terminal = ctx.plugin<TerminalPlugin>('terminal');
  //get server port
  const port = ctx.config.path('server.port', 3000);
  //start the server
  terminal?.verbose && terminal.control.system(`Server is running on port ${port}`);
  terminal?.verbose && terminal.control.system('------------------------------');
  const server = ctx.create();
  server.listen(port);
  server.on('error', e => {
    terminal?.verbose && terminal.control.error((e as Error).message);
  });
  server.on('close', () => {
    terminal?.verbose && terminal.control.success('Server Exited.');
  });
  res.setStatus(200);
});