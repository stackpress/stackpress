import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';

export type CsrfConfig = { name?: string, error?: string };

export type CsrfPlugin = {
  generateToken(res: Response, ctx: Server): string,
  validateToken(req: Request, res: Response): boolean
};