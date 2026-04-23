//modules
import { useEffect } from 'react';
import { useLanguage } from 'r22n';
import Button from 'frui/Button';
//views
import type { ServerPageProps, AuthConfigProps } from '../../view/types.js';
import LayoutBlank from '../../view/layout/LayoutBlank.js';
import { useServer } from '../../view/server/hooks.js';

export function AuthSignin2FABody() {
  //hooks
  const { _ } = useLanguage();
  const { config, request, response: _response } = useServer<AuthConfigProps>();
  //variables
  const base = config.path('auth.base', '/auth');
  const redirect = request.data.path<string>('redirect_uri', '/');
  const tokenKey = config.path('csrf.name', 'csrf');
  const token = config.path('csrf.token', '');
  //effects
  useEffect(() => {
    //errors are already handled by LayoutBlank notifier
  }, []);
  //render
  return (
    <main className="auth-page auth-signin-page auth-2fa-page">
      <div className="container">
        <section className="auth-modal">
          <header>
            <i className="fas fa-fw fa-key"></i>
            <h3 className="label">{_('Two-Factor Authentication')}</h3>
          </header>
          <form className="auth-form" method="post">
            <input type="hidden" name={tokenKey} value={token} />
            <p className="control auth-2fa-instructions">
              {_('Enter the 6-digit code from your authenticator app.')}
            </p>
            <div className="control">
              <input
                className="otp-field auth-2fa-otp"
                type="text"
                name="code"
                maxLength={6}
                autoComplete="off"
                required
              />
            </div>
            <div className="action">
              <Button className="submit auth-2fa-submit" type="submit">
                {_('Submit')}
              </Button>
            </div>
          </form>
          <footer>
            <a
              className="auth-2fa-footer-link"
              href={`${base}/signin?redirect_uri=${encodeURIComponent(redirect)}`}
            >
              {_('Choose a different sign-in method')}
            </a>
          </footer>
        </section>
      </div>
    </main>
  );
}

export function AuthSignin2FAHead(props: ServerPageProps<AuthConfigProps>) {
  const { data, styles = [] } = props;
  const { favicon = '/favicon.ico' } = data?.brand || {};
  const { _ } = useLanguage();
  const title = _('Two-Factor Authentication');
  const description = _('Enter the 6-digit code from your authenticator app.');
  const mimetype = favicon.endsWith('.png')
    ? 'image/png'
    : favicon.endsWith('.svg')
    ? 'image/svg+xml'
    : 'image/x-icon';
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
};

export function AuthSignin2FAPage(props: ServerPageProps<AuthConfigProps>) {
  return (
    <LayoutBlank head={false} {...props}>
      <AuthSignin2FABody />
    </LayoutBlank>
  );
}

export const Head = AuthSignin2FAHead;
export default AuthSignin2FAPage;