//stackpress-server
import type { TerminalPlugin } from '../types.js';
import type Server from '@stackpress/ingest/Server';

export default function serve(
  terminal: TerminalPlugin, 
  server: Server<any, any, any>,
  port: number
) {
  //start the server
  terminal?.verbose && terminal.control.system(`Server is running on port ${port}`);
  terminal?.verbose && terminal.control.system('------------------------------');
  const service = server.create();
  service.listen(port);
  service.on('error', e => {
    terminal?.verbose && terminal.control.error((e as Error).message);
  });
  service.on('close', () => {
    terminal?.verbose && terminal.control.success('Server Exited.');
  });
};