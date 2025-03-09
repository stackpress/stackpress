//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//root
import type { SigninType, SessionPlugin } from '../../../types';

export default async function SignInPage(req: ServerRequest, res: Response) {
  //extract project and model from client
  const server = req.context;
  //set data for template layer
  const auth = server.config.path('auth');
  res.data.set('auth', { 
    name: auth.name, 
    logo: auth.logo, 
    roles: auth.roles || [], 
    username: auth.username, 
    email: auth.email, 
    phone: auth.phone, 
    password: auth.password
  });
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  // /auth/signin/:type
  const { redirect_uri: redirect = '/' } = req.data<{ 
    type: SigninType, 
    redirect_uri: string 
  }>();
  //get the session
  const session = server.plugin<SessionPlugin>('session');
  const { guest } = session.load(req);
  //form submission
  if (req.method === 'POST') {
    //sign in
    await server.call('auth-signin', req, res);
    //if there is an error, do nothing
    if (res.code !== 200) return;
    //redirect
    res.redirect(redirect);
    return;
  //if there is already a session
  } else if (!guest) {
    res.redirect(redirect);
  }
};