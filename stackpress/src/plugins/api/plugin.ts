//stackpress
import type Server from '@stackpress/ingest/Server';
//local
import type { 
  ApiConfig, 
  ApiEndpoint, 
  Application, 
  Session 
} from '../../types';
import { authorize, unauthorized, validData } from './helpers';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on listen, add webhooks
  server.on('listen', (_req, _res, server) => {
    const { webhooks = [] } = server.config<ApiConfig>('api') || {};
    for (const webhook of webhooks) {
      server.on(webhook.event, async (req, res) => {
        //if there was an error, return
        if (res.code !== 200) return;
        //get the data from the webhook
        const data = webhook.data || {};
        //get the params from the request
        const params = req.data();
        //get the results from the response
        const results = res.toStatusResponse().results as Record<string, any>;
        //if the data is not valid, return
        if (!validData(webhook.validity, results)) return;
        //send the webhook
        await fetch(webhook.uri, {
          method: webhook.method,
          body: JSON.stringify({ data, params, results }),
        });
      }, -200);
    }
  })
  //on route, add user routes
  server.on('route', (_req, _res, server) => {
    const { endpoints = [] } = server.config<ApiConfig>('api') || {};
    //if no endpoints, return
    if (!Array.isArray(endpoints) || endpoints.length === 0) return;
    server.import.all('/auth/oauth/token', () => import('./pages/token'));
    server.import.all('/auth/oauth', () => import('./pages/oauth'));
    server.view.all('/auth/oauth', 'stackpress/template/pages/oauth', -100);
    for (const endpoint of endpoints) {
      if (endpoint.type === 'session') {
        session(endpoint, server);
      } else if (endpoint.type === 'app') {
        app(endpoint, server);
      } else if (endpoint.type === 'public') {
        open(endpoint, server);
      }
    }
  });
};

export function session(endpoint: ApiEndpoint, server: Server) {
  server.route(
    endpoint.method, 
    endpoint.route, 
    async function SessionAPI(req, res, server) {
      //authorization check
      const authorization = authorize(req, res);
      if (!authorization) {
        return;
      }
      const { id, secret } = authorization;
      const response = await server.resolve('session-detail', { id });
      if (!response || !response.results) {
        return unauthorized(res);
      }
      const session = response.results as Session;
      if (req.method.toUpperCase() !== 'GET' 
        && secret !== session.secret
      ) {
        return unauthorized(res);
      }
      //if all of the application scopes are not any of endpoint scopes
      //then return unauthorized
      const permits = endpoint.scopes || [];
      if (!session.scopes.some(scope => permits.includes(scope))) {
        return unauthorized(res);
      }
      //we are good to call
      req.data.set(endpoint.data || {});
      req.data.set('profileId', session.profileId);
      await server.emit(endpoint.event, req, res);
    }, 
    endpoint.priority || 0
  );
};

export function app(endpoint: ApiEndpoint, server: Server) {
  server.route(
    endpoint.method, 
    endpoint.route, 
    async function AppAPI(req, res, server) {
      //authorization check
      const authorization = authorize(req, res);
      if (!authorization) {
        return;
      }
      const { id, secret } = authorization;
      const response = await server.resolve('application-detail', { id });
      if (!response || !response.results) {
        return unauthorized(res);
      }
      const application = response.results as Application;
      if (req.method.toUpperCase() !== 'GET' 
        && secret !== application.secret
      ) {
        return unauthorized(res);
      }
      //if all of the application scopes are not any of endpoint scopes
      //then return unauthorized
      const permits = endpoint.scopes || [];
      if (!application.scopes.some(scope => permits.includes(scope))) {
        return unauthorized(res);
      }
      //we are good to call
      req.data.set(endpoint.data || {});
      await server.emit(endpoint.event, req, res);
    }, 
    endpoint.priority || 0
  );
};

export function open(endpoint: ApiEndpoint, server: Server) {
  server.route(
    endpoint.method, 
    endpoint.route, 
    async function PublicAPI(req, res, server) {
      req.data.set(endpoint.data || {});
      await server.emit(endpoint.event, req, res);
    }, 
    endpoint.priority || 0
  );
};