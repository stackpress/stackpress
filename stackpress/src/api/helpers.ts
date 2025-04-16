//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import { isObject } from '@stackpress/ingest/helpers';
//root
import Exception from '../Exception.js';

export function authorize(req: Request, res: Response) {
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
};

export function unauthorized(res: Response) {
  res.setError(Exception
    .for('Unauthorized')
    .withCode(401)
    .toResponse()
  );
};

export function validData(assert: Record<string, any>, data: Record<string, any>) {
  for (const [ key, value ] of Object.entries(assert)) {
    if (typeof data[key] === 'undefined') return false;
    if (Array.isArray(value)) {
      if (!Array.isArray(data[key])) return false;
      if (!value.every(item => data[key].includes(item))) return false;
    } else if (isObject(value)) {
      if (!isObject(data[key])) return false;
      if (!validData(value, data[key])) return false;
    } else if (data[key] !== value) {
      return false;
    }
  }
  return true;
};