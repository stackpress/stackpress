//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//root
import type { Session } from '../../types';
//session
import type { SessionData } from '../../session/types';
//api
import type { ApiConfig } from '../types';
import { unauthorized } from '../helpers';

export default async function OAuth(
  req: Request, 
  res: Response, 
  ctx: Server
) {
  //set data for template layer
  const { scopes = {}, endpoints = [] } = ctx.config.path('api');
  res.data.set('api', { scopes, endpoints });
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  //there must be a client id and redirect uri
  const id = req.data<string>('client_id');
  const redirect = req.data<string>('redirect_uri');
  //A free parameter you can use to set some data. 
  //This field will be sent back in the state query-string 
  //parameter when redirecting to your callback URL.
  const state = req.data<string>('state');
  //there must be a client id and redirect uri
  if (!id || !redirect) {
    return unauthorized(res);
  }

  //get session
  const session = await ctx.resolve('me', req);
  if (!session.results) {
    const redirect = encodeURIComponent(
      req.url.pathname + req.url.search
    );
    res.redirect(
      `/auth/signin?redirect_uri=${redirect}`
    );
    return;
  }
  await ctx.resolve('application-detail', { id }, res);
  //if no applcation found
  if (res.code !== 200) {
    return unauthorized(res);
  }
  //if submitted
  if (req.method === 'POST') {
    //get expires length
    const { 
      expires = 1000 * 60 * 60 * 24 
    } = ctx.config<ApiConfig>('api') || {};
    const response = await ctx.resolve<Session>('session-create', {
      ...req.data(),
      applicationId: id,
      profileId: (session.results as SessionData).id,
      expires: new Date(Date.now() + expires)
    });
    if (res.code !== 200 || !response.results) {
      return;
    }
    const [ uri, query ] = redirect.split('?');
    const params = new URLSearchParams(query);
    params.set('code', response.results.id);
    if (state) {
      params.set('state', state);
    }
    //redirect
    res.redirect(`${uri}?${params.toString()}`);
    return;
  }
}