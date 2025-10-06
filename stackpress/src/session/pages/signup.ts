//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//view
import type { ViewConfig, BrandConfig } from '../../view/types.js';
//session
import type { SessionPlugin, AuthConfig } from '../types.js';


export default async function SignupPage(
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
    username: !!auth.username, 
    email: !!auth.email, 
    phone: !!auth.phone, 
    password: auth.password || {}
  });
  const redirect = req.data.path('redirect_uri', `${auth.base}/signin`);
  //get the session
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  const guest = await me.guest();
  //form submission
  if (req.method === 'POST') {

    //get the recaptcha token from the form
    const token = req.data.path('recaptcha_token', '');

    //verify the token
    const verifyToken = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHAV3_SECRETKEY || '',
        response: token,
      }),
    })

    //result of the verification request
    const tokenResult = await verifyToken.json();

    //if the token is invalid or the score is less than 0.4, do nothing
    if (!tokenResult.success || tokenResult.score < 0.4) {
      res.setHTML('Are you a robot? If not, please try signing up again.');
      return;
    }

    await ctx.emit('auth-signup', req, res);
    //if signup successful, redirect
    if (res.code === 200) {
      res.redirect(redirect);
    }
  //if i am already signed in
  } else if (!guest) {
    res.redirect(redirect);
  }
};
