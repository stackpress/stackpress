//modules
import { action } from '@stackpress/ingest/Server';
//client
import sse from '../scripts/sse.js';

/**
 * Bridge the Stackpress event system into the SSE MCP transport script.
 */
export default action(async function SseScript({ ctx, res }) {
  //if another listener already failed, then stop here
  if (res.code && res.code !== 200) {
    return;
  }

  //from here we can safely start the SSE transport
  await sse(ctx);
  res.code = 200;
});
