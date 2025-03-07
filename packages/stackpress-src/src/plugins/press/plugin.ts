//node
import path from 'node:path';
//stackpress
import type { ServerDocumentClass, InkCompiler } from '@stackpress/ink/dist/types';
import type { IM, SR } from '@stackpress/ingest/dist/types';
import type { CLIProps } from '@stackpress/idea-transformer/dist/types';
import type Transformer from '@stackpress/idea-transformer/dist/Transformer';
import type Server from '@stackpress/ingest/dist/Server';
import RefreshServer from '@stackpress/ink-dev/dist/HttpServer';
import FileLoader from '@stackpress/lib/dist/system/FileLoader';
import ink, { cache } from '@stackpress/ink/compiler';
import { plugin as css } from '@stackpress/ink-css';
import { serialize } from '@stackpress/ink/compiler';
//local
import type { InkPlugin } from './types';
import Router from './Router';

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
    const cwd = server.config.path('template.config.cwd', process.cwd());
    const minify = server.config.path('template.config.minify', false);
    const brand = server.config.path('template.config.brand', '');
    const clientPath = server.config.path('template.config.clientPath');
    const serverPath = server.config.path('template.config.serverPath');
    const manifestPath = server.config.path('template.config.manifestPath');
    //make a new refresh server
    const refresh = new RefreshServer({ cwd });
    //create ink compiler
    const compiler = ink({ brand, cwd, minify });
    //use ink css
    compiler.use(css());
    //use build cache
    if (!development) {
      compiler.use(cache({ clientPath, serverPath, manifestPath }));
    }
    //make a render function
    const render = renderer(development, serverPath, compiler, refresh);
    //make a route function
    const router = new Router(server, render);
    //add ink as a project plugin
    server.register('ink', { compiler, refresh, render, router });
    //add renderer to the project
    server.register('template', { render });
  });
  //on route, add dev routes
  server.on('route', req => {
    const server = req.context;
    //get server environment
    const environment = server.config.path('server.mode', 'production');
    const development = environment !== 'production';
    //dont add dev routes if not in development mode
    if (!development) return;
    const { compiler, refresh } = server.plugin<InkPlugin>('ink');
    const buildRoute = server.config.path(
      'template.config.dev.buildRoute',
      '/build/client'
    );
    const socketRoute = server.config.path(
      'template.config.dev.socketRoute',
      '/__ink_dev__'
    );
    server.all('/dev.js', function DevClient(req, res) {
      const script = compiler.fs.readFileSync(
        require.resolve('@stackpress/ink-dev/client.js'),
        'utf-8'
      );
      const id = 'InkAPI.BUILD_ID';
      const start = `;ink_dev.default(${id}, { path: '${socketRoute}' });`;
      res.setBody('text/javascript', script + start);
    });
    server.all(socketRoute, function SSE(req, res) {
      res.stop();
      res.setStatus(200);
      const response = res.resource as SR;
      response.statusCode = 200;
      response.statusMessage = 'OK';
      refresh.wait(req.resource as IM, response);
    });
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
    refresh.watch();
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
    transformer.schema.plugin['@stackpress/incept-ink/dist/transform'] = {};
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
export function renderer(
  development: boolean, 
  serverPath: string, 
  compiler: InkCompiler, 
  refresh: RefreshServer
) {
  //make a new file loader (for render function below)
  const loader = new FileLoader(compiler.fs, compiler.config.cwd);
  return async function render(
    filePath: string, 
    props: Record<string, unknown> = {}
  ) {
    if (!path.extname(filePath)) {
      filePath = `${filePath}.ink`;
    }
    if (development) {
      refresh.sync(compiler.fromSource(filePath));
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
};