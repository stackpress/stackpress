//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//local
import type { 
  ApiConfig, 
  ApiEndpoint, 
  Application, 
  Session 
} from '@/types';
import { authorize, unauthorized } from './helpers';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on route, add user routes
  server.on('route', req => {
    const server = req.context;
    server.imports.all('/auth/oauth/token', () => import('./pages/token'));
    server.imports.all('/auth/oauth', () => import('./pages/oauth'));
    server.view.all('/auth/oauth', 'stackpress/template/pages/oauth', -100);
    const { endpoints = [] } = server.config<ApiConfig>('api') || {};
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
  server.route(endpoint.method, endpoint.route, async function SessionAPI(req, res) {
    const server = req.context;
    //authorization check
    const authorization = authorize(req, res);
    if (!authorization) {
      return;
    }
    const { id, secret } = authorization;
    const response = await server.call('session-detail', { id });
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
  }, endpoint.priority || 0);
};

export function app(endpoint: ApiEndpoint, server: Server) {
  server.route(endpoint.method, endpoint.route, async function AppAPI(req, res) {
    const server = req.context;
    //authorization check
    const authorization = authorize(req, res);
    if (!authorization) {
      return;
    }
    const { id, secret } = authorization;
    const response = await server.call('application-detail', { id });
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
  }, endpoint.priority || 0);
};

export function open(endpoint: ApiEndpoint, server: Server) {
  server.route(endpoint.method, endpoint.route, async function PublicAPI(req, res) {
    const server = req.context;
    req.data.set(endpoint.data || {});
    await server.emit(endpoint.event, req, res);
  }, endpoint.priority || 0);
};