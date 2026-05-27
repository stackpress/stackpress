//stackpress-view
import {
  LayoutBlank,
  useLanguage,
  useServer,
  useTheme
} from 'stackpress-view/client';
//stackpress-session
import type { AuthPageProps } from '../../types.js';

/**
 * Renders the fallback screen for invalid or expired magic-link requests.
 */
export function MagicLinkSigninBody() {
  //hooks
  const { _ } = useLanguage();
  const { config, request, response } = useServer();
  const { theme, toggle } = useTheme();
  //derive the navigation values from the current failed request
  const dark = theme === 'dark';
  const base = config.path('auth.base', '/auth');
  const redirect = request.data.path<string>('redirect_uri', '/');
  const error = response.error || _('Magic link is invalid or expired.');
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
            <i className="fas fa-fw fa-wand-magic-sparkles icon" />
            <h1 className="title">{_('Magic Link')}</h1>
            <span className="theme" onClick={() => toggle()}>
              <i className={`fas fa-fw ${dark ? 'fa-moon' : 'fa-sun'}`} />
            </span>
          </header>
          <main className="auth-email-message">
            <p>{error}</p>
            <hr />
            <a
              className="auth-email-footer-link"
              href={`${base}/signin?redirect_uri=${encodeURIComponent(redirect)}`}
            >
              {_('Choose a different sign-in method')}
            </a>
          </main>
        </section>
      </div>
    </main>
  );
}

/**
 * Builds the document head for the magic-link fallback page.
 */
export function MagicLinkSigninHead(props: AuthPageProps) {
  //props
  const { data, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //pick a favicon mime type that matches whatever brand asset the app exposes
  const { favicon = '/favicon.ico' } = data?.brand || {};
  const mimetype = favicon.endsWith('.png')
    ? 'image/png'
    : favicon.endsWith('.svg')
      ? 'image/svg+xml'
      : 'image/x-icon';
  return (
    <>
      <title>{_('Magic Link')}</title>
      <meta
        name="description"
        content={_('Sign in with a magic link sent to your email address.')}
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
 * Wraps the magic-link message with the blank auth layout.
 */
export function MagicLinkSigninPage(props: AuthPageProps) {
  return (
    <LayoutBlank {...props}>
      <MagicLinkSigninBody />
    </LayoutBlank>
  );
}

export const Head = MagicLinkSigninHead;
export default MagicLinkSigninPage;
