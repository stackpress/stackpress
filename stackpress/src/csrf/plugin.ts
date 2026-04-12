//node
import crypto from 'node:crypto';
//stackpress
import Server from '@stackpress/ingest/Server';
import { Exception } from '../lib';
import type { Request, Response } from '@stackpress/ingest';
//local
import { CsrfConfig } from './types';

export default function plugin(ctx: Server) {
  ctx.on('config', (_req, _res, ctx) => {
    //if no csrf config, disable csrf
    if (!ctx.config.get('csrf')) return;
    //configure and register csrf
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
      validateToken(req: Request) {
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
          throw Exception
            .for('Page Expired')
            .withCode(419);
        }
      }
    });
  });
}