//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//root
import type { SessionPermissionList } from '@/types';
//server
import Session from '@/server/Session';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on config, register session plugin
  server.on('config', req => {
    const server = req.context;
    const name = server.config.path('session.name', 'session');
    const seed = server.config.path('session.seed', 'abc123');
    const access = server.config.path<SessionPermissionList>('session.access', {});
    //make a new session
    const session = new Session(name, seed, access);
    //add session as a project plugin
    server.register('session', session);
  });
  //on listen, add user events
  server.on('listen', req => {
    const router = req.context.imports;
    router.on('auth-search', () => import('./events/search'), -100);
    router.on('auth-detail', () => import('./events/detail'), -100);
    router.on('auth-get', () => import('./events/detail'), -100);
    router.on('auth-signup', () => import('./events/signup'));
    router.on('auth-signin', () => import('./events/signin'));
    router.on('auth-signout', () => import('./events/signout'));
    router.on('authorize', () => import('./events/authorize'));
    router.on('me', () => import('./events/session'));
    router.on('request', () => import('./pages/authorize'));
  });
  //on route, add user routes
  server.on('route', req => {
    const server = req.context;
    server.imports.all('/auth/signin', () => import('./pages/signin'));
    server.imports.all('/auth/signin/:type', () => import('./pages/signin'));
    server.imports.all('/auth/signup', () => import('./pages/signup'));
    server.imports.all('/auth/signout', () => import('./pages/signout'));

    server.view.all('/auth/signin', 'stackpress/template/pages/signin', -100);
    server.view.all('/auth/signin/:type', 'stackpress/template/pages/signin', -100);
    server.view.all('/auth/signup', 'stackpress/template/pages/signin', -100);
  });
};