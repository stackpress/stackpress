//node
import path from 'node:path';
//types
import type { Method, APIType } from 'stackpress/types';
export type { Config } from 'stackpress/types';
export type Cascade = 'CASCADE'|'RESTRICT'|'SET NULL';
//pathnames
export const cwd = process.cwd();
export const build = path.join(cwd, '.build');
export const assets = path.join(cwd, 'public');
export const modules = path.join(cwd, 'node_modules');
//environment variables
export const seed = {
  database: process.env.DATABASE_SEED || 'abc123',
  session: process.env.SESSION_SEED || 'abc123'
};
//common config
export const admin = {
  //name of the admin section. shown on the top left of the page
  name: 'Admin',
  //base route for the admin section
  base: '/admin',
  //static admin menu items
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
};

export const api = {
  //when sessions expire. this is used with `session.created` column
  expires: 1000 * 60 * 60 * 24 * 365,
  //calls out external urls when specified events happen
  webhooks: [
    {
      event: 'auth-signout',
      uri: 'http://localhost:3000/api/webhook',
      method: 'POST' as Method,
      validity: {},
      data: {}
    }
  ],
  //scopes are used to limit access to certain endpoints
  //when creating the default application, make sure the 
  //following scopes are included, or you will get a 401 
  //error when trying to access the endpoints
  scopes: {
    'user': { 
      name: 'User API Service',
      description: 'Profile Endpoints' 
    }
  },
  endpoints: [
    //Auth Endpoints
    {
      method: 'GET' as Method,
      route: '/api/auth/search',
      type: 'public' as APIType,
      event: 'auth-search',
      cors: true,
      data: {}
    },
    //Profile Endpoints
    {
      method: 'GET' as Method,
      route: '/api/profile/search',
      type: 'app' as APIType,
      scopes: [ 'user' ],
      event: 'profile-search',
      data: {}
    },
    {
      method: 'GET' as Method,
      route: '/api/profile/detail/:id',
      type: 'app' as APIType,
      scopes: [ 'user' ],
      event: 'profile-detail',
      data: {}
    },
    {
      method: 'GET' as Method,
      route: '/api/profile/get/:key/:value',
      type: 'app' as APIType,
      scopes: [ 'user' ],
      event: 'profile-get',
      data: {}
    },
    //Address Endpoints
    {
      method: 'GET' as Method,
      route: '/api/my/address',
      type: 'session' as APIType,
      scopes: [ 'user' ],
      event: 'profile-detail',
      data: {}
    },
    //File Endpoints
    {
      method: 'GET' as Method,
      route: '/api/my/files',
      type: 'session' as APIType,
      scopes: [ 'user' ],
      event: 'profile-detail',
      data: {}
    }
  ]
};

export const auth = {
  //base route for signin, signout, signup pages
  base: '/auth',
  //on signin (or already signed in)
  redirect: '/',
  //two factor authentication settings
  '2fa': {},
  //captcha settings
  captcha: {},
  //default roles for new users
  roles: [ 'USER' ],
  //allow signin with username
  username: true,
  //allow signin with email address
  email: true,
  //allow signin with phone
  phone: true,
  //password settings
  password: {
    min: 8,
    max: 32,
    upper: true,
    lower: true,
    number: true,
    special: true
  }
};

export const brand = {
  name: 'Stackpress',
  logo: '/logo.png',
  icon: '/icon.png',
  favicon: '/favicon.ico'
};

export const cli = {
  label: '[EXAMPLE]',
  idea: path.join(cwd, 'schema.idea')
};

export const client = { 
  //whether to compiler client in `js` or `ts`
  lang: 'js',
  //used by `stackpress/client` to `import()` 
  //the generated client code to memory
  module: 'app-client',
  //name of the client package used in package.json
  package: 'app-client',
  //where to store serialized idea json files for historical 
  //purposes. Revisions are used in conjuction with push and 
  //migrate to determine the changes between each idea change.
  revisions: path.join(build, 'revisions'),
  //where to store the generated client code
  build: path.join(cwd, 'node_modules', 'app-client'),
  //what tsconfig file to base the typescript compiler on
  tsconfig: path.join(cwd, 'tsconfig.json')
};

export const cookie = { 
  //see: https://github.com/jshttp/cookie?tab=readme-ov-file#options-1
  path: '/' 
};

export const database = {
  //used to encrypt/decrypt data in the database
  seed: seed.database,
  //where to store create and alter table migration files
  // - This is used in conjunction with `revisions`
  // - This doesn't update the database, it simply logs the changes
  migrations: path.join(build, 'migrations'),
  //cascading rules used when generating the database schema
  //options: 'CASCADE', 'SET NULL', 'RESTRICT'
  schema: {
    onDelete: 'CASCADE' as Cascade,
    onUpdate: 'RESTRICT' as Cascade
  }
};

export const email = {
  host: 'smtp.example.com',
  port: 587,
  // upgrade later with STARTTLS
  secure: false, 
  auth: {
    user: 'username',
    pass: 'password',
  }
};

export const language = {
  //url flag (ie. ?json) used to change the user's locale
  //this is also the name of the cookie used to store the locale
  key: 'locale',
  //default locale
  locale: 'en_US',
  //languages and translations
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
};

export const server = {
  port: 3000,
  cwd: cwd
};

export const session = {
  //name of the session cookie
  key: 'session',
  //used to generate the session id
  seed: seed.session,
  access: {
    ADMIN: [
      //page routes
      { method: 'ALL', route: '/' },
      { method: 'GET', route: '/form' },
      { method: 'ALL', route: '/auth/**' },
      { method: 'ALL', route: '/admin/**' },
      { method: 'ALL', route: '/api/**' }
    ],
    USER: [
      //page routes
      { method: 'ALL', route: '/' },
      { method: 'GET', route: '/form' },
      { method: 'ALL', route: '/auth/**' },
      { method: 'ALL', route: '/api/**' }
    ],
    GUEST: [
      //page routes
      { method: 'ALL', route: '/' },
      { method: 'GET', route: '/form' },
      { method: 'ALL', route: '/auth/**' },
      { method: 'ALL', route: '/api/**' }
    ]
  }
};

export const view = {
  //url flag (ie. ?json) used to disable template 
  //rendering and show the raw json data instead
  noview: 'json',
  //used by vite and in development mode
  //to determine the root of the project
  base: '/',
  //frontend notification display settings
  notify: {
    position: 'bottom-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }
};