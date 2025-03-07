//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//plugins
import type { TemplatePlugin } from '@/plugins/template/types';
import type { SessionData } from '@/plugins/user/types';
//local
import type { APIConfig, Session } from '../types';
import { unauthorized } from '../helpers';

const template = '@stackpress/incept-api/dist/templates/oauth';

export default async function OAuth(req: ServerRequest, res: Response) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  //there must be a client id and redirect uri
  const id = req.data<string>('client_id');
  const redirect = req.data<string>('redirect_uri');
  //the API scope your client application needs.
  //It tells the Authorization endpoint what kind 
  //of permissions to ask for when displaying the 
  //consent form to the end-user. Use space as 
  //separator if more than one value. If no scope
  //is provided, the app just wants the session data.
  const scope = req.data<string>('scope');
  const permissions = scope ? scope.split(' ') : [];
  //A free parameter you can use to set some data. 
  //This field will be sent back in the state query-string 
  //parameter when redirecting to your callback URL.
  const state = req.data<string>('state');
  //there must be a client id and redirect uri
  if (!id || !redirect) {
    return unauthorized(res);
  }
  //make a revert uri
  const [ uri, query ] = redirect.split('?');
  const params = new URLSearchParams(query);
  params.set('error', 'denied');
  if (state) {
    params.set('state', state);
  }
  const revert = `${uri}?${params.toString()}`;

  //get the server
  const server = req.context;
  //get session
  const session = await server.call('me', req);
  if (!session.results) {
    const redirect = encodeURIComponent(req.url.pathname + req.url.search);
    res.redirect(
      `/auth/signin?redirect_uri=${redirect}`
    );
    return;
  }
  const application = await server.call('application-detail', { id });
  //if no applcation found
  if (application.code !== 200) {
    return unauthorized(res);
  }
  //get scopes and endpoints
  const { 
    scopes = {},
    endpoints = []
  } = server.config<APIConfig['api']>('api') || {};
  //get the renderer
  const { render } = server.plugin<TemplatePlugin>('template');
  //if submitted
  if (req.method === 'POST') {
    //get expires length
    const { 
      expires = 1000 * 60 * 60 * 24 
    } = server.config<APIConfig['api']>('api') || {};
    const response = await server.call('session-create', {
      ...req.data(),
      applicationId: id,
      profileId: (session.results as SessionData).id,
      expires: new Date(Date.now() + expires)
    });
    if (response.code !== 200) {
      res.setHTML(await render(template, { 
        ...response, 
        revert,
        scopes,
        endpoints,
        permissions,
        session: session.results,
        application: application.results
      }));
      return;
    }
    const results = response.results as Session;

    const [ uri, query ] = redirect.split('?');
    const params = new URLSearchParams(query);
    params.set('code', results.id);
    if (state) {
      params.set('state', state);
    }
    //redirect
    res.redirect(`${uri}?${params.toString()}`);
    return;
  }
  //render the template
  res.setHTML(await render(template, { 
    revert,
    scopes,
    endpoints,
    permissions,
    session: session.results,
    application: application.results
  }));
}