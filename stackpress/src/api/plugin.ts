//stackpress
import type Server from '@stackpress/ingest/Server';
//root
import type { Application, Session } from '../types';
//api
import type { ApiConfig, ApiEndpoint } from './types';
import { authorize, unauthorized, validData } from './helpers';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(ctx: Server) {
  //on listen, add webhooks
  ctx.on('listen', (_req, _res, ctx) => {
    const { webhooks = [] } = ctx.config<ApiConfig>('api') || {};
    for (const webhook of webhooks) {
      ctx.on(webhook.event, async (req, res) => {
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
  ctx.on('route', (_req, _res, ctx) => {
    const { endpoints = [] } = ctx.config<ApiConfig>('api') || {};
    //if no endpoints, return
    if (!Array.isArray(endpoints) || endpoints.length === 0) return;
    ctx.import.all('/auth/oauth/token', () => import('./pages/token'));
    ctx.import.all('/auth/oauth', () => import('./pages/oauth'));
    ctx.view.all('/auth/oauth', 'stackpress/template/pages/oauth', -100);
    for (const endpoint of endpoints) {
      if (endpoint.type === 'session') {
        session(endpoint, ctx);
      } else if (endpoint.type === 'app') {
        app(endpoint, ctx);
      } else if (endpoint.type === 'public') {
        open(endpoint, ctx);
      }
    }
  });
};

export function session(endpoint: ApiEndpoint, ctx: Server) {
  ctx.route(
    endpoint.method, 
    endpoint.route, 
    async function SessionAPI(req, res, ctx) {
      //authorization check
      const authorization = authorize(req, res);
      if (!authorization) {
        return;
      }
      const { id, secret } = authorization;
      const response = await ctx.resolve('session-detail', { id });
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
      await ctx.emit(endpoint.event, req, res);
    }, 
    endpoint.priority || 0
  );
};

export function app(endpoint: ApiEndpoint, ctx: Server) {
  ctx.route(
    endpoint.method, 
    endpoint.route, 
    async function AppAPI(req, res, ctx) {
      //authorization check
      const authorization = authorize(req, res);
      if (!authorization) {
        return;
      }
      const { id, secret } = authorization;
      const response = await ctx.resolve('application-detail', { id });
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
      await ctx.emit(endpoint.event, req, res);
    }, 
    endpoint.priority || 0
  );
};

export function open(endpoint: ApiEndpoint, ctx: Server) {
  ctx.route(
    endpoint.method, 
    endpoint.route, 
    async function PublicAPI(req, res, ctx) {
      req.data.set(endpoint.data || {});
      await ctx.emit(endpoint.event, req, res);
    }, 
    endpoint.priority || 0
  );
};