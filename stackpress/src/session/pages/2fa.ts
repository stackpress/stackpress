//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//view
import type { ViewConfig, BrandConfig } from '../../view/types.js';
//session
import type { AuthConfig, Auth } from '../types.js';
import type { CsrfPlugin } from '../../types.js';
//local
import { verifyTOTP } from '../totp.js';
import { hash } from '../../schema/helpers.js';

/**
 * This page handles the second factor authentication step during sign-in.
 * 
 * route: /signin/2fa/:profileId/:authId/:challenge
 */
export default async function SignIn2FAPage(
  req: Request,
  res: Response,
  ctx: Server
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    return;
  }
  //get the view, brand and auth config
  const view = ctx.config.path<ViewConfig>('view', {});
  const brand = ctx.config.path<BrandConfig>('brand', {});
  const auth = ctx.config.path<AuthConfig>('auth');
  //get auth base
  const base = auth.base || '/auth';
  //set data for template layer
  res.data.set('view', {
    base: view.base || '/',
    props: view.props || {}
  });
  res.data.set('brand', {
    name: brand.name || 'Stackpress',
    logo: brand.logo || '/logo.png',
    icon: brand.icon || '/icon.png',  
    favicon: brand.favicon || '/favicon.ico'
  });
  res.data.set('auth', {
    base
  });
  //get redirect from url query
  const redirect = req.data.path<string>('redirect_uri', `/`);
  //get the auth and profile id
  const profileId = String(req.data.path('profile'));
  const authId = String(req.data.path('auth'));
  const challenge = String(req.data.path('challenge'));
  if (typeof authId !== 'string' 
    || authId.length === 0
    || typeof profileId !== 'string' 
    || profileId.length === 0
  ) {
    res.setError('Invalid user ID');
    return;
  }
  //get csrf plugin
  const csrf = ctx.plugin<CsrfPlugin>('csrf');
  csrf.generateToken(res, ctx);
  //get all the authentications for the user
  const search = await ctx.resolve<Auth[]>('auth-search', {
    eq: { profileId: profileId }
  });
  if (search.code !== 200) {
    res.fromStatusResponse(search);
    return;
  } else if (!search.results?.length) {
    res.setError('No authentication methods found');
    return;
  }
  //find the current auth method
  const currentAuth = search.results.find(auth => auth.id === authId);
  if (!currentAuth) {
    res.setError('Invalid authentication method');
    return;
  } else if (hash(currentAuth.consumed.toString()) !== challenge) {
    res.session.set('flash', JSON.stringify({
      type: 'error',
      message: 'Two-factor authentication failed.'
    }));
    if (currentAuth.type === 'email') {
      res.redirect(`${base}/signin/email?redirect_uri=${encodeURIComponent(redirect)}`);
    } else if (currentAuth.type === 'phone') {
      res.redirect(`${base}/signin/phone?redirect_uri=${encodeURIComponent(redirect)}`);
    } else {
      res.redirect(`${base}/signin/username?redirect_uri=${encodeURIComponent(redirect)}`);
    }
    return;
  }
  //find the 2FA authentication
  const twoFA = search.results.find(auth => auth.type === '2fa') as Auth;
  //if no 2fa record exists
  if (!twoFA) {
    //sign them in with the current auth method
    await ctx.resolve('auth-signin', {
      type: currentAuth.type,
      [currentAuth.type]: currentAuth.token,
      password: false
    }, res);
    //if there is an error, do nothing
    if (res.code !== 200) {
      return;
    }
    //then redirect
    res.redirect(redirect);
    return;
  }
  //if we get here, the user has 2FA enabled, so we need to verify the code
  if (req.method === 'POST') {
    //if csrf token is invalid, return
    if (!csrf.validateToken(req, res)) return;
    //validate the code
    const code = String(req.data.path('code'));
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
    //At this point, the user is verified.
    //sign them in with the current auth method
    await ctx.resolve('auth-signin', {
      type: currentAuth.type,
      [currentAuth.type]: currentAuth.token,
      password: false
    }, res);
    //if there is an error, do nothing
    if (res.code !== 200) {
      return;
    }
    //then redirect
    res.redirect(redirect);
    return;
  }
}
