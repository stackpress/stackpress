//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';

export default async function SignOutPage(req: ServerRequest, res: Response) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  //extract project and model from client
  const server = req.context;
  const response = await server.call('auth-signout', req, res);
  //if there is an error
  if (response.code !== 200) {
    //kick it down the road
    return;
  }
  //redirect
  res.redirect(req.data('redirect') || '/');
};