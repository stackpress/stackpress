//modules
import { useState } from 'react';
import { useLanguage } from 'r22n';
import FieldControl from 'frui/form/FieldControl';
import Button from 'frui/Button';
import Input from 'frui/form/Input';
import PasswordInput from 'frui/form/PasswordInput';
import Progress from 'frui/Progress';
//stackpress-view
import type { NestedObject } from 'stackpress-view/client/types';
import { useServer } from 'stackpress-view/client/server/hooks';
import LayoutBlank from 'stackpress-view/client/layout/LayoutBlank';
//stackpress-session
import type {
  Auth, 
  AuthPageProps,
  AuthConfigProps,
  PasswordConfig,
  SignupInput
} from '../types.js';

//--------------------------------------------------------------------//
// Types

export type PasswordStrengthProps = {
  secret: string,
  rules: PasswordConfig
};

export type PasswordCheck = {
  id: string,
  label: string,
  weight: number,
  score: (value: string) => number,
  pass: (value: string) => boolean
};

export type AuthSignupFormProps = {
  input: Partial<SignupInput>;
  errors: NestedObject<string | string[]>;
};

//--------------------------------------------------------------------//
// Helpers

export function passwordChecklist(rules: PasswordConfig = {}) {
  const checks: PasswordCheck[] = [];

  if (rules.min) {
    const min = rules.min;
    checks.push({
      id: 'min',
      label: `At least ${min} characters`,
      weight: min,
      score: (val: string) => val.length >= min ? min : val.length,
      pass: (val: string) => val.length >= min
    });
  }

  if (rules.max) {
    const min = rules.min || 0;
    const max = rules.max;
    checks.push({
      id: 'max',
      label: `No more than ${max} characters`,
      weight: max - min,
      score: (val: string) => val.length < min 
        ? 0
        : val.length <= max 
        ? (max - min) - (max - val.length)
        : 0,
      pass: (val: string) => val.length <= max
    });
  }

  if (rules.upper) {
    checks.push({
      id: 'upper',
      label: 'Uppercase letter (A–Z)',
      weight: 1,
      score: (val: string) => Number(/[A-Z]/.test(val)),
      pass: (val: string) => /[A-Z]/.test(val)
    });
  }

  if (rules.lower) {
    checks.push({
      id: 'lower',
      label: 'Lowercase letter (a–z)',
      weight: 1,
      score: (val: string) => Number(/[a-z]/.test(val)),
      pass: (val: string) => /[a-z]/.test(val)
    });
  }

  if (rules.number) {
    checks.push({
      id: 'number',
      label: 'Number (0–9)',
      weight: 1,
      score: (val: string) => Number(/[0-9]/.test(val)),
      pass: (val: string) => /[0-9]/.test(val)
    });
  }

  if (rules.special) {
    checks.push({
      id: 'special',
      label: 'Special character (!@#$…)',
      weight: 1,
      score: (val: string) => Number(/[^A-Za-z0-9\s]/.test(val)),
      pass: (val: string) => /[^A-Za-z0-9\s]/.test(val)
    });
  }

  return checks;
};

export function evaluatePassword(secret: string, checks: PasswordCheck[]) {
  if (!secret || checks.length === 0) {
    return { failed: [], score: 0 };
  }
  const failed: { id: string, label: string }[] = [];
  const total = checks.reduce((weight, check) => {
    return weight + check.weight;
  }, 0);
  const score = checks.reduce((score, check) => {
    const grade = check.score(secret);
    if (!check.pass(secret)) {
      failed.push({ id: check.id, label: check.label });
    }
    return score + grade;
  }, 0);
  return { failed, score: Math.floor((score / total) * 100) };
};

//--------------------------------------------------------------------//
// Components

export function PasswordStrength(props: PasswordStrengthProps) {
  //props
  const { secret, rules } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const checklist = passwordChecklist(rules);
  const { failed, score } = evaluatePassword(secret, checklist);
  //render
  return secret.length > 0 ?(
    <div className="password-strength">
      <Progress
        error={score < 25}
        warning={score >= 25 && score < 50}
        info={score >= 50 && score < 75}
        success={score >= 75}
        width={score}
        height={10}
      />
      {failed.length > 0 && (
        <div className="password-strength-checklist">
          {failed.map(({ id, label }) => (
            <div key={id} className="password-strength-checklist-item">
              <i className="fas fa-times" />
              {_(label)}
            </div>
          ))}
        </div>
      )}
    </div>
  ): null;
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
  const password = config.path<PasswordConfig>('auth.password', {});
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
          onChange={(e) => setSecret(e.target.value)}
        />
        <PasswordStrength secret={secret} rules={password} />
      </FieldControl>
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

export function AuthSignupHead(props: AuthPageProps) {
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

export function AuthSignupPage(props: AuthPageProps) {
  return (
    <LayoutBlank {...props}>
      <AuthSignupBody />
    </LayoutBlank>
  );
};

export const Head = AuthSignupHead;
export default AuthSignupPage;
