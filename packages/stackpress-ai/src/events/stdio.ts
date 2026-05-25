//modules
import { action } from '@stackpress/ingest/Server';
//client
import stdio from '../scripts/stdio.js';

/**
 * Bridge the Stackpress event system into the stdio MCP transport script.
 */
export default action(async function StdioScript({ ctx, res }) {
  //if another listener already failed, then stop here
  if (res.code && res.code !== 200) {
    return;
  }

  //from here we can safely start the stdio transport
  await stdio(ctx);
  res.code = 200;
});
