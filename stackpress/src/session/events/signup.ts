//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//root
import type { ClientPlugin, DatabasePlugin } from '../../types';
//session
import { signup } from '../../session/actions';

export default async function AuthSignup(
  req: Request, 
  res: Response,
  ctx: Server
) {
  //get the roles from the config
  const roles = ctx.config<string[]>('session', 'auth', 'roles') || [];
  //get the database engine 
  const engine = ctx.plugin<DatabasePlugin>('database');
  //get the client
  const client = ctx.plugin<ClientPlugin>('client');
  //get the session seed
  const seed = ctx.config.path('session.seed', 'abc123');
  //get input
  const input = { roles, ...req.data() };
  const response = await signup(input, seed, engine, client);
  //if good
  if (response.code === 200) {
    if (input.email) {
      ctx.resolve('email-email-send', { 
        email: input.email, 
        ...response.results 
      });
    }
    if (input.phone) {
      ctx.resolve('auth-phone-verify', { 
        phone: input.phone, 
        ...response.results 
      });
    }
  }
  //if there is an email
  if (response.results?.auth.email) {
    //remove sensitive data
    delete response.results.auth.email.secret;
  }
  //if there is an phone
  if (response.results?.auth.phone) {
    //remove sensitive data
    delete response.results.auth.phone.secret;
  }
  //if there is an username
  if (response.results?.auth.username) {
    //remove sensitive data
    delete response.results.auth.username.secret;
  }
  
  res.fromStatusResponse(response);
}