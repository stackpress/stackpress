//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';

export default async function Authorize(req: ServerRequest, res: Response) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  //get the server
  const server = req.context;
  //get authorization
  const authorized = await server.call('authorize', req);
  //if not authorized
  if (authorized.code !== 200) {
    res.fromStatusResponse(authorized);
  }
}