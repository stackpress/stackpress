//modules
import { action } from '@stackpress/ingest/Server';
//stackpress-session
import Exception from '../../Exception.js';
//stackpress-session/profile
import type { ProfileAuth } from '../../profile/types.js';
//stackpress-session/auth
import AuthActions from '../AuthActions.js';
import { normalizePhone } from '../helpers.js';

export default action(async function AuthSignup({ req, res, ctx }) {
  //get the roles from the config
  const roles = ctx.config.path<string[]>('auth.roles', []);
  //get actions
  const actions = AuthActions.make(ctx);
  //get input
  const input: Record<string, any> & { roles: string[] } = { 
    roles,
    ...(req.data() as Record<string, any>)  
  };
  //normalize the phone
  input.phone = normalizePhone(input.phone);
  let results: Partial<ProfileAuth>; 
  try { //to sign up
    results = await actions.signup(input);
  } catch (e) {
    const exception = Exception.upgrade(e as Error);
    //if e is an exception with errors
    //NOTE: we cant rely on instanceof...
    if ((e as Exception).errors) {
      exception.withErrors((e as Exception).errors);
    }
    res.setError(exception.toResponse());
    return;
  }
  //if email was provided
  if (input.email) {
    ctx.resolve('email-email-send', { email: input.email, ...results });
  }
  //if phone was provided
  if (input.phone) {
    ctx.resolve('auth-phone-verify', { phone: input.phone, ...results });
  }
  //if there is an email
  if (results.auth?.email) {
    //remove sensitive data
    delete results.auth.email.secret;
  }
  //if there is an phone
  if (results.auth?.phone) {
    //remove sensitive data
    delete results.auth.phone.secret;
  }
  //if there is an username
  if (results.auth?.username) {
    //remove sensitive data
    delete results.auth.username.secret;
  }
  
  res.results(results);
});
