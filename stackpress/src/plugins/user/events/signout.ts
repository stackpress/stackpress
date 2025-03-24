//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';

export default async function AuthSignout(req: ServerRequest, res: Response) {
  //remove session
  res.session.delete('session');
  res.setStatus(200);
}