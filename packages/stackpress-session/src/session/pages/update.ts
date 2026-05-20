//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session/session
import type { SessionPlugin } from '../types.js';
import { loadAccountProfile } from './account.js';

/**
 * Main page handler
 */
export default async function AccountUpdatePage(
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
  //load account profile
  const profile = await loadAccountProfile(ctx, data.id);
  //if profile returned 404 code
  if (profile.code === 404) {
    //return unauthorized error to client
    res.setStatus(401, 'Unauthorized');
    return;
  } else if (req.method === 'POST') {
    //if profile has no results, sync profile response to response
    if (profile.code !== 200 || !profile.results) {
      res.fromStatusResponse(profile);
      return;
    }
    //if we are here, we are ready to update profile and auth...
    const auth = profile.results.auth || {};
    const name = req.data('name');
    const image = req.data('image');
    await ctx.resolve('profile-update', { id: data.id, name, image }, res);
    if (res.code && res.code !== 200) {
      return;
    }
    //update username
    const username = await updateAuth(
      ctx,
      auth.username?.id,
      req.data('username')
    );
    //update email
    const email = await updateAuth(
      ctx,
      auth.email?.id,
      req.data('email')
    );
    //update phone
    const phone = await updateAuth(
      ctx,
      auth.phone?.id,
      req.data('phone')
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
};

export async function updateAuth(
  ctx: Server,
  id: string | undefined,
  token: string | undefined
) {
  //Skip missing records
  if (!id || typeof token === 'undefined') return null;
  //Update auth token
  return await ctx.resolve('auth-update', { id, token });
};
