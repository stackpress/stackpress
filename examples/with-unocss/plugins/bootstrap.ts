//stackpress
import { server as http } from 'stackpress/http';
//local
import { config } from './config';

export default async function bootstrap(mode = config.server.mode) {
  //make a server
  const server = http();
  //load the plugins
  await server.bootstrap();
  //initialize the plugins
  await server.resolve('config');
  //set the server mode to testing
  server.config.set('server', 'mode', mode);
  //add events
  await server.resolve('listen');
  //add routes
  await server.resolve('route');
  //return the server
  return server;
};