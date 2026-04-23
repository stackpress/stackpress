//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//view
import type { ViewConfig, BrandConfig } from '../../../view/types.js';
//session
import type { AuthConfig, SessionPlugin } from '../../types.js';

export default async function AuthAccountSecurityPage(
  req: Request,
  res: Response,
  ctx: Server,
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
        `${base}/account/security`,
      )}`,
    );
    return;
  }
}