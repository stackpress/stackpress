//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';

export default async function Authorize(
  req: Request, 
  res: Response,
  ctx: Server
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  //get authorization
  const authorized = await ctx.resolve('authorize', req);
  //if not authorized
  if (authorized.code !== 200) {
    res.fromStatusResponse(authorized);
    await ctx.emit('error', req, res);
  }
}