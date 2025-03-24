//node
import path from 'node:path';
//modules
import { CLIENT_TEMPLATE, DOCUMENT_TEMPLATE, PAGE_TEMPLATE } from 'reactus';
//stackpress
import type { Config as StackpressConfig } from 'stackpress';

const cwd = process.cwd();
const seed = process.env.SESSION_SEED || 'abc123';
const environment = process.env.NODE_ENV || 'development';
const development = environment === 'development';
//File Structure:
// - [project]/public
const assets = development 
  ? path.join(cwd, 'public') 
  : path.resolve(cwd, '..', 'public');
// - [project]/build
// - [project]/build/client?
// - [project]/build/plugins
// - [project]/build/scripts
const build = development ? path.join(cwd, '.build') : cwd;
// - [project]/build/migrations
const migrations = path.join(build, 'migrations');
// - [project]/build/revisions
const revisions = path.join(build, 'revisions');
// - [project]/tsconfig.json
const tsconfig = path.join(cwd, 'tsconfig.json');
// - [project]/node_modules
const modules = path.join(cwd, 'node_modules');

export type Config = StackpressConfig & { assets: string };

export const config: Config = {
  assets,
  server: {
    port: 3000,
    cwd: cwd,
    build: build,
    mode: environment,
    bodySize: 0
  },
  client: { 
    lang: 'js',
    module: '.client',
    revisions: revisions,
    build: path.join(modules, '.client'),
    tsconfig: tsconfig
  },
  database: {
    migrations: migrations,
    schema: {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    }
  },
  view: {
    //path where to save assets (css, images, etc)
    // - used in build step
    assetPath: path.join(cwd, '.build/assets'),
    //base path (used in vite)
    // - used in dev mode
    basePath: '/',
    //path where to save the client scripts (js)
    // - used in build step
    clientPath: path.join(cwd, '.build/client'),
    //client script route prefix used in the document markup
    //ie. /client/[id][extname]
    //<script type="module" src="/client/[id][extname]"></script>
    //<script type="module" src="/client/abc123.tsx"></script>
    // - used in dev mode and live server
    clientRoute: '/client',
    //template wrapper for the client script (tsx)
    // - used in dev mode and build step
    clientTemplate: CLIENT_TEMPLATE,
    //filepath to a global css file
    // - used in dev mode and build step
    cssFile: undefined,
    //style route prefix used in the document markup
    //ie. /assets/[id][extname]
    //<link rel="stylesheet" type="text/css" href="/client/[id][extname]" />
    //<link rel="stylesheet" type="text/css" href="/assets/abc123.css" />
    // - used in live server
    cssRoute: '/assets',
    //template wrapper for the document markup (html)
    // - used in dev mode and live server
    documentTemplate: DOCUMENT_TEMPLATE,
    //path where to save and load (live) the server script (js)
    // - used in build step and live server
    pagePath: path.join(cwd, '.build/pages'),
    //template wrapper for the page script (tsx)
    // - used in build step
    pageTemplate: PAGE_TEMPLATE,
    //vite plugins
    plugins: [],
    //original vite options (overrides other settings related to vite)
    vite: undefined,
    //ignore files in watch mode
    // - used in dev mode
    watchIgnore: []
  },
  email: {
    host: 'smtp.example.com',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: 'username',
      pass: 'password',
    }
  },
  auth: {
    name: 'Incept',
    logo: '/images/incept-logo-long.png',
    '2fa': {},
    captcha: {},
    roles: [ 'USER' ],
    username: true,
    email: true,
    phone: true,
    password: {
      min: 8,
      max: 32,
      upper: true,
      lower: true,
      number: true,
      special: true
    }
  },
  session: {
    key: 'session',
    seed: seed,
    access: {
      ADMIN: [
        { method: 'GET', route: '/client/**' },
        { method: 'GET', route: '/__ink_dev__' },
        { method: 'GET', route: '/dev.js' },
        { method: 'GET', route: '/images/**' },
        { method: 'GET', route: '/styles/**' },
        { method: 'GET', route: '/favicon.ico' },
        { method: 'GET', route: '/favicon.png' },
        { method: 'ALL', route: '/' },
        { method: 'ALL', route: '/auth/**' },
        { method: 'ALL', route: '/admin/**' },
        { method: 'ALL', route: '/api/**' }
      ],
      USER: [
        { method: 'GET', route: '/client/**' },
        { method: 'GET', route: '/__ink_dev__' },
        { method: 'GET', route: '/dev.js' },
        { method: 'GET', route: '/images/**' },
        { method: 'GET', route: '/styles/**' },
        { method: 'GET', route: '/favicon.ico' },
        { method: 'GET', route: '/favicon.png' },
        { method: 'ALL', route: '/' },
        { method: 'ALL', route: '/auth/**' },
        { method: 'ALL', route: '/api/**' }
      ],
      GUEST: [
        { method: 'GET', route: '/client/**' },
        { method: 'GET', route: '/__ink_dev__' },
        { method: 'GET', route: '/dev.js' },
        { method: 'GET', route: '/images/**' },
        { method: 'GET', route: '/styles/**' },
        { method: 'GET', route: '/favicon.ico' },
        { method: 'GET', route: '/favicon.png' },
        { method: 'ALL', route: '/' },
        { method: 'ALL', route: '/auth/**' },
        { method: 'ALL', route: '/api/**' }
      ]
    }
  },
  cookie: { path: '/' },
  admin: {
    name: 'Admin',
    logo: '/images/incept-logo-square-1.png',
    root: '/admin',
    menu: [
      {
        name: 'Profiles',
        icon: 'user',
        path: '/admin/profile/search',
        match: '/admin/profile'
      },
      {
        name: 'Files',
        icon: 'file',
        path: '/admin/file/search',
        match: '/admin/file'
      },
      {
        name: 'Addresses',
        icon: 'map-marker',
        path: '/admin/address/search',
        match: '/admin/address'
      },
      {
        name: 'Auth',
        icon: 'lock',
        path: '/admin/auth/search',
        match: '/admin/auth'
      },
      {
        name: 'Connections',
        icon: 'users',
        path: '/admin/connection/search',
        match: '/admin/connection'
      },
      {
        name: 'Apps',
        icon: 'laptop',
        path: '/admin/application/search',
        match: '/admin/application'
      },
      {
        name: 'Sessions',
        icon: 'coffee',
        path: '/admin/session/search',
        match: '/admin/session'
      }
    ]
  },
  api: {
    expires: 1000 * 60 * 60 * 24 * 365,
    webhooks: [
      {
        event: 'auth-signout',
        uri: 'http://localhost:3000/api/webhook',
        method: 'POST',
        validity: {},
        data: {}
      }
    ],
    scopes: {
      'user': { 
        name: 'User API Service',
        description: 'Profile Endpoints' 
      }
    },
    endpoints: [
      //Auth Endpoints
      {
        method: 'GET',
        route: '/api/auth/search',
        type: 'public',
        event: 'auth-search',
        data: {}
      },
      //Profile Endpoints
      {
        method: 'GET',
        route: '/api/profile/search',
        type: 'app',
        scopes: [ 'user' ],
        event: 'profile-search',
        data: {}
      },
      {
        method: 'GET',
        route: '/api/profile/detail/:id',
        type: 'app',
        scopes: [ 'user' ],
        event: 'profile-detail',
        data: {}
      },
      {
        method: 'GET',
        route: '/api/profile/get/:key/:value',
        type: 'app',
        scopes: [ 'user' ],
        event: 'profile-get',
        data: {}
      },
      //Address Endpoints
      {
        method: 'GET',
        route: '/api/my/address',
        type: 'session',
        scopes: [ 'user' ],
        event: 'profile-detail',
        data: {}
      },
      //File Endpoints
      {
        method: 'GET',
        route: '/api/my/files',
        type: 'session',
        scopes: [ 'user' ],
        event: 'profile-detail',
        data: {}
      }
    ]
  },
  language: {
    key: 'locale',
    locale: 'en_US',
    languages: {
      en_US: {
        label: 'EN',
        translations: {
          'Sign In': 'Signin',
          'Home Page': 'Home Page'
        }
      },
      th_TH: {
        label: 'TH',
        translations: {
          'Sign In': 'Signin',
          'Home Page': 'Home Pagesss'
        }
      }
    }
  }
};