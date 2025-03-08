//stackpress
import type Server from '@stackpress/ingest/dist/Server';
import { server as http } from '@stackpress/ingest/http';
//local
import { config } from './config';

export default async function bootstrap(mode = config.server.mode) {
  //make a server
  const server = http() as Server;
  //load the plugins
  await server.bootstrap();
  //initialize the plugins
  await server.call('config');
  //set the server mode to testing
  server.config.set('server', 'mode', mode);
  //add events
  await server.call('listen');
  //add routes
  await server.call('route');
  //return the server
  return server;
};