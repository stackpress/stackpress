//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//common
import type { AuthExtended, SessionPlugin } from '../types';
import { decrypt } from '../helpers';

export default async function AuthSearch(req: ServerRequest, res: Response) {
  //if there is no result object
  if (!Array.isArray(res.body)) return;
  const server = req.context;
  const session = server.plugin<SessionPlugin>('session');
  const seed = session.seed;
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