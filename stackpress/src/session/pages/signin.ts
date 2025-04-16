//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//view
import type { ViewConfig, BrandConfig } from '../../view/types.js';
//session
import type { AuthConfig, SigninType, SessionPlugin } from '../types.js';

export default async function SignInPage(
  req: Request, 
  res: Response,
  ctx: Server
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  //get the view, brand and auth config
  const view = ctx.config.path<ViewConfig>('view', {});
  const brand = ctx.config.path<BrandConfig>('brand', {});
  const auth = ctx.config.path<AuthConfig>('auth');
  //set data for template layer
  res.data.set('view', { 
    base: view.base || '/',
    props: view.props || {}
  });
  res.data.set('brand', { 
    name: brand.name || 'Stackpress',
    logo: brand.logo || '/logo.png',
    icon: brand.icon || '/icon.png',
    favicon: brand.favicon || '/favicon.ico',
  });
  res.data.set('auth', { 
    base: auth.base || '/auth',
    roles: auth.roles || [], 
    username: auth.username, 
    email: auth.email, 
    phone: auth.phone, 
    password: auth.password
  });
  // /auth/signin/:type
  const { redirect_uri: redirect = '/' } = req.data<{ 
    type: SigninType, 
    redirect_uri: string 
  }>();
  //get the session
  const session = ctx.plugin<SessionPlugin>('session');
  const { guest } = session.load(req);
  //form submission
  if (req.method === 'POST') {
    //sign in
    await ctx.emit('auth-signin', req, res);
    //if there is an error, do nothing
    if (res.code !== 200) return;
    //redirect
    res.redirect(redirect);
    return;
  //if there is already a session
  } else if (!guest) {
    res.redirect(redirect);
  }
};