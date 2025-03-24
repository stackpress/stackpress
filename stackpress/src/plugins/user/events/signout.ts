//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';

export default async function AuthSignout(_req: Request, res: Response) {
  //remove session
  res.session.delete('session');
  res.setStatus(200);
}