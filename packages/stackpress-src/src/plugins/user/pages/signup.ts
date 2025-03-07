//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//common
import type { SessionPlugin } from '../types';

export default async function SignupPage(req: ServerRequest, res: Response) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  //extract project and model from client
  const server = req.context;
  const redirect = req.data<string>('redirect') || '/auth/signin';
  //get the session
  const session = server.plugin<SessionPlugin>('session');
  //get authorization
  const token = session.token(req);
  const me = session.get(token || '');
  //form submission
  if (req.method === 'POST') {
    await server.call('auth-signup', req, res);
    //if signup successful, redirect
    if (res.code === 200) {
      res.redirect(redirect);
    }
  //if i am already signed in
  } else if (me) {
    res.redirect(redirect);
  }
};
