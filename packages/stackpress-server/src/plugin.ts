//stackpress
import type Server from '@stackpress/ingest/Server';
import { action } from '@stackpress/ingest/Server';

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server<any, any, any>) {
  //on listen
  ctx.on('listen', action.props(({ ctx }) => {
    //add server scripts
    ctx.on('serve', () => import('./events/serve.js'));
    ctx.on('develop', () => import('./events/develop.js'));
  }));
};