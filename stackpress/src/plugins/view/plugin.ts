//stackpress
import type { ResponseStatus } from '@stackpress/lib/types';
import type Server from '@stackpress/ingest/Server';
import Status from '@stackpress/lib/Status';
import reactus, { 
  type ServerConfig,
  Server as ReactusServer
} from 'reactus';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(ctx: Server) {
  //on config, configure and register the language plugin
  ctx.on('config', async (_req, _res, ctx) => {
    //get current working directory
    const cwd = ctx.config.path('server.cwd', process.cwd());
    //get server mode
    const mode = ctx.config.path('server.mode', 'production');
    //determine if this is production
    const production = mode === 'production';
    //get all the options
    const options = ctx.config.get<Partial<ServerConfig>>('view');
    //create reactus engine
    const engine = reactus(ReactusServer.configure({ 
      ...options, 
      cwd, 
      production 
    }));
    //register the reactus engine
    ctx.register('reactus', engine);
    //set the render function
    ctx.view.render = (action, props) => engine.render(action, props);
    //set the view engine
    ctx.view.engine = async (action, req, res, ctx) => {
      //set the final status
      const status = Status.get(res.code || 200) as ResponseStatus;
      res.setStatus(status.code, status.status);
      //get the noteplate flag
      const noview = ctx.config.path('view.noview', 'json');
      //const render, if redirecting
      if (res.redirected 
        //or if json
        || req.data.has(noview)
        //or body is a string already
        || typeof res.body === 'string'
      ) return;
      //get the session
      const session = await ctx.resolve('me', req);
      //render the html
      const html = await ctx.view.render(action, {
        data: res.data(),
        session: session.results,
        request: {
          url: {
            hash: req.url.hash,
            host: req.url.host,
            hostname: req.url.hostname,
            href: req.url.href,
            origin: req.url.origin,
            pathname: req.url.pathname,
            port: req.url.port,
            protocol: req.url.protocol,
            search: req.url.search
          },
          headers: Object.fromEntries(req.headers.entries()),
          session: req.session.data,
          method: req.method,
          mime: req.mimetype,
          data: req.data()
        },
        response: res.toStatusResponse()
      });
      //if there is html
      if (html) {
        //add the html to the response
        res.setHTML(html, status.code, status.status);
      }
    };
  });
};