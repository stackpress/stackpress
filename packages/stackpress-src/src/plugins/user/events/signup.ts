//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//plugins
import type { DatabasePlugin } from '@/plugins/sql/types';
//local
import type { Client } from '../types';
import { signup } from '../actions';

export default async function AuthSignup(req: ServerRequest, res: Response) {
  //get the roles from the config
  const roles = req.context.config<string[]>('session', 'auth', 'roles') || [];
  //get the server
  const server = req.context;
  //get the database engine 
  const engine = server.plugin<DatabasePlugin>('database');
  //get the client
  const client = server.plugin<Client>('client');
  //get the session seed
  const seed = server.config.path('session.seed', 'abc123');
  //get input
  const input = { roles, ...req.data() };
  const response = await signup(input, seed, engine, client);
  //if good
  if (response.code === 200) {
    //get server
    const server = req.context;
    if (input.email) {
      server.call('email-email-send', { 
        email: input.email, 
        ...response.results 
      });
    }
    if (input.phone) {
      server.call('auth-phone-verify', { 
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