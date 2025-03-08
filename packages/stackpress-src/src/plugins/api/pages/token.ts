//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//root
import type { SessionExtended } from '../../../types';
//sql
import { toResponse } from '../../../sql/helpers';
//local
import { authorize, unauthorized } from '../helpers';

export default async function APIToken(req: ServerRequest, res: Response) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  //authorization check
  const authorization = authorize(req, res);
  if (!authorization) {
    return;
  }
  const { id, secret } = authorization;

  //code is the session id
  const code = req.data<string>('code');
  //there must be a code and secret
  if (!code || !secret) {
    return unauthorized(res);
  }
  //get the server
  const server = req.context;
  //get session
  const session = await server.call('session-detail', { id: code });
  const data = session.results as SessionExtended;
  //application id does not match
  if (!data || data.applicationId !== id) {
    return unauthorized(res);
  //if the session is expired
  } else if (data.expires && data.expires.getTime() < Date.now()) {
    return unauthorized(res);
  }
  //set the global response
  res.fromStatusResponse(toResponse({
    token_type: 'Bearer',
    access_token: data.id,
    access_secret: data.secret,
    expires_in: data.expires 
      ? Math.floor((data.expires.getTime() - Date.now()) / 1000) 
      : 0,
    user: {
      id: data.profile.id,
      name: data.profile.name,
      image: data.profile.image,
      created: data.profile.created
    }
  }));
}