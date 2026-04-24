//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
import Exception from '../Exception.js';
import type { CaptchaConfig, CaptchaProvider } from './types.js';

export type MCaptchaVerifyResponse = { valid?: boolean };

export type HCaptchaVerifyResponse = {
  //is the captcha valid?
  success?: boolean;
  //timestamp of the challenge
  challenge_ts?: string;
  //the hostname of the site where the captcha was solved
  hostname?: string;
  //whether the response is from a test key
  credit?: boolean;
  //error codes when the captcha is invalid
  'error-codes'?: string[];
};

type CaptchaProviderAdapter = {
  //the name of the provider.
  provider: CaptchaProvider;
  //the default token field for this provider
  defaultTokenField: string;
  //returns missing required config keys for this provider.
  missingConfig(captcha: CaptchaConfig): string[];
  //provider-specific verification. Should set response errors when invalid. */
  verify(args: {
    ctx: Server;
    req: Request;
    res: Response;
    captcha: CaptchaConfig;
    token: string;
    tokenField: string;
    abortSignal: AbortSignal;
  }): Promise<boolean>;
};

//----------------------------------------------------------------------
// Adapters

const mcaptchaAdapter: CaptchaProviderAdapter = {
  provider: 'mcaptcha',
  defaultTokenField: 'mcaptcha__token',
  missingConfig(captcha) {
    const missing: string[] = [];
    if (!captcha.verifyUrl) missing.push('verifyUrl');
    if (!captcha.siteKey) missing.push('siteKey');
    if (!captcha.secretKey) missing.push('secretKey');
    return missing;
  },
  async verify({ captcha, token, tokenField, res, abortSignal }) {
    const response = await fetch(captcha.verifyUrl as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, key: captcha.siteKey, secret: captcha.secretKey }),
      signal: abortSignal
    });

    const json = (await response.json().catch(() => null)) as
      | MCaptchaVerifyResponse
      | null;

    if (!json || json.valid !== true) {
      res.setError(
        Exception.for('Invalid Captcha')
          .withErrors({ [tokenField]: 'Invalid captcha' })
          .withCode(400)
          .toResponse()
      );
      return false;
    }

    return true;
  }
};

const hcaptchaAdapter: CaptchaProviderAdapter = {
  provider: 'hcaptcha',
  defaultTokenField: 'h-captcha-response',
  missingConfig(captcha) {
    const missing: string[] = [];
    if (!captcha.verifyUrl) missing.push('verifyUrl');
    if (!captcha.secretKey) missing.push('secretKey');
    return missing;
  },
  async verify({ captcha, token, tokenField, res, abortSignal }) {
    const body = new URLSearchParams();
    body.set('secret', captcha.secretKey as string);
    body.set('response', token);
    if (captcha.siteKey) body.set('sitekey', captcha.siteKey);

    const response = await fetch(captcha.verifyUrl as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: abortSignal
    });

    const json = (await response.json().catch(() => null)) as
      | HCaptchaVerifyResponse
      | null;

    if (!json || json.success !== true) {
      res.setError(
        Exception.for('Invalid Captcha')
          .withErrors({ [tokenField]: 'Invalid captcha' })
          .withCode(400)
          .toResponse()
      );
      return false;
    }

    return true;
  }
};

const ADAPTERS: Record<CaptchaProvider, CaptchaProviderAdapter> = {
  mcaptcha: mcaptchaAdapter,
  hcaptcha: hcaptchaAdapter
};

function resolveAdapter(captcha: CaptchaConfig): CaptchaProviderAdapter {
  const provider = (captcha.provider || 'mcaptcha') as CaptchaProvider;
  return ADAPTERS[provider] || ADAPTERS.mcaptcha;
}

/**
 * Determines if captcha is enforced for a given form based on config.
 */
export function isCaptchaEnforced(form: string, captcha: CaptchaConfig) {
  const enforce = captcha.enforce || {};
  if (form === 'signin') return enforce.signin;
  if (form === 'signup') return enforce.signup;
  return Array.isArray(enforce.forms) && enforce.forms.includes(form);
}

/**
 * Server-side captcha verification.
 *
 * Reads config from `auth.captcha`.
 * - When captcha isn't enforced, returns true.
 * - When captcha fails, it sets response error and returns false.
 */
export async function verifyCaptcha(
  ctx: Server,
  req: Request,
  res: Response,
  form: string
): Promise<boolean> {
  //get captcha config
  const captcha = ctx.config.path<CaptchaConfig>('auth.captcha', {});
  //Allow to proceed request if
  // 1. captcha isn't enforced for this form, or
  // 2. captcha bypass is allowed
  if (!isCaptchaEnforced(form, captcha) || captcha.bypass) return true;

  //proceed with verification...

  //resolve the adapter for the configured captcha provider
  const adapter = resolveAdapter(captcha);

  //get the token from the request data using tokenField
  const tokenField = captcha.tokenField || adapter.defaultTokenField;
  const token = req.data.path(tokenField, '');
  //if token is missing
  if (!token) {
    //set error on response and return false
    res.setError(
      Exception.for('Invalid parameters')
        .withErrors({ [tokenField]: 'Captcha is required' })
        .withCode(400)
        .toResponse()
    );
    return false;
  }

  //if required config is missing, we can't verify
  const missing = adapter.missingConfig(captcha);
  if (missing.length) {
    res.setError(
      Exception.for('Captcha is not configured')
        .withErrors({ captcha: `Missing ${missing.join('/')}` })
        .withCode(500)
        .toResponse()
    );
    return false;
  }

  //get and set a timeout for the verification request
  const timeoutMs = captcha.timeoutMs || 2500;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try { // to verify the captcha
    return await adapter.verify({
      ctx,
      req,
      res,
      captcha,
      token,
      tokenField,
      abortSignal: controller.signal
    });
  } catch (_e) {
    //if verification request fails
    res.setError(
      Exception.for('Captcha verification unavailable')
        .withErrors({ captcha: 'Verification request failed' })
        .withCode(503)
        .toResponse()
    );
    return false;
  } finally { //clear timeout
    clearTimeout(timeout);
  }
}
