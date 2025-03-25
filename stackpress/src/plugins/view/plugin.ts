//node
import { IncomingMessage, ServerResponse } from 'node:http';
//modules
import reactus, { 
  type ServerConfig,
  Server as ReactusServer
} from 'reactus';
import unocss from 'unocss/vite';
//stackpress
import type { ResponseStatus } from '@stackpress/lib/types';
import type { IM, SR } from '@stackpress/ingest/types';
import type Server from '@stackpress/ingest/Server';
import Status from '@stackpress/lib/Status';
//common
import { ViewPlugin } from '../../types';

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
    //if no plugins, add an empty array
    if (!options.plugins) options.plugins = [];
    //add the unocss plugin
    options.plugins.push(unocss());
    //set the css file
    options.cssFile = options.cssFile || 'virtual:uno.css';
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
  //on route, 
  ctx.on('route', async (_req, _res, ctx) => {
    ctx.on('request', async (req, res, ctx) => {
      //get server mode
      const mode = ctx.config.path('server.mode', 'production');
      //if not production, and node http request
      if (mode === 'production'
        || !(req.resource instanceof IncomingMessage)
        || !(res.resource instanceof ServerResponse)
      ) return;
      const reactus = ctx.plugin<ViewPlugin>('reactus');
      const im = req.resource as IM;
      const sr = res.resource as SR;
      //handles public, assets and hmr
      await reactus.http(im, sr);
      //if middleware was triggered
      //stop the response
      if (sr.headersSent) res.stop();
    });
  });
  
};