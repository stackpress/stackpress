//modules
import { action } from '@stackpress/ingest/Server';

export default action(async function Authorize({ req, res, ctx }) {
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
});
