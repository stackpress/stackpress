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
  if (me.guest) {
    res.setError({
      code: 404,
      status: 'Not Found',
      error: 'No session found.'
    });
    return;
  }
  res.fromStatusResponse(toResponse(me.authorization));
}