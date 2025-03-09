//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//root
import type { SessionPlugin } from '../../../types';
//sql
import { toResponse } from '../../../sql/helpers';

export default async function Session(req: ServerRequest, res: Response) {
  const server = req.context;
  const session = server.plugin<SessionPlugin>('session');
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