//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress-csrf
import type { CsrfPlugin } from 'stackpress-csrf/types';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session/session
import type { SessionPlugin } from '../../../session/types.js';
//stackpress-session/auth
import type { AuthConfig } from '../../types.js';

/**
 * Main page handler
 */
export default async function UsernameSignInPage(
  req: Request, 
  res: Response, 
  ctx: Server
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }  
  //get session plugin
  const session = ctx.plugin<SessionPlugin>('session');
  //get csrf plugin
  const csrf = ctx.plugin<CsrfPlugin>('csrf');
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
  //generate a csrf token
  csrf.generate(res, ctx);
  //if form submission
  if (req.method === 'POST') {
    //if invalid csrf
    if (!csrf.valid(req, res)) return;
    //TODO:
    // //prevent passwordless sign in on this page...
    // req.data.set('password', true);
    // //sign in
    // await ctx.emit('auth-signin', req, res);
    //if not ok
    if (res.code !== 200) return;
    //remove csrf
    csrf.clear(req, res, ctx);
    //sign in successful, redirect
    res.redirect(req.data.path('redirect_uri', '/'));
    return;
  }
  //get user from session
  const me = session.load(req);
  const guest = await me.guest();
  //if i am already signed in
  if (!guest) {
    //remove csrf
    csrf.clear(req, res, ctx);
    //redirect to home
    res.redirect(req.data.path('redirect_uri', '/'));
  }
};