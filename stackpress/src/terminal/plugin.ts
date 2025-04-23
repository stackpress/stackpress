//stackpress
import type Server from '@stackpress/ingest/Server';
//events
import listen from './events/index.js';

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server) {
  //on listen, add cli scripts
  ctx.on('listen', (_req, _res, ctx) => {
    ctx.use(listen());
  });
};