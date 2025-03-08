import type { Config as StackpressConfig } from 'stackpress';

import path from 'path';

const cwd = process.cwd();
const seed = process.env.SESSION_SEED || 'abc123';
const environment = process.env.NODE_ENV || 'development';
const development = environment === 'development';
//File Structure:
// - [project]/public
const assets = development 
  ? path.join(cwd, 'public') 
  : path.resolve(cwd, '..', 'public');
// - [project]/public/client
const client = path.join(assets, 'client');
// - [project]/build
// - [project]/build/client?
// - [project]/build/plugins
// - [project]/build/scripts
const build = development ? path.join(cwd, '.build') : cwd;
// - [project]/build/migrations
const migrations = path.join(build, 'migrations');
// - [project]/build/revisions
const revisions = path.join(build, 'revisions');
// - [project]/build/templates
const templates = path.join(build, 'templates');
// - [project]/build/templates/manifest.json
const manifest = path.join(templates, 'manifest.json');
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
  template: {
    cwd: cwd,
    brand: '',
    extname: '.ink',
    minify: environment !== 'development',
    serverPath: templates,
    clientPath: client,
    manifestPath: manifest,
    notemplate: 'json',
    dev: { 
      mode: 'http',
      buildRoute: '/client',
      socketRoute: '/__ink_dev__'
    }
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
    name: 'session',
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
    en_US: {
      label: 'EN',
      translations: {
        'Sign In': 'Signin'
      }
    },
    th_TH: {
      label: 'TH',
      translations: {
        'Sign In': 'Signin'
      }
    }
  }
};