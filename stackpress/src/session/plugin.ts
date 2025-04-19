//stackpress
import type Server from '@stackpress/ingest/Server';
//session
import type { SessionPermissionList } from './types.js';
import Session from './Session.js';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(ctx: Server) {
  //if no session config, disable session
  if (!ctx.config.get('session')) return;
  //on config, register session plugin
  ctx.on('config', (_req, _res, ctx) => {
    const key = ctx.config.path('session.key', 'session');
    const seed = ctx.config.path('session.seed', 'abc123');
    const access = ctx.config.path<SessionPermissionList>('session.access', {});
    //configure and add session as a project plugin
    ctx.register('session', Session.configure(key, seed, access));
  });
  //on listen, add user events
  ctx.on('listen', (_req, _res, ctx) => {
    ctx.import.on('me', () => import('./events/session'));
    //if auth config, add auth routes
    if (ctx.config.get('auth')) {
      ctx.import.on('auth-signup', () => import('./events/signup'));
      ctx.import.on('auth-signin', () => import('./events/signin'));
      ctx.import.on('auth-signout', () => import('./events/signout'));
      ctx.import.on('authorize', () => import('./events/authorize'));
      ctx.import.on('request', () => import('./pages/authorize'));
    }
  });
  //on route, add user routes
  ctx.on('route', (_req, _res, ctx) => {
    //if no auth config, disable auth routes
    if (!ctx.config.get('auth')) return;
    ctx.import.all('/auth/signin', () => import('./pages/signin'));
    ctx.import.all('/auth/signin/:type', () => import('./pages/signin'));
    ctx.import.all('/auth/signup', () => import('./pages/signup'));
    ctx.import.all('/auth/signout', () => import('./pages/signout'));
    
    ctx.view.all('/auth/signin', 'stackpress/esm/session/views/signin', -100);
    ctx.view.all('/auth/signin/:type', 'stackpress/esm/session/views/signin', -100);
    ctx.view.all('/auth/signup', 'stackpress/esm/session/views/signup', -100);
  });
};