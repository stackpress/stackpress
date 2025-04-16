//node
import path from 'node:path';
//stackpress
import { server as http } from 'stackpress/http';
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