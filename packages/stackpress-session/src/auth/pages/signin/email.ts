//modules
import type { SendMailOptions } from 'nodemailer';
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
import { action } from '@stackpress/ingest/Server';
//stackpress-csrf
import type { CsrfPlugin } from 'stackpress-csrf/types';
//stackpress-email
import type { EmailConfig } from 'stackpress-email/types';
//stackpress-schema
import { hash } from 'stackpress-schema/helpers';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session/session
import type { SessionPlugin } from '../../../session/types.js';
//stackpress-session/auth
import type { AuthConfig, AuthExtended } from '../../types.js';
import {
  makeMagicLinkTemplate,
  makeOTPTemplate
} from './../../templates.js';

/**
 * Main page handler
 */
export default action(async function EmailSignInPage({ req, res, ctx }) {
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
    //get sign-in method
    const method = req.data.path('auth', 'pass');
    //if authentication method is with password
    if (method === 'pass') {
      await PasswordSignin(req, res, ctx);
      //if authentication method is with otp
    } else if (method === 'otp') {
      await OTPSignin(req, res, ctx);
      //if authentication method is with magic
    } else if (method === 'magic') {
      await MagicLinkSignin(req, res, ctx);
    } else {
      //set error if sign-in method is invalid
      res.setError('Invalid Parameters', {
        auth: 'Invalid sign-in method'
      });
    }
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
});

/**
 * Completes the classic email-and-password sign-in flow.
 */
export async function PasswordSignin(
  req: Request,
  res: Response,
  ctx: Server
): Promise<void> {
  //prevent passwordless sign in on this page...
  req.data.set('password', true);
  //set auth type
  req.data.set('type', 'email');
  //sign in
  await ctx.emit('auth-signin', req, res);
  //if not ok
  if (res.code !== 200) return;
  //get csrf plugin
  const csrf = ctx.plugin<CsrfPlugin>('csrf');
  //remove csrf
  csrf.clear(req, res, ctx);
  //sign in successful, redirect
  res.redirect(req.data.path('redirect_uri', '/'));
}

/**
 * Sends a one-time pin email, then redirects the browser to the OTP challenge page.
 */
export async function OTPSignin(
  req: Request,
  res: Response,
  ctx: Server
): Promise<void> {
  //get email
  const email = req.data.path('email', '').trim();
  //if no email
  if (!email) {
    //set an error
    res.setError('Invalid Parameters', {
      email: 'Email Address is required'
    });
    return;
  }
  //get auth record of type email
  const response = await ctx.resolve<AuthExtended[]>('auth-search', {
    columns: [ '*', 'profile.*' ],
    eq: { type: 'email', token: email }
  });
  //if not ok
  if (response.code !== 200) {
    //sync the response object with the response
    res.fromStatusResponse(response);
    return;
  }
  //get the auth record
  const current = response.results?.[0];
  //if no auth record
  if (!current) {
    //set error
    res.setError('Invalid Parameters', { email: 'Account not found' });
    return;
  }
  //get auth config
  const auth = ctx.config<AuthConfig>('auth');
  const base = auth.base || '/auth';
  //get redirect from url query
  const redirect = req.data.path<string>('redirect_uri', '/');
  //prepare the delivery context that the email template needs
  const port = ctx.config.path('server.port', 3000);
  const host = ctx.config.path('host', `http://localhost:${port}`);
  const brand = ctx.config.path('brand.name', 'Stackpress');
  //generate code
  const code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  //bind the otp code to the consumed timestamp
  const challenge = hash(current.consumed.toString() + code);
  //build the challenge link
  const link = `${base}/signin/otp/${encodeURIComponent(current.id)}/${
    encodeURIComponent(challenge)
  }?redirect_uri=${encodeURIComponent(redirect)}`;
  //get email config
  const config = ctx.config<EmailConfig>('email');
  //if no config, do nothing.
  if (!config) return;
  //make the otp template
  const template = makeOTPTemplate({
    brand,
    email,
    link: `${host}${link}`,
    name: current.profile?.name,
    pin: code
  });
  //if no name or email address given
  if (!auth.email?.address || !auth.email.name) {
    //do not send email
    return;
  }
  //form email data
  const mail: SendMailOptions = {
    from: { name: auth.email.name, address: auth.email.address },
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html
  };
  //send email
  const sent = await ctx.resolve('email-send', mail, res);
  //if not ok
  if (sent.code !== 200) {
    //sync sent response object to response
    res.fromStatusResponse(sent);
    return;
  }
  //get csrf plugin
  const csrf = ctx.plugin<CsrfPlugin>('csrf');
  //remove csrf
  csrf.clear(req, res, ctx);
  //redirect to challenge
  res.redirect(link);
}

/**
 * Sends a magic-link email without signing the user in on this first step.
 */
export async function MagicLinkSignin(
  req: Request,
  res: Response,
  ctx: Server
): Promise<void> {
  //get email
  const email = req.data.path('email', '').trim();
  //if no email
  if (!email) {
    //set an error
    res.setError('Invalid Parameters', {
      email: 'Email Address is required'
    });
    return;
  }
  //get auth record
  const response = await ctx.resolve<AuthExtended[]>('auth-search', {
    columns: [ '*', 'profile.*' ],
    eq: { type: 'email', token: email }
  });
  //if not ok
  if (response.code !== 200) {
    //sync response object to response
    res.fromStatusResponse(response);
    return;
  }
  //get first current auth record
  const current = response.results?.[0];
  if (!current) {
    res.setError('Invalid Parameters', { email: 'Account not found' });
    return;
  }
  //get auth config
  const auth = ctx.config<AuthConfig>('auth');
  const base = auth.base || '/auth';
  //reuse the current host and brand config so the email can deep-link back here
  const redirect = req.data.path<string>('redirect_uri', '/');
  const port = ctx.config.path('server.port', 3000);
  const host = ctx.config.path('host', `http://localhost:${port}`);
  const brand = ctx.config.path('brand.name', 'Stackpress');
  //create challenge
  const challenge = hash(current.consumed.toString());
  //build the link
  const link = `${base}/signin/link/${encodeURIComponent(current.id)}/${
    encodeURIComponent(challenge)
  }?redirect_uri=${encodeURIComponent(redirect)}`;
  //get email config
  const config = ctx.config<EmailConfig>('email');
  //if no config, do nothing.
  if (!config) return;
  //make magic link template
  const template = makeMagicLinkTemplate({
    brand,
    email,
    link: `${host}${link}`,
    name: current.profile?.name
  });
  //if no name or email address given
  if (!auth.email?.address || !auth.email.name) {
    //do not send email
    return;
  }
  //form email data
  const mail: SendMailOptions = {
    from: { name: auth.email.name, address: auth.email.address },
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html
  };
  //send email
  const sent = await ctx.resolve('email-send', mail, res);
  //if not ok
  if (sent.code !== 200) {
    //sync sent response object to response
    res.fromStatusResponse(sent);
    return;
  }
}
