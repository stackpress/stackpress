//stackpress
import type Server from '@stackpress/ingest/Server';
//root
import type { SessionPermissionList } from '../../types';
//ctx
import Session from '../../session/Session';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(ctx: Server) {
  //on config, register session plugin
  ctx.on('config', (_req, _res, ctx) => {
    //if no session config, return
    if (!ctx.config.get('session')) return;
    const key = ctx.config.path('session.key', 'session');
    const seed = ctx.config.path('session.seed', 'abc123');
    const access = ctx.config.path<SessionPermissionList>('session.access', {});
    //configure and add session as a project plugin
    ctx.register('session', Session.configure(key, seed, access));
  });
  //on listen, add user events
  ctx.on('listen', (_req, _res, ctx) => {
    const router = ctx.import;
    //if no auth config, return
    if (!ctx.config.get('auth')) return;
    router.on('auth-search', () => import('./events/search'), -100);
    router.on('auth-detail', () => import('./events/detail'), -100);
    router.on('auth-get', () => import('./events/detail'), -100);
    router.on('auth-signup', () => import('./events/signup'));
    router.on('auth-signin', () => import('./events/signin'));
    router.on('auth-signout', () => import('./events/signout'));
    router.on('authorize', () => import('./events/authorize'));
    router.on('request', () => import('./pages/authorize'));
    //if no session config, return
    if (!ctx.config.get('session')) return;
    router.on('me', () => import('./events/session'));
  });
  //on route, add user routes
  ctx.on('route', (_req, _res, ctx) => {
    //if no auth config, return
    if (!ctx.config.get('auth')) return;
    ctx.import.all('/auth/signin', () => import('./pages/signin'));
    ctx.import.all('/auth/signin/:type', () => import('./pages/signin'));
    ctx.import.all('/auth/signup', () => import('./pages/signup'));
    ctx.import.all('/auth/signout', () => import('./pages/signout'));
  });
};