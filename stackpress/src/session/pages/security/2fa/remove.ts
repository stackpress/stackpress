//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//view
import type { ViewConfig, BrandConfig } from '../../../../view/types.js';
//session
import type { AuthConfig, SessionPlugin } from '../../../types.js';
//csrf
import type { CsrfPlugin } from '../../../../types.js';

export default async function Security2FAPage(
  req: Request,
  res: Response,
  ctx: Server,
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    return;
  }
  //only allow POST
  if (req.method !== 'POST') {
    res.setError('Method Not Allowed', {}, [], 405);
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
    props: view.props || {},
  });
  res.data.set('brand', {
    name: brand.name || 'Stackpress',
    logo: brand.logo || '/logo.png',
    icon: brand.icon || '/icon.png',
    favicon: brand.favicon || '/favicon.ico',
  });
  res.data.set('auth', {
    base: auth.base || '/auth',
  });
  //get the session
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  const guest = await me.guest();
  const data = await me.data();
  //if not signed in, redirect to the redirect URI
  if (guest || !data) {
    res.redirect(
      `${base}/signin?redirect_uri=${encodeURIComponent(
        `${base}/account/security/2fa`,
      )}`,
    );
    return;
  }
  //do not proceed if csrf token is invalid
  const csrf = ctx.plugin<CsrfPlugin>('csrf');
  if (!csrf.validateToken(req, res)) return;
  //get authId from request data
  const authId = String(req.data.path('authId'));
  //if authId is not present
  if (!authId) {
    //set an error
    res.setError('Invalid authentication record.');
    //and redirect back to 2FA page
    res.redirect(`${base}/account/security/2fa`);
    return;
  }

  //proceed to remove the 2FA record...

  //search for the auth record to ensure it exists and belongs to the user
  const exists = await ctx.resolve('auth-search', {
    id: authId,
    profileId: data.id,
    type: '2fa',
  });
  //if there is an error
  if (exists.code !== 200) {
    //set an error
    res.fromStatusResponse(exists);
    return;
  }
  //remove the auth record
  const removed = await ctx.resolve('auth-remove', {
    id: authId,
    profileId: data.id,
    type: '2fa',
  });
  //if there is an error
  if (removed.code !== 200) {
    //set an error
    res.fromStatusResponse(removed);
    return;
  }
  //show a success message and redirect back to the security page
  res.session.set(
    'flash',
    JSON.stringify({
      type: 'success',
      message: 'Two-Factor Authentication has been removed successfully.',
      close: 3000,
    }),
  );
  res.redirect(`${base}/account/security/2fa`);
  return;
}
