//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//plugins
import { toResponse } from '@/plugins/sql/helpers';
//local
import type { SessionPlugin } from '../types';

export default async function Session(req: ServerRequest, res: Response) {
  const server = req.context;
  const session = server.plugin<SessionPlugin>('session');
  const token = session.token(req);
  const me = session.get(token || '');
  if (!me) {
    res.setError({
      code: 404,
      status: 'Not Found',
      error: 'No session found.'
    });
    return;
  }
  res.fromStatusResponse(toResponse(me));
}