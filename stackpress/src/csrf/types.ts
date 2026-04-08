import type Response from '@stackpress/ingest/Response';
import type Request from '@stackpress/ingest/Request';

export type CsrfConfig = {
  name?: string | undefined
};

export type CsrfPlugin = {
  generateToken(res: Response): string,
  validateToken(req: Request, res: Response): boolean
};