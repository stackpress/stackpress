//modules
import { useLanguage } from 'r22n';
import Control from 'frui/form/Control';
import Button from 'frui/form/Button';
import Input from 'frui/field/Input';
import Password from 'frui/field/Password';
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useState } from 'react';
//views
import type {
  NestedObject,
  ServerPageProps
} from '../../types/index.js';
import LayoutBlank from '../../view/layout/LayoutBlank.js';
import { useServer } from '../../view/server/hooks.js';
//session
import type {
  SignupInput,
  AuthConfigProps,
  Auth
} from '../types.js';

export type AuthSignupFormProps = {
  input: Partial<SignupInput>;
  errors: NestedObject<string | string[]>;
}

//@ts-ignore
const RECAPTCHAV3 = import.meta.env.VITE_RECAPTCHAV3_SITEKEY;

export function AuthSignupForm(props: AuthSignupFormProps) {
  //props
  const { input, errors } = props;
  //hooks
  const { _ } = useLanguage();
  const [token, setToken] = useState<string>('');

  return (
    <form className="auth-form" method="post">
      {/* Google reCAPTCHA to verify user */}
      <GoogleReCaptcha onVerify={token => {
        setToken(token);
      }}
      />

      {/* Hidden input for reCAPTCHA token */}
      <Input type="hidden" name="recaptcha_token" value={token}/>
      
      <Control
        label={`${_('Name')}*`}
        error={errors.email as string | undefined}
        className="control"
      >
        <Input
          name="name"
          className="field"
          error={!!errors.email}
          defaultValue={input.email}
          required
        />
      </Control>
      <Control
        label={_('Email Address')}
        error={errors.email as string | undefined}
        className="control"
      >
        <Input
          name="email"
          className="field"
          error={!!errors.email}
          defaultValue={input.email}
        />
      </Control>
      <Control
        label={_('Phone Number')}
        error={errors.phone as string | undefined}
        className="control"
      >
        <Input
          name="phone"
          className="field"
          error={!!errors.phone}
          defaultValue={input.phone}
        />
      </Control>
      <Control
        label={_('Username')}
        error={errors.username as string | undefined}
        className="control"
      >
        <Input
          name="username"
          className="field"
          error={!!errors.username}
          defaultValue={input.username}
        />
      </Control>
      <Control
        label={`${_('Password')}*`}
        error={errors.secret as string | undefined}
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
          {_('Sign Up')}
        </Button>
      </div>
    </form>
  );
}

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
        ) : (
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
}

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
}

export function AuthSignupPage(props: ServerPageProps<AuthConfigProps>) {
  return (
    <LayoutBlank head={false} {...props}>
      <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHAV3}>
        <AuthSignupBody />
      </GoogleReCaptchaProvider>
    </LayoutBlank>
  );
}

export const Head = AuthSignupHead;
export default AuthSignupPage;
