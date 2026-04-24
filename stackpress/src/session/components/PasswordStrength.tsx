import { AuthConfig } from '../types';

export type PasswordStrengthProps = {
  secret: string,
  rules: AuthConfig['password']
};

export type Check = {
  id: string,
  label: string,
  test: (val: string) => boolean,
  style: string
};

export type CheckListProps = {
  check: Check,
  secret: string
}

const LEVELS = [
  { text: '', tone: 'neutral' },
  { text: 'Weak', tone: 'weak' },
  { text: 'Fair', tone: 'fair' },
  { text: 'Good', tone: 'good' },
  { text: 'Strong', tone: 'strong' },
];

function buildChecks(rules: AuthConfig['password']): Check[] {
  const checks: Check[] = [];

  if (rules?.min != null) {
    checks.push({
      id: 'min',
      label: `At least ${rules.min} characters`,
      test: (val: string) => val.length >= rules.min,
      style: 'password-strength__check-dot--success',
    });
  }

  if (rules?.max != null) {
    checks.push({
      id: 'max',
      label: `No more than ${rules.max} characters`,
      test: (val: string) => val.length > 0 && val.length <= rules.max,
      style: 'password-strength__check-dot--success',
    });
  }

  if (rules?.upper) {
    checks.push({
      id: 'upper',
      label: 'Uppercase letter (A–Z)',
      test: (val: string) => /[A-Z]/.test(val),
      style: 'password-strength__check-dot--accent',
    });
  }

  if (rules?.lower) {
    checks.push({
      id: 'lower',
      label: 'Lowercase letter (a–z)',
      test: (val: string) => /[a-z]/.test(val),
      style: 'password-strength__check-dot--accent',
    });
  }

  if (rules?.number) {
    checks.push({
      id: 'number',
      label: 'Number (0–9)',
      test: (val: string) => /[0-9]/.test(val),
      style: 'password-strength__check-dot--info',
    });
  }

  if (rules?.special) {
    checks.push({
      id: 'special',
      label: 'Special character (!@#$…)',
      test: (val: string) => /[^A-Za-z0-9\s]/.test(val),
      style: 'password-strength__check-dot--warning',
    });
  }

  return checks;
}

function evaluate(secret: string, checks: Check[]) {
  if (!secret || checks.length === 0) return 0;
  const passed = checks.filter(({ test }) => test(secret)).length;
  const ratio = passed / checks.length;
  if (ratio <= 0) return 0;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio < 1) return 3;
  return 4;
}

function CheckIcon() {
  return (
    <i className="fas fa-check password-strength__check-icon" />
  );
};

export default function PasswordStrength(props: PasswordStrengthProps) {
  const { secret, rules } = props;
  const checks = buildChecks(rules);
  const level = evaluate(secret, checks);
  const { text, tone } = LEVELS[level];

  return (
    <div className="password-strength">

      {/* Strength bars */}
      <div className="password-strength__bars">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={
              `password-strength__bar 
              ${i < level ? `password-strength__bar--${tone}` : ""}`
            }
          />
        ))}
      </div>

      {/* Strength label */}
      <p
        className={
          `password-strength__label ${secret ? `password-strength__label--${tone}` : 
          "password-strength__label--placeholder"}`
        }
      >
        {secret ? text : '-'}
      </p>

      {/* Requirement checklist is only rendered when rules are provided */}
      {checks.length > 0 && (
        <div className="password-strength__checks">
          {checks.map((check) => (
            <CheckList key={check.id} check={check} secret={secret} />
          ))}
        </div>
      )}

    </div>
  );
};

function CheckList(props: CheckListProps) {
  //props
  const { check, secret } = props;
  //variables
  const { id, label, test, style } = check;
  const passes = test(secret);
  return (
    <div
      key={id}
      className={
        `password-strength__check 
        ${passes ? "password-strength__check--pass" : ""}`
      }
    >
      <span
        className={
          `password-strength__check-dot 
          ${passes ? `password-strength__check-dot--pass ${style}` : ""}`
        }
      >
        {passes && <CheckIcon />}
      </span>
      {label}
    </div>
  )
}