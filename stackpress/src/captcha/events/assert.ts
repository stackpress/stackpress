//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
import type { CaptchaConfig } from '../types.js';
import { verifyCaptcha } from '../verify.js';

/**
 * Generic captcha assertion event.
 *
 * Payload:
 * - form: string (required)
 * - token?: string (optional; will be copied into tokenField if missing)
 */
export default async function CaptchaAssert(
  req: Request,
  res: Response,
  ctx: Server
) {
  //get the form and token from the request data
  const form = req.data.path('form')
  const token = req.data.path('token');
  //get captcha config
  const captcha = ctx.config.path<CaptchaConfig>('auth.captcha', {});
  const tokenField = captcha.tokenField || 'mcaptcha__token';
  //if token is provided but tokenField is missing, 
  // copy token to tokenField for verification
  if (token && !req.data.has(tokenField)) {
    req.data.set(tokenField, token);
  }
  //verify captcha...
  const ok = await verifyCaptcha(ctx, req, res, form);
  //if not ok, do nothing
  if (!ok) return;
  //if ok, then valid
  res.setResults({ valid: true });
}
