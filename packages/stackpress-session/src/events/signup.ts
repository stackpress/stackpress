//modules
import { action } from '@stackpress/ingest/Server';
//stackpress-sql
import type { 
  ClientPlugin,
  DatabasePlugin
} from 'stackpress-sql/types';
//stackpress-session
import type { PasswordConfig, ProfileAuth } from '../types.js';
import Exception from '../Exception.js';
import { signup } from '../actions.js';

export default action(async function AuthSignup({ req, res, ctx }) {
  //get the roles from the config
  const roles = ctx.config.path<string[]>('auth.roles', []);
  //get the database engine 
  const engine = ctx.plugin<DatabasePlugin>('database');
  //get the client
  const client = ctx.plugin<ClientPlugin>('client');
  //get the session seed
  const seed = ctx.config.path('database.seed', 'abc123');
  //get password config
  const password = ctx.config.path<PasswordConfig>('auth.password', {});
  //get input
  const input: Record<string, any> & { roles: string[] } = { 
    roles,
    ...(req.data() as Record<string, any>)
  };
  let results: Partial<ProfileAuth>; 
  try { //to sign up
    results = await signup(input, seed, engine, await client(), password);
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
