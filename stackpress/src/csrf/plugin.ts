//stackpress
import type Server from '@stackpress/ingest/Server';
import type Response from '@stackpress/ingest/Response';
import type Request from '@stackpress/ingest/Request';
//node
import crypto from 'node:crypto';
import { Exception } from '../lib';
import { CsrfConfig } from './types';

export default function plugin(ctx: Server) {
  ctx.on('config', (_req, _res, ctx) => {
    //if no csrf config, disable csrf
    if (!ctx.config.get('csrf')) return;
    //configure and add csrf plugin
    ctx.register('csrf', {
      generateToken(res: Response) {
        const token = crypto.randomBytes(32).toString('hex');
        //get csrf name from config
        const csrf = ctx.config.path<CsrfConfig>('csrf', {});
        //set token in the cookie
        res.session.set(csrf.name || 'csrf', token);
        //set token in the response data for server side rendering
        res.data.set('csrf', {
          name: csrf.name || 'csrf',
          token: token
        });
        //return the token
        return token;
      },
      validateToken(req: Request, res: Response) {
        //get csrf name from config
        const name = ctx.config.path<string>('csrf.name', 'csrf');
        //extract token from session and request
        const sessionToken = req.session.get(name) as string;
        const inputToken = req.data<string>(name);
    
        //convert tokens to buffers for timingSafeEqual
        const sessionTokenBuffer = Buffer.from(sessionToken);
        const inputTokenBuffer = Buffer.from(inputToken);

        const isValid = crypto.timingSafeEqual(sessionTokenBuffer, inputTokenBuffer);
    
        if (!isValid) {
          res.setError(
            Exception
              .for('Page Expired')
              .withCode(419)
              .toResponse()
          );
        }
      }
    });
  });
}