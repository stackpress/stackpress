//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//root
import type { AuthExtended } from '../../types';
//session
import { decrypt } from '../helpers';

export default async function AuthSearch(
  _req: Request, 
  res: Response,
  ctx: Server
) {
  //if there is no result object
  if (!Array.isArray(res.body)) return;
  //get the session seed
  const seed = ctx.config.path('session.seed', 'abc123');
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