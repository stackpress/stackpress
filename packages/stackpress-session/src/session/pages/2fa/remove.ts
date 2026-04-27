//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress-csrf
import type { CsrfPlugin } from 'stackpress-csrf/types';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session
import type { SessionPlugin } from '../../types.js';

/**
 * Main page handler
 */
export default async function TwoFactorRemovePage(
  req: Request,
  res: Response,
  ctx: Server
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    return;
  }
  //get csrf plugin
  const csrf = ctx.plugin<CsrfPlugin>('csrf');
  //get session plugin
  const session = ctx.plugin<SessionPlugin>('session');
  //pass the view props down to view
  setViewProps(req, res, ctx);
  const me = session.load(req);
  const data = await me.data();
  if (!data || await me.guest()) {
    res.setStatus(401, 'Unauthorized');
    //NOTE: no need for csrf here...
    return;
  }
  await ctx.resolve('profile-detail', { id: data.id }, res);
  if (res.code === 404) {
    res.setStatus(401, 'Unauthorized');
    //NOTE: no need for csrf here...
    return;
  } 
  if (req.data('confirmed')) {
    //for redirect...
    const base = ctx.config.path('auth.base', '/auth');
    //get authId from request data
    const authId = String(req.data.path('authId'));
    //if authId is not present
    if (!authId) {
      //set an error
      res.setError('Invalid authentication.');
      //and redirect back to 2FA page
      res.redirect(`${base}/account/security/2fa`);
      //generate csrf token before returning
      csrf.generate(res, ctx);
      return;
    }

    //proceed to remove the 2FA record...

    //search for the auth record to ensure it exists and belongs to the user
    const exists = await ctx.resolve('auth-search', {
      id: authId,
      profileId: data.id,
      type: '2fa',
    });
    //if there is an error
    if (exists.code !== 200) {
      //set an error
      res.fromStatusResponse(exists);
      //generate csrf token before returning
      csrf.generate(res, ctx);
      return;
    }
    //remove the auth record
    const removed = await ctx.resolve('auth-remove', {
      id: authId,
      profileId: data.id,
      type: '2fa',
    });
    //if there is an error
    if (removed.code !== 200) {
      //set an error
      res.fromStatusResponse(removed);
      //generate csrf token before returning
      csrf.generate(res, ctx);
      return;
    }
    //show a success message and redirect back to the security page
    res.session.set(
      'flash',
      JSON.stringify({
        type: 'success',
        message: 'Two-Factor Authentication has been removed successfully.',
        close: 3000,
      }),
    );
    res.redirect(req.data.path(
      'redirect_uri', 
      `${base}/account/security/2fa`
    ));
    return;
  }
  //generate csrf token before returning
  csrf.generate(res, ctx);
};