//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress-schema
import { hash } from 'stackpress-schema/helpers';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session/auth
import type { AuthExtended } from '../../auth/types.js';
//stackpress-session/session
import type { SessionPlugin } from '../types.js';

/**
 * Main page handler
 */
export default async function AccountRemovePage(
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
  await ctx.resolve('profile-detail', { id: data.id }, res);
  if (res.code === 404) {
    res.setStatus(401, 'Unauthorized');
    return;
  } else if (req.method === 'POST' && req.data('confirmed')) {
    //Require the current password before deleting account records so the
    // security action cannot be triggered by an active session alone.
    const secret = req.data('secret');
    const auths = await ctx.resolve<AuthExtended[]>('auth-search', {
      eq: {
        profileId: data.id
      },
    });
    if (auths.code !== 200) {
      res.fromStatusResponse(auths);
      return;
    } else if (!secret) {
      res.setError('Invalid Parameters', {
        secret: 'Password is required',
      });
      return;
    } else if (!auths.results || auths.results.length === 0) {
      res.setError('No authentication found.');
      return;
    } else if (
      !auths.results.find((auth) => auth.secret === hash(secret.toString()))
    ) {
      res.setError('Invalid Parameters', {
        secret: 'Password is incorrect',
      });
      return;
    }
    //Remove linked sign-in records before deleting the profile so 
    // orphaned auth credentials cannot remain after account removal.
    for (const auth of auths.results) {
      const removed = await ctx.resolve('auth-remove', { id: auth.id });
      if (removed.code !== 200) {
        res.fromStatusResponse(removed);
        return;
      }
    }
    await ctx.resolve('profile-remove', { id: data.id }, res);
    if (res.code === 200) {
      res.session.set('flash', JSON.stringify({ 
        type: 'success', 
        message: 'Your account has been scheduled for removal.' 
      }));
      const base = ctx.config.path('auth.base', '/auth');
      res.redirect(`${base}/signout`);
      return;
    }
  }
  //pass the view props down to view
  setViewProps(req, res, ctx);
};
