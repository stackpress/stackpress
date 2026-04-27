//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress-schema
import { hash } from 'stackpress-schema/helpers';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session
import type { AuthExtended, AuthPasswordConfig, SessionPlugin } from '../../types.js';
import { isSpecialChars } from '../../helpers.js';

/**
 * Main page handler
 */
export default async function AccountUpdatePage(
  req: Request,
  res: Response,
  ctx: Server
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    return;
  }
  //get the session
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  const data = await me.data();
  if (!data || await me.guest()) {
    res.setStatus(401, 'Unauthorized');
    return;
  }
  await ctx.resolve('profile-detail', { id: data.id }, res);
  if (res.code === 404) {
    res.setStatus(401, 'Unauthorized');
    return;
  } else if (req.method === 'POST') {
    const secret = req.data('secret');
    const current = req.data('current');
    //get password config
    const password = ctx.config.path<AuthPasswordConfig>('auth.password', {});
    //do initial check
    const errors = assert(secret, current, password);
    //if there are any errors
    if (errors) {
      //set the error and return
      res.setError('Invalid Parameters', errors);
      return;
    }

    //get auth records for the user (username, email, phone)
    const auths = await ctx.resolve<AuthExtended[]>('auth-search', { 
      eq: { 
        profileId: data.id,
        type: [ 'username', 'email', 'phone' ]
      }
    });
    //if no results
    if (!auths.results || auths.results.length === 0) {
      res.setError('No authentication found.');
      return;
    //if current password does not match any of the auth records
    } else if (!auths.results.find(auth => auth.secret === hash(current))) {
      //set the error and return
      res.setError('Invalid Parameters', {
        current: 'Current password is incorrect'
      });
      return;
    }
    //now we can proceed to update the password for all auth records
    for (const auth of auths.results) {
      //update the auth record with the new password
      await ctx.resolve('auth-update', { id: auth.id, secret: secret });  
    }
    res.session.set('flash', JSON.stringify({ 
      type: 'success', 
      message: 'Your password has been updated.' 
    }));
    const base = ctx.config.path('auth.base', '/auth');
    res.redirect(`${base}/account`);
    return;
  }
  //pass the view props down to view
  setViewProps(req, res, ctx);
};

export function assert(
  secret: string, 
  current: string, 
  password: AuthPasswordConfig = {}
) {
  const errors: Record<string, string> = {};
  if (!secret) {
    errors.secret = 'Password is required';
  } else if (password.min && secret.length < password.min) {
    errors.secret = `Password must be at least ${password.min} characters`;
  } else if (password.max && secret.length > password.max) {
    errors.secret = `Password must be less than ${password.max} characters`;
  } else if (password.upper && !/[A-Z]/.test(secret)) {
    errors.secret = 'Password must contain at least one uppercase letter';
  } else if (password.lower && !/[a-z]/.test(secret)) {
    errors.secret = 'Password must contain at least one lowercase letter';
  } else if (password.number && !/[0-9]/.test(secret)) {
    errors.secret = 'Password must contain at least one number';
  } else if (password.special && !isSpecialChars.test(secret)) {
    errors.secret = 'Password must contain at least one special character';
  }
  if (!current) {
    errors.current = 'Current password is required';
  } else if (current === secret) {
    errors.current = 'Current password must be different from new password';
  }
  return Object.keys(errors).length > 0 ? errors : null;
};