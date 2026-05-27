//modules
import { useLanguage } from 'r22n';
import Button from 'frui/Button';
import type { AuthConfigProps } from '../../types';
import {
  LayoutBlank,
  ServerPageProps,
  useServer,
  useTheme,
} from 'stackpress-view/client';

export function Auth2FASigninBody() {
  //hooks
  const { _ } = useLanguage();
  const { config, request, response: _response } = useServer<AuthConfigProps>();
  const { theme, toggle } = useTheme();
  //variables
  const dark = theme === 'dark';
  const base = config.path('auth.base', '/auth');
  const redirect = request.data.path<string>('redirect_uri', '/');
  const tokenKey = config.path('csrf.name', 'csrf');
  const token = config.path('csrf.token', '');
  //render
  return (
    <main className="auth-signin-options auth-page auth-2fa-page">
      <div className="container">
        <section className="auth-modal">
          <header>
            <i className="fas fa-fw fa-key icon"></i>
            <h1 className="title">{_('Two-Factor Authentication')}</h1>
            <span className="theme" onClick={() => toggle()}>
              <i className={`fas fa-fw ${dark ? 'fa-moon' : 'fa-sun'}`} />
            </span>
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

export function Auth2FASigninHead(props: ServerPageProps<AuthConfigProps>) {
  //props
  const { data, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const { favicon = '/favicon.ico' } = data?.brand || {};
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
}

export function Auth2FASigninPage(props: ServerPageProps<AuthConfigProps>) {
  return (
    <LayoutBlank {...props}>
      <Auth2FASigninBody />
    </LayoutBlank>
  );
}

export const Head = Auth2FASigninHead;
export default Auth2FASigninPage;
