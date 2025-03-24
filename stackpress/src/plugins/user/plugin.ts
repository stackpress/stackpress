//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//root
import type { SessionPermissionList } from '../../types';
//server
import Session from '../../session/Session';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on config, register session plugin
  server.on('config', req => {
    const server = req.context;
    //if no session config, return
    if (!server.config.get('session')) return;
    const key = server.config.path('session.key', 'session');
    const seed = server.config.path('session.seed', 'abc123');
    const access = server.config.path<SessionPermissionList>('session.access', {});
    //configure and add session as a project plugin
    server.register('session', Session.configure(key, seed, access));
  });
  //on listen, add user events
  server.on('listen', req => {
    const router = req.context.imports;
    //if no auth config, return
    if (!server.config.get('auth')) return;
    router.on('auth-search', () => import('./events/search'), -100);
    router.on('auth-detail', () => import('./events/detail'), -100);
    router.on('auth-get', () => import('./events/detail'), -100);
    router.on('auth-signup', () => import('./events/signup'));
    router.on('auth-signin', () => import('./events/signin'));
    router.on('auth-signout', () => import('./events/signout'));
    router.on('authorize', () => import('./events/authorize'));
    router.on('request', () => import('./pages/authorize'));
    //if no session config, return
    if (!server.config.get('session')) return;
    router.on('me', () => import('./events/session'));
  });
  //on route, add user routes
  server.on('route', req => {
    const server = req.context;
    //if no auth config, return
    if (!server.config.get('auth')) return;
    server.imports.all('/auth/signin', () => import('./pages/signin'));
    server.imports.all('/auth/signin/:type', () => import('./pages/signin'));
    server.imports.all('/auth/signup', () => import('./pages/signup'));
    server.imports.all('/auth/signout', () => import('./pages/signout'));

    server.view.all('/auth/signin', 'stackpress/template/pages/signin', -100);
    server.view.all('/auth/signin/:type', 'stackpress/template/pages/signin', -100);
    server.view.all('/auth/signup', 'stackpress/template/pages/signin', -100);
  });
};