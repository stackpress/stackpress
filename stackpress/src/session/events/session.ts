//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//sql
import { toResponse } from '../../sql/helpers.js';
//session
import type { SessionPlugin } from '../types.js';

export default async function Session(
  req: Request, 
  res: Response,
  ctx: Server
) {
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  const response = toResponse(await me.authorization());
  res.fromStatusResponse(response);
}