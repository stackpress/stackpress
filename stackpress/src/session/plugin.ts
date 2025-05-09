//stackpress
import type Server from '@stackpress/ingest/Server';
//session
import type { SessionPermissionList } from './types.js';
import Session from './Session.js';

/**
 * This interface is intended for the Stackpress library.
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
    ctx.import.on('me', () => import('./events/session.js'));
    //if auth config, add auth routes
    if (ctx.config.get('auth')) {
      ctx.import.on('auth-signup', () => import('./events/signup.js'));
      ctx.import.on('auth-signin', () => import('./events/signin.js'));
      ctx.import.on('auth-signout', () => import('./events/signout.js'));
      ctx.import.on('authorize', () => import('./events/authorize.js'));
      ctx.import.on('request', () => import('./pages/authorize.js'));
    }
  });
  //on route, add user routes
  ctx.on('route', (_req, _res, ctx) => {
    //if no auth config, disable auth routes
    if (!ctx.config.get('auth')) return;
    const base = ctx.config.path('auth.base', '/auth');
    ctx.import.all(`${base}/signin`, () => import('./pages/signin.js'));
    ctx.import.all(`${base}/signin/:type`, () => import('./pages/signin.js'));
    ctx.import.all(`${base}/signup`, () => import('./pages/signup.js'));
    ctx.import.all(`${base}/signout`, () => import('./pages/signout.js'));
    
    ctx.view.all(`${base}/signin`, 'stackpress/esm/session/views/signin', -100);
    ctx.view.all(`${base}/signin/:type`, 'stackpress/esm/session/views/signin', -100);
    ctx.view.all(`${base}/signup`, 'stackpress/esm/session/views/signup', -100);
  });
};