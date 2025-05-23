//modules
import { useLanguage } from 'r22n';
import Control from 'frui/form/Control';
import Button from 'frui/form/Button';
import Input from 'frui/field/Input';
import Password from 'frui/field/Password';
//views
import type { NestedObject, ServerPageProps } from '../../view/types.js';
import LayoutBlank from '../../view/layout/LayoutBlank.js';
import { useServer } from '../../view/server/hooks.js';
//session
import type { 
  SigninInput, 
  AuthConfigProps,
  AuthExtended
} from '../types.js';

export type AuthSigninFormProps = {
  input: Partial<SigninInput>;
  errors: NestedObject<string | string[]>;
}

export function AuthSigninForm(props: AuthSigninFormProps) {
  const { input, errors } = props;
  const { _ } = useLanguage();
  return (
    <form className="auth-form" method="post">
      {input.type === 'phone' ? (
        <Control 
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
        </Control>
      ) : input.type === 'email' ? (
        <Control 
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
        </Control>
      ) : (
        <Control 
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
        </Control>
      )}
      <Control 
        label={`${_('Password')}*`} 
        error={errors.secret as string|undefined} 
        className="control"
      >
        <Password
          name="secret"
          error={!!errors.secret}
          defaultValue={input.secret}
          required
        />
      </Control>
      <div className="action">
        <Button className="submit" type="submit">
          {_('Sign In')}
        </Button>
      </div>
    </form>
  );
}

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
}

export function AuthSigninHead(props: ServerPageProps<AuthConfigProps>) {
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
}

export function AuthSigninPage(props: ServerPageProps<AuthConfigProps>) {
  return (
    <LayoutBlank head={false} {...props}>
      <AuthSigninBody />
    </LayoutBlank>
  );
}

export const Head = AuthSigninHead;
export default AuthSigninPage;
