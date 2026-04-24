//modules
import type Server from '@stackpress/ingest/Server';
import { action } from '@stackpress/ingest/Server';
//stackpress-server
import { develop, emit, serve } from './events/index.js';

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server<any, any, any>) {
  //on listen
  ctx.on('listen', action.props(({ ctx }) => {
    //add server scripts
    ctx.on('develop', develop);
    ctx.on('emit', emit);
    ctx.on('serve', serve);
  }));
};