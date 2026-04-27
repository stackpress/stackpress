//modules
import type Server from '@stackpress/ingest/Server';
//stackpress-session
import auth from './auth/plugin.js';
import session from './session/plugin.js';

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server) {
  auth(ctx);
  session(ctx);
};