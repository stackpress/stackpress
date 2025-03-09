//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//root
import type { 
  ClientPlugin, 
  AuthExtended, 
  SessionPlugin,
  DatabasePlugin 
} from '../../../types';
//local
import { signin } from '../../../session/actions';

export default async function AuthSignin(req: ServerRequest, res: Response) {
  //get the type of signin username, email, phone
  const type = req.data('type') || 'username';
  //get the server
  const server = req.context;
  //get the database engine 
  const engine = server.plugin<DatabasePlugin>('database');
  //get the client
  const client = server.plugin<ClientPlugin>('client');
  //get the session seed
  const seed = server.config.path('session.seed', 'abc123');
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
  const registry = req.context.plugin<SessionPlugin>('session');
  //get the results from the response object
  const results = response.results as AuthExtended;
  //set the cookie session in the response
  res.session.set(registry.name, registry.create({
    id: results.profile.id, 
    name: results.profile.name,
    image: results.profile.image,
    roles: results.profile.roles
  }));
}