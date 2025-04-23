//stackpress
import { action } from '@stackpress/ingest/Server';
import { terminalControls } from '@stackpress/lib/Terminal';
//scripts
import serve from '../../scripts/serve.js';

export default action(async function ServeScript(req, res, ctx) {
  //cli setup
  const label = ctx.config.path('cli.label', '');
  const verbose = req.data.path('verbose', false) || req.data.path('v', false);
  const control = terminalControls(label);
  //get server port
  const port = ctx.config.path('server.port', 3000);
  //start the server
  verbose && control.system(`Server is running on port ${port}`);
  verbose && control.system('------------------------------');
  const server = await serve(ctx, port);
  server.on('error', e => {
    verbose && control.error((e as Error).message);
  });
  server.on('close', () => {
    verbose && control.success('Server Exited.');
  });
  res.setStatus(200);
});