//modules
import { action } from '@stackpress/ingest/Server';
//stackpress-schema
import { hash } from 'stackpress-schema/helpers';
//stackpress-csrf
import type { CsrfPlugin } from 'stackpress-csrf/types';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session/session
import type { SessionPlugin } from '../../../session/types.js';
//stackpress-session/auth
import type { AuthConfig, AuthExtended } from '../../types.js';

/**
 * Main page handler
 */
export default action(async function OTPSignInPage({ req, res, ctx }) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  //get session plugin
  const session = ctx.plugin<SessionPlugin>('session');
  //get csrf plugin
  const csrf = ctx.plugin<CsrfPlugin>('csrf');
  //get the auth config
  const auth = ctx.config.path<AuthConfig>('auth');
  //get redirect
  const redirect = req.data.path<string>('redirect_uri', '/');
  //get me
  const me = session.load(req);
  //skip otp screen for signed-in users
  if (!await me.guest()) {
    csrf.clear(req, res, ctx);
    res.redirect(redirect);
    return;
  }
  //pass the view props down to view
  setViewProps(req, res, ctx);
  //set auth props for view as well
  res.data.set('auth', {
    base: auth.base || '/auth',
    roles: auth.roles || [],
    menu: auth.menu || [],
    password: auth.password || {}
  });
  //generate csrf
  csrf.generate(res, ctx);
  //get auth
  const authId = req.data.path('auth', '');
  //get challenge
  const challenge = req.data.path('challenge', '');
  //reject incomplete links early because there is no record or
  // challenge to validate against once either route parameter is missing.
  if (!authId || !challenge) {
    res.statusCode(404, 'Not Found');
    res.setError('One-time password link is invalid or expired.');
    return;
  }
  //get the auth record behind the OTP link
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
  const found = current.results?.[0];
  //if no record found
  if (!found) {
    //set error as expired-link
    res.statusCode(404, 'Not Found');
    res.setError('One-time password link is invalid or expired.');
    return;
  }
  //remove the stored secret before the view sees the auth payload
  const { secret: _secret, ...results } = found;
  //set results
  res.results(results);
  //stop on GET after the auth payload is ready so the form can render
  // without running any of the OTP submission checks below.
  if (req.method !== 'POST') {
    return;
  }
  //check if csrf is valid
  if (!csrf.valid(req, res)) return;
  //continue on validation check
  const code = String(req.data.path('code', '')).trim();
  const padded = code.padStart(6, '0');
  //normalize the user input to six digits so short entries can still
  // match the stored OTP challenge format.
  if (!code || padded.length !== 6) {
    res.setError('Invalid Parameters', { code: 'OTP code is required' });
    return;
  }
  //match the expected answer from the consumed timestamp and the
  // submitted code
  const answer = hash(results.consumed.toString() + padded);
  if (answer !== challenge) {
    //set error if answer and challenge mismatched
    res.setError('Invalid OTP Code', {
      code: 'The OTP code is invalid or has expired'
    });
    return;
  }
  //remove csrf
  csrf.clear(req, res, ctx);
  //if we are here OTP challenge passes, hand the user off to the shared
  // 2FA route so email OTP and app-based 2FA continue through the same
  // final checkpoint.
  const twoFactorChallenge = hash(results.consumed.toString());
  res.redirect(
    `${auth.base}/signin/2fa/${encodeURIComponent(results.profileId)}/${
      encodeURIComponent(results.id)
    }/${encodeURIComponent(twoFactorChallenge)}?redirect_uri=${
      encodeURIComponent(redirect)
    }`
  );
});
