//node
import path from 'node:path';
//stackpress
import type { ResponseStatus } from '@stackpress/lib/dist/types';
import type { ServerDocumentClass, InkCompiler } from '@stackpress/ink/dist/types';
import type { IM, SR } from '@stackpress/ingest/dist/types';
import type { CLIProps } from '@stackpress/idea-transformer/dist/types';
import type Transformer from '@stackpress/idea-transformer/dist/Transformer';
import type Server from '@stackpress/ingest/dist/Server';
import HttpServer from '@stackpress/ink-dev/dist/HttpServer';
import WhatwgServer from '@stackpress/ink-dev/dist/WhatwgServer';
import FileLoader from '@stackpress/lib/dist/system/FileLoader';
import ink, { cache } from '@stackpress/ink/compiler';
import { getStatus } from '@stackpress/lib/dist/Status';
import { plugin as css } from '@stackpress/ink-css';
import { serialize } from '@stackpress/ink/compiler';
//local
import type { TemplatePlugin, TemplateServers } from '../../types';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on config, register template plugin
  server.on('config', req => {
    const server = req.context;
    //get server environment
    const environment = server.config.path('server.mode', 'production');
    const development = environment !== 'production';
    //get template engine config
    const cwd = server.config.path('template.cwd', process.cwd());
    const minify = server.config.path('template.minify', false);
    const brand = server.config.path('template.brand', '');
    const clientPath = server.config.path('template.clientPath');
    const serverPath = server.config.path('template.serverPath');
    const manifestPath = server.config.path('template.manifestPath');
    //create ink compiler
    const compiler = ink({ brand, cwd, minify });
    //make a dev servers
    const servers = {
      http: new HttpServer({ cwd }),
      whatwg: new WhatwgServer({ cwd })
    };
    //use ink css
    compiler.use(css());
    //use build cache, if production
    if (!development) {
      compiler.use(cache({ clientPath, serverPath, manifestPath }));
    }
    //make a render function
    const render = useRender(server, compiler, servers);
    //make a template engine
    useEngine(server);
    //add renderer to the project
    server.register('template', { compiler, servers, render });
  });
  //on route, add dev routes
  server.on('route', req => {
    const server = req.context;
    //get server config
    const mode = server.config.path('template.mode', 'http');
    const environment = server.config.path('server.mode', 'production');
    const development = environment !== 'production';
    //dont add dev routes if not in development mode
    if (!development) return;
     //get more server config
    const buildRoute = server.config.path(
      'template.config.dev.buildRoute',
      '/build/client'
    );
    const socketRoute = server.config.path(
      'template.config.dev.socketRoute',
      '/__stackpress__'
    );
    //get the template plugin
    const { compiler, servers } = server.plugin<TemplatePlugin>('template');
    //determine dev server
    const devServer = servers[mode as 'http'|'whatwg'];
    //this is the dev client script
    server.all('/dev.js', function DevClient(req, res) {
      //get the client script from file
      const script = compiler.fs.readFileSync(
        require.resolve('@stackpress/ink-dev/client.js'),
        'utf-8'
      );
      //mod client script to include build id and socket route
      const id = 'InkAPI.BUILD_ID';
      const start = `;ink_dev.default(${id}, { path: '${socketRoute}' });`;
      //send to response
      res.setBody('text/javascript', script + start);
    });
    //this is the SSE socket route (__ink_dev__)
    server.all(socketRoute, function SSE(req, res) {
      //prevent response from being sent out in the future
      res.stop();
      //if the dev mode is http
      if (mode === 'http') {
        //extract the response from the res resource
        const response = res.resource as SR;
        response.statusCode = 200;
        response.statusMessage = 'OK';
        //add resource to the dev server client list
        servers.http.wait(req.resource as IM, response);
      } else {
        //the mode is whatwg...
        // - make a response
        // - add to the dev server client list
        // - set the resource in res
        res.resource = servers.whatwg.wait();
      }
    });
    //these are the client build assets (ie. abc123.js, abc123.css)
    server.all(
      `${buildRoute}/:build`, 
      async function BuildAsset(req, res) {
        //get filename ie. abc123.js
        const filename = req.data<string>('build');
        //if no filename, let someone else handle it...
        if (!filename) return;
        //get asset
        const { type, content } = await compiler.asset(filename);
        //send response
        res.setBody(type, content);
      }
    );
    //start the dev server
    devServer.watch();
  });
  //on idea, generate components
  server.on('idea', req => {
    //get the transformer from the request
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    //if no plugin object exists, create one
    if (!transformer.schema.plugin) {
      transformer.schema.plugin = {};
    }
    //add this plugin generator to the schema
    //so it can be part of the transformation
    transformer.schema.plugin['stackpress/plugins/template/transform'] = {};
  });
};

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
      'template.config.notemplate', 
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
      config: server.config(),
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