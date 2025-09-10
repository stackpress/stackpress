//modules
import React, { useCallback, useState, useRef } from 'react';
import { useLanguage } from 'r22n';
import Control from 'frui/form/Control';
import Button from 'frui/form/Button';
import Input from 'frui/field/Input';
import Password from 'frui/field/Password';
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

//@ts-ignore
import ReCAPTCHA from 'react-google-recaptcha';
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3';

// Public keys for Google reCAPTCHA (these are safe to show in frontend code)
const INVISIBLE_CAPTCHA_KEY = '6Lcb0cIrAAAAAOVFB2R7yXHEv59KB7U_ofxktXmG'; // v3 - invisible
const VISIBLE_CAPTCHA_KEY = '6LcfjsArAAAAAMPsVYoAb2qcC8uA4y50lgDxS7zA';   // v2 - visible checkbox

export type AuthSignupFormProps = {
  input: Partial<SignupInput>;
  errors: NestedObject<string | string[]>;
}

export function AuthSignupForm(props: AuthSignupFormProps) {
  const { input, errors } = props;
  const { _ } = useLanguage();

  // State for storing reCAPTCHA tokens
  const [captchaTokenV2, setCaptchaTokenV2] = useState<string>('');
  const [captchaTokenV3, setCaptchaTokenV3] = useState<string>('');

  // State to control which captcha to show (v3 is invisible, v2 is visible checkbox)
  const [showVisibleCaptcha, setShowVisibleCaptcha] = useState(false);

  // Reference to the v2 captcha component for resetting
  const captchaRef = useRef<ReCAPTCHA>(null);

  // Handler when user completes the visible v2 captcha
  const handleV2CaptchaComplete = (token: string | null) => {
    if (token) {
      setCaptchaTokenV2(token);
      console.log('Visible captcha completed:', token);
    }
  }

  // Handler when invisible v3 captcha completes automatically  
  const handleV3CaptchaComplete = useCallback((token: string) => {
    setCaptchaTokenV3(token);
    console.log('Invisible captcha completed:', token);
    if (!token) {
      alert('Security verification failed. Please try again.');
    }
  }, []);

  // Check URL parameters to see if we need to show visible captcha
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const needsVisibleCaptcha = urlParams.get('fallback');
    const securityScore = urlParams.get('score');
    const errorMessage = urlParams.get('error');

    if (needsVisibleCaptcha === 'v2') {
      setShowVisibleCaptcha(true);

      // Log why we're showing visible captcha
      if (securityScore) {
        console.log(`Security score too low (${securityScore}), showing visible captcha`);
      } else if (errorMessage) {
        console.log(`Security check failed (${errorMessage}), showing visible captcha`);
      }

      // Clean up the URL after reading parameters
      if (window.history && window.history.replaceState) {
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, []);

  // Determine which captcha token to send and which type
  const currentCaptchaToken = showVisibleCaptcha ? captchaTokenV2 : captchaTokenV3;
  const currentCaptchaType = showVisibleCaptcha ? "v2" : "v3";

  // Check if user can submit (must complete captcha first)
  const canSubmit = showVisibleCaptcha ? captchaTokenV2.length > 0 : captchaTokenV3.length > 0;

  return (
    <form className="auth-form" method="post">
      {/* Hidden fields that tell the server which captcha we're using */}
      <Input
        name="recaptcha_token"
        type="hidden"
        value={currentCaptchaToken}
      />
      <Input
        name="recaptcha_type"
        type="hidden"
        value={currentCaptchaType}
      />
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

      {/* Invisible captcha (v3) - shows by default */}
      {!showVisibleCaptcha && <GoogleReCaptcha onVerify={handleV3CaptchaComplete} />}

      {/* Visible captcha (v2) - shows when security check fails */}
      {showVisibleCaptcha && (
        <div style={{ margin: '10px 0', padding: '12px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
          <p style={{ color: '#856404', marginBottom: '10px', fontSize: '14px' }}>
            <i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>
            {_('Additional security verification required. Please complete the challenge below:')}
          </p>
          <ReCAPTCHA
            ref={captchaRef}
            sitekey={VISIBLE_CAPTCHA_KEY}
            onChange={handleV2CaptchaComplete}
          />
        </div>
      )}


      <div className="action">
        <Button
          className="submit"
          type="submit"
          disabled={!canSubmit}
        >
          {_('Sign In')}
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
      <GoogleReCaptchaProvider reCaptchaKey={INVISIBLE_CAPTCHA_KEY}>
        <AuthSignupBody />
      </GoogleReCaptchaProvider>
    </LayoutBlank>
  );
}

export const Head = AuthSignupHead;
export default AuthSignupPage;
