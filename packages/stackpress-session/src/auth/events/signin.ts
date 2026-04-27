//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress-session
import type { SessionPlugin } from '../../session/types.js';
import type { AuthExtended, SigninType } from '../types.js';
import AuthActions from '../AuthActions.js';
import Exception from '../Exception.js';

export default async function AuthSignin(
  req: Request, 
  res: Response,
  ctx: Server
) {
  //get the type of signin username, email, phone
  const type = req.data.path('type', 'username') as SigninType;
  //get actions
  const actions = AuthActions.make(ctx);
  //get the user from the database
  let results: Partial<AuthExtended>;
  try { //to sign in
    results = await actions.signin(type, req.data());
  } catch (e) {
    const exception = Exception.upgrade(e as Error);
    res.setError(exception.toResponse());
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
    image: profile.image || undefined,
    roles: Array.isArray(profile.roles) && profile.roles.length > 0 
      ? profile.roles 
      : [ 'GUEST' ]
  }));
}