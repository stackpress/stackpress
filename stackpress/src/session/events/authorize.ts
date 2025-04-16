//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//session
import type { SessionPlugin } from '../types.js';

export default async function Authorize(
  req: Request, 
  res: Response,
  ctx: Server
) {
  const registry = ctx.plugin<SessionPlugin>('session');
  registry.authorize(req, res);
};