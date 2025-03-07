//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import Exception from '@/Exception';

export function authorize(req: ServerRequest, res: Response) {
  const authorization = req.headers.get('authorization') as string;
  if (!authorization) {
    unauthorized(res);
    return false;
  }
  const [ , token ] = authorization.split(' ');
  if (!token.trim().length) {
    unauthorized(res);
    return false;
  }
  const [ id, secret ] = token.split(':');
  if (!id.trim().length) {
    unauthorized(res);
    return false;
  }
  if (req.method.toUpperCase() !== 'GET' && !secret?.trim().length) {
    unauthorized(res);
    return false;
  }
  return { 
    token: token.trim(), 
    id: id.trim(), 
    secret: secret?.trim() || ''
  };
}

export function unauthorized(res: Response) {
  res.setError(Exception
    .for('Unauthorized')
    .withCode(401)
    .toResponse()
  );
}