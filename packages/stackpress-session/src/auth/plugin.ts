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
      //Globally evaluate every route and check if user has access to it
      //this is where the secret sauce starts...
      ctx.import.on('request', () => import('./pages/authorize.js'));
    }
  });
  //on route, add user routes
  ctx.on('route', (_req, _res, ctx) => {
    //if no auth config, disable auth routes
    if (!ctx.config.get('auth')) return;
    const base = ctx.config.path('auth.base', '/auth');
    ctx.import.get(
      `${base}/signup`, 
      () => import('./pages/signup.js')
    );
    ctx.import.get(
      `${base}/signin`, 
      () => import('./pages/signin.js')
    );
    ctx.import.get(
      `${base}/signin/email`, 
      () => import('./pages/signin/email.js')
    );
    ctx.import.get(
      `${base}/signin/phone`, 
      () => import('./pages/signin/phone.js')
    );
    ctx.import.get(
      `${base}/signin/username`, 
      () => import('./pages/signin/username.js')
    );
    ctx.import.get(
      `${base}/signout`, 
      () => import('./pages/signout.js')
    );
    ctx.import.get(
      `${base}/account`, 
      () => import('./pages/account/index.js')
    );
    ctx.import.get(
      `${base}/account/export`, 
      () => import('./pages/account/export.js')
    );
    ctx.import.get(
      `${base}/account/remove`, 
      () => import('./pages/account/remove.js')
    );
    ctx.import.get(
      `${base}/account/update`, 
      () => import('./pages/account/update.js')
    );
    ctx.import.get(
      `${base}/account/security/password`, 
      () => import('./pages/account/password.js')
    );
    ctx.import.get(
      `${base}/account/security/2fa`, 
      () => import('./pages/account/2fa/index.js')
    );
    ctx.import.get(
      `${base}/account/security/2fa/remove`, 
      () => import('./pages/account/2fa/remove.js')
    );

    ctx.import.post(
      `${base}/signup`, 
      () => import('./pages/signup.js')
    );
    ctx.import.post(
      `${base}/signin/email`, 
      () => import('./pages/signin/email.js')
    );
    ctx.import.post(
      `${base}/signin/phone`, 
      () => import('./pages/signin/phone.js')
    );
    ctx.import.post(
      `${base}/signin/username`, 
      () => import('./pages/signin/username.js')
    );
    ctx.import.post(
      `${base}/account/update`, 
      () => import('./pages/account/update.js')
    );
    ctx.import.post(
      `${base}/account/security/password`, 
      () => import('./pages/account/password.js')
    );
    ctx.import.post(
      `${base}/account/security/2fa`, 
      () => import('./pages/account/2fa/index.js')
    );
    ctx.import.post(
      `${base}/account/security/2fa/remove`, 
      () => import('./pages/account/2fa/remove.js')
    );
    
    ctx.view.get(
      `${base}/signup`, 
      'stackpress-session/esm/views/signup', 
      -100
    );
    ctx.view.get(
      `${base}/signin`, 
      'stackpress-session/esm/views/signin/index', 
      -100
    );
    ctx.view.get(
      `${base}/signin/email`, 
      'stackpress-session/esm/views/signin/index', 
      -100
    );
    ctx.view.get(
      `${base}/signin/phone`, 
      'stackpress-session/esm/views/signin/index', 
      -100
    );
    ctx.view.get(
      `${base}/signin/username`, 
      'stackpress-session/esm/views/signin/index', 
      -100
    );
    ctx.view.get(
      `${base}/account`, 
      'stackpress-session/esm/views/account/index', 
      -100
    );
    ctx.view.get(
      `${base}/account/remove`, 
      'stackpress-session/esm/views/account/remove', 
      -100
    );
    ctx.view.get(
      `${base}/account/update`, 
      'stackpress-session/esm/views/account/update', 
      -100
    );
    ctx.view.get(
      `${base}/account/security/password`, 
      'stackpress-session/esm/views/account/password', 
      -100
    );
    ctx.view.get(
      `${base}/account/security/2fa`, 
      'stackpress-session/esm/views/account/2fa/index', 
      -100
    );
    ctx.view.get(
      `${base}/account/security/2fa/remove`, 
      'stackpress-session/esm/views/account/2fa/remove', 
      -100
    );

    ctx.view.post(
      `${base}/signup`, 
      'stackpress-session/esm/views/signup', 
      -100
    );
    ctx.view.post(
      `${base}/signin/:type`, 
      'stackpress-session/esm/views/signin/index', 
      -100
    );
    ctx.view.post(
      `${base}/account/update`, 
      'stackpress-session/esm/views/account/update', 
      -100
    );
    ctx.view.post(
      `${base}/account/security/password`, 
      'stackpress-session/esm/views/account/password', 
      -100
    );
    ctx.view.post(
      `${base}/account/security/2fa`, 
      'stackpress-session/esm/views/account/2fa/index', 
      -100
    );
    ctx.view.post(
      `${base}/account/security/2fa/remove`, 
      'stackpress-session/esm/views/account/2fa/remove', 
      -100
    );
  });
};