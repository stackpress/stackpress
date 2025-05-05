//stackpress
import { action } from '@stackpress/ingest/Server';
//scripts
import serve from '../../scripts/serve.js';
//terminal
import type { CLIPlugin } from '../types.js';

export default action(async function ServeScript(_req, res, ctx) {
  //cli setup
  const cli = ctx.plugin<CLIPlugin>('cli');
  //get server port
  const port = ctx.config.path('server.port', 3000);
  //start the server
  cli?.verbose && cli.control.system(`Server is running on port ${port}`);
  cli?.verbose && cli.control.system('------------------------------');
  const server = await serve(ctx, port);
  server.on('error', e => {
    cli?.verbose && cli.control.error((e as Error).message);
  });
  server.on('close', () => {
    cli?.verbose && cli.control.success('Server Exited.');
  });
  res.setStatus(200);
});