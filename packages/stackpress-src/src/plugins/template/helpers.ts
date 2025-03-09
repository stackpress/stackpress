//node
import path from 'node:path';
//stackpress
import type { ResponseStatus } from '@stackpress/lib/dist/types';
import type { ServerDocumentClass, InkCompiler } from '@stackpress/ink/dist/types';
import type Server from '@stackpress/ingest/dist/Server';
import FileLoader from '@stackpress/lib/dist/system/FileLoader';
import { serialize } from '@stackpress/ink/compiler';
import { getStatus } from '@stackpress/lib/dist/Status';
//local
import type { TemplateServers } from '../../types';

/**
 * Determine the id (without component because it will check to see if it exists)
 */
export function id(filePath: string, loader: FileLoader) {
  //get the absolute path
  const absolute = loader.absolute(filePath);
  let relative = path.relative(loader.cwd, absolute);
  relative = relative.startsWith('.') ? relative : `./${relative}`;
  //if this is a node modules
  if (relative.includes('node_modules/')) {
    //remove the left side of the path
    relative = relative.split('node_modules/')[1];
  }
  return serialize(relative);
};

/**
 * Makes a custom render function
 */
export function useRender(
  server: Server,
  compiler: InkCompiler, 
  refresh: TemplateServers
) {
  //get config
  const mode = server.config.path('template.mode', 'http');
  const extname = server.config.path('template.extname', '.press');
  const serverPath = server.config.path('template.serverPath');
  //get server environment
  const environment = server.config.path('server.mode', 'production');
  const development = environment !== 'production';
  //make a new file loader (for render function below)
  const loader = new FileLoader(compiler.fs, compiler.config.cwd);
  const devServer = refresh[mode as 'http'|'whatwg'];
  //make a render function
  server.view.render = async function render(
    filePath: string, 
    props: Record<string, unknown> = {}
  ) {
    if (!path.extname(filePath)) {
      filePath = `${filePath}${extname}`;
    }
    if (development) {
      devServer.sync(compiler.fromSource(filePath));
      return await compiler.render(filePath, props);
    }
    //if production use cache only (return the markup)
    //get the server build path
    const server = path.join(serverPath, `${id(filePath, loader)}.js`);
    //if the server file does not exist, try to dynamic render
    if (!loader.fs.existsSync(server)) {
      return await compiler.render(filePath, props);
    }
    //get the build object
    const build = require(server);
    const Document = build.default as ServerDocumentClass;
    const document = new Document();
    //render the document
    return document.render(props);
  };
  return server.view.render;
};

/**
 * Makes a custom view engine
 */
export function useEngine(server: Server) {
  server.view.engine = async function engine(action, req, res) {
    //set the final status
    const status = getStatus(res.code || 200) as ResponseStatus;
    res.setStatus(status.code, status.status);
    //get the noteplate flag
    const notemplate = req.context.config.path(
      'template.notemplate', 
      'json'
    );
    //const render, if redirecting
    if (res.redirected 
      //or if json
      || req.data.has(notemplate)
      //or body is a string already
      || typeof res.body === 'string'
    ) return;
    //get the server
    const server = req.context;
    //get the session
    const session = await server.call('me', req);
    //render the html
    const html = await server.view.render(action, {
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
  return server.view.engine;
};