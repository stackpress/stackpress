//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
import { isObject } from '@stackpress/ingest/helpers';
//root
import type { AuthExtended } from '../../types';
//session
import { decrypt } from '../helpers';

export default async function AuthDetail(
  _req: Request, 
  res: Response,
  ctx: Server
) {
  //if there is no result object
  if (!isObject(res.body)) return;
  //get the session seed
  const seed = ctx.config.path('session.seed', 'abc123');
  const results = res.body as Partial<AuthExtended>;
  //decode token
  try {
    results.token = decrypt(results.token as string, seed);
  } catch (e) {}
  //remove sensitive data
  delete results.secret;
};