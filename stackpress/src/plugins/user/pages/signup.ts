//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//root
import type { SessionPlugin } from '../../../types';

export default async function SignupPage(
  req: Request, 
  res: Response,
  ctx: Server
) {
  //set data for template layer
  const { name, logo } = ctx.config.path('auth');
  res.data.set('auth', { name, logo });
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  const redirect = req.data<string>('redirect') || '/auth/signin';
  //get the session
  const session = ctx.plugin<SessionPlugin>('session');
  const { guest } = session.load(req);
  //form submission
  if (req.method === 'POST') {
    await ctx.emit('auth-signup', req, res);
    //if signup successful, redirect
    if (res.code === 200) {
      res.redirect(redirect);
    }
  //if i am already signed in
  } else if (!guest) {
    res.redirect(redirect);
  }
};
