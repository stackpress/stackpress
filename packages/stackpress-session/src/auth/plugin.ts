//stackpress
import type Server from '@stackpress/ingest/Server';

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server) {
  //on listen, add user events
  ctx.on('listen', (_req, _res, ctx) => {
    ctx.import.on('auth-signup', () => import('./events/signup.js'));
    ctx.import.on('auth-signin', () => import('./events/signin.js'));
    ctx.import.on('auth-signout', () => import('./events/signout.js'));
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
  });
};