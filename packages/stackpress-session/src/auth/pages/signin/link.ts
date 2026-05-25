//modules
import { action } from '@stackpress/ingest/Server' 
//stackpress-schema
import { hash } from 'stackpress-schema/helpers';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session/session
import type { SessionPlugin } from '../../../session/types.js';
//stackpress-session/auth
import type { AuthConfig, AuthExtended } from '../../types.js';

/**
 * Main page handler
 */
export default action(async function MagicLinkSignInPage({ req, res, ctx }) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  //get session plugin
  const session = ctx.plugin<SessionPlugin>('session');
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
  //get redirect
  const redirect = req.data.path<string>('redirect_uri', '/');
  //load session
  const me = session.load(req);
  //skip magic-link validation for signed-in users 
  if (!await me.guest()) {
    //redirect
    res.redirect(redirect);
    return;
  }
  //get auth
  const authId = req.data.path('auth', '');
  //get challenge
  const challenge = req.data.path('challenge', '');
  //reject incomplete links early because there is no way to verify
  if (!authId || !challenge) {
    res.statusCode(404, 'Not Found');
    res.setError('Magic link is invalid or expired.');
    return;
  }
  //get the auth record behind the magic link
  const current = await ctx.resolve<AuthExtended[]>('auth-search', {
    eq: { id: authId }
  });
  //if there's an error
  if (current.code !== 200) {
    //sync current response object to response
    res.fromStatusResponse(current);
    return;
  }
  //get first result
  const results = current.results?.[0];
  //treat any missing record or mismatched hash as the same expired-link
  if (!results || hash(results.consumed.toString()) !== challenge) {
    res.statusCode(404, 'Not Found');
    res.setError('Magic link is invalid or expired.');
    return;
  }
  //if we are here the magic-link proof passes, reuse the shared 2FA 
  // route so email sign-in and app-based 2FA finish through one final 
  // checkpoint.
  const twoFactorChallenge = hash(results.consumed.toString());
  res.redirect(
    `${auth.base}/signin/2fa/${encodeURIComponent(results.profileId)}/${
      encodeURIComponent(results.id)
    }/${encodeURIComponent(twoFactorChallenge)}?redirect_uri=${
      encodeURIComponent(redirect)
    }`
  );
});
