//modules
import { action } from '@stackpress/ingest/Server';
//client
import http from '../scripts/http.js';

/**
 * Bridge the Stackpress event system into the HTTP MCP transport script.
 */
export default action(async function HttpScript({ ctx, res }) {
  //if another listener already failed, then stop here
  if (res.code && res.code !== 200) {
    return;
  }

  //from here we can safely start the HTTP transport
  await http(ctx);
  res.code = 200;
});
