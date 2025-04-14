//node
import { IncomingMessage, ServerResponse } from 'node:http';
//modules
import type { ServerConfig } from 'reactus';
import reactus, { Server as ReactusServer } from 'reactus';
//stackpress
import type { ResponseStatus } from '@stackpress/lib/types';
import type { IM, SR } from '@stackpress/ingest/types';
import type Server from '@stackpress/ingest/Server';
import Status from '@stackpress/lib/Status';
//view
import type { ViewPlugin } from '../types';

export function config(server: Server) {
  //get current working directory
  const cwd = server.config.path('server.cwd', process.cwd());
  //get all the options
  const options = server.config.path<Partial<ServerConfig>>('view.engine', {});
  //create reactus engine
  const engine = reactus(ReactusServer.configure({ 
    ...options, 
    cwd, 
    production: false 
  }));
  //register the reactus engine
  server.register('reactus', engine);
  //set the render function
  server.view.render = (action, props) => engine.render(action, props);
  //set the view engine
  server.view.engine = async (action, req, res, ctx) => {
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
    //get props from config
    const props = ctx.config.path('view.props', {});
    //get the session
    const session = await ctx.resolve('me', req);
    //render the html
    const html = await ctx.view.render(action, {
      data: {...props, ...res.data<Record<string, unknown>>() },
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
};

export function route(server: Server) {
  server.on('request', async (req, res, ctx) => {
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
};