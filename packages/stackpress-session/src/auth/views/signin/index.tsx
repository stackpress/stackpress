//stackpress-view
import { 
  useConfig,
  useLanguage,
  useRequest,
  useTheme,
  LayoutBlank
} from 'stackpress-view/client';
//stackpress-session
import type { 
  AuthPageProps,
  AuthMenuConfig
} from '../../types.js';

export function AuthSigninBody() {
  //hooks
  const { _ } = useLanguage();
  const config = useConfig();
  const request = useRequest();
  const { theme, toggle } = useTheme();
  //variables
  const menu = config.path<AuthMenuConfig[]>('auth.menu', []);
  const options = menu.filter(option => option.type !== 'footer');
  const footer = menu.filter(option => option.type === 'footer');
  const redirect = request.data.path('redirect_uri', '/account');
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
            <i className="fas fa-fw fa-lock icon" />
            <h1 className="title">
              {_('Sign In Options')}
            </h1>
            <span className="theme" onClick={() => toggle()}>
              <i className={`fas fa-fw ${dark ? 'fa-moon' : 'fa-sun'}`} />
            </span>
          </header>
          <main>
            {options.map((option, index) => (
              <a 
                key={index} 
                href={`${option.path}?redirect_uri=${encodeURIComponent(redirect)}`}
                target={option.target}
              >
                <i className={`fas fa-fw fa-${option.icon} icon`} />
                <span className="label">{_(option.name)}</span>
                <i className="fas fa-fw fa-chevron-right action" />
              </a>  
            ))}
          </main>
          {footer.length> 0 && (
            <footer>
              {footer.map((option, index) => (
                <a key={index} href={option.path} target={option.target}>
                  {_(option.name)}
                </a>
              ))}
            </footer>
          )}
        </section>
      </div>
    </main>
  );
};

export function AuthSigninHead(props: AuthPageProps) {
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
      <title>{_('Sign In Options')}</title>
      <meta 
        name="description" 
        content={_('Choose a sign-in method to continue.')} 
      />
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
};

export function AuthSigninPage(props: AuthPageProps) {
  return (
    <LayoutBlank {...props}>
      <AuthSigninBody />
    </LayoutBlank>
  );
};

export const Head = AuthSigninHead;
export default AuthSigninPage;