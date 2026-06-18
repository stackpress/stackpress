//modules
import { useState } from 'react';
//stackpress-view
import {
  LayoutBlank,
  useConfig,
  useLanguage,
  useServer,
  useTheme
} from 'stackpress-view/client';
//stackpress-session
import type { AuthPageProps } from '../../types.js';

export function UsernameSigninForm() {
  //hooks
  const { _ } = useLanguage();
  const { config } = useServer();
  const [ shown, setShown ] = useState(false);
  //variables
  const tokenKey = config.path('csrf.name', 'csrf');
  const token = config.path('csrf.token', '');
  //render
  return (
    <form className="auth-email-form" method="POST">
      <input type="hidden" name={tokenKey} value={token} />
      <section className="auth-form-section">
        <label>{_('Username *')}</label>
        <input
          name="username"
          className="auth-form-input"
          type="text"
          placeholder={_('Username')}
        />
      </section>
      <section className="auth-form-section">
        <label>{_('Password *')}</label>
        <div className="auth-form-password">
          <input
            name="secret"
            className="auth-form-input auth-form-password-input"
            autoComplete="off"
            type={shown ? 'text' : 'password'}
            placeholder={_('Password')}
          />
          <button
            type="button"
            className="auth-form-password-toggle"
            aria-label={shown ? _('Hide password') : _('Show password')}
            aria-pressed={shown}
            onClick={() => setShown(!shown)}
          >
            {shown ? '*' : 'A'}
          </button>
        </div>
      </section>
      <button className="auth-submit-btn" type="submit">{_('Submit')}</button>
      <hr />
      <a
        className="auth-email-footer-link"
        href={`${config.path('auth.base', '/auth')}/signin`}
      >
        {_('Choose a different sign-in method')}
      </a>
    </form>
  );
};

export function UsernameSigninBody() {
  //hooks
  const { _ } = useLanguage();
  const config = useConfig();
  const { theme, toggle } = useTheme();
  //variables
  const dark = theme === 'dark';
  //render
  return (
    <main className="auth-signin-options auth-page">
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
            <i className="fas fa-fw fa-user icon" />
            <h1 className="title">
              {_('Username Sign In')}
            </h1>
            <span className="theme" onClick={() => toggle()}>
              <i className={`fas fa-fw ${dark ? 'fa-moon' : 'fa-sun'}`} />
            </span>
          </header>
          <UsernameSigninForm />
        </section>
      </div>
    </main>
  );
}

export function UsernameSigninHead(props: AuthPageProps) {
  //props
  const { data, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const { favicon = '/favicon.ico' } = data?.brand || {};
  const mimetype = favicon.endsWith('.png')
    ? 'image/png'
    : favicon.endsWith('.svg')
      ? 'image/svg+xml'
      : 'image/x-icon';
  //render
  return (
    <>
      <title>{_('Username Sign In')}</title>
      <meta
        name="description"
        content={_('Sign in with your username.')}
      />
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function UsernameSigninPage(props: AuthPageProps) {
  return (
    <LayoutBlank {...props}>
      <UsernameSigninBody />
    </LayoutBlank>
  );
};

export const Head = UsernameSigninHead;
export default UsernameSigninPage;
