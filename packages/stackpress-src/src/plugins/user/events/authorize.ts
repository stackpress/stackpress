//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//common
import type { SessionPlugin } from '../types';

export default async function Authorize(req: ServerRequest, res: Response) {
  const server = req.context;
  const session = server.plugin<SessionPlugin>('session');
  session.authorize(req, res);
};