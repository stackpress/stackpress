//node
import path from 'node:path';
//stackpress
import type { Server } from 'stackpress/server';
import { server as http } from 'stackpress/http';
import { DOCUMENT_TEMPLATE } from 'stackpress/view';
//plugin
import assets from '../plugins/assets/plugin.js';
//config
import type { Config } from './common.js';
import * as common from './common.js';

export const config: Config = {
  assets: common.assets,
  server: {
    ...common.server,
    mode: 'production'
  },
  view: {
    ...common.view,
    //reactus specific settings
    engine: {
      //client script route prefix used in the document markup
      //ie. /client/[id][extname]
      //<script type="module" src="/client/[id][extname]"></script>
      //<script type="module" src="/client/abc123.tsx"></script>
      clientRoute: '/client',
      //style route prefix used in the document markup
      //ie. /assets/[id][extname]
      //<link rel="stylesheet" type="text/css" href="/client/[id][extname]" />
      //<link rel="stylesheet" type="text/css" href="/assets/abc123.css" />
      cssRoute: '/assets',
      //template wrapper for the document markup (html)
      documentTemplate: DOCUMENT_TEMPLATE,
      //path where to save and load (live) the server script (js)
      pagePath: path.join(common.cwd, '.build/views')
    }
  },
  session: {
    ...common.session,
    access: {
      ADMIN: [
        ...common.session.access.ADMIN,
        //public routes
        { method: 'GET', route: '/assets/**' },
        { method: 'GET', route: '/client/**' },
        { method: 'GET', route: '/images/**' },
        { method: 'GET', route: '/styles/**' },
        { method: 'GET', route: '/icon.png' },
        { method: 'GET', route: '/logo.png' },
        { method: 'GET', route: '/favicon.ico' },
        { method: 'GET', route: '/favicon.png' },
      ],
      USER: [
        ...common.session.access.USER,
        //public routes
        { method: 'GET', route: '/assets/**' },
        { method: 'GET', route: '/client/**' },
        { method: 'GET', route: '/images/**' },
        { method: 'GET', route: '/styles/**' },
        { method: 'GET', route: '/icon.png' },
        { method: 'GET', route: '/logo.png' },
        { method: 'GET', route: '/favicon.ico' },
        { method: 'GET', route: '/favicon.png' },
      ],
      GUEST: [
        ...common.session.access.GUEST,
        //public routes
        { method: 'GET', route: '/assets/**' },
        { method: 'GET', route: '/client/**' },
        { method: 'GET', route: '/images/**' },
        { method: 'GET', route: '/styles/**' },
        { method: 'GET', route: '/icon.png' },
        { method: 'GET', route: '/logo.png' },
        { method: 'GET', route: '/favicon.ico' },
        { method: 'GET', route: '/favicon.png' },
      ]
    }
  },
  admin: common.admin,
  api: common.api,
  auth: common.auth,
  brand: common.brand,
  cli: common.cli,
  client: common.client,
  cookie: common.cookie,
  database: common.database,
  email: common.email,
  language: common.language
};

export async function bootstrap() {
  //make a server
  const server = http();
  //set config
  server.config.set(config);
  //load the plugins
  await server.bootstrap();
  //add the assets plugin
  assets(server as Server);
  //initialize the plugins
  await server.resolve('config');
  //add events
  await server.resolve('listen');
  //add routes
  await server.resolve('route');
  //return the server
  return server;
};