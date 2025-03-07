//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//local;
import emitter from './events';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on listen, add user routes
  server.on('listen', req => {
    const server = req.context;
    server.use(emitter);
  });
};