//stackpress
import type Server from '@stackpress/ingest/Server';
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import { verifyCaptcha } from './verify.js';

/**
 * Captcha plugin for Stackpress.
 *
 * Config lives under `auth.captcha`.
 */
export default function plugin(ctx: Server) {
  ctx.on('config', (_req, _res, ctx) => {
    ctx.register('captcha', {
      verify(req: Request, res: Response, form: string) {
        return verifyCaptcha(ctx, req, res, form);
      }
    });
  });

  ctx.on('listen', (_req, _res, ctx) => {
    ctx.import.on('captcha-assert', () => import('./events/assert.js'));
  });
}
