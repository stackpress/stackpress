//modules
import type Server from '@stackpress/ingest/Server';
//stackpress-email
import email from 'stackpress-email/plugin'
//stackpress-session
import auth from './auth/plugin.js';
import session from './session/plugin.js';

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server) {
  auth(ctx);
  email(ctx)
  session(ctx);
};