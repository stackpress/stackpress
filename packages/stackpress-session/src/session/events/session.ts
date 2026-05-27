//stackpress
import { action } from '@stackpress/ingest/Server';
//session
import type { SessionPlugin } from '../types.js';

export default action(async function Session({ req, res, ctx }) {
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  res.results(await me.authorization());
});