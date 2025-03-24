//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//root
import type { 
  ClientPlugin, 
  AuthExtended, 
  SessionPlugin,
  DatabasePlugin 
} from '../../../types';
//local
import { signin } from '../../../session/actions';

export default async function AuthSignin(
  req: Request, 
  res: Response,
  ctx: Server
) {
  //get the type of signin username, email, phone
  const type = req.data('type') || 'username';
  //get the database engine 
  const engine = ctx.plugin<DatabasePlugin>('database');
  //get the client
  const client = ctx.plugin<ClientPlugin>('client');
  //get the session seed
  const seed = ctx.config.path('session.seed', 'abc123');
  //get the user from the database
  const response = await signin(type, req.data(), seed, engine, client);
  //if there are results
  if (response.results) {
    //remove sensitive data
    const results = response.results as Partial<AuthExtended>;
    delete results.secret;
  }
  //sync the response object with the response
  res.fromStatusResponse(response);
  //if error
  if (response.code !== 200) {
    //do nothing else
    return;
  }
  //get the session
  const registry = ctx.plugin<SessionPlugin>('session');
  //get the results from the response object
  const results = response.results as AuthExtended;
  //set the cookie session in the response
  res.session.set(registry.key, registry.create({
    id: results.profile.id, 
    name: results.profile.name,
    image: results.profile.image,
    roles: results.profile.roles
  }));
}