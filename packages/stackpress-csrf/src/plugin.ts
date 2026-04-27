//node
import crypto from 'node:crypto';
//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';

export default function plugin(ctx: Server) {
  ctx.on('config', (_req, _res, ctx) => {
    //configure and register csrf
    ctx.register('csrf', {
      clear(req: Request, res: Response, ctx: Server) {
        //get csrf name from config
        const name = ctx.config.path<string>('csrf.name', 'csrf');
        //delete token from req, res and session
        req.data.delete(name);
        res.session.delete(name);
        res.data.delete(name);
      },
      generate(res: Response, ctx: Server) {
        //get csrf name from config
        const name = ctx.config.path<string>('csrf.name', 'csrf');
        //make token
        const token = crypto.randomBytes(32).toString('hex');
        //set new token in session
        res.session.set(name, token);
        //set token in the response data for server side rendering
        res.data.set(name, { name, token });
        //return the token
        return token;
      },
      valid(req: Request, res: Response) {
        //get csrf name from config
        const name = ctx.config.path<string>('csrf.name', 'csrf');
        const error = ctx.config.path<string>(
          'csrf.error', 
          'This page may have been requested from an external source. We corrected the issue. Please try again.'
        );
        //extract token from session and request
        const session = req.session.get(name);
        const input = req.data(name);
        //if invalid token or input
        if (typeof session !== 'string' 
          || typeof input !== 'string'
          || session.length === 0
          || input.length === 0
        ) {
          res.setError(error);
          res.setStatus(419, 'Page Expired');
          return false;
        }
        //convert tokens to buffers for timingSafeEqual
        const buffer = {
          session: Buffer.from(session, 'utf-8'),
          input: Buffer.from(input, 'utf-8')
        };
        //if token lengths dont match or tokens are not equal
        if (buffer.session.length !== buffer.input.length
          || !crypto.timingSafeEqual(buffer.session, buffer.input)
        ) {
          res.setError(error);
          res.setStatus(419, 'Page Expired');
          return false;
        }
        return true;
      }
    });
  });
}