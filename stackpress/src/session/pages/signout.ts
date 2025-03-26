//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';

export default async function SignOutPage(
  req: Request, 
  res: Response,
  ctx: Server
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  const response = await ctx.resolve('auth-signout', req, res);
  //if there is an error
  if (response.code !== 200) {
    //kick it down the road
    return;
  }
  //redirect
  res.redirect(req.data('redirect') || '/');
};