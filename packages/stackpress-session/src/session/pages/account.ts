//modules
import type { StatusResponse } from '@stackpress/lib/types';
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session/auth
import type { Auth, AuthExtended } from '../../auth/types.js';
//stackpress-session/profile
import type { ProfileExtended } from '../../profile/types.js';
//stackpress-session
import type { SessionPlugin } from '../types.js';

export type AccountProfile = ProfileExtended & {
  //e.g. auth: { email: { ... }, username: { ... }, { phone: { ... } }}
  auth: Record<string, Partial<Auth>>
};

export async function loadAccountProfile(
  ctx: Server,
  id: string
): Promise<Partial<StatusResponse<AccountProfile>>> {
  //Load the profile first because the auth records are only useful when
  // the account itself exists and can be returned to the view.
  const profile = await ctx.resolve<ProfileExtended>(
    'profile-detail',
    { id }
  );
  if (profile.code !== 200 || !profile.results) {
    return profile as Partial<StatusResponse<AccountProfile>>;
  }
  //Get editable sign-in identifiers so account pages can show and update
  // the linked username, email, and phone auth records.
  const auth = await ctx.resolve<AuthExtended[]>('auth-search', {
    eq: {
      profileId: id
    }
  });
  if (auth.code !== 200 || !auth.results?.length) {
    return auth as Partial<StatusResponse<AccountProfile>>;
  }
  //Attach public auth details to the profile without exposing secrets
  //to the client view.
  const results = profile.results as AccountProfile;
  results.auth = auth.results.reduce((map, item) => {
    map[item.type] = {
      id: item.id,
      type: item.type,
      token: item.token,
      verified: item.verified
    };
    return map;
  }, {} as AccountProfile['auth']);
  return {
    ...profile,
    results
  };
};

/**
 * Main page handler
 */
export default async function AccountPage(
  req: Request,
  res: Response,
  ctx: Server
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    return;
  }
  //get the session
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  const data = await me.data();
  if (!data || await me.guest()) {
    res.setStatus(401, 'Unauthorized');
    return;
  }
  //load account profile with linked auth records
  const profile = await loadAccountProfile(ctx, data.id);
  if (profile.code === 404) {
    res.setStatus(401, 'Unauthorized');
    return;
  }
  //sync profile response to response
  res.fromStatusResponse(profile);
  //pass the view props down to view
  setViewProps(req, res, ctx);
};