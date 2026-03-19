//node
import path from 'node:path';
//modules
import unocss from 'unocss/vite';
//stackpress
import { server as http } from 'stackpress/http';
import { CLIENT_TEMPLATE, PAGE_TEMPLATE } from 'stackpress/view';
//config
import type { Config } from './common.js';
import * as common from './common.js';

export const config: Config = {
  server: {
    ...common.server,
    mode: 'production',
    //where to store the build files
    build: common.build
  },
  view: {
    ...common.view,
    //reactus specific settings
    engine: {
      //path where to save assets (css, images, etc)
      assetPath: path.join(common.assets, 'assets'),
      //path where to save the client scripts (js)
      clientPath: path.join(common.assets, 'client'),
      //template wrapper for the client script (tsx)
      clientTemplate: CLIENT_TEMPLATE,
      //filepath to a global css file
      cssFiles: [ 
        'frui/frui.css', 
        'stackpress/stackpress.css', 
        'virtual:uno.css' 
      ],
      //path where to save and load (live) the server script (js)
      pagePath: path.join(common.cwd, '.build/views'),
      //template wrapper for the page script (tsx)
      pageTemplate: PAGE_TEMPLATE,
      //vite plugins
      plugins: [ unocss() ],
      //original vite options (overrides other settings related to vite)
      vite: undefined
    }
  },
  admin: common.admin,
  api: common.api,
  auth: common.auth,
  brand: common.brand,
  cli: common.cli,
  client: common.client,
  database: common.database,
  email: common.email,
  cookie: common.cookie,
  language: common.language,
  session: common.session
};

export default async function bootstrap() {
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