//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//root
import type { AuthExtended } from '../../../types';
//session
import { decrypt } from '../../../session/helpers';

export default async function AuthSearch(req: ServerRequest, res: Response) {
  //if there is no result object
  if (!Array.isArray(res.body)) return;
  const server = req.context;
  //get the session seed
  const seed = server.config.path('session.seed', 'abc123');
  const rows = res.body as Partial<AuthExtended>[];
  res.body = rows.map(row => {
    //decode token
    try {
      row.token = decrypt(row.token as string, seed);
    } catch (e) {}
    //remove sensitive data
    delete row.secret;
    return row;
  });
};