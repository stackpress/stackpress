//stackpress-view
import {
  LayoutBlank,
  useLanguage,
  useServer,
  useTheme
} from 'stackpress-view/client';
//stackpress-session/auth
import type { AuthExtended, AuthPageProps } from '../../types.js';

export function OTPSigninBody() {
  const { _ } = useLanguage();
  const { config, request, response } = useServer<
    AuthPageProps['data'],
    Record<string, string>,
    AuthExtended
  >();
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  const base = config.path('auth.base', '/auth');
  const redirect = request.data.path<string>('redirect_uri', '/');
  const tokenKey = config.path('csrf.name', 'csrf');
  const token = config.path('csrf.token', '');
  const email = response.results?.token || request.data.path('email', '');
  const errors = response.errors();
  console.log(errors)
  return (
    <main className="auth-signin-options auth-page auth-2fa-page">
      <div className="container">
        {config.has('brand', 'logo') ? (
          <img
            height="50"
            alt={config.path('brand.name')}
            src={config.path('brand.logo')}
            className="logo"
          />
        ) : config.withPath.has('brand.name') ? (
          <h2 className="brand">{config.path('brand.name')}</h2>
        ) : null}
        <section className="auth-modal">
          <header>
            <i className="fas fa-fw fa-key icon" />
            <h1 className="title">{_('One Time Pin Code')}</h1>
            <span className="theme" onClick={() => toggle()}>
              <i className={`fas fa-fw ${dark ? 'fa-moon' : 'fa-sun'}`} />
            </span>
          </header>
          <form className="auth-email-form" method="POST">
            <input type="hidden" name={tokenKey} value={token} />
            <p className="auth-email-instructions">
              {_('Please enter the one-time password sent to %s.', email)}
            </p>
            <section className="auth-form-section">
              <input
                className="otp-field auth-2fa-otp"
                type="text"
                name="code"
                maxLength={6}
                autoComplete="off"
                required
              />
              {/* {errors.code && (
                <span className="auth-form-error">{errors?.name}</span>
              )} */}
            </section>
            <button className="auth-submit-btn" type="submit">
              {_('Submit')}
            </button>
            <hr />
            <a
              className="auth-email-footer-link"
              href={`${base}/signin?redirect_uri=${encodeURIComponent(redirect)}`}
            >
              {_('Choose a different sign-in method')}
            </a>
          </form>
        </section>
      </div>
    </main>
  );
}

export function OTPSigninHead(props: AuthPageProps) {
  const { data, styles = [] } = props;
  const { _ } = useLanguage();
  const { favicon = '/favicon.ico' } = data?.brand || {};
  const mimetype = favicon.endsWith('.png')
    ? 'image/png'
    : favicon.endsWith('.svg')
      ? 'image/svg+xml'
      : 'image/x-icon';
  return (
    <>
      <title>{_('One Time Pin Code')}</title>
      <meta
        name="description"
        content={_('Enter the OTP sent to your email address.')}
      />
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function OTPSigninPage(props: AuthPageProps) {
  return (
    <LayoutBlank {...props}>
      <OTPSigninBody />
    </LayoutBlank>
  );
}

export const Head = OTPSigninHead;
export default OTPSigninPage;
