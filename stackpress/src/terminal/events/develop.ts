//modules
import { action } from '@stackpress/ingest/Server';
//stackpress/scripts
import develop from '../../scripts/develop.js';
//stackpress/terminal
import type { CLIPlugin } from '../types.js';

export default action(async function DevelopScript(_req, res, ctx) {
  //cli setup
  const cli = ctx.plugin<CLIPlugin>('cli');
  //get server port
  const port = ctx.config.path('server.port', 3000);
  //start the server
  cli?.verbose && cli.control.system(`Server is running on port ${port}`);
  cli?.verbose && cli.control.system('------------------------------');
  const server = await develop(ctx, port, cli);
  server.on('error', err => {
    cli?.verbose && cli.control.error((err as Error).message);
  });
  server.on('close', () => {
    cli?.verbose && cli.control.success('Server Exited.');
  });
  res.setStatus(200);
});