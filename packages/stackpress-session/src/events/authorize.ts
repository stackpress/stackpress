//stackpress
import { action } from '@stackpress/ingest/Server';
//session
import type { SessionPlugin } from '../types.js';

export default action(async function Authorize({ req, res, ctx }) {
  const session = ctx.plugin<SessionPlugin>('session');
  await session.authorize(req, res);
});
