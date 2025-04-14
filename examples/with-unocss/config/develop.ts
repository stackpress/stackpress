//node
import path from 'node:path';
//modules
import unocss from 'unocss/vite';
//stackpress
import { server as http } from 'stackpress/http';
import { CLIENT_TEMPLATE, DOCUMENT_TEMPLATE } from 'stackpress/view';
//config
import type { Config } from './common';
import * as common from './common';

export const config: Config = {
  server: {
    ...common.server,
    mode: 'development',
    //where to store the build files
    build: common.build
  },
  client: { 
    ...common.client,
    //used by `stackpress/client` to `import()` 
    //the generated client code to memory
    module: '.client',
    //where to store serialized idea json files for historical 
    //purposes. Revisions are used in conjuction with push and 
    //migrate to determine the changes between each idea change.
    revisions: path.join(common.build, 'revisions'),
    //where to store the generated client code
    build: path.join(common.cwd, 'node_modules', '.client'),
    //what tsconfig file to base the typescript compiler on
    tsconfig: path.join(common.cwd, 'tsconfig.json')
  },
  database: {
    ...common.database,
    //where to store create and alter table migration files
    // - This is used in conjunction with `revisions`
    // - This doesn't update the database, it simply logs the changes
    migrations: path.join(common.build, 'migrations')
  },
  view: {
    ...common.view,
    //reactus specific settings
    engine: {
      //base path (used in vite)
      basePath: '/',
      //client script route prefix used in the document markup
      //ie. /client/[id][extname]
      //<script type="module" src="/client/[id][extname]"></script>
      //<script type="module" src="/client/abc123.tsx"></script>
      clientRoute: '/client',
      //template wrapper for the client script (tsx)
      clientTemplate: CLIENT_TEMPLATE,
      //filepath to a global css file
      cssFiles: [ 
        'frui/frui.css', 
        'stackpress/stackpress.css', 
        'virtual:uno.css' 
      ],
      //template wrapper for the document markup (html)
      documentTemplate: DOCUMENT_TEMPLATE,
      //vite plugins
      plugins: [ unocss() ],
      //original vite options (overrides other settings related to vite)
      vite: undefined,
      //ignore files in watch mode
      watchIgnore: []
    }
  },
  session: {
    ...common.session,
    access: {
      ADMIN: [
        ...common.session.access.ADMIN,
        //dev routes
        { method: 'ALL', route: '/@vite/client' },
        { method: 'ALL', route: '/@react-refresh' },
        { method: 'ALL', route: '/@fs/**' },
        { method: 'ALL', route: '/node_modules/**' },
        { method: 'ALL', route: '/__uno.css' },
        { method: 'ALL', route: '/plugins/**' },
        { method: 'ALL', route: '/react.svg' },
        //public routes
        { method: 'GET', route: '/assets/**' },
        { method: 'GET', route: '/client/**' },
        { method: 'GET', route: '/images/**' },
        { method: 'GET', route: '/styles/**' },
        { method: 'GET', route: '/favicon.ico' },
        { method: 'GET', route: '/favicon.png' },
      ],
      USER: [
        ...common.session.access.USER,
        //dev routes
        { method: 'ALL', route: '/@vite/client' },
        { method: 'ALL', route: '/@react-refresh' },
        { method: 'ALL', route: '/@fs/**' },
        { method: 'ALL', route: '/node_modules/**' },
        { method: 'ALL', route: '/__uno.css' },
        { method: 'ALL', route: '/plugins/**' },
        { method: 'ALL', route: '/react.svg' },
        //public routes
        { method: 'GET', route: '/assets/**' },
        { method: 'GET', route: '/client/**' },
        { method: 'GET', route: '/images/**' },
        { method: 'GET', route: '/styles/**' },
        { method: 'GET', route: '/favicon.ico' },
        { method: 'GET', route: '/favicon.png' },
      ],
      GUEST: [
        ...common.session.access.GUEST,
        //dev routes
        { method: 'ALL', route: '/@vite/client' },
        { method: 'ALL', route: '/@react-refresh' },
        { method: 'ALL', route: '/@fs/**' },
        { method: 'ALL', route: '/node_modules/**' },
        { method: 'ALL', route: '/__uno.css' },
        { method: 'ALL', route: '/plugins/**' },
        { method: 'ALL', route: '/react.svg' },
        //public routes
        { method: 'GET', route: '/assets/**' },
        { method: 'GET', route: '/client/**' },
        { method: 'GET', route: '/images/**' },
        { method: 'GET', route: '/styles/**' },
        { method: 'GET', route: '/favicon.ico' },
        { method: 'GET', route: '/favicon.png' },
      ]
    }
  },
  brand: common.brand,
  email: common.email,
  auth: common.auth,
  cookie: common.cookie,
  admin: common.admin,
  api: common.api,
  language: common.language
};

export async function bootstrap() {
  //make a server
  const server = http();
  //set config
  server.config.set(config);
  //load the plugins
  await server.bootstrap();
  //initialize the plugins
  await server.resolve('config');
  //add events
  await server.resolve('listen');
  //add routes
  await server.resolve('route');
  //return the server
  return server;
};