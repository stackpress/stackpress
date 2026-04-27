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
    ctx.import.on('authorize', () => import('./events/authorize.js'));
  });
  //on route, add user routes
  ctx.on('route', (_req, _res, ctx) => {
    //if no auth config, disable auth routes
    if (!ctx.config.get('auth')) return;
    const base = ctx.config.path('auth.base', '/auth');
    ctx.import.get(
      `${base}/account`, 
      () => import('./pages/account.js')
    );
    ctx.import.get(
      `${base}/account/export`, 
      () => import('./pages/export.js')
    );
    ctx.import.get(
      `${base}/account/remove`, 
      () => import('./pages/remove.js')
    );
    ctx.import.get(
      `${base}/account/update`, 
      () => import('./pages/update.js')
    );
    ctx.import.get(
      `${base}/account/security/password`, 
      () => import('./pages/password.js')
    );
    ctx.import.get(
      `${base}/account/security/2fa`, 
      () => import('./pages/2fa/detail.js')
    );
    ctx.import.get(
      `${base}/account/security/2fa/remove`, 
      () => import('./pages/2fa/remove.js')
    );

    ctx.import.post(
      `${base}/account/update`, 
      () => import('./pages/update.js')
    );
    ctx.import.post(
      `${base}/account/security/password`, 
      () => import('./pages/password.js')
    );
    ctx.import.post(
      `${base}/account/security/2fa`, 
      () => import('./pages/2fa/detail.js')
    );
    ctx.import.post(
      `${base}/account/security/2fa/remove`, 
      () => import('./pages/2fa/remove.js')
    );

    ctx.view.get(
      `${base}/account`, 
      'stackpress-session/esm/views/account', 
      -100
    );
    ctx.view.get(
      `${base}/account/remove`, 
      'stackpress-session/esm/views/remove', 
      -100
    );
    ctx.view.get(
      `${base}/account/update`, 
      'stackpress-session/esm/views/update', 
      -100
    );
    ctx.view.get(
      `${base}/account/security/password`, 
      'stackpress-session/esm/views/password', 
      -100
    );
    ctx.view.get(
      `${base}/account/security/2fa`, 
      'stackpress-session/esm/views/2fa/detail', 
      -100
    );
    ctx.view.get(
      `${base}/account/security/2fa/remove`, 
      'stackpress-session/esm/views/2fa/remove', 
      -100
    );

    ctx.view.post(
      `${base}/account/update`, 
      'stackpress-session/esm/views/update', 
      -100
    );
    ctx.view.post(
      `${base}/account/security/password`, 
      'stackpress-session/esm/views/password', 
      -100
    );
    ctx.view.post(
      `${base}/account/security/2fa`, 
      'stackpress-session/esm/views/2fa/detail', 
      -100
    );
    ctx.view.post(
      `${base}/account/security/2fa/remove`, 
      'stackpress-session/esm/views/2fa/remove', 
      -100
    );
  });
};