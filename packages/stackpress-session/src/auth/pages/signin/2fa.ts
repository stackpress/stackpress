//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress-schema
import { hash } from 'stackpress-schema/helpers';
//stackpress-csrf
import type { CsrfPlugin } from 'stackpress-csrf/types';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session/session
import type { SessionPlugin } from '../../../session/types.js';
import { verifyTOTP } from '../../../session/helpers.js';
//stackpress-session/auth
import type { AuthConfig, AuthExtended } from '../../types.js';

/**
 * Main page handler
 */
export default async function TwoFactorSignInPage(
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
  const base = auth.base || '/auth';
  //generate a csrf token
  csrf.generate(res, ctx);
  //get redirect from url query
  const redirect = req.data.path<string>('redirect_uri', '/');
  //get user from session
  const me = session.load(req);
  const guest = await me.guest();
  //if i am already signed in
  if (!guest) {
    //remove csrf
    csrf.clear(req, res, ctx);
    //redirect to home
    res.redirect(redirect);
    return;
  }
  //get the auth and profile id
  const profileId = String(req.data.path('profile', ''));
  const authId = String(req.data.path('auth', ''));
  const challenge = String(req.data.path('challenge', ''));
  if (!authId || !profileId) {
    res.redirect(`${base}/signin?redirect_uri=${encodeURIComponent(redirect)}`);
    return;
  }
  //get all the authentications for the user
  const search = await ctx.resolve<AuthExtended[]>('auth-search', {
    eq: { profileId },
  });
  //if there is an error
  if (search.code !== 200) {
    res.fromStatusResponse(search);
    return;
  } else if (!search.results?.length) {
    res.setError('No authentication methods found');
    return;
  }
  //find the current auth method
  const currentAuth = search.results.find((auth) => auth.id === authId);
  if (!currentAuth) {
    res.setError('Invalid authentication method');
    return;
  } else if (hash(currentAuth.consumed.toString()) !== challenge) {
    res.session.set(
      'flash',
      JSON.stringify({
        type: 'error',
        message: 'Two-factor authentication failed.',
      }),
    );
    res.redirect(
      `${base}/signin/${currentAuth.type}?redirect_uri=${encodeURIComponent(
        redirect,
      )}`,
    );
    return;
  }
  //find the 2FA authentication
  const twoFA = search.results.find((auth) => auth.type === '2fa');
  //if no 2fa
  if (!twoFA) {
    //prevent password signin on this page...
    req.data.set('password', false);
    //set auth type
    req.data.set('type', currentAuth.type);
    //set auth token
    req.data.set(currentAuth.type, currentAuth.token);
    //skip the 2FA redirect check after the challenge has passed
    req.data.set('2fa', false);
    //sign in
    await ctx.emit('auth-signin', req, res);
    //if not ok
    if (res.code !== 200) return;
    //remove csrf
    csrf.clear(req, res, ctx);
    //then redirect
    res.redirect(redirect);
    return;
  }
  //if we are here, the user has 2FA enabled
  if (req.method === 'POST') {
    //if invalid csrf
    if (!csrf.valid(req, res)) return;
    //validate the code
    const code = String(req.data.path('code', ''));
    const padded = code.padStart(6, '0');
    if (!code || padded.length < 6) {
      res.setError('Invalid code');
      return;
    }
    //verify the code
    const valid = verifyTOTP(padded, twoFA.token);
    if (!valid) {
      res.setError('Invalid code');
      return;
    }
    //prevent password signin on this page...
    req.data.set('password', false);
    //set auth type
    req.data.set('type', currentAuth.type);
    //set auth token
    req.data.set(currentAuth.type, currentAuth.token);
    //skip the 2FA redirect check after the challenge has passed
    req.data.set('2fa', false);
    //sign in
    await ctx.emit('auth-signin', req, res);
    //if not ok
    if (res.code !== 200) return;
    //remove csrf
    csrf.clear(req, res, ctx);
    //sign in successful, redirect
    res.redirect(redirect);
    return;
  }
}
