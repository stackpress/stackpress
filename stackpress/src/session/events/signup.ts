//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress
import Exception from '../../Exception.js';
//stackpress/client
import type { ClientPlugin } from '../../client/types.js';
//stackpress/sql
import type { DatabasePlugin } from '../../sql/types.js';
//stackpress/session
import type { ProfileAuth } from '../types.js';
import { signup } from '../actions.js';
//stackpress/captcha
import { verifyCaptcha } from '../../captcha/verify.js';

export default async function AuthSignup(
  req: Request, 
  res: Response,
  ctx: Server
) {
  //verify captcha
  if (!(await verifyCaptcha(ctx, req, res, 'signup'))) return;
  //get the roles from the config
  const roles = ctx.config.path<string[]>('auth.roles', []);
  //get the database engine 
  const engine = ctx.plugin<DatabasePlugin>('database');
  //get the client
  const client = ctx.plugin<ClientPlugin>('client');
  //get the session seed
  const seed = ctx.config.path('database.seed', 'abc123');
  //get input
  const input = { roles, ...req.data() };
  let results: Partial<ProfileAuth>; 
  try { //to sign up
    results = await signup(input, seed, engine, client);
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
  
  res.setResults(results);
}