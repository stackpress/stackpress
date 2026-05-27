//modules
import { useState } from 'react';
//stackpress-view
import {
  LayoutBlank,
  useLanguage,
  useServer,
  useTheme
} from 'stackpress-view/client';
//stackpress-session
import type { AuthPageProps } from '../../types.js';

type AuthModeControlProps = {
  icon: string;
  active: boolean;
  label: string;
  onClick: () => void;
};

/**
 * Renders one icon toggle for the available email sign-in methods.
 */
function AuthModeControl(props: AuthModeControlProps) {
  const { icon, active, label, onClick } = props;
  return (
    <button
      type="button"
      className={`auth-email-mode-icon${active ? ' active' : ''}`}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
    >
      <i className={`fas fa-fw ${icon}`} />
    </button>
  );
}

/**
 * Renders the email sign-in form and switches its fields by selected method.
 */
export function EmailSigninForm() {
  //hooks
  const { _ } = useLanguage();
  const { config } = useServer();
  const [ shown, setShown ] = useState(false);
  const [ method, setMethod ] = useState('pass');
  //derive the csrf payload once so every submission path posts the same token
  const tokenKey = config.path('csrf.name', 'csrf');
  const token = config.path('csrf.token', '');
  //render
  return (
    <form className="auth-email-form" method="POST">
      <input type="hidden" name={tokenKey} value={token} />
      <input type="hidden" name="auth" value={method} />
      <section className="auth-form-section">
        <label>{_('Email Address *')}</label>
        <input
          name="email"
          className="auth-form-input"
          type="email"
          placeholder={_('Email')}
        />
      </section>
      <section className="auth-form-section auth-email-mode-section">
        <div
          className="auth-email-mode-row"
          role="tablist"
          aria-label={_('Sign in method')}
        >
          {/* swap the helper copy when the screen is sending a challenge instead */}
          {method === 'pass' ? (
            <label className="auth-email-mode-label">{_('Password *')}</label>
          ) : (
            <p className="auth-email-mode-label auth-email-mode-note">
              {method === 'otp'
                ? _('(send one-time pin code)')
                : _('(send magic link)')}
            </p>
          )}
          <div className="auth-email-mode-actions">
            <AuthModeControl
              icon="fa-asterisk"
              active={method === 'pass'}
              label={_('Sign in with password')}
              onClick={() => setMethod('pass')}
            />
            <AuthModeControl
              icon="fa-message"
              active={method === 'otp'}
              label={_('Send one-time pin code')}
              onClick={() => setMethod('otp')}
            />
            <AuthModeControl
              icon="fa-wand-magic-sparkles"
              active={method === 'magic'}
              label={_('Send magic link')}
              onClick={() => setMethod('magic')}
            />
          </div>
        </div>
        {/* only show the password input when this flow signs in immediately */}
        {method === 'pass' ? (
          <div className="auth-form-password">
            <input
              name="secret"
              className="auth-form-input auth-form-password-input"
              autoComplete="off"
              type={shown ? 'text' : 'password'}
              placeholder={_('Enter your password')}
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
        ) : null}
      </section>
      <button className="auth-submit-btn" type="submit">
        {_('Submit')}
      </button>
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

/**
 * Chooses between the email form and the post-send magic-link confirmation copy.
 */
export function EmailSigninBody() {
  //hooks
  const { _ } = useLanguage();
  const { config, request, response } = useServer<
    AuthPageProps,
    Record<string, string>,
    { email?: string }
  >();
  const { theme, toggle } = useTheme();
  //detect the one case where the request succeeded without signing in yet
  const dark = theme === 'dark';
  const sent = response.code === 200 &&
    request.method === 'POST' &&
    request.data.path('auth', 'pass') === 'magic';
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
            <i className="fas fa-fw fa-lock icon" />
            <h1 className="title">
              {_('Email Sign In')}
            </h1>
            <span className="theme" onClick={() => toggle()}>
              <i className={`fas fa-fw ${dark ? 'fa-moon' : 'fa-sun'}`} />
            </span>
          </header>
          {/*
            keep the user on the page after a magic-link send so the next step
            is obvious and there is no temptation to resubmit the form
          */}
          {sent ? (
            <main className="auth-email-message">
              <p>{_('A magic link has been sent to your email address.')}</p>
              <p>
                {_('Please check your inbox and click the link to sign in.')}
              </p>
              <hr />
              <a
                className="auth-email-footer-link"
                href={`${config.path('auth.base', '/auth')}/signin`}
              >
                {_('Choose a different sign-in method')}
              </a>
            </main>
          ) : (
            <EmailSigninForm />
          )}
        </section>
      </div>
    </main>
  );
}

/**
 * Builds the document head for the email sign-in page.
 */
export function EmailSigninHead(props: AuthPageProps) {
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
      <title>{_('Email Sign In')}</title>
      <meta
        name="description"
        content={_('Sign in with your email address.')}
      />
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

/**
 * Wraps the email sign-in body with the blank auth layout.
 */
export function EmailSigninPage(props: AuthPageProps) {
  return (
    <LayoutBlank {...props}>
      <EmailSigninBody />
    </LayoutBlank>
  );
};

export const Head = EmailSigninHead;
export default EmailSigninPage;
