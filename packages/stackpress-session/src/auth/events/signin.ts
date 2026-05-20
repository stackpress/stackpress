//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress-schema
import { hash } from 'stackpress-schema/helpers';
//stackpress-session
import Exception from '../../Exception.js';
//stackpress-session/session
import type { SessionPlugin } from '../../session/types.js';
//stackpress-session/auth
import type { AuthExtended, AuthConfig, SigninType } from '../types.js';
import AuthActions from '../AuthActions.js';

export default async function AuthSignin(
  req: Request, 
  res: Response,
  ctx: Server
) {
  //get the type of signin username, email, phone
  const type = req.data.path('type', 'username') as SigninType;
  //determine if password validation should be used
  const password = req.data.path('password', true);
  //get actions
  const actions = AuthActions.make(ctx);
  //get the user from the database
  let results: Partial<AuthExtended>;
  try { //to sign in
    results = await actions.signin(type, req.data(), Boolean(password));
  } catch (e) {
    const exception = Exception.upgrade(e as Error);
    res.setError(exception.toResponse());
    return;
  }
  //get the auth config
  const auth = ctx.config.path<AuthConfig>('auth');
  //get the auth base path
  const base = auth.base || '/auth';
  //if 2fa should be checked
  if (req.data.path('2fa', true) !== false) {
    //get the values needed to build a 2fa challenge
    const profileId = results.profileId;
    const authId = results.id;
    const consumed = results.consumed;
    //if we cannot build a challenge
    if (!profileId || !authId || !consumed) {
      //redirect to signin
      res.redirect(`${base}/signin`);
      return;
    }
    //search for 2fa enabled for this profile
    const twoFA = await ctx.resolve<AuthExtended[]>('auth-search', {
      eq: { type: '2fa', profileId }
    });
    //if there was a search error
    if (twoFA.code !== 200) {
      res.fromStatusResponse(twoFA);
      return;
    //if the user has 2fa enabled
    } else if (twoFA.results?.length) {
      //get the post 2fa redirect path
      const redirect = req.data.path<string>('redirect_uri', '/');
      //hash the persisted consumed date to create the challenge
      const challenge = hash(consumed.toString());
      //redirect to 2fa before creating the session
      res.redirect(
        `${base}/signin/2fa/${encodeURIComponent(
          profileId
        )}/${encodeURIComponent(authId)}/${encodeURIComponent(
          challenge
        )}?redirect_uri=${encodeURIComponent(redirect)}`
      );
      return;
    }
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