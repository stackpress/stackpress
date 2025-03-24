//stackpress
import type { IM, SR } from '@stackpress/ingest/dist/types';
import type { CLIProps } from '@stackpress/idea-transformer/dist/types';
import type Transformer from '@stackpress/idea-transformer/dist/Transformer';
import type Server from '@stackpress/ingest/dist/Server';
import HttpServer from '@stackpress/ink-dev/dist/HttpServer';
import WhatwgServer from '@stackpress/ink-dev/dist/WhatwgServer';
import ink, { cache } from '@stackpress/ink/compiler';
import { plugin as css } from '@stackpress/ink-css';
//root
import type { TemplatePlugin } from '../../types';
//local
import { useRender, useEngine } from './helpers';
const shims: [ string|RegExp, string ][] = [
  [ 'stackpress/template/client', 'stackpress/template/server' ]
];

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on config, register template plugin
  server.on('config', req => {
    const server = req.context;
    //if no template config, return
    if (!server.config.get('template')) return;
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
    const compiler = ink({ brand, cwd, minify, shims });
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
    //if no template config, return
    if (!server.config.get('template')) return;
    //get server config
    const mode = server.config.path('template.dev.mode', 'http');
    const environment = server.config.path('server.mode', 'production');
    const development = environment !== 'production';
    //dont add dev routes if not in development mode
    if (!development) return;
     //get more server config
    const buildRoute = server.config.path(
      'template.dev.buildRoute',
      '/client'
    );
    const socketRoute = server.config.path(
      'template.dev.socketRoute',
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