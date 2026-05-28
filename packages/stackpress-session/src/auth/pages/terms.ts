//modules
import { action } from '@stackpress/ingest/Server';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session/auth
import type { AuthConfig } from '../types.js';

/**
 * Main page handler
 */
export default action(async function TermsPage({ req, res, ctx }) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  //pass the view props down to view
  setViewProps(req, res, ctx);
  //get the auth config
  const auth = ctx.config.path<AuthConfig>('auth');
  //set auth props for view as well
  res.data.set('auth', {
    base: auth.base || '/auth',
    roles: auth.roles || [],
    menu: auth.menu || [],
    password: auth.password || {}
  });
});
