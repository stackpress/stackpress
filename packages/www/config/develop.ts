//modules
import unocss from 'unocss/vite';
//stackpress
import { server as http } from 'stackpress/http';
import { CLIENT_TEMPLATE, DOCUMENT_TEMPLATE } from 'stackpress/view';
//config
import type { Config } from './common.js';
import * as common from './common.js';

export const config: Config = {
  server: {
    ...common.server,
    mode: 'development',
    //where to store the build files
    build: common.build
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
      optimizeDeps: { 
        include: [ 'react-dom/client' ] 
      },
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
  brand: common.brand,
  language: common.language,
  terminal: common.terminal
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