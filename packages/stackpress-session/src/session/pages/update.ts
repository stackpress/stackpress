//modules
import type Server from '@stackpress/ingest/Server';
import { action } from '@stackpress/ingest/Server'
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session/auth
import { normalizePhone } from '../../auth/helpers.js';
import type { Auth, AuthExtended } from '../../auth/types.js';
//stackpress-session/session
import type { SessionPlugin } from '../types.js';
import { loadAccountProfile } from './account.js';

/**
 * Main page handler
 */
export default action(async function AccountUpdatePage({ req, res, ctx }) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    return;
  }
  //get the session
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  const data = await me.data();
  if (!data || await me.guest()) {
    res.statusCode(401, 'Unauthorized');
    return;
  }
  //load account profile
  const profile = await loadAccountProfile(ctx, data.id);
  //if profile returned 404 code
  if (profile.code === 404) {
    //return unauthorized error to client
    res.statusCode(401, 'Unauthorized');
    return;
  } else if (req.method === 'POST') {
    //if profile has no results, sync profile response to response
    if (profile.code !== 200 || !profile.results) {
      res.fromStatusResponse(profile);
      return;
    }
    //if we are here, we are ready to update profile and auth...
    const auth = profile.results.auth || {};
    const current = await ctx.resolve<AuthExtended[]>('auth-search', {
      eq: { profileId: data.id }
    });
    if (current.code !== 200) {
      res.fromStatusResponse(current);
      return;
    }
    const secret = current.results?.find(auth =>
      auth.type === 'username'
      || auth.type === 'email'
      || auth.type === 'phone'
    )?.secret;
    const name = req.data('name');
    const image = req.data('image');
    await ctx.resolve('profile-update', { id: data.id, name, image }, res);
    if (res.code && res.code !== 200) {
      return;
    }
    //update username
    const username = await updateAuth(
      ctx,
      data.id,
      'username',
      auth.username?.id,
      req.data('username'),
      secret
    );
    //update email
    const email = await updateAuth(
      ctx,
      data.id,
      'email',
      auth.email?.id,
      req.data('email'),
      secret
    );
    //update phone
    const phone = await updateAuth(
      ctx,
      data.id,
      'phone',
      auth.phone?.id,
      normalizePhone(req.data('phone')),
      secret
    );
    //if there was an error with auth types, sync to response
    if (username?.code && username.code !== 200) {
      res.fromStatusResponse(username);
      return;
    } else if (email?.code && email.code !== 200) {
      res.fromStatusResponse(email);
      return;
    } else if (phone?.code && phone.code !== 200) {
      res.fromStatusResponse(phone);
      return;
    }
    //if you reached here, update was successful
    if (res.code === 200) {
      const base = ctx.config.path('auth.base', '/auth');
      //redirect to account detail page
      res.redirect(`${base}/account`);
      return;
    }
  }
  //sync profile response to response
  res.fromStatusResponse(profile);
  //pass the view props down to view
  setViewProps(req, res, ctx);
});

export async function updateAuth(
  ctx: Server,
  profileId: string,
  type: Auth['type'],
  id: string | undefined,
  token: string | null | undefined,
  secret?: string
) {
  //skip empty values, but do not treat them as deletes
  if (typeof token !== 'string' || token.trim().length === 0) {
    return null;
  }
  //update existing auth token
  if (id) {
    return await ctx.resolve('auth-update', { id, token });
  }
  //otherwise, create the missing auth record
  return await ctx.resolve('auth-create', { profileId, type, token, secret });
};
