//stackpress
import { server as http } from 'stackpress/server/http';
//local
import { config } from './config';

export default async function bootstrap(mode = config.server.mode) {
  //make a server
  const server = http();
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