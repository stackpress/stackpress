//stackpress
import type Server from '@stackpress/ingest/Server';

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server) {
  //on listen, add user events
  ctx.on('listen', ({ ctx }) => {
    ctx.import.on('auth-signup', () => import('./events/signup.js'));
    ctx.import.on('auth-signin', () => import('./events/signin.js'));
    ctx.import.on('auth-signout', () => import('./events/signout.js'));
  });
  //on route, add user routes
  ctx.on('route', ({ ctx }) => {
    //if no auth config, disable auth routes
    if (!ctx.config.get('auth')) return;
    const base = ctx.config.path('auth.base', '/auth');
    ctx.import.get(
      `${base}/signup`,
      () => import('./pages/signup.js')
    );
    ctx.import.get(
      `${base}/privacy-policy`,
      () => import('./pages/privacy.js')
    );
    ctx.import.get(
      `${base}/signin`,
      () => import('./pages/signin.js')
    );
    ctx.import.get(
      `${base}/signin/2fa/:profile/:auth/:challenge`,
      () => import('./pages/signin/2fa.js')
    );
    ctx.import.get(
      `${base}/signin/link/:auth/:challenge`,
      () => import('./pages/signin/link.js')
    );
    ctx.import.get(
      `${base}/signin/email`,
      () => import('./pages/signin/email.js')
    );
    ctx.import.get(
      `${base}/signin/otp/:auth/:challenge`,
      () => import('./pages/signin/otp.js')
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
      `${base}/terms-of-use`,
      () => import('./pages/terms.js')
    );

    ctx.import.post(
      `${base}/signup`,
      () => import('./pages/signup.js')
    );
    ctx.import.post(
      `${base}/signin/2fa/:profile/:auth/:challenge`,
      () => import('./pages/signin/2fa.js')
    );
    ctx.import.post(
      `${base}/signin/link/:auth/:challenge`,
      () => import('./pages/signin/link.js')
    );
    ctx.import.post(
      `${base}/signin/email`,
      () => import('./pages/signin/email.js')
    );
    ctx.import.post(
      `${base}/signin/otp/:auth/:challenge`,
      () => import('./pages/signin/otp.js')
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
      'stackpress-session/esm/auth/views/signup',
      -100
    );
    ctx.view.get(
      `${base}/privacy-policy`,
      'stackpress-session/esm/auth/views/privacy',
      -100
    );
    ctx.view.get(
      `${base}/signin`,
      'stackpress-session/esm/auth/views/signin/index',
      -100
    );
    ctx.view.get(
      `${base}/signin/2fa/:profile/:auth/:challenge`,
      'stackpress-session/esm/auth/views/signin/2fa',
      -100
    );
    ctx.view.get(
      `${base}/signin/link/:auth/:challenge`,
      'stackpress-session/esm/auth/views/signin/link',
      -100
    );
    ctx.view.get(
      `${base}/signin/email`,
      'stackpress-session/esm/auth/views/signin/email',
      -100
    );
    ctx.view.get(
      `${base}/signin/otp/:auth/:challenge`,
      'stackpress-session/esm/auth/views/signin/otp',
      -100
    );
    ctx.view.get(
      `${base}/signin/phone`,
      'stackpress-session/esm/auth/views/signin/phone',
      -100
    );
    ctx.view.get(
      `${base}/signin/username`,
      'stackpress-session/esm/auth/views/signin/username',
      -100
    );
    ctx.view.get(
      `${base}/terms-of-use`,
      'stackpress-session/esm/auth/views/terms',
      -100
    );

    ctx.view.post(
      `${base}/signup`,
      'stackpress-session/esm/auth/views/signup',
      -100
    );
    ctx.view.post(
      `${base}/signin/2fa/:profile/:auth/:challenge`,
      'stackpress-session/esm/auth/views/signin/2fa',
      -100
    );
    ctx.view.post(
      `${base}/signin/link/:auth/:challenge`,
      'stackpress-session/esm/auth/views/signin/link',
      -100
    );
    ctx.view.post(
      `${base}/signin/email`,
      'stackpress-session/esm/auth/views/signin/email',
      -100
    );
    ctx.view.post(
      `${base}/signin/otp/:auth/:challenge`,
      'stackpress-session/esm/auth/views/signin/otp',
      -100
    );
    ctx.view.post(
      `${base}/signin/phone`,
      'stackpress-session/esm/auth/views/signin/phone',
      -100
    );
    ctx.view.post(
      `${base}/signin/username`,
      'stackpress-session/esm/auth/views/signin/username',
      -100
    );
    ctx.view.post(
      `${base}/signin/:type`,
      'stackpress-session/esm/auth/views/signin/index',
      -100
    );
  });
};
