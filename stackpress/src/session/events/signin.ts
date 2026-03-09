//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress
import type { AuthExtended } from '../../types.js';
import Exception from '../../Exception.js';
//stackpress/client
import type { ClientPlugin } from '../../client/types.js';
//stackpress/sql
import type { DatabasePlugin } from '../../sql/types.js';
//stackpress/session
import type { SessionPlugin, SigninType } from '../types.js';
import { signin } from '../actions.js';

export default async function AuthSignin(
  req: Request, 
  res: Response,
  ctx: Server
) {
  //get the type of signin username, email, phone
  const type = req.data.path('type', 'username') as SigninType;
  //get password
  const password = req.data.path('password', true);
  //get the database engine 
  const engine = ctx.plugin<DatabasePlugin>('database');
  //get the client
  const client = ctx.plugin<ClientPlugin>('client');
  //get the session seed
  //Q: Do I want to error if no seed?
  const seed = ctx.config.path('database.seed', 'abc123');
  //get the user from the database
  let results: Partial<AuthExtended> | null = null;
  try { //to sign in
    results = await signin(
      type, 
      req.data(), 
      seed, 
      engine, 
      client, 
      Boolean(password)
    );
  } catch (e) {
    const exception = Exception.upgrade(e as Error);
    res.setError(exception.toResponse());
    return;
  }
  //if no results
  if (results === null) {
    res.setError('User Not Found').setStatus(404, 'Not Found');
    return;
  }
  //remove sensitive data
  delete results.secret;
  //sync the response object with the response
  res.setResults(results);
  //get the session
  const session = ctx.plugin<SessionPlugin>('session');
  const profile = results.profile!;
  //set the cookie session in the response
  res.session.set(session.key, await session.create({
    id: profile.id, 
    name: profile.name,
    image: profile.image,
    roles: profile.roles
  }));
}