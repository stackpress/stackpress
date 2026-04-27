//node
import path from 'node:path';
//modules
import type { ToastPosition } from 'react-toastify';
//types
export type { Config } from 'stackpress/types';
export type Cascade = 'CASCADE' | 'RESTRICT' | 'SET NULL';
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
      name: 'Categories',
      icon: 'sitemap',
      path: '/admin/category/search',
      match: '/admin/category'
    },
    {
      name: 'Articles',
      icon: 'file',
      path: '/admin/article/search',
      match: '/admin/article'
    },
    {
      name: 'Profiles',
      icon: 'user',
      path: '/admin/profile/search',
      match: '/admin/profile'
    },
    {
      name: 'Auth',
      icon: 'lock',
      path: '/admin/auth/search',
      match: '/admin/auth'
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
      method: 'POST' as 'POST',
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
      method: 'GET' as 'GET',
      route: '/api/auth/search',
      type: 'public' as 'public',
      event: 'auth-search',
      cors: true,
      data: {}
    },
    //Profile Endpoints
    {
      method: 'GET' as 'GET',
      route: '/api/profile/search',
      type: 'app' as 'app',
      scopes: [ 'user' ],
      event: 'profile-search',
      data: {}
    },
    {
      method: 'GET' as 'GET',
      route: '/api/profile/detail/:id',
      type: 'app' as 'app',
      scopes: [ 'user' ],
      event: 'profile-detail',
      data: {}
    },
    {
      method: 'GET' as 'GET',
      route: '/api/profile/get/:key/:value',
      type: 'app' as 'app',
      scopes: [ 'user' ],
      event: 'profile-get',
      data: {}
    },
    //Address Endpoints
    {
      method: 'GET' as 'GET',
      route: '/api/my/address',
      type: 'session' as 'session',
      scopes: [ 'user' ],
      event: 'profile-detail',
      data: {}
    },
    //File Endpoints
    {
      method: 'GET' as 'GET',
      route: '/api/my/files',
      type: 'session' as 'session',
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

export const client = { 
  //whether to compiler client in `js` or `ts`
  lang: 'js',
  //used by `stackpress/client` to `import()` 
  //the generated client code to memory
  module: 'blog-client',
  //name of the client package used in package.json
  package: 'blog-client',
  //where to store serialized idea json files for historical 
  //purposes. Revisions are used in conjuction with push and 
  //migrate to determine the changes between each idea change.
  revisions: path.join(build, 'revisions'),
  //where to store the generated client code
  build: path.join(cwd, 'node_modules', 'blog-client'),
  //what tsconfig file to base the typescript compiler on
  tsconfig: path.join(cwd, 'tsconfig.json'),
  prettier: {
    singleQuote: true,
    jsxSingleQuote: false,
    trailingComma: 'none' as 'none',
    bracketSpacing: true,
    experimentalTernaries: true
  }
};

export const cookie = { 
  //see: https://github.com/jshttp/cookie?tab=readme-ov-file#options-1
  path: '/' 
};

export const csrf = {
  name: 'csrf'
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
  },
  populate: [
    {
      event: 'profile-create',
      data: {
        id: 'developer',
        name: 'Developer',
        type: 'person',
        roles: [ 'ADMIN' ]
      }
    },
    {
      event: 'auth-create',
      data: {
        profileId: 'developer',
        type: 'username',
        token: 'developer',
        secret: 'developer'
      }
    },
    {
      event: 'auth-create',
      data: {
        profileId: 'developer',
        type: 'email',
        token: 'developer@shoppable.ph',
        secret: 'developer'
      }
    },
    {
      event: 'application-create',
      data: {
        profileId: 'developer',
        name: 'Developer App',
        scopes: [ 'profile-write', 'auth-read' ],
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
      }
    },
    {
      event: 'category-create',
      data: {
        id: 'anime',
        banner: 'https://i.pinimg.com/736x/86/e3/34/86e3344c625be5db137c16d6d06e5ad3.jpg',
        slug: 'anime',
        name: 'Anime',
        description: 'All about anime'
      }
    },
    {
      event: 'category-create',
      data: {
        id: 'gaming',
        banner: 'https://wallpapers.com/images/hd/youtube-banner-gaming-63ft5u6qosotxyaj.jpg',
        slug: 'gaming',
        name: 'Gaming',
        description: 'All about gaming'
      }
    },
    {
      event: 'article-create',
      data: {
        id: 'pokemon',
        profileId: 'developer',
        banner: 'https://g.foolcdn.com/editorial/images/598665/pokemon-go.jpg',
        slug: 'pokemon-turns-30-how-the-fictional-pocket-monsters-shaped-science',
        title: 'Pokémon turns 30 — how the fictional pocket monsters shaped science',
        contents: `<p>On 27 February 1996, Japanese game designer Satoshi Tajiri 
        released the first ever Pokémon games for the Nintendo Game Boy. What 
        started as a childhood passion for collecting insects grew into a giant 
        franchise and global phenomenon with themes of science at its heart.</p>
        <p>The fictional world of Pokémon has found its way into science and 
        academic research, including ecology, fossils, evolution, biodiversity, 
        education and even calling out predatory journals.</p>
        <p>“It influenced my idea of what animals and natural history were, 
        almost before I knew what real animals in the real world were like,” 
        says Arjan Mann, assistant curator of fossil fishes and early tetrapods 
        at the Field Museum in Chicago, Illinois, who was a child when the 
        television series came out.</p>`,
        keywords: [ 'pokemon', 'nintendo' ],
        tags: [ 'Satoshi Tajiri', 'Arjan Mann' ],
        references: { source: 'nature.com' },
        status: 'PUBLISHED',
        published: new Date('2024-02-27T12:00:00Z')
      }
    },
    {
      event: 'article-create',
      data: {
        id: 'minecraft',
        profileId: 'developer',
        banner: 'https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/MSpotlight_HEADER.jpg',
        slug: 'minecraft-is-15-years-old-and-still-changing-lives',
        title: 'Minecraft is 15 years old and still changing lives',
        contents: `<p>A few days ago, I was tidying my home office – which more 
        closely resembles a video game arcade recently hit by a tornado – when I 
        found a long-lost piece of technology in the bottom drawer of my filing 
        cabinet. It was an old Xbox 360, the Elite model – black, heavy, ungainly, 
        impossibly retro. Out of curiosity, I hauled it out, found a controller 
        and power cable and switched it on. I knew immediately what I wanted to 
        look for, but I was also apprehensive: I didn’t know how I’d feel if 
        Minecraft was still there – or worse, if it wasn’t. Minecraft, you see, 
        is more than just a game for me. I thought about just putting the console 
        back where I found it. But as this month sees the 15th anniversary of the 
        game’s original release, I felt I had to go on.</p>
        <p>In 2012, Microsoft held a big Xbox Games Showcase event at a cavernous 
        venue in San Francisco. The company was showing all the biggest titles of 
        the era – Forza, Gears of War, Halo – but in one quiet corner sat a couple 
        of demo units showing off the as yet unreleased Xbox version of Minecraft. 
        I already knew about the game, of course – designed by Swedish studio Mojang, 
        it was an open-world creative adventure, allowing players to explore vast, 
        procedurally generated worlds, collect resources and build whatever they 
        wanted. It was already attracting millions of players on PC. But I had 
        never really given it much time; so I sat down to have a quick go … and 
        ended up staying for an hour. There was something in it that was holding me 
        there, despite all the other games on offer. That something was Zac.</p>`,
        keywords: [ 'xbox', 'pc' ],
        references: { source: 'minecraft.net' },
        tags: [ 'Mojang', 'Microsoft' ],
        status: 'PUBLISHED',
        published: new Date('2024-11-15T12:00:00Z')
      }
    },
    {
      event: 'catalog-create',
      data: {
        categoryId: 'anime',
        articleId: 'pokemon'
      }
    },
    {
      event: 'catalog-create',
      data: {
        categoryId: 'gaming',
        articleId: 'minecraft'
      }
    },
    {
      event: 'comment-create',
      data: {
        profileId: 'developer',
        articleId: 'pokemon',
        comment: 'Great article!'
      }
    },
    {
      event: 'comment-create',
      data: {
        profileId: 'developer',
        articleId: 'pokemon',
        comment: 'Congrats on 30 years of Pokémon!'
      }
    },
    {
      event: 'comment-create',
      data: {
        profileId: 'developer',
        articleId: 'minecraft',
        comment: 'Minecraft is still amazing after 15 years!'
      }
    },
    {
      event: 'comment-create',
      data: {
        profileId: 'developer',
        articleId: 'minecraft',
        comment: 'Looking forward to the next 15 years of Minecraft!'
      }
    },
    {
      event: 'application-create',
      data: {
        profileId: 'developer',
        name: 'Example App',
        scopes: [ 'profile-write', 'auth-read' ],
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
      }
    }
  ]
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
      { method: 'ALL', route: '/articles/**' },
      { method: 'ALL', route: '/auth/**' },
      { method: 'ALL', route: '/admin/**' },
      { method: 'ALL', route: '/api/**' }
    ],
    MANAGER: [
      //page routes
      { method: 'ALL', route: '/' },
      { method: 'ALL', route: '/articles/**' },
      { method: 'ALL', route: '/auth/**' },
      { method: 'ALL', route: '/admin/auth/**' },
      { method: 'ALL', route: '/api/**' }
    ],
    USER: [
      //page routes
      { method: 'ALL', route: '/' },
      { method: 'ALL', route: '/articles/**' },
      { method: 'ALL', route: '/auth/**' },
      { method: 'ALL', route: '/api/**' }
    ],
    GUEST: [
      //page routes
      { method: 'ALL', route: '/' },
      { method: 'ALL', route: '/articles/**' },
      { method: 'ALL', route: '/auth/**' },
      { method: 'ALL', route: '/api/**' }
    ]
  }
};

export const terminal = {
  label: '[BLOG]',
  idea: path.join(cwd, 'schema.idea')
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
    position: 'bottom-center' as ToastPosition,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }
};