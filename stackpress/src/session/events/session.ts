//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//sql
import { toResponse } from '../../sql/helpers';
//session
import type { SessionPlugin } from '../types';

export default async function Session(
  req: Request, 
  res: Response,
  ctx: Server
) {
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  const response = toResponse(me.authorization);
  res.fromStatusResponse(response);
}