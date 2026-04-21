//modules
import { useLanguage } from 'r22n';
import FieldControl from 'frui/form/FieldControl';
import Button from 'frui/Button';
import Input from 'frui/form/Input';
import PasswordInput from 'frui/form/PasswordInput';
//stackpress-views
import type { NestedObject } from 'stackpress-view/client/types';
import { useServer } from 'stackpress-view/server/hooks';
//stackpress-session
import type { 
  SigninInput, 
  AuthConfigProps,
  AuthExtended,
  AuthPageProps
} from '../types.js';
import Layout from '../Layout.js';

export type AuthSigninFormProps = {
  input: Partial<SigninInput>;
  errors: NestedObject<string | string[]>;
};

export function AuthSigninForm(props: AuthSigninFormProps) {
  const { input, errors } = props;
  const { _ } = useLanguage();
  const { config } = useServer();
  const tokenKey = config.path('csrf.name', 'csrf');
  const token = config.path('csrf.token', '');
  return (
    <form className="auth-form" method="post">
      <input type="hidden" name={tokenKey} value={token} />
      {input.type === 'phone' ? (
        <FieldControl 
          label={`${_('Phone Number')}*`} 
          error={errors.phone as string|undefined} 
          className="control"
        >
          <Input
            name="phone"
            className="field"
            error={!!errors.phone}
            defaultValue={input.phone}
            required
          />
        </FieldControl>
      ) : input.type === 'email' ? (
        <FieldControl 
          label={`${_('Email Address')}*`} 
          error={errors.email as string|undefined} 
          className="control"
        >
          <Input
            name="email"
            className="field"
            error={!!errors.email}
            defaultValue={input.email}
            required
          />
        </FieldControl>
      ) : (
        <FieldControl 
          label={`${_('Username')}*`} 
          error={errors.username as string|undefined} 
          className="control"
        >
          <Input
            name="username"
            className="field"
            error={!!errors.username}
            defaultValue={input.username}
            required
          />
        </FieldControl>
      )}
      <FieldControl 
        label={`${_('Password')}*`} 
        error={errors.secret as string|undefined} 
        className="control"
      >
        <PasswordInput
          name="secret"
          error={!!errors.secret}
          defaultValue={input.secret}
          required
        />
      </FieldControl>
      <div className="action">
        <Button className="submit" type="submit">
          {_('Sign In')}
        </Button>
      </div>
    </form>
  );
};

export function AuthSigninBody() {
  const { config, request, response } = useServer<
    AuthConfigProps, 
    Partial<SigninInput>, 
    AuthExtended
  >();
  const { _ } = useLanguage();
  const input = { 
    type: 'username',
    ...response.results, 
    ...request.data() 
  } as SigninInput;
  const base = config.path('auth.base', '/auth');
  const options = new Set<string>();
  if (config.path('auth.username')) options.add('username');
  if (config.path('auth.email')) options.add('email');
  if (config.path('auth.phone')) options.add('phone');
  const tabs = options.size > 1 ? Array.from(options).map(option => ({
    icon: option === 'phone' 
      ? 'phone'
      : option === 'email' 
      ? 'envelope'
      : 'user',
    label: option === 'phone' 
      ? _('Phone') 
      : option === 'email' 
      ? _('Email') 
      : _('Username'),
    class: input.type === option 
      ? 'auth-tab active'
      : 'auth-tab',
    url: `${base}/signin/${option}`
  })): [];
  //render
  return (
    <main className="auth-signin-page auth-page">
      <div className="container">
        {config.has('brand', 'logo') ? (
          <img 
            height="50" 
            alt={config.path('brand.name')} 
            src={config.path('brand.logo')} 
            className="logo" 
          />
        ): (
          <h2 className="brand">{config.path('brand.name')}</h2>
        )}
        <section className="auth-modal">
          <header>
            <i className="fas fa-fw fa-lock"></i>
            <h3 className="label">{_('Sign In')}</h3>
          </header>
          {tabs.length > 0 ? (
            <div className="auth-tabs">
              {tabs.map((tab, index) => (
                <a key={index} href={tab.url} className={tab.class}>
                  <i className={`fas fa-fw fa-${tab.icon}`}></i>
                  <span className="label">{tab.label}</span>
                </a>
              ))}
            </div>
          ) : null}
          <AuthSigninForm errors={response.errors()} input={input} />
          <footer>
            <a href={`${base}/signup`}>
              {_('No Account?')}
            </a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href={`${base}/forgot`}>
              {_('Forgot Password?')}
            </a>
          </footer>
        </section>
      </div>
    </main>
  );
};

export function AuthSigninHead(props: AuthPageProps) {
  const { data, styles = [] } = props;
  const { favicon = '/favicon.ico' } = data?.brand || {};
  const { _ } = useLanguage();
  const mimetype = favicon.endsWith('.png')
    ? 'image/png'
    : favicon.endsWith('.svg')
    ? 'image/svg+xml'
    : 'image/x-icon';
  return (
    <>
      <title>{_('Sign In')}</title>
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
    <Layout {...props}>
      <AuthSigninBody />
    </Layout>
  );
};

export const Head = AuthSigninHead;
export default AuthSigninPage;
