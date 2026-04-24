//modules
import { useLanguage } from 'r22n';
import { useState } from 'react';
import FieldControl from 'frui/form/FieldControl';
import Button from 'frui/Button';
import Input from 'frui/form/Input';
import PasswordInput from 'frui/form/PasswordInput';
//views
import type { 
  NestedObject, 
  ServerPageProps 
} from '../../types.js';
import LayoutBlank from '../../view/layout/LayoutBlank.js';
import { useServer } from '../../view/server/hooks.js';
//session
import type { 
  SignupInput, 
  AuthConfigProps,
  Auth,
  AuthConfig
} from '../types.js';
import PasswordStrength from '../components/PasswordStrength.js';

export type AuthSignupFormProps = {
  input: Partial<SignupInput>;
  errors: NestedObject<string | string[]>;
};

export function AuthSignupForm(props: AuthSignupFormProps) {
  //props
  const { input, errors } = props;
  //hooks
  const { _ } = useLanguage();
  const { config } = useServer();
  const [ secret, setSecret ] = useState(input.secret ?? '');
  //variables
  const tokenKey = config.path('csrf.name', 'csrf');
  const token = config.path('csrf.token', '');
  const password = config.path<AuthConfig['password']>('auth.password', {});
  //render
  return (
    <form className="auth-form" method="post">
      <input type="hidden" name={tokenKey} value={token} />
      <FieldControl 
        label={`${_('Name')}*`} 
        error={errors.name as string|undefined} 
        className="control"
      >
        <Input
          name="name"
          className="field"
          error={!!errors.name}
          defaultValue={input.name}
          required
        />
      </FieldControl>
      <FieldControl 
        label={_('Email Address')} 
        error={errors.email as string|undefined} 
        className="control"
      >
        <Input
          name="email"
          className="field"
          error={!!errors.email}
          defaultValue={input.email}
        />
      </FieldControl>
      <FieldControl 
        label={_('Phone Number')} 
        error={errors.phone as string|undefined} 
        className="control"
      >
        <Input
          name="phone"
          className="field"
          error={!!errors.phone}
          defaultValue={input.phone}
        />
      </FieldControl>
      <FieldControl 
        label={_('Username')} 
        error={errors.username as string|undefined} 
        className="control"
      >
        <Input
          name="username"
          className="field"
          error={!!errors.username}
          defaultValue={input.username}
        />
      </FieldControl>
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
          onChange={(event) => setSecret(event.target.value)}
        />
      </FieldControl>
      <PasswordStrength secret={secret} rules={password} />
      <div className="action">
        <Button className="submit" type="submit">
          {_('Sign Up')}
        </Button>
      </div>
    </form>
  );
};

export function AuthSignupBody() {
  const { config, request, response } = useServer<
      AuthConfigProps, 
      Partial<SignupInput>, 
      Auth
    >();
  const input = { 
    ...response.results, 
    ...request.data() 
  } as SignupInput;
  const base = config.path('auth.base', '/auth');
  const errors = response.errors();
  const { _ } = useLanguage();
  //render
  return (
    <main className="auth-signup-page auth-page">
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
            <i className="fas fa-fw fa-user"></i>
            <h3 className="label">{_('Sign Up')}</h3>
          </header>
          <AuthSignupForm errors={errors} input={input} />
          <footer>
            <a href={`${base}/signin`}>
              {_('Have an Account?')}
            </a>
          </footer>
        </section>
      </div>
    </main>
  );
};

export function AuthSignupHead(props: ServerPageProps<AuthConfigProps>) {
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
      <title>{_('Signup')}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
};

export function AuthSignupPage(props: ServerPageProps<AuthConfigProps>) {
  return (
    <LayoutBlank head={false} {...props}>
      <AuthSignupBody />
    </LayoutBlank>
  );
};

export const Head = AuthSignupHead;
export default AuthSignupPage;
