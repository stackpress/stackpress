//node
import crypto from 'node:crypto';
//stackpress
import Server from '@stackpress/ingest/Server';
import { type Request, type Response } from '@stackpress/ingest';
//local
import Exception from '../Exception.js';

export default function plugin(ctx: Server) {
  ctx.on('config', (_req, _res, ctx) => {
    //get csrf name from config
    const csrfName = ctx.config.path<string>('csrf.name', 'csrf');
    //configure and register csrf
    ctx.register('csrf', {
      generateToken(res: Response) {
        const token = crypto.randomBytes(32).toString('hex');
        //set new token in session
        res.session.set(csrfName, token);
        //set token in the response data for server side rendering
        res.data.set('csrf', {
          name: csrfName,
          token: token
        });
        //return the token
        return token;
      },
      validateToken(req: Request, res: Response) {
        //extract token from session and request
        const sessionToken = req.session.get(csrfName) as string;
        const inputToken = String(req.data(csrfName));

        //convert tokens to buffers for timingSafeEqual
        const sessionBuffer = Buffer.from(sessionToken, 'utf-8');
        const inputBuffer = Buffer.from(inputToken, 'utf-8');

        const errorMessage = `This page may have been requested from an external source. 
          We corrected the issue. Please try again.`;

        const exception = Exception
          .for(errorMessage);

        if (sessionBuffer.length !== inputBuffer.length) {
          res.setError(
            exception.toResponse(),
            {},
            [],
            419,
            'Page Expired'
          );
          return false;
        }
        if (!crypto.timingSafeEqual(sessionBuffer, inputBuffer)) {
          res.setError(
            exception.toResponse(),
            {},
            [],
            419,
            'Page Expired'
          );
          return false;
        }
        return true;
      }
    });
  });
}