//stackpress
import type Server from '@stackpress/ingest/Server';
//email
import emitter from './events.js';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(ctx: Server) {
  //if no email is configured, disable plugin
  if (!ctx.config.has('email')) return;
  //on listen, add user routes
  ctx.on('listen', (_req, _res, ctx) => {
    //if no email config exists, return
    if (!ctx.config.get('email')) return;
    ctx.use(emitter);
  });
};