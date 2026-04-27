//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session
import type { SessionPlugin } from '../../types.js';

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
  } else if (req.data('confirmed')) {
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
