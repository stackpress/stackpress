//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//root
import type { Session } from '../../types/index.js';
//session
import type { 
  SessionData, 
  SessionTokenData 
} from '../../session/types.js';
//view
import type { 
  ViewConfig, 
  BrandConfig 
} from '../../view/types.js';
//api
import type { ApiConfig } from '../types.js';
import { unauthorized } from '../helpers.js';

export default async function OAuth(
  req: Request, 
  res: Response, 
  ctx: Server
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  //get the view, brand and api config
  const view = ctx.config.path<ViewConfig>('view', {});
  const brand = ctx.config.path<BrandConfig>('brand', {});
  const { scopes = {}, endpoints = [] } = ctx.config.path('api');
  res.data.set('api', { scopes, endpoints });
  res.data.set('view', { 
    base: view.base || '/',
    props: view.props || {}
  });
  res.data.set('brand', { 
    name: brand.name || 'Stackpress',
    logo: brand.logo || '/logo.png',
    icon: brand.icon || '/icon.png',
    favicon: brand.favicon || '/favicon.ico',
  });
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
  const session = await ctx.resolve<SessionTokenData>('me', req);
  if (!session.results?.id) {
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